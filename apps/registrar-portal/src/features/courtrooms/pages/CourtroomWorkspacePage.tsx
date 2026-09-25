import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Input,
  Stack,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { EmptyStateComponent, SectionLoader } from "@repo/ui/elements";
import {
  BookIcon,
  CalendarIcon,
  ChevronLeftIcon,
  HistoryIcon,
  ListChecksIcon,
  MegaphoneIcon,
} from "@repo/ui/icons";
import { formatLongDate } from "@repo/utils";
import { ReachPill, SectionCard, SegmentedControl } from "@/components/common";
import { DiaryGrid } from "@/components/diary/DiaryGrid";
import { DateRequestCard } from "@/components/requests/DateRequestCard";
import { StatusActions } from "@/components/status/StatusActions";
import { StatusSummary } from "@/components/status/StatusSummary";
import {
  addWorkingDays,
  todayLagos,
  useCourtroomSummary,
  useDateRequests,
  useDiary,
} from "@/shared/api";
import { RouteConstants } from "@/shared/constants/routes";
import { CauseListPanel } from "../components/CauseListPanel";
import { StatusTimeline } from "../components/StatusTimeline";

export function CourtroomWorkspacePage() {
  const { id = "" } = useParams();
  const [params, setParams] = useSearchParams();
  const today = todayLagos();
  const tomorrow = addWorkingDays(today, 1);
  const date = params.get("date") ?? today;
  const isToday = date === today;
  const [tab, setTab] = useState("list");

  const summary = useCourtroomSummary(id, date);
  const requests = useDateRequests();
  const diary = useDiary(id, 30);
  const row = summary.data?.data;
  const roomRequests = (requests.data?.data ?? []).filter(
    (r) => r.courtroom_id === id,
  );
  const pendingCount = roomRequests.filter(
    (r) => r.status === "PENDING",
  ).length;

  const setDate = (d: string) => {
    params.set("date", d);
    setParams(params, { replace: true });
  };

  if (summary.isLoading) return <SectionLoader />;
  if (!row)
    return (
      <EmptyStateComponent
        title="Courtroom not found"
        description="You may not manage this courtroom."
      />
    );

  const dayChoice =
    date === today ? "today" : date === tomorrow ? "tomorrow" : "other";

  return (
    <Stack gap="5">
      <Button asChild variant="ghost" size="sm" alignSelf="flex-start" ml="-2">
        <Link to={RouteConstants.courtrooms.base.path}>
          <ChevronLeftIcon /> Courtrooms
        </Link>
      </Button>

      <Grid
        templateColumns={{ base: "1fr", lg: "minmax(0, 1fr) 24rem" }}
        gap="5"
        alignItems="flex-start"
      >
        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.75"
          rounded="lg"
          p={{ base: "4", md: "6" }}
        >
          <Flex justify="space-between" gap="4" wrap="wrap" mb="4">
            <Box>
              <Text
                textStyle="tiny-semibold"
                color="secondary.400"
                textTransform="uppercase"
                letterSpacing="0.06em"
              >
                {row.courtroom.complex_name} · {row.courtroom.division_name}{" "}
                Division
              </Text>
              <Heading textStyle="h1" mt="1">
                {row.courtroom.name}
              </Heading>
              <Text textStyle="small-regular" color="gray.300">
                {row.courtroom.judge_name ?? "No judge assigned"} · usually sits{" "}
                {row.courtroom.default_sitting_time ?? "09:00"}
              </Text>
            </Box>
            <Button asChild variant="outline" size="sm" alignSelf="flex-start">
              <Link
                to={`${RouteConstants.broadcasts.base.path}?courtroom=${id}`}
              >
                <MegaphoneIcon /> Broadcast
              </Link>
            </Button>
          </Flex>
          <Stack gap="4">
            <StatusSummary status={row.status} />
            <StatusActions
              row={row}
              date={date}
              isToday={isToday}
              onAdjournNow={() => {
                setTab("list");
                params.set("adjourn", "1");
                setParams(params, { replace: true });
              }}
            />
            <ReachPill
              recipients={row.reach.recipients}
              sms={row.reach.sms}
              whatsapp={row.reach.whatsapp}
              future
            />
          </Stack>
        </Box>

        <SectionCard title="Date" description={formatLongDate(date)}>
          <Stack gap="3">
            <SegmentedControl
              value={dayChoice === "other" ? "today" : dayChoice}
              onChange={(v) => setDate(v === "today" ? today : tomorrow)}
              options={[
                { value: "today", label: "Today" },
                { value: "tomorrow", label: "Tomorrow" },
              ]}
            />
            <Flex align="center" gap="2">
              <Text
                textStyle="tiny-regular"
                color="gray.200"
                whiteSpace="nowrap"
              >
                Or prepare the list for
              </Text>
              <Input
                type="date"
                size="sm"
                value={date}
                min={today}
                onChange={(e) => e.target.value && setDate(e.target.value)}
              />
            </Flex>
            {!isToday && (
              <Text textStyle="tiny-regular" color="gray.300">
                Planning ahead: build and publish the list so counsel know their
                item numbers before they leave home.
              </Text>
            )}
          </Stack>
        </SectionCard>
      </Grid>

      <Tabs.Root
        value={tab}
        onValueChange={(e) => setTab(e.value)}
        variant="line"
        colorPalette="primary"
      >
        <Tabs.List overflowX="auto" overflowY="hidden">
          <Tabs.Trigger value="list">
            <ListChecksIcon /> Cause list
          </Tabs.Trigger>
          <Tabs.Trigger value="timeline">
            <HistoryIcon /> Status timeline
          </Tabs.Trigger>
          <Tabs.Trigger value="requests">
            <CalendarIcon /> Date requests
            {pendingCount ? ` (${pendingCount})` : ""}
          </Tabs.Trigger>
          <Tabs.Trigger value="diary">
            <BookIcon /> Judge's diary
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="list">
          <CauseListPanel
            courtroomId={id}
            date={date}
            isToday={isToday}
            notSitting={row.status?.status === "NOT_SITTING"}
          />
        </Tabs.Content>
        <Tabs.Content value="timeline">
          <StatusTimeline courtroomId={id} date={date} />
        </Tabs.Content>
        <Tabs.Content value="requests">
          {roomRequests.length === 0 ? (
            <EmptyStateComponent
              size="inline"
              title="No date requests"
              description="When this court doesn't sit, counsel can propose new dates here instead of queueing at the registry."
            />
          ) : (
            <Stack gap="3">
              {roomRequests.map((r) => (
                <DateRequestCard key={r.id} request={r} />
              ))}
            </Stack>
          )}
        </Tabs.Content>
        <Tabs.Content value="diary">
          <SectionCard
            title="Next 30 sitting days"
            description="Matters already fixed for each day. Blocked days include vacations and public holidays."
          >
            <DiaryGrid days={diary.data?.data ?? []} />
          </SectionCard>
        </Tabs.Content>
      </Tabs.Root>
    </Stack>
  );
}
