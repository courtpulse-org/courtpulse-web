import {
  Box,
  Button,
  Flex,
  Heading,
  Progress,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { COURT_STATUS_LABEL } from "@repo/types";
import {
  ArrowRightIcon,
  CalendarIcon,
  SkipIcon,
  WarningIcon,
} from "@repo/ui/icons";
import { timeAgo } from "@repo/utils";
import { ReachPill } from "@/components/common";
import { StatusActions } from "@/components/status/StatusActions";
import { StatusSummary } from "@/components/status/StatusSummary";
import {
  useCallNext,
  useDismissCrowdReport,
  usePostStatus,
  type RegistrarCourtroom,
} from "@/shared/api";
import { RouteConstants } from "@/shared/constants/routes";

interface Props {
  row: RegistrarCourtroom;
  date: string;
  isToday: boolean;
}

export function CourtroomControlCard({ row, date, isToday }: Props) {
  const navigate = useNavigate();
  const callNext = useCallNext();
  const dismiss = useDismissCrowdReport();
  const confirm = usePostStatus();
  const { courtroom, status, dock, list, crowd_conflict } = row;
  const workspace = RouteConstants.courtrooms.details.generate({
    id: courtroom.id,
  });
  const running =
    isToday &&
    (status?.status === "ON_BENCH" || status?.status === "IN_RECESS");
  const progress =
    list && list.total ? Math.round((list.done / list.total) * 100) : 0;

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.75"
      rounded="lg"
      overflow="hidden"
      borderTop="4px solid"
      borderTopColor={
        status?.status === "NOT_SITTING"
          ? "error.300"
          : status?.status === "SITTING_LATE"
            ? "warning.500"
            : status?.status === "ON_BENCH"
              ? "success.300"
              : status
                ? "primary.200"
                : "gray.100"
      }
    >
      <Stack p={{ base: "4", md: "5" }} gap="4">
        <Flex justify="space-between" align="flex-start" gap="3">
          <Box minW="0">
            <Flex align="baseline" gap="2" wrap="wrap">
              <Heading textStyle="h3">{courtroom.name}</Heading>
              <Text textStyle="tiny-medium" color="gray.200">
                {courtroom.complex_name}
              </Text>
            </Flex>
            <Text textStyle="small-regular" color="gray.300" truncate>
              {courtroom.judge_name ?? "No judge assigned"}
            </Text>
          </Box>
          <Button asChild variant="ghost" size="sm" flexShrink={0}>
            <Link to={workspace}>
              Open <ArrowRightIcon />
            </Link>
          </Button>
        </Flex>

        <StatusSummary status={status} />

        {row.calendar_period && (
          <Flex
            gap="2"
            align="center"
            bg="info.50"
            color="info.700"
            rounded="md"
            px="3"
            py="2"
            textStyle="tiny-medium"
          >
            <CalendarIcon />
            {row.calendar_period.name} — regular courts don't sit.
          </Flex>
        )}

        {crowd_conflict && (
          <Flex
            bg="warning.50"
            border="1px solid"
            borderColor="warning.200"
            rounded="md"
            p="3"
            gap="3"
            direction="column"
          >
            <Flex gap="2" align="flex-start" flex="1" color="warning.800">
              <WarningIcon mt="0.5" />
              <Text textStyle="tiny-medium">
                A spotter in the courtroom reports{" "}
                <b>{COURT_STATUS_LABEL[crowd_conflict.status]}</b> (
                {timeAgo(crowd_conflict.created_at)}). Is that right?
              </Text>
            </Flex>
            <Flex gap="2" flexShrink={0}>
              <Button
                size="sm"
                variant="secondary"
                loading={confirm.isPending}
                onClick={() =>
                  confirm.mutate({
                    courtroom_id: courtroom.id,
                    date,
                    status: crowd_conflict.status,
                  })
                }
              >
                Yes, post it
              </Button>
              <Button
                size="sm"
                variant="outlineSecondary"
                loading={dismiss.isPending}
                onClick={() => dismiss.mutate(crowd_conflict.id)}
              >
                Dismiss
              </Button>
            </Flex>
          </Flex>
        )}

        {running && dock && dock.total_items > 0 && (
          <Flex
            bg="primary.25"
            border="1px solid"
            borderColor="primary.50"
            rounded="md"
            p="3"
            gap="3"
            align="center"
          >
            <Box flex="1" minW="0">
              <Text
                textStyle="tiny-medium"
                color="primary.200"
                textTransform="uppercase"
                letterSpacing="0.04em"
              >
                Now calling
              </Text>
              <Text textStyle="default-semibold" color="primary.400" truncate>
                {dock.current_item
                  ? `Item ${dock.current_item} of ${dock.total_items}`
                  : `Not started · ${dock.total_items} listed`}
                {dock.current_suit_number && (
                  <Text
                    as="span"
                    textStyle="mono"
                    color="gray.300"
                    fontWeight="500"
                    ml="2"
                  >
                    {dock.current_suit_number}
                  </Text>
                )}
              </Text>
            </Box>
            <Button
              size="md"
              loading={callNext.isPending}
              onClick={() => callNext.mutate(courtroom.id)}
            >
              <SkipIcon /> Call next
            </Button>
          </Flex>
        )}

        <StatusActions
          row={row}
          date={date}
          isToday={isToday}
          onAdjournNow={() => navigate(`${workspace}?adjourn=1`)}
        />
      </Stack>

      <Flex
        px={{ base: "4", md: "5" }}
        py="3"
        bg="gray.25"
        borderTop="1px solid"
        borderColor="gray.75"
        justify="space-between"
        align="center"
        gap="3"
        wrap="wrap"
      >
        <ReachPill recipients={row.reach.recipients} compact future />
        {list && list.total > 0 ? (
          <Flex align="center" gap="2" minW="10rem">
            <Progress.Root
              value={progress}
              size="xs"
              colorPalette="primary"
              flex="1"
              minW="5rem"
            >
              <Progress.Track rounded="full">
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>
            <Text textStyle="tiny-medium" color="gray.300" whiteSpace="nowrap">
              {list.done}/{list.total} dealt with
            </Text>
          </Flex>
        ) : (
          <Button asChild size="sm" variant="ghost">
            <Link to={`${workspace}?date=${date}`}>
              No cause list yet — add one
            </Link>
          </Button>
        )}
      </Flex>
      {row.pending_date_requests > 0 && isToday && (
        <Link to={RouteConstants.dateRequests.base.path}>
          <Flex
            px={{ base: "4", md: "5" }}
            py="2"
            bg="secondary.25"
            color="secondary.500"
            textStyle="tiny-semibold"
            gap="2"
            align="center"
            borderTop="1px solid"
            borderColor="secondary.50"
          >
            <CalendarIcon /> {row.pending_date_requests} counsel asked for a new
            date — review
          </Flex>
        </Link>
      )}
    </Box>
  );
}
