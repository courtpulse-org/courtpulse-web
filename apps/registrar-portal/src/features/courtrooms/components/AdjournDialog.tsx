import { Button, Checkbox, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  BUSINESS_LABEL,
  BUSINESS_TYPES,
  type BusinessOfDay,
  type ICauseListItem,
} from "@repo/types";
import { CustomSelect, CustomTextArea } from "@repo/ui/input";
import { formatCourtDate } from "@repo/utils";
import { AppDialog, FormField, MessagePreview } from "@/components/common";
import { DateSuggestions } from "@/components/diary/DateSuggestions";
import { useSetOutcome } from "@/shared/api";

interface Props {
  item: ICauseListItem | null;
  courtroomId: string;
  onClose: () => void;
  /** "RESERVED" = judgment reserved to a date. */
  mode?: "ADJOURNED" | "RESERVED";
}

export function AdjournDialog({
  item,
  courtroomId,
  onClose,
  mode = "ADJOURNED",
}: Props) {
  const setOutcome = useSetOutcome();
  const [date, setDate] = useState("");
  const [business, setBusiness] = useState<BusinessOfDay>("HEARING");
  const [note, setNote] = useState("");
  const [notify, setNotify] = useState(true);

  useEffect(() => {
    if (!item) return;
    setDate("");
    setBusiness(
      mode === "RESERVED" ? "JUDGMENT" : (item.business ?? "HEARING"),
    );
    setNote("");
    setNotify(true);
  }, [item, mode]);

  if (!item) return null;

  const message = `${item.suit_number}${item.title ? ` ${item.title}` : ""}: ${mode === "RESERVED" ? "judgment reserved" : "adjourned"}${date ? ` to ${formatCourtDate(date)}` : ""}${business ? ` for ${BUSINESS_LABEL[business].toLowerCase()}` : ""}.${note ? ` ${note}` : ""}`;

  return (
    <AppDialog
      open={!!item}
      onClose={onClose}
      size="lg"
      title={
        mode === "RESERVED"
          ? `Reserve judgment · Item #${item.item_number}`
          : `Adjourn Item #${item.item_number}`
      }
      description={`${item.suit_number} · ${item.title ?? ""}`}
      footer={
        <Button
          w={{ base: "full", md: "auto" }}
          disabled={!date}
          loading={setOutcome.isPending}
          onClick={async () => {
            await setOutcome.mutateAsync({
              id: item.id,
              outcome: mode,
              next_date: date,
              next_business: business,
              note: note || null,
              notify,
            });
            onClose();
          }}
        >
          {notify ? "Save & send hearing notice" : "Save"}
        </Button>
      }
    >
      <Stack gap="5">
        <FormField
          label="New date"
          hint="Suggested from the judge's diary — busiest days are marked."
        >
          <DateSuggestions
            courtroomId={courtroomId}
            value={date}
            onChange={setDate}
          />
        </FormField>
        <CustomSelect
          label="Business on the next date"
          options={BUSINESS_TYPES.map((b) => ({
            label: BUSINESS_LABEL[b],
            value: b,
          }))}
          value={business}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setBusiness(e.target.value as BusinessOfDay)
          }
        />
        <CustomTextArea
          label="Note (optional)"
          rows={2}
          placeholder="e.g. Adjourned at the instance of the defendant. Costs of ₦20,000 awarded."
          value={note}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setNote(e.target.value)
          }
        />
        <Checkbox.Root
          checked={notify}
          onCheckedChange={(e) => setNotify(!!e.checked)}
          colorPalette="primary"
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>
            <Text textStyle="small-medium">
              Send a hearing notice to counsel on this matter
            </Text>
          </Checkbox.Label>
        </Checkbox.Root>
        {notify && <MessagePreview message={message} label="Hearing notice" />}
      </Stack>
    </AppDialog>
  );
}
