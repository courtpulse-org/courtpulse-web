import {
  Box,
  Button,
  Checkbox,
  Flex,
  NativeSelect,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import type { ICauseList, IDiaryDay } from "@repo/types";
import { CustomTextArea } from "@repo/ui/input";
import { formatCourtDate } from "@repo/utils";
import { AppDialog, BusinessTag, ReachPill } from "@/components/common";
import { useBulkAdjourn, useDiary } from "@/shared/api";

interface Props {
  open: boolean;
  onClose: () => void;
  list: ICauseList;
}

/**
 * "Taking dates" for everything left on the list — the job a registrar does
 * at the registry window when the judge doesn't sit, done in one pass. Dates
 * are spread across the diary so no day is overloaded.
 */
export function BulkAdjournDialog({ open, onClose, list }: Props) {
  const bulk = useBulkAdjourn();
  const diary = useDiary(list.courtroom_id, 45);
  const pending = useMemo(
    () =>
      list.items.filter((i) =>
        ["PENDING", "STOOD_DOWN", "CALLED"].includes(i.outcome ?? "PENDING"),
      ),
    [list.items],
  );
  const [perDay, setPerDay] = useState(4);
  const [dates, setDates] = useState<Record<string, string>>({});
  const [note, setNote] = useState("Court did not sit.");
  const [notify, setNotify] = useState(true);

  const openDays: IDiaryDay[] = useMemo(
    () =>
      (diary.data?.data ?? []).filter(
        (d) => !d.blocked && d.booked < d.capacity,
      ),
    [diary.data],
  );

  const autoAssign = (limit: number) => {
    const out: Record<string, string> = {};
    const used: Record<string, number> = {};
    let dayIdx = 0;
    for (const item of pending) {
      while (dayIdx < openDays.length) {
        const d = openDays[dayIdx]!;
        const room = d.capacity - d.booked - (used[d.date] ?? 0);
        if ((used[d.date] ?? 0) < limit && room > 0) break;
        dayIdx += 1;
      }
      const day = openDays[Math.min(dayIdx, openDays.length - 1)];
      if (day) {
        out[item.id] = day.date;
        used[day.date] = (used[day.date] ?? 0) + 1;
      }
    }
    setDates(out);
  };

  useEffect(() => {
    if (open && openDays.length) autoAssign(perDay);
    // Re-spread whenever the dialog opens or the limit changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, openDays.length, perDay]);

  const assigned = pending.filter((i) => dates[i.id]);
  const counsel = new Set(
    assigned.flatMap((i) =>
      [i.claimant_counsel, i.defendant_counsel].filter(Boolean),
    ),
  );

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      size="xl"
      title={`Give new dates · ${pending.length} matters`}
      description="Dates are spread across the judge's diary. Change any row before sending."
      footer={
        <Flex
          w="full"
          justify="space-between"
          align="center"
          gap="3"
          direction={{ base: "column", md: "row" }}
        >
          {notify ? (
            <ReachPill recipients={counsel.size} compact future />
          ) : (
            <Box />
          )}
          <Button
            w={{ base: "full", md: "auto" }}
            disabled={assigned.length === 0}
            loading={bulk.isPending}
            onClick={async () => {
              await bulk.mutateAsync({
                courtroom_id: list.courtroom_id,
                assignments: assigned.map((i) => ({
                  item_id: i.id,
                  next_date: dates[i.id]!,
                  next_business: i.business,
                })),
                note,
                notify,
              });
              onClose();
            }}
          >
            Adjourn {assigned.length} & send hearing notices
          </Button>
        </Flex>
      }
    >
      <Stack gap="4">
        <Flex gap="3" align="center" wrap="wrap">
          <Text textStyle="small-medium" color="gray.400">
            At most
          </Text>
          <NativeSelect.Root size="sm" w="5.5rem">
            <NativeSelect.Field
              value={perDay}
              onChange={(e) => setPerDay(Number(e.target.value))}
            >
              {[2, 3, 4, 5, 6, 8].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          <Text textStyle="small-medium" color="gray.400">
            of these matters per day
          </Text>
        </Flex>

        <Box
          border="1px solid"
          borderColor="gray.75"
          rounded="md"
          overflowX="auto"
        >
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row bg="gray.25">
                <Table.ColumnHeader w="3rem">#</Table.ColumnHeader>
                <Table.ColumnHeader>Matter</Table.ColumnHeader>
                <Table.ColumnHeader minW="13rem">New date</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {pending.map((i) => (
                <Table.Row key={i.id}>
                  <Table.Cell textStyle="mono" color="gray.300">
                    {i.item_number}
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap="2" align="center" wrap="wrap">
                      <Text textStyle="mono" fontSize="xs">
                        {i.suit_number}
                      </Text>
                      <BusinessTag business={i.business} />
                    </Flex>
                    <Text
                      textStyle="tiny-regular"
                      color="gray.300"
                      lineClamp={1}
                    >
                      {i.title}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        value={dates[i.id] ?? ""}
                        onChange={(e) =>
                          setDates((d) => ({ ...d, [i.id]: e.target.value }))
                        }
                      >
                        <option value="">Don't adjourn</option>
                        {openDays.map((d) => (
                          <option key={d.date} value={d.date}>
                            {formatCourtDate(d.date)} · {d.booked}/{d.capacity}
                          </option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>

        <CustomTextArea
          label="Note on every notice"
          rows={2}
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
              Send each counsel a hearing notice with their matter's new date
              (SMS + WhatsApp)
            </Text>
          </Checkbox.Label>
        </Checkbox.Root>
      </Stack>
    </AppDialog>
  );
}
