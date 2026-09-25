import { Badge, type BadgeProps } from "@chakra-ui/react";
import {
  BUSINESS_LABEL,
  OUTCOME_LABEL,
  type AppearanceOutcome,
  type BusinessOfDay,
} from "@repo/types";
import { OUTCOME_COLOR } from "@repo/theme";
import { formatShortDate } from "@repo/utils";

export function OutcomeBadge({
  outcome = "PENDING",
  nextDate,
  ...props
}: { outcome?: AppearanceOutcome; nextDate?: string | null } & BadgeProps) {
  return (
    <Badge
      colorPalette={OUTCOME_COLOR[outcome]}
      variant="subtle"
      rounded="full"
      px="2"
      textStyle="tiny-semibold"
      {...props}
    >
      {outcome === "ADJOURNED" && nextDate
        ? `Adjourned · ${formatShortDate(nextDate)}`
        : OUTCOME_LABEL[outcome]}
    </Badge>
  );
}

const SHORT_BUSINESS: Record<BusinessOfDay, string> = {
  MENTION: "Mention",
  HEARING: "Hearing",
  MOTION: "Motion",
  ADOPTION: "Adoption",
  RULING: "Ruling",
  JUDGMENT: "Judgment",
};

export function BusinessTag({
  business,
  ...props
}: { business?: BusinessOfDay } & BadgeProps) {
  if (!business) return null;
  const heavy = business === "RULING" || business === "JUDGMENT";
  return (
    <Badge
      variant="outline"
      colorPalette={heavy ? "secondary" : "gray"}
      rounded="sm"
      textStyle="tiny-medium"
      title={BUSINESS_LABEL[business]}
      {...props}
    >
      {SHORT_BUSINESS[business]}
    </Badge>
  );
}
