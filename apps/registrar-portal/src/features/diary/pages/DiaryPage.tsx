import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import type { IDiaryDay } from "@repo/types";
import { PageHeader, SectionLoader } from "@repo/ui/elements";
import { CustomSelect } from "@repo/ui/input";
import { formatCourtDate } from "@repo/utils";
import { SectionCard } from "@/components/common";
import { DiaryGrid } from "@/components/diary/DiaryGrid";
import {
  todayLagos,
  useDiary,
  useMyCourtrooms,
  useSetDiaryBlock,
} from "@/shared/api";

export function DiaryPage() {
  const roomsQuery = useMyCourtrooms(todayLagos());
  const rooms = useMemo(() => roomsQuery.data?.data ?? [], [roomsQuery.data]);
  const [courtroomId, setCourtroomId] = useState("");
  useEffect(() => {
    if (!courtroomId && rooms[0]) setCourtroomId(rooms[0].courtroom.id);
  }, [rooms, courtroomId]);
  const diary = useDiary(courtroomId, 40);
  const block = useSetDiaryBlock();
  const [selected, setSelected] = useState<IDiaryDay | null>(null);
  const [reason, setReason] = useState("");

  const days = diary.data?.data ?? [];
  const open = days.filter((d) => !d.blocked);
  const avg = open.length
    ? Math.round(
        (open.reduce((n, d) => n + d.booked / d.capacity, 0) / open.length) *
          100,
      )
    : 0;
  const firstFree = open.find((d) => d.booked < d.capacity * 0.6);

  return (
    <>
      <PageHeader
        title="Judge's diary"
        description="Which days are free for adjournments. Dates you give — in court, in bulk or to remote requests — fill it automatically."
      />
      <Grid
        templateColumns={{ base: "1fr", lg: "minmax(0, 1fr) 20rem" }}
        gap="5"
        alignItems="flex-start"
      >
        <SectionCard
          title={
            <Box minW="14rem">
              <CustomSelect
                options={rooms.map((r) => ({
                  label: `${r.courtroom.name} · ${r.courtroom.judge?.name ?? ""}`,
                  value: r.courtroom.id,
                }))}
                value={courtroomId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setCourtroomId(e.target.value);
                  setSelected(null);
                }}
              />
            </Box>
          }
          description="Tap a day to block or open it."
        >
          {diary.isLoading ? (
            <SectionLoader h="16rem" />
          ) : (
            <DiaryGrid
              days={days}
              selected={selected?.date}
              onSelect={(d) => {
                setSelected(d);
                setReason(d.block_reason ?? "");
              }}
            />
          )}
        </SectionCard>
        <Stack gap="4">
          <SectionCard title="At a glance">
            <Stack gap="3">
              <Flex justify="space-between">
                <Text textStyle="small-regular" color="gray.300">
                  Average fill
                </Text>
                <Text textStyle="small-semibold">{avg}%</Text>
              </Flex>
              <Flex justify="space-between">
                <Text textStyle="small-regular" color="gray.300">
                  First comfortable day
                </Text>
                <Text textStyle="small-semibold">
                  {firstFree ? formatCourtDate(firstFree.date) : "—"}
                </Text>
              </Flex>
              <Flex justify="space-between">
                <Text textStyle="small-regular" color="gray.300">
                  Blocked days
                </Text>
                <Text textStyle="small-semibold">
                  {days.length - open.length}
                </Text>
              </Flex>
            </Stack>
          </SectionCard>
          {selected && (
            <SectionCard
              title={formatCourtDate(selected.date)}
              description={
                selected.blocked
                  ? "Blocked"
                  : `${selected.booked} of ${selected.capacity} matters fixed`
              }
            >
              <Stack gap="3">
                {selected.blocked ? (
                  <>
                    <Badge alignSelf="flex-start" colorPalette="gray">
                      {selected.block_reason}
                    </Badge>
                    <Button
                      variant="outline"
                      loading={block.isPending}
                      onClick={() =>
                        block.mutate(
                          {
                            courtroom_id: courtroomId,
                            date: selected.date,
                            blocked: false,
                          },
                          { onSuccess: () => setSelected(null) },
                        )
                      }
                    >
                      Open this day
                    </Button>
                  </>
                ) : (
                  <>
                    <Input
                      placeholder="Reason, e.g. Judgment writing"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                    <Button
                      variant="dangerOutline"
                      loading={block.isPending}
                      onClick={() =>
                        block.mutate(
                          {
                            courtroom_id: courtroomId,
                            date: selected.date,
                            reason,
                            blocked: true,
                          },
                          { onSuccess: () => setSelected(null) },
                        )
                      }
                    >
                      Block this day
                    </Button>
                  </>
                )}
              </Stack>
            </SectionCard>
          )}
        </Stack>
      </Grid>
    </>
  );
}
