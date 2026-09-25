import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { EmptyStateComponent, PageHeader } from "@repo/ui/elements";
import { CustomSelect } from "@repo/ui/input";
import { MegaphoneIcon, SendIcon } from "@repo/ui/icons";
import { formatCourtTime, timeAgo } from "@repo/utils";
import {
  ChipGroup,
  FormField,
  MessagePreview,
  ReachPill,
  SectionCard,
  SegmentedControl,
} from "@/components/common";
import {
  todayLagos,
  useBroadcasts,
  useCreateBroadcast,
  useExpireBroadcast,
  useMyCourtrooms,
} from "@/shared/api";

const MAX = 280;
const TEMPLATES = [
  {
    key: "chambers",
    label: "Meeting in chambers",
    text: (room: string) =>
      `${room} sitting suspended until 11:30 AM due to a meeting in chambers. Counsel in matters listed are to remain within the premises.`,
  },
  {
    key: "late",
    label: "Starting late",
    text: (room: string) =>
      `${room} will start at 11:00 AM today. Matters will be taken in the order listed.`,
  },
  {
    key: "registry",
    label: "Registry notice",
    text: () =>
      "The registry will close at 2:00 PM on Friday for staff training. E-filing remains available.",
  },
  {
    key: "dates",
    label: "Dates at registry",
    text: (room: string) =>
      `${room} will not sit today. Counsel may collect new dates at the registry from 10:00 AM or take a date on CourtPulse.`,
  },
];

export function BroadcastsPage() {
  const [params] = useSearchParams();
  const courtrooms = useMyCourtrooms(todayLagos());
  const broadcasts = useBroadcasts();
  const create = useCreateBroadcast();
  const expire = useExpireBroadcast();
  const rooms = useMemo(() => courtrooms.data?.data ?? [], [courtrooms.data]);

  const [target, setTarget] = useState<string>(params.get("courtroom") ?? "");
  const [severity, setSeverity] = useState<"URGENT" | "INFO">("URGENT");
  const [message, setMessage] = useState("");
  const [template, setTemplate] = useState<string | null>(null);

  const targetRow = rooms.find((r) => r.courtroom.id === target);
  const roomName = targetRow
    ? `${targetRow.courtroom.complex_name?.replace(/^(Federal )?High Court, /, "")} ${targetRow.courtroom.name}`
    : "The court";
  const reach = useMemo(() => {
    if (targetRow) return targetRow.reach;
    const division = rooms[0]?.courtroom.division_id;
    return rooms
      .filter((r) => r.courtroom.division_id === division)
      .reduce(
        (a, r) => ({
          recipients: a.recipients + r.reach.recipients,
          sms: a.sms + r.reach.sms,
          whatsapp: a.whatsapp + r.reach.whatsapp,
        }),
        { recipients: 0, sms: 0, whatsapp: 0 },
      );
  }, [targetRow, rooms]);

  const send = async () => {
    await create.mutateAsync({
      courtroom_id: target || null,
      division_id: target ? undefined : rooms[0]?.courtroom.division_id,
      severity,
      message,
    });
    setMessage("");
    setTemplate(null);
  };

  const list = broadcasts.data?.data ?? [];
  const active = list.filter(
    (b) => !b.expires_at || new Date(b.expires_at) > new Date(),
  );
  const past = list.filter(
    (b) => b.expires_at && new Date(b.expires_at) <= new Date(),
  );

  return (
    <>
      <PageHeader
        title="Broadcasts"
        description="Urgent notices to every counsel following a courtroom or the whole division — by SMS and WhatsApp, in seconds."
      />
      <Grid
        templateColumns={{ base: "1fr", xl: "26rem minmax(0, 1fr)" }}
        gap="5"
        alignItems="flex-start"
      >
        <SectionCard title="New broadcast">
          <Stack gap="4">
            <CustomSelect
              label="Send to"
              options={[
                {
                  label: `Whole ${rooms[0]?.courtroom.division_name ?? ""} division`,
                  value: "",
                },
                ...rooms.map((r) => ({
                  label: `${r.courtroom.name} · ${r.courtroom.complex_name}`,
                  value: r.courtroom.id,
                })),
              ]}
              value={target}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setTarget(e.target.value)
              }
            />
            <FormField label="Priority">
              <SegmentedControl
                value={severity}
                onChange={setSeverity}
                options={[
                  { value: "URGENT", label: "Urgent" },
                  { value: "INFO", label: "Information" },
                ]}
              />
            </FormField>
            <FormField label="Start from a template">
              <ChipGroup
                value={template}
                onChange={(k) => {
                  setTemplate(k);
                  setMessage(
                    TEMPLATES.find((t) => t.key === k)!.text(roomName),
                  );
                }}
                options={TEMPLATES.map((t) => ({
                  value: t.key,
                  label: t.label,
                }))}
              />
            </FormField>
            <FormField
              label="Message"
              hint={`${message.length}/${MAX} characters`}
              required
            >
              <Textarea
                rows={4}
                maxLength={MAX}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What should counsel know?"
              />
            </FormField>
            {message && (
              <MessagePreview
                message={`${severity === "URGENT" ? "URGENT: " : ""}${message}`}
              />
            )}
            <ReachPill {...reach} future />
            <Button
              size="lg"
              disabled={!message.trim()}
              loading={create.isPending}
              onClick={send}
            >
              <SendIcon /> Send to {reach.recipients.toLocaleString()} counsel
            </Button>
          </Stack>
        </SectionCard>

        <Stack gap="4">
          <SectionCard
            title="Live now"
            description="Shown on counsel's courtroom pages until ended."
            flush
          >
            {active.length === 0 ? (
              <Box p="5">
                <EmptyStateComponent
                  size="inline"
                  icon={<MegaphoneIcon boxSize="8" />}
                  title="No live broadcasts"
                />
              </Box>
            ) : (
              <Stack gap="0">
                {active.map((b) => (
                  <Flex
                    key={b.id}
                    gap="3"
                    px={{ base: "4", md: "5" }}
                    py="4"
                    borderBottom="1px solid"
                    borderColor="gray.75"
                    align="flex-start"
                  >
                    <Box
                      boxSize="2.5"
                      rounded="full"
                      mt="1.5"
                      bg={b.severity === "URGENT" ? "error.300" : "info.500"}
                      flexShrink={0}
                    />
                    <Box flex="1" minW="0">
                      <Flex gap="2" align="center" wrap="wrap" mb="1">
                        <Badge
                          colorPalette={
                            b.severity === "URGENT" ? "error" : "info"
                          }
                          variant="subtle"
                          size="sm"
                        >
                          {b.severity === "URGENT" ? "Urgent" : "Info"}
                        </Badge>
                        <Text textStyle="tiny-semibold" color="gray.400">
                          {b.courtroom_name ?? "Whole division"}
                        </Text>
                        <Text textStyle="tiny-regular" color="gray.200">
                          {b.author_name} · {timeAgo(b.created_at)}
                        </Text>
                      </Flex>
                      <Text textStyle="small-regular" color="gray.500">
                        {b.message}
                      </Text>
                    </Box>
                    <Button
                      size="xs"
                      variant="ghost"
                      loading={expire.isPending}
                      onClick={() => expire.mutate(b.id)}
                    >
                      End
                    </Button>
                  </Flex>
                ))}
              </Stack>
            )}
          </SectionCard>
          {past.length > 0 && (
            <SectionCard title="Ended" flush>
              {past.map((b) => (
                <Box
                  key={b.id}
                  px={{ base: "4", md: "5" }}
                  py="3"
                  borderBottom="1px solid"
                  borderColor="gray.75"
                  opacity={0.7}
                >
                  <Text textStyle="tiny-regular" color="gray.200">
                    {b.courtroom_name ?? "Whole division"} ·{" "}
                    {formatCourtTime(b.created_at)}
                  </Text>
                  <Text textStyle="small-regular" lineClamp={2}>
                    {b.message}
                  </Text>
                </Box>
              ))}
            </SectionCard>
          )}
        </Stack>
      </Grid>
    </>
  );
}
