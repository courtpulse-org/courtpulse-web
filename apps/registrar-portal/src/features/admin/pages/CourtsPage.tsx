import {
  Badge,
  Box,
  Button,
  Flex,
  Input,
  NativeSelect,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { COURT_SYSTEM_LABEL, type ICourtroom } from "@repo/types";
import { CourtStatusBadge } from "@repo/ui/court";
import { PageHeader, SectionLoader } from "@repo/ui/elements";
import { formatCourtDate } from "@repo/utils";
import { AppDialog, FormField, SectionCard } from "@/components/common";
import {
  todayLagos,
  useAllCourtrooms,
  useAssignJudge,
  useJudgeAssignments,
  useJudges,
} from "@/shared/api";

export function CourtsPage() {
  const { data, isLoading } = useAllCourtrooms();
  const [room, setRoom] = useState<ICourtroom | null>(null);
  const rooms = data?.data ?? [];
  const byDivision = rooms.reduce<Record<string, typeof rooms>>((acc, r) => {
    (acc[
      `${r.court_system ? COURT_SYSTEM_LABEL[r.court_system] : ""} — ${r.division_name}`
    ] ??= []).push(r);
    return acc;
  }, {});

  return (
    <>
      <PageHeader
        title="Courts & judges"
        description="Court system → division → complex → courtroom. Judges move between courtrooms; each change is kept as history."
      />
      {isLoading ? (
        <SectionLoader />
      ) : (
        <Stack gap="5">
          {Object.entries(byDivision).map(([title, list]) => (
            <SectionCard key={title} title={title} flush>
              <Box overflowX="auto">
                <Table.Root size="sm">
                  <Table.Header>
                    <Table.Row bg="gray.25">
                      <Table.ColumnHeader>Courtroom</Table.ColumnHeader>
                      <Table.ColumnHeader>Judge</Table.ColumnHeader>
                      <Table.ColumnHeader>Registrars</Table.ColumnHeader>
                      <Table.ColumnHeader>Today</Table.ColumnHeader>
                      <Table.ColumnHeader />
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {list.map((r) => (
                      <Table.Row key={r.id}>
                        <Table.Cell>
                          <Text textStyle="small-semibold">{r.name}</Text>
                          <Text textStyle="tiny-regular" color="gray.200">
                            {r.complex_name}
                          </Text>
                        </Table.Cell>
                        <Table.Cell textStyle="small-regular">
                          {r.judge_name ?? "Vacant"}
                        </Table.Cell>
                        <Table.Cell textStyle="tiny-regular">
                          {r.registrars.join(", ") || (
                            <Badge colorPalette="warning" size="sm">
                              None
                            </Badge>
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          {r.status ? (
                            <CourtStatusBadge status={r.status.status} />
                          ) : (
                            <Text textStyle="tiny-regular" color="gray.200">
                              —
                            </Text>
                          )}
                        </Table.Cell>
                        <Table.Cell textAlign="end">
                          <Button
                            size="sm"
                            variant="outlineSecondary"
                            onClick={() => setRoom(r)}
                          >
                            Judge history
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>
            </SectionCard>
          ))}
        </Stack>
      )}
      <AssignJudgeDialog room={room} onClose={() => setRoom(null)} />
    </>
  );
}

function AssignJudgeDialog({
  room,
  onClose,
}: {
  room: ICourtroom | null;
  onClose: () => void;
}) {
  const judges = useJudges().data?.data ?? [];
  const history = useJudgeAssignments(room?.id ?? "").data?.data ?? [];
  const assign = useAssignJudge();
  const [judgeId, setJudgeId] = useState("");
  const [newName, setNewName] = useState("");
  const [start, setStart] = useState(todayLagos());

  return (
    <AppDialog
      open={!!room}
      onClose={onClose}
      title={`${room?.name ?? ""} · ${room?.complex_name ?? ""}`}
      description="Assigning a judge ends the current assignment the day before."
      footer={
        <Button
          disabled={!judgeId && !newName.trim()}
          loading={assign.isPending}
          onClick={async () => {
            await assign.mutateAsync({
              courtroom_id: room!.id,
              judge_id: judgeId || undefined,
              new_judge_name: judgeId ? undefined : newName,
              start_date: start,
            });
            setJudgeId("");
            setNewName("");
          }}
        >
          Assign judge
        </Button>
      }
    >
      <Stack gap="5">
        <Box>
          <Text
            textStyle="tiny-semibold"
            color="gray.200"
            textTransform="uppercase"
            mb="2"
          >
            History
          </Text>
          <Stack gap="2">
            {history.map((a) => (
              <Flex
                key={a.id}
                justify="space-between"
                gap="3"
                bg={a.end_date ? "white" : "primary.25"}
                border="1px solid"
                borderColor="gray.75"
                rounded="md"
                px="3"
                py="2"
              >
                <Text textStyle="small-medium">
                  {a.judge.title} {a.judge.name}
                </Text>
                <Text
                  textStyle="tiny-regular"
                  color="gray.300"
                  whiteSpace="nowrap"
                >
                  {formatCourtDate(a.start_date)} –{" "}
                  {a.end_date ? formatCourtDate(a.end_date) : "present"}
                </Text>
              </Flex>
            ))}
          </Stack>
        </Box>
        <FormField label="Assign a judge">
          <NativeSelect.Root>
            <NativeSelect.Field
              value={judgeId}
              onChange={(e) => setJudgeId(e.target.value)}
            >
              <option value="">New judge (type the name below)</option>
              {judges.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} {j.name}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          {!judgeId && (
            <Input
              mt="2"
              placeholder="e.g. Adaora C. Nwankwo"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          )}
        </FormField>
        <FormField label="From">
          <Input
            type="date"
            maxW="12rem"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </FormField>
      </Stack>
    </AppDialog>
  );
}
