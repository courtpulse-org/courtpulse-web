import { Badge, type BadgeProps } from "@chakra-ui/react";
import { COURT_STATUS_LABEL, type CourtStatus } from "@repo/types";
import { COURT_STATUS_COLOR } from "@repo/theme";
import { LiveDot } from "./live-dot";

interface CourtStatusBadgeProps extends Omit<BadgeProps, "children"> {
  status: CourtStatus;
  /** Show the live ring — pass true for a VERIFIED or OFFICIAL status. */
  live?: boolean;
}

export function CourtStatusBadge({
  status,
  live = false,
  ...props
}: CourtStatusBadgeProps) {
  const palette = COURT_STATUS_COLOR[status];
  return (
    <Badge
      colorPalette={palette}
      variant="subtle"
      rounded="full"
      px="2.5"
      py="1"
      textStyle="tiny-semibold"
      display="inline-flex"
      alignItems="center"
      gap="1.5"
      {...props}
    >
      {live && <LiveDot colorPalette={palette} />}
      {COURT_STATUS_LABEL[status]}
    </Badge>
  );
}
