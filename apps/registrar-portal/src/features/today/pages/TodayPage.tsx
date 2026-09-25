import {
  Box,
  Flex,
  Grid,
  Heading,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { EmptyStateComponent, StatCard } from "@repo/ui/elements";
import {
  ActivityIcon,
  CalendarIcon,
  ListChecksIcon,
  MoonIcon,
  SunIcon,
  UsersIcon,
} from "@repo/ui/icons";
import { formatLongDate, greetingForNow } from "@repo/utils";
import { SegmentedControl } from "@/components/common";
import { useCurrentUser } from "@/hooks";
import {
  addWorkingDays,
  todayLagos,
  useAlerts,
  useMyCourtrooms,
} from "@/shared/api";
import { ActivityFeed } from "../components/ActivityFeed";
import { CourtroomControlCard } from "../components/CourtroomControlCard";

export function TodayPage() {
  const { userData, isAdmin } = useCurrentUser();
  const [day, setDay] = useState<"today" | "tomorrow">("today");
  const today = todayLagos();
  const date = day === "today" ? today : addWorkingDays(today, 1);
  const { data, isLoading } = useMyCourtrooms(date);
  const alerts = useAlerts();
  const rows = data?.data ?? [];

  const sitting = rows.filter(
    (r) => r.status && r.status.status !== "NOT_SITTING",
  ).length;
  const notSitting = rows.filter(
    (r) => r.status?.status === "NOT_SITTING",
  ).length;
  const unknown = rows.filter((r) => !r.status).length;
  const listed = rows.reduce((n, r) => n + (r.list?.total ?? 0), 0);
  const reachedToday = (alerts.data?.data ?? [])
    .filter(
      (a) =>
        a.created_at.slice(0, 10) === today ||
        Date.now() - new Date(a.created_at).getTime() < 86_400_000,
    )
    .reduce((n, a) => n + a.recipients, 0);
  const pendingRequests = rows.reduce((n, r) => n + r.pending_date_requests, 0);

  return (
    <Stack gap="6">
      <Flex
        justify="space-between"
        align={{ base: "flex-start", md: "flex-end" }}
        gap="4"
        direction={{ base: "column", md: "row" }}
      >
        <Box>
          <Text
            textStyle="tiny-semibold"
            color="secondary.400"
            textTransform="uppercase"
            letterSpacing="0.06em"
          >
            {formatLongDate(date)}
          </Text>
          <Heading textStyle="h1" mt="1">
            {greetingForNow()}, {userData?.first_name}
          </Heading>
          <Text textStyle="small-regular" color="gray.300" mt="1.5">
            {day === "today"
              ? "Tap a courtroom's status the moment it changes. Counsel get it by SMS and WhatsApp within seconds."
              : "Know already that the judge won't sit tomorrow? Post it tonight and save counsel the journey."}
          </Text>
        </Box>
        <SegmentedControl
          w={{ base: "full", md: "auto" }}
          value={day}
          onChange={setDay}
          options={[
            {
              value: "today",
              label: (
                <>
                  <SunIcon /> Today
                </>
              ),
            },
            {
              value: "tomorrow",
              label: (
                <>
                  <MoonIcon /> Tomorrow
                </>
              ),
            },
          ]}
        />
      </Flex>

      <SimpleGrid
        columns={{ base: 2, lg: 4 }}
        gap="3"
        order={{ base: 3, md: 0 }}
      >
        <StatCard
          label={isAdmin ? "Courtrooms" : "Your courtrooms"}
          value={rows.length || "—"}
          hint={
            rows.length
              ? `${sitting} sitting · ${notSitting} not sitting · ${unknown} not posted`
              : undefined
          }
          icon={<ActivityIcon />}
        />
        <StatCard
          label="Matters listed"
          value={listed || "—"}
          hint={
            day === "today" ? "on today's cause lists" : "on tomorrow's lists"
          }
          icon={<ListChecksIcon />}
        />
        <StatCard
          label="Counsel alerted"
          value={reachedToday.toLocaleString()}
          hint="in the last 24 hours"
          icon={<UsersIcon />}
        />
        <StatCard
          label="Date requests"
          value={pendingRequests}
          hint="waiting for your decision"
          icon={<CalendarIcon />}
        />
      </SimpleGrid>

      <Grid
        templateColumns={{ base: "1fr", "2xl": "minmax(0, 1fr) 20rem" }}
        gap="6"
        alignItems="flex-start"
        order={{ base: 2, md: 0 }}
      >
        <Box>
          {isLoading ? (
            <SimpleGrid columns={{ base: 1, lg: 2 }} gap="4">
              {[0, 1].map((i) => (
                <Skeleton key={i} h="22rem" rounded="lg" />
              ))}
            </SimpleGrid>
          ) : rows.length === 0 ? (
            <EmptyStateComponent
              icon={<ActivityIcon boxSize="10" />}
              title="No courtrooms assigned yet"
              description={
                userData?.is_verified
                  ? "An admin assigns the courtrooms you manage. Ask the Chief Registrar's office."
                  : "Your account is awaiting verification by an admin."
              }
            />
          ) : (
            <SimpleGrid
              columns={{
                base: 1,
                md: Math.min(rows.length, 2),
                xl: Math.min(rows.length, 3),
              }}
              gap="4"
              alignItems="flex-start"
            >
              {rows.map((row) => (
                <CourtroomControlCard
                  key={row.courtroom.id}
                  row={row}
                  date={date}
                  isToday={day === "today"}
                />
              ))}
            </SimpleGrid>
          )}
        </Box>
        <ActivityFeed />
      </Grid>
    </Stack>
  );
}
