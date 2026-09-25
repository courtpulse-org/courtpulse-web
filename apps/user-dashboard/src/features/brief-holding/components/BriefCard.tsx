import { Badge, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import type { IBriefHoldingRequest } from "@repo/types";
import { SurfaceCard } from "@repo/ui/elements";
import { formatCourtDate, formatNaira, humanizeEnum } from "@repo/utils";
import { RouteConstants } from "@/shared/constants/routes";

const STATUS_PALETTE: Record<IBriefHoldingRequest["status"], string> = {
  OPEN: "info",
  ACCEPTED: "primary",
  IN_PROGRESS: "warning",
  COMPLETED: "success",
  CANCELLED: "gray",
  DISPUTED: "error",
};

export function BriefCard({ brief }: { brief: IBriefHoldingRequest }) {
  return (
    <Link to={RouteConstants.briefs.details.generate({ id: brief.id })}>
      <SurfaceCard _hover={{ borderColor: "primary.100" }}>
        <Flex justify="space-between" align="flex-start" gap="3">
          <Flex direction="column" gap="1">
            <Text textStyle="mono" color="primary.300">
              {brief.suit_number}
            </Text>
            <Text textStyle="small-regular" color="gray.300">
              {humanizeEnum(brief.matter_type)} ·{" "}
              {formatCourtDate(brief.scheduled_date)}
            </Text>
          </Flex>
          <Flex direction="column" align="flex-end" gap="1">
            <Text textStyle="default-semibold">
              {formatNaira(brief.fee_amount)}
            </Text>
            <Badge colorPalette={STATUS_PALETTE[brief.status]} variant="subtle">
              {humanizeEnum(brief.status)}
            </Badge>
          </Flex>
        </Flex>
      </SurfaceCard>
    </Link>
  );
}
