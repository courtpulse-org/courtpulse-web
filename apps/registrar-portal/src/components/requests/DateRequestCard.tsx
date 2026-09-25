import { Badge, Box, Button, Flex, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import type { IRemoteDateRequest } from "@repo/types";
import { formatCourtDate, timeAgo } from "@repo/utils";
import { DateSuggestions } from "@/components/diary/DateSuggestions";
import { useDecideDateRequest } from "@/shared/api";

/**
 * Counsel propose dates when the court doesn't sit; the registrar — who holds
 * the judge's diary — confirms one. The platform proposes, the registry decides.
 */
export function DateRequestCard({ request }: { request: IRemoteDateRequest }) {
  const decide = useDecideDateRequest();
  const [date, setDate] = useState(request.proposed_dates[0] ?? "");
  const [declining, setDeclining] = useState(false);
  const pending = request.status === "PENDING";

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.75"
      rounded="lg"
      p={{ base: "4", md: "5" }}
    >
      <Flex justify="space-between" align="flex-start" gap="3" mb="3">
        <Box minW="0">
          <Text textStyle="mono" color="primary.300">
            {request.suit_number}
          </Text>
          <Text textStyle="small-semibold" lineClamp={1}>
            {request.title}
          </Text>
          <Text textStyle="tiny-regular" color="gray.200">
            {request.courtroom_name} · {request.requester_name} ·{" "}
            {timeAgo(request.created_at)}
          </Text>
        </Box>
        <Badge
          colorPalette={
            request.status === "APPROVED"
              ? "success"
              : request.status === "REJECTED"
                ? "error"
                : "warning"
          }
          variant="subtle"
          rounded="full"
          flexShrink={0}
        >
          {request.status === "APPROVED"
            ? `Confirmed · ${formatCourtDate(request.approved_date!)}`
            : request.status === "REJECTED"
              ? "Declined"
              : "Awaiting you"}
        </Badge>
      </Flex>
      {request.note && (
        <Text
          textStyle="small-regular"
          color="gray.300"
          bg="gray.25"
          rounded="md"
          px="3"
          py="2"
          mb="3"
        >
          “{request.note}”
        </Text>
      )}
      {pending && (
        <Stack gap="3">
          <Text textStyle="tiny-semibold" color="gray.300">
            Counsel proposed — pick one that suits the diary
          </Text>
          <DateSuggestions
            courtroomId={request.courtroom_id}
            value={date}
            onChange={setDate}
            restrictTo={request.proposed_dates}
          />
          <Flex gap="2" wrap="wrap">
            <Button
              disabled={!date}
              loading={decide.isPending && !declining}
              onClick={() =>
                decide.mutate({
                  id: request.id,
                  decision: "APPROVED",
                  approved_date: date,
                })
              }
            >
              Confirm{" "}
              {date ? formatCourtDate(date).replace(/ \d{4}$/, "") : "date"}
            </Button>
            <Button
              variant="outlineSecondary"
              loading={decide.isPending && declining}
              onClick={() => {
                setDeclining(true);
                decide.mutate(
                  {
                    id: request.id,
                    decision: "REJECTED",
                    note: "None of the proposed dates is free. Please come to the registry.",
                  },
                  { onSettled: () => setDeclining(false) },
                );
              }}
            >
              None work — decline
            </Button>
          </Flex>
        </Stack>
      )}
    </Box>
  );
}
