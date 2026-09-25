import { Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { CourtStatusBadge, VerificationBadge } from "@repo/ui/court";
import { SurfaceCard } from "@repo/ui/elements";
import { timeAgo } from "@repo/utils";
import type { LiveBoardRow as Row } from "@/shared/api";
import { RouteConstants } from "@/shared/constants/routes";

export function LiveBoardRow({ row }: { row: Row }) {
  const { courtroom, status } = row;
  return (
    <Link to={RouteConstants.pulse.courtroom.generate({ id: courtroom.id })}>
      <SurfaceCard
        _hover={{ borderColor: "primary.100" }}
        borderLeft="3px solid"
        borderLeftColor={row.has_watched_case ? "secondary.300" : "gray.75"}
      >
        <Flex justify="space-between" align="center" gap="3" wrap="wrap">
          <Flex direction="column" gap="0.5">
            <Text textStyle="default-semibold">{courtroom.name}</Text>
            {courtroom.judge_name && (
              <Text textStyle="tiny-regular" color="gray.200">
                {courtroom.judge_name}
              </Text>
            )}
          </Flex>
          <Flex align="center" gap="2">
            {status ? (
              <>
                <CourtStatusBadge
                  status={status.status}
                  live={status.verification !== "UNVERIFIED"}
                />
                <VerificationBadge
                  level={status.verification}
                  reportCount={status.report_count}
                />
                <Text textStyle="tiny-regular" color="gray.200">
                  {timeAgo(status.reported_at)}
                </Text>
              </>
            ) : (
              <Text textStyle="tiny-regular" color="gray.200">
                No reports yet today
              </Text>
            )}
          </Flex>
        </Flex>
      </SurfaceCard>
    </Link>
  );
}
