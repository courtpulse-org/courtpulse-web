import { Button, SimpleGrid, type SimpleGridProps } from "@chakra-ui/react";
import {
  SPOTTER_STATUSES,
  COURT_STATUS_LABEL,
  type CourtStatus,
} from "@repo/types";
import { COURT_STATUS_COLOR } from "@repo/theme";

interface StatusTapGroupProps extends Omit<SimpleGridProps, "onSelect"> {
  value?: CourtStatus | null;
  onSelect: (status: CourtStatus) => void;
  disabled?: boolean;
  loading?: boolean;
  /** Registrars don't post "Court in Recess" in V1 (PRD M3 lists three). */
  statuses?: readonly CourtStatus[];
}

/**
 * The 1-tap micro-status control shared by Spotters (lawyer app) and
 * Registrars (portal). Thumb-sized, two-up on phones.
 */
export function StatusTapGroup({
  value,
  onSelect,
  disabled,
  loading,
  statuses = SPOTTER_STATUSES,
  ...props
}: StatusTapGroupProps) {
  return (
    <SimpleGrid columns={{ base: 2, md: statuses.length }} gap="3" {...props}>
      {statuses.map((status) => (
        <Button
          key={status}
          variant="status"
          size="xl"
          colorPalette={COURT_STATUS_COLOR[status]}
          data-active={value === status ? "" : undefined}
          disabled={disabled}
          loading={loading && value === status}
          onClick={() => onSelect(status)}
        >
          {COURT_STATUS_LABEL[status]}
        </Button>
      ))}
    </SimpleGrid>
  );
}
