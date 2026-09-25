import { Button, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  BUSINESS_LABEL,
  BUSINESS_TYPES,
  type BusinessOfDay,
  type ICauseListItem,
} from "@repo/types";
import { CustomInput, CustomSelect } from "@repo/ui/input";
import { looksLikeSuitNumber, normalizeSuitNumber } from "@repo/utils";
import { AppDialog } from "@/components/common";
import { useAddItems, useUpdateItem } from "@/shared/api";

interface Props {
  open: boolean;
  onClose: () => void;
  courtroomId: string;
  date: string;
  /** Present when editing. */
  item?: ICauseListItem | null;
}

const empty = {
  suit_number: "",
  title: "",
  business: "MENTION" as BusinessOfDay,
  claimant_counsel: "",
  defendant_counsel: "",
};

export function ItemFormDialog({
  open,
  onClose,
  courtroomId,
  date,
  item,
}: Props) {
  const add = useAddItems();
  const update = useUpdateItem();
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (!open) return;
    setForm(
      item
        ? {
            suit_number: item.suit_number,
            title: item.title ?? "",
            business: item.business ?? "MENTION",
            claimant_counsel: item.claimant_counsel ?? "",
            defendant_counsel: item.defendant_counsel ?? "",
          }
        : empty,
    );
  }, [open, item]);

  const normalized = normalizeSuitNumber(form.suit_number);
  const suspicious =
    form.suit_number.length > 3 && !looksLikeSuitNumber(form.suit_number);
  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    const payload = { ...form, suit_number: normalized };
    if (item) await update.mutateAsync({ id: item.id, ...payload });
    else
      await add.mutateAsync({
        courtroom_id: courtroomId,
        date,
        items: [payload],
      });
    onClose();
  };

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={item ? `Edit Item #${item.item_number}` : "Add a matter"}
      description={
        item
          ? undefined
          : "It goes to the end of the list. Reorder from the list."
      }
      footer={
        <Button
          w={{ base: "full", md: "auto" }}
          disabled={!form.suit_number.trim()}
          loading={add.isPending || update.isPending}
          onClick={submit}
        >
          {item ? "Save changes" : "Add to cause list"}
        </Button>
      }
    >
      <Stack gap="4">
        <CustomInput
          label="Suit number"
          required
          placeholder="ID/1234/2024"
          value={form.suit_number}
          onChange={set("suit_number")}
          inputProps={{ textStyle: "mono", autoFocus: true }}
          helperText={
            form.suit_number && normalized !== form.suit_number
              ? `Saved as ${normalized}`
              : "Any format — it's normalised for matching counsel's watchlists."
          }
        />
        {suspicious && (
          <Text textStyle="tiny-medium" color="warning.700" mt="-2">
            That doesn't look like a complete suit number (prefix / serial /
            year). Check it before saving.
          </Text>
        )}
        <CustomInput
          label="Parties"
          placeholder="Adeyemi v. Lekki Pearl Estates Ltd"
          value={form.title}
          onChange={set("title")}
        />
        <CustomSelect
          label="Business of the day"
          options={BUSINESS_TYPES.map((b) => ({
            label: BUSINESS_LABEL[b],
            value: b,
          }))}
          value={form.business}
          onChange={set("business")}
        />
        <SimpleGrid columns={{ base: 1, sm: 2 }} gap="4">
          <CustomInput
            label="Claimant's counsel"
            placeholder="A. Okafor"
            value={form.claimant_counsel}
            onChange={set("claimant_counsel")}
          />
          <CustomInput
            label="Defendant's counsel"
            placeholder="O. Adeyemi SAN"
            value={form.defendant_counsel}
            onChange={set("defendant_counsel")}
          />
        </SimpleGrid>
      </Stack>
    </AppDialog>
  );
}
