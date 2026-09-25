import { Badge, Box, Flex, Text } from "@chakra-ui/react";
import { NOT_SITTING_REASON_LABEL, type ICourtroomStatus } from "@repo/types";
import { CourtStatusBadge } from "@repo/ui/court";
import { formatCourtDate, formatCourtTime } from "@repo/utils";

/** Big status + provenance + the detail counsel will see. */
export function StatusSummary({
  status,
  compact,
}: {
  status: ICourtroomStatus | null;
  compact?: boolean;
}) {
  if (!status) {
    return (
      <Box>
        <Badge
          variant="outline"
          colorPalette="gray"
          rounded="full"
          px="2.5"
          py="1"
          textStyle="tiny-semibold"
        >
          No status posted
        </Badge>
        {!compact && (
          <Text textStyle="tiny-regular" color="gray.200" mt="1.5">
            Counsel see "Unknown" until you or spotters post.
          </Text>
        )}
      </Box>
    );
  }
  const detail = [
    status.reason ? NOT_SITTING_REASON_LABEL[status.reason] : null,
    status.expected_start ? `expected ${status.expected_start}` : null,
    status.until_date ? `back ${formatCourtDate(status.until_date)}` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  return (
    <Box minW="0">
      <Flex align="center" gap="2" wrap="wrap">
        <CourtStatusBadge
          status={status.status}
          live={status.verification !== "UNVERIFIED"}
          fontSize="sm"
          px="3"
          py="1.5"
        />
        <Text textStyle="tiny-regular" color="gray.200">
          {status.verification === "OFFICIAL"
            ? "Official"
            : status.verification === "VERIFIED"
              ? `Verified by ${status.report_count} spotters`
              : "1 spotter, unverified"}{" "}
          · {formatCourtTime(status.reported_at)}
        </Text>
      </Flex>
      {!compact && (detail || status.note) && (
        <Text textStyle="small-regular" color="gray.300" mt="2" lineClamp={2}>
          {detail && (
            <Text as="span" fontWeight="600" color="gray.400">
              {detail}.{" "}
            </Text>
          )}
          {status.note}
        </Text>
      )}
    </Box>
  );
}
