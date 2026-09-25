import { Button, Checkbox, Input, Stack, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import {
  NOT_SITTING_REASON_LABEL,
  type CourtStatus,
  type NotSittingReason,
} from "@repo/types";
import { CustomTextArea } from "@repo/ui/input";
import { formatClock } from "@repo/utils";
import {
  AppDialog,
  ChipGroup,
  FormField,
  MessagePreview,
  ReachPill,
} from "@/components/common";
import { usePostStatus, type RegistrarCourtroom } from "@/shared/api";

const NOT_SITTING_REASONS: NotSittingReason[] = [
  "INDISPOSED",
  "ON_LEAVE",
  "OFFICIAL_ENGAGEMENT",
  "CHAMBERS_MEETING",
  "TRAINING",
  "PUBLIC_HOLIDAY",
  "STRIKE",
  "OTHER",
];
const LATE_REASONS: NotSittingReason[] = [
  "CHAMBERS_MEETING",
  "OFFICIAL_ENGAGEMENT",
  "OTHER",
];
const LATE_TIMES = [
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "14:00",
];
const SITTING_TIMES = ["09:00", "09:30", "10:00", "10:30"];

interface StatusDialogProps {
  row: RegistrarCourtroom;
  date: string;
  isToday: boolean;
  target: CourtStatus | null;
  onClose: () => void;
  /** Called after "Not sitting" when the registrar chose to give dates now. */
  onAdjournNow?: () => void;
}

export function StatusDialog({
  row,
  date,
  isToday,
  target,
  onClose,
  onAdjournNow,
}: StatusDialogProps) {
  const post = usePostStatus();
  const [reason, setReason] = useState<NotSittingReason | null>(null);
  const [time, setTime] = useState<string>("");
  const [until, setUntil] = useState("");
  const [note, setNote] = useState("");
  const [adjournNow, setAdjournNow] = useState(true);

  useEffect(() => {
    if (!target) return;
    setReason(
      target === "NOT_SITTING"
        ? "INDISPOSED"
        : target === "SITTING_LATE"
          ? "CHAMBERS_MEETING"
          : null,
    );
    setTime(
      target === "SITTING_LATE"
        ? "11:30"
        : target === "SITTING"
          ? (row.courtroom.default_sitting_time ?? "09:00")
          : "",
    );
    setUntil("");
    setNote("");
  }, [target, row.courtroom.default_sitting_time]);

  const room = `${row.courtroom.complex_name?.replace(/^(Federal )?High Court, /, "")} ${row.courtroom.name}`;
  const when = isToday ? "today" : "tomorrow";
  const pending = row.list?.pending ?? 0;

  const message = useMemo(() => {
    const extra = note.trim() ? ` ${note.trim()}` : "";
    if (target === "NOT_SITTING") {
      return `${room} will NOT sit ${when}${reason ? ` — ${NOT_SITTING_REASON_LABEL[reason].toLowerCase()}` : ""}.${until ? ` Expected back ${until}.` : ""}${isToday && adjournNow && pending ? " New dates will be sent to you shortly." : ""}${extra}`;
    }
    if (target === "SITTING_LATE") {
      return `${room} is sitting late ${when}${time ? `, expected ${formatClock(time)}` : ""}${reason ? ` (${NOT_SITTING_REASON_LABEL[reason].toLowerCase()})` : ""}.${extra}`;
    }
    return `${room} is sitting ${when}${time ? ` from ${formatClock(time)}` : ""}.${extra}`;
  }, [
    target,
    room,
    when,
    reason,
    until,
    note,
    time,
    isToday,
    adjournNow,
    pending,
  ]);

  if (!target) return null;

  const submit = async () => {
    await post.mutateAsync({
      courtroom_id: row.courtroom.id,
      date,
      status: target,
      reason: target === "SITTING" ? null : reason,
      expected_start: time ? formatClock(time) : null,
      until_date: until || null,
      note: note.trim() || null,
    });
    onClose();
    if (target === "NOT_SITTING" && isToday && adjournNow && pending > 0)
      onAdjournNow?.();
  };

  const title =
    target === "NOT_SITTING"
      ? `${row.courtroom.name} is not sitting ${when}`
      : target === "SITTING_LATE"
        ? `${row.courtroom.name} is sitting late`
        : `${row.courtroom.name} is sitting ${when}`;

  return (
    <AppDialog
      open={!!target}
      onClose={onClose}
      title={title}
      description={row.courtroom.judge_name}
      footer={
        <Stack w="full" gap="3">
          <ReachPill
            recipients={row.reach.recipients}
            sms={row.reach.sms}
            whatsapp={row.reach.whatsapp}
            future
          />
          <Button
            size="lg"
            w="full"
            variant={target === "NOT_SITTING" ? "danger" : "primary"}
            loading={post.isPending}
            onClick={submit}
          >
            Post & alert {row.reach.recipients} counsel
          </Button>
        </Stack>
      }
    >
      <Stack gap="5">
        {target !== "SITTING" && (
          <FormField label="Reason">
            <ChipGroup
              value={reason}
              onChange={setReason}
              colorPalette={target === "NOT_SITTING" ? "error" : "warning"}
              options={(target === "NOT_SITTING"
                ? NOT_SITTING_REASONS
                : LATE_REASONS
              ).map((r) => ({
                value: r,
                label: NOT_SITTING_REASON_LABEL[r],
              }))}
            />
          </FormField>
        )}

        {(target === "SITTING_LATE" || target === "SITTING") && (
          <FormField
            label={target === "SITTING" ? "Sitting from" : "Expected to sit at"}
          >
            <ChipGroup
              value={time}
              onChange={setTime}
              colorPalette={target === "SITTING" ? "primary" : "warning"}
              options={(target === "SITTING" ? SITTING_TIMES : LATE_TIMES).map(
                (t) => ({ value: t, label: formatClock(t) }),
              )}
            />
            <Input
              type="time"
              mt="2"
              maxW="10rem"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </FormField>
        )}

        {target === "NOT_SITTING" &&
          (reason === "ON_LEAVE" ||
            reason === "TRAINING" ||
            reason === "INDISPOSED") && (
            <FormField
              label="Expected back (optional)"
              hint="Counsel with matters before then are told not to come."
            >
              <Input
                type="date"
                maxW="12rem"
                value={until}
                onChange={(e) => setUntil(e.target.value)}
              />
            </FormField>
          )}

        <CustomTextArea
          label="Note to counsel (optional)"
          rows={2}
          placeholder={
            target === "NOT_SITTING"
              ? "e.g. New dates will be given at the registry from 10:00 AM."
              : "e.g. Counsel in matters listed are to remain within the premises."
          }
          value={note}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setNote(e.target.value)
          }
        />

        {target === "NOT_SITTING" && isToday && pending > 0 && (
          <Checkbox.Root
            checked={adjournNow}
            onCheckedChange={(e) => setAdjournNow(!!e.checked)}
            colorPalette="primary"
            alignItems="flex-start"
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control mt="0.5" />
            <Checkbox.Label>
              <Text textStyle="small-semibold">
                Give new dates for the {pending} listed matters next
              </Text>
              <Text textStyle="tiny-regular" color="gray.200">
                Opens date-taking with dates suggested from the judge's diary.
                Counsel get a hearing notice.
              </Text>
            </Checkbox.Label>
          </Checkbox.Root>
        )}

        <MessagePreview message={message} label="SMS & WhatsApp preview" />
      </Stack>
    </AppDialog>
  );
}
