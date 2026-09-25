import { Flex, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import type { CourtStatus } from "@repo/types";
import { CourtStatusBadge, StatusTapGroup } from "@repo/ui/court";
import { SurfaceCard } from "@repo/ui/elements";
import { timeAgo } from "@repo/utils";
import { usePostOfficialStatus, type RegistrarCourtroom } from "../api";

// PRD Module 3 lists three registrar statuses; recess is a Spotter report.
const REGISTRAR_STATUSES = ["ON_BENCH", "SITTING_LATE", "NOT_SITTING"] as const;

export function CourtroomStatusCard({ row }: { row: RegistrarCourtroom }) {
  const post = usePostOfficialStatus();
  const [pending, setPending] = useState<CourtStatus | null>(null);

  return (
    <SurfaceCard>
      <Flex justify="space-between" align="center" mb="4" gap="3" wrap="wrap">
        <Stack gap="0.5">
          <Text textStyle="h4">{row.courtroom.name}</Text>
          {row.courtroom.judge_name && (
            <Text textStyle="tiny-regular" color="gray.200">
              {row.courtroom.judge_name}
            </Text>
          )}
        </Stack>
        {row.status && (
          <Flex align="center" gap="2">
            <CourtStatusBadge status={row.status.status} live />
            <Text textStyle="tiny-regular" color="gray.200">
              {timeAgo(row.status.reported_at)}
            </Text>
          </Flex>
        )}
      </Flex>
      <StatusTapGroup
        statuses={REGISTRAR_STATUSES}
        value={pending ?? row.status?.status ?? null}
        loading={post.isPending}
        onSelect={(status) => {
          setPending(status);
          post.mutate(
            { courtroom_id: row.courtroom.id, status },
            { onSettled: () => setPending(null) },
          );
        }}
      />
    </SurfaceCard>
  );
}
