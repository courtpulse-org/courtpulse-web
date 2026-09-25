import {
  Badge,
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  NativeSelect,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  COURT_SYSTEM_LABEL,
  type CourtSystem,
  type ICalendarPeriod,
} from "@repo/types";
import { PageHeader } from "@repo/ui/elements";
import { PlusIcon, TrashIcon } from "@repo/ui/icons";
import { formatCourtDate } from "@repo/utils";
import { AppDialog, FormField, SectionCard } from "@/components/common";
import {
  todayLagos,
  useAddCalendarPeriod,
  useCalendar,
  useRemoveCalendarPeriod,
} from "@/shared/api";

const KIND_COLOR = {
  VACATION: "info",
  PUBLIC_HOLIDAY: "secondary",
  OTHER: "gray",
} as const;

export function CalendarPage() {
  const periods = useCalendar().data?.data ?? [];
  const remove = useRemoveCalendarPeriod();
  const add = useAddCalendarPeriod();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    kind: "PUBLIC_HOLIDAY" as ICalendarPeriod["kind"],
    start_date: "",
    end_date: "",
    court_system: "",
  });
  const today = todayLagos();
  const upcoming = periods.filter((p) => p.end_date >= today);
  const past = periods.filter((p) => p.end_date < today);

  const row = (p: ICalendarPeriod) => (
    <Flex
      key={p.id}
      justify="space-between"
      align="center"
      gap="3"
      py="3"
      borderBottom="1px solid"
      borderColor="gray.75"
    >
      <Box minW="0">
        <Flex gap="2" align="center" wrap="wrap">
          <Text textStyle="small-semibold">{p.name}</Text>
          <Badge colorPalette={KIND_COLOR[p.kind]} variant="subtle" size="sm">
            {p.kind === "PUBLIC_HOLIDAY"
              ? "Public holiday"
              : p.kind === "VACATION"
                ? "Vacation"
                : "Other"}
          </Badge>
          <Text textStyle="tiny-regular" color="gray.200">
            {p.court_system ? COURT_SYSTEM_LABEL[p.court_system] : "All courts"}
          </Text>
        </Flex>
        <Text textStyle="tiny-regular" color="gray.300">
          {formatCourtDate(p.start_date)}
          {p.end_date !== p.start_date
            ? ` – ${formatCourtDate(p.end_date)}`
            : ""}
          {p.start_date <= today && p.end_date >= today
            ? " · in effect now"
            : ""}
        </Text>
      </Box>
      <IconButton
        aria-label="Remove"
        size="sm"
        variant="ghost"
        onClick={() => remove.mutate(p.id)}
      >
        <TrashIcon />
      </IconButton>
    </Flex>
  );

  return (
    <>
      <PageHeader
        title="Legal calendar"
        description="Vacations and public holidays. Regular courts don't sit on these days, so no 'not sitting' alerts go out and they're blocked in every judge's diary."
        actions={
          <Button onClick={() => setOpen(true)}>
            <PlusIcon /> Add period
          </Button>
        }
      />
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap="5" alignItems="flex-start">
        <SectionCard title="Upcoming & current">
          {upcoming.map(row)}
        </SectionCard>
        <SectionCard title="Earlier this legal year">
          {past.length ? (
            past.map(row)
          ) : (
            <Text textStyle="small-regular" color="gray.200">
              None.
            </Text>
          )}
        </SectionCard>
      </SimpleGrid>
      <AppDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Add a non-sitting period"
        footer={
          <Button
            disabled={!form.name || !form.start_date}
            loading={add.isPending}
            onClick={async () => {
              await add.mutateAsync({
                ...form,
                end_date: form.end_date || form.start_date,
                court_system: (form.court_system || null) as CourtSystem | null,
              });
              setOpen(false);
            }}
          >
            Add to calendar
          </Button>
        }
      >
        <Stack gap="4">
          <FormField label="Name">
            <Input
              placeholder="e.g. Eid-el-Maulud"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </FormField>
          <FormField label="Type">
            <NativeSelect.Root>
              <NativeSelect.Field
                value={form.kind}
                onChange={(e) =>
                  setForm({
                    ...form,
                    kind: e.target.value as ICalendarPeriod["kind"],
                  })
                }
              >
                <option value="PUBLIC_HOLIDAY">Public holiday</option>
                <option value="VACATION">Court vacation</option>
                <option value="OTHER">Other</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </FormField>
          <SimpleGrid columns={2} gap="3">
            <FormField label="From">
              <Input
                type="date"
                value={form.start_date}
                onChange={(e) =>
                  setForm({ ...form, start_date: e.target.value })
                }
              />
            </FormField>
            <FormField label="To">
              <Input
                type="date"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              />
            </FormField>
          </SimpleGrid>
          <FormField label="Applies to">
            <NativeSelect.Root>
              <NativeSelect.Field
                value={form.court_system}
                onChange={(e) =>
                  setForm({ ...form, court_system: e.target.value })
                }
              >
                <option value="">All courts</option>
                {(Object.keys(COURT_SYSTEM_LABEL) as CourtSystem[]).map((k) => (
                  <option key={k} value={k}>
                    {COURT_SYSTEM_LABEL[k]}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </FormField>
        </Stack>
      </AppDialog>
    </>
  );
}
