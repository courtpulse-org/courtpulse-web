import { Badge, type BadgeProps } from "@chakra-ui/react";
import type { VerificationLevel } from "@repo/types";
import { VERIFICATION_COLOR } from "@repo/theme";

const LABEL: Record<VerificationLevel, string> = {
  UNVERIFIED: "Unverified",
  VERIFIED: "Verified",
  OFFICIAL: "Official",
};

interface VerificationBadgeProps extends Omit<BadgeProps, "children"> {
  level: VerificationLevel;
  /** Number of independent Spotter reports behind this status. */
  reportCount?: number;
}

export function VerificationBadge({
  level,
  reportCount,
  ...props
}: VerificationBadgeProps) {
  return (
    <Badge
      colorPalette={VERIFICATION_COLOR[level]}
      variant={level === "OFFICIAL" ? "solid" : "outline"}
      rounded="full"
      px="2"
      textStyle="tiny-medium"
      {...props}
    >
      {LABEL[level]}
      {reportCount != null && level !== "OFFICIAL" ? ` · ${reportCount}` : ""}
    </Badge>
  );
}
