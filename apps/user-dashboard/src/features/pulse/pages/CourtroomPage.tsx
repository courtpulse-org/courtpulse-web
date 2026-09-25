import { Button, Flex, Stack, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import type { CourtStatus } from "@repo/types";
import {
  CourtStatusBadge,
  StatusTapGroup,
  VerificationBadge,
} from "@repo/ui/court";
import { PageHeader, SectionLoader, SurfaceCard } from "@repo/ui/elements";
import { timeAgo } from "@repo/utils";
import { useGetCourtroomStatus } from "@/shared/api";
import {
  useCheckIn,
  useCheckOut,
  useGetMyCheckIn,
  useReportStatus,
} from "../api";

/** Spotter check-in + 1-tap status for one courtroom. */
export function CourtroomPage() {
  const { id = "" } = useParams();
  const status = useGetCourtroomStatus(id);
  const myCheckIn = useGetMyCheckIn();
  const checkIn = useCheckIn();
  const checkOut = useCheckOut();
  const report = useReportStatus();

  const isCheckedInHere = myCheckIn.data?.data?.courtroom_id === id;
  const current = status.data?.data;

  const onSelect = (s: CourtStatus) =>
    report.mutate({ courtroom_id: id, status: s });

  if (status.isLoading) return <SectionLoader />;

  return (
    <Stack gap="5">
      <PageHeader
        title="Courtroom"
        description="Current status and your Spotter controls."
      />

      <SurfaceCard>
        <Text
          textStyle="tiny-medium"
          color="gray.200"
          textTransform="uppercase"
          mb="2"
        >
          Current status
        </Text>
        {current ? (
          <Flex align="center" gap="3" wrap="wrap">
            <CourtStatusBadge
              status={current.status}
              live={current.verification !== "UNVERIFIED"}
              fontSize="sm"
            />
            <VerificationBadge
              level={current.verification}
              reportCount={current.report_count}
            />
            <Text textStyle="tiny-regular" color="gray.200">
              {timeAgo(current.reported_at)}
            </Text>
          </Flex>
        ) : (
          <Text color="gray.200">No reports yet today.</Text>
        )}
      </SurfaceCard>

      <SurfaceCard>
        <Flex justify="space-between" align="center" mb="4" gap="3" wrap="wrap">
          <Text textStyle="h4">Spotter check-in</Text>
          {isCheckedInHere ? (
            <Button
              variant="outlineSecondary"
              size="sm"
              loading={checkOut.isPending}
              onClick={() => checkOut.mutate(undefined)}
            >
              Check out
            </Button>
          ) : (
            <Button
              size="sm"
              loading={checkIn.isPending}
              onClick={() => checkIn.mutate({ courtroom_id: id })}
            >
              I'm in this courtroom
            </Button>
          )}
        </Flex>
        <Text textStyle="small-regular" color="gray.200" mb="4">
          Once checked in, tap the status you can see. Two or more matching
          reports verify it and alert every lawyer tracking this courtroom.
          Early verified reports earn Pulse Credits.
        </Text>
        <StatusTapGroup
          value={current?.status ?? null}
          onSelect={onSelect}
          disabled={!isCheckedInHere}
          loading={report.isPending}
        />
      </SurfaceCard>
    </Stack>
  );
}
