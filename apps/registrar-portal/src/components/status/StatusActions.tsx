import { Button, Menu, Portal, SimpleGrid } from "@chakra-ui/react";
import { useState } from "react";
import {
  COURT_STATUSES,
  COURT_STATUS_LABEL,
  COURT_STATUS_TRANSITIONS,
  type CourtStatus,
} from "@repo/types";
import { COURT_STATUS_COLOR } from "@repo/theme";
import { DotsIcon } from "@repo/ui/icons";
import { usePostStatus, type RegistrarCourtroom } from "@/shared/api";
import { StatusDialog } from "./StatusDialog";

/** Statuses that need a detail (reason / time) before posting. */
const NEEDS_DETAIL: CourtStatus[] = ["NOT_SITTING", "SITTING_LATE", "SITTING"];

const ACTION_LABEL: Record<CourtStatus, string> = {
  SITTING: "Sitting",
  SITTING_LATE: "Sitting late",
  ON_BENCH: "Judge on bench",
  IN_RECESS: "Recess",
  ROSE: "Court rose",
  NOT_SITTING: "Not sitting",
};

interface StatusActionsProps {
  row: RegistrarCourtroom;
  date: string;
  isToday: boolean;
  onAdjournNow?: () => void;
  size?: "lg" | "xl";
}

/**
 * The registrar's 1-tap control. Shows only the sensible next states from the
 * sitting state machine; everything else sits behind "More".
 */
export function StatusActions({
  row,
  date,
  isToday,
  onAdjournNow,
  size = "lg",
}: StatusActionsProps) {
  const post = usePostStatus();
  const [target, setTarget] = useState<CourtStatus | null>(null);
  const [posting, setPosting] = useState<CourtStatus | null>(null);

  const current = row.status?.status ?? "UNKNOWN";
  // Tomorrow can only be planned, not run.
  const next = isToday
    ? COURT_STATUS_TRANSITIONS[current]
    : COURT_STATUS_TRANSITIONS.UNKNOWN;
  const others = COURT_STATUSES.filter(
    (s) =>
      !next.includes(s) &&
      s !== current &&
      (isToday || NEEDS_DETAIL.includes(s)),
  );

  const choose = (s: CourtStatus) => {
    if (NEEDS_DETAIL.includes(s)) {
      setTarget(s);
      return;
    }
    setPosting(s);
    post.mutate(
      { courtroom_id: row.courtroom.id, date, status: s },
      { onSettled: () => setPosting(null) },
    );
  };

  return (
    <>
      <SimpleGrid
        columns={{
          base: next.length > 2 ? 2 : next.length,
          sm: next.length + (others.length ? 1 : 0),
        }}
        gap="2"
      >
        {next.map((s, idx) => (
          <Button
            key={s}
            variant="status"
            size={size}
            colorPalette={COURT_STATUS_COLOR[s]}
            loading={posting === s}
            disabled={posting !== null}
            onClick={() => choose(s)}
            gridColumn={{
              base:
                next.length === 3 && idx === 2 && !others.length
                  ? "span 2"
                  : undefined,
              sm: "auto",
            }}
          >
            {ACTION_LABEL[s]}
          </Button>
        ))}
        {others.length > 0 && (
          <Menu.Root positioning={{ placement: "bottom-end" }}>
            <Menu.Trigger asChild>
              <Button
                variant="outlineSecondary"
                size={size}
                aria-label="More statuses"
              >
                <DotsIcon /> More
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content minW="200px">
                  {others.map((s) => (
                    <Menu.Item key={s} value={s} onClick={() => choose(s)}>
                      {COURT_STATUS_LABEL[s]}
                    </Menu.Item>
                  ))}
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        )}
      </SimpleGrid>
      <StatusDialog
        row={row}
        date={date}
        isToday={isToday}
        target={target}
        onClose={() => setTarget(null)}
        onAdjournNow={onAdjournNow}
      />
    </>
  );
}
