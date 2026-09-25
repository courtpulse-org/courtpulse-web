import { Badge, Box, Flex, SimpleGrid, Table, Text } from "@chakra-ui/react";
import { useState } from "react";
import type { AlertKind } from "@repo/types";
import {
  EmptyStateComponent,
  PageHeader,
  SectionLoader,
  StatCard,
} from "@repo/ui/elements";
import {
  BellIcon,
  CheckCircleIcon,
  MessageIcon,
  UsersIcon,
} from "@repo/ui/icons";
import { formatCourtDate, formatCourtTime } from "@repo/utils";
import { ChipGroup, SectionCard } from "@/components/common";
import { courtroomLabel, useAlerts } from "@/shared/api";

const KIND_LABEL: Record<AlertKind, string> = {
  STATUS: "Status",
  BROADCAST: "Broadcast",
  ADJOURNMENT: "Hearing notice",
  CALLED: "Matter called",
  CAUSE_LIST: "Cause list",
  REMOTE_DATE: "Date request",
};
const KIND_COLOR: Record<AlertKind, string> = {
  STATUS: "primary",
  BROADCAST: "error",
  ADJOURNMENT: "info",
  CALLED: "success",
  CAUSE_LIST: "secondary",
  REMOTE_DATE: "warning",
};

export function AlertLogPage() {
  const { data, isLoading } = useAlerts();
  const [kind, setKind] = useState<AlertKind | "ALL">("ALL");
  const all = data?.data ?? [];
  const rows = kind === "ALL" ? all : all.filter((a) => a.kind === kind);

  const reached = all.reduce((n, a) => n + a.recipients, 0);
  const delivered = all.reduce((n, a) => n + a.delivered, 0);
  const whatsapp = all.reduce((n, a) => n + a.whatsapp, 0);

  return (
    <>
      <PageHeader
        title="Alert log"
        description="Every SMS and WhatsApp message your posts triggered, and whether it got through."
      />
      <SimpleGrid columns={{ base: 2, lg: 4 }} gap="3" mb="5">
        <StatCard label="Alerts sent" value={all.length} icon={<BellIcon />} />
        <StatCard
          label="Counsel reached"
          value={reached.toLocaleString()}
          icon={<UsersIcon />}
        />
        <StatCard
          label="Delivered"
          value={reached ? `${((delivered / reached) * 100).toFixed(1)}%` : "—"}
          icon={<CheckCircleIcon />}
        />
        <StatCard
          label="Also on WhatsApp"
          value={reached ? `${Math.round((whatsapp / reached) * 100)}%` : "—"}
          icon={<MessageIcon />}
        />
      </SimpleGrid>
      <SectionCard
        flush
        title="Dispatches"
        actions={
          <ChipGroup
            value={kind}
            onChange={setKind}
            options={[
              { value: "ALL" as const, label: "All" },
              ...(Object.keys(KIND_LABEL) as AlertKind[]).map((k) => ({
                value: k,
                label: KIND_LABEL[k],
              })),
            ]}
          />
        }
      >
        {isLoading ? (
          <SectionLoader />
        ) : rows.length === 0 ? (
          <Box p="5">
            <EmptyStateComponent size="inline" title="No alerts yet" />
          </Box>
        ) : (
          <Box overflowX="auto">
            <Table.Root size="md">
              <Table.Header>
                <Table.Row bg="gray.25">
                  <Table.ColumnHeader>Sent</Table.ColumnHeader>
                  <Table.ColumnHeader>Type</Table.ColumnHeader>
                  <Table.ColumnHeader minW="20rem">Message</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="end">
                    Counsel
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    textAlign="end"
                    display={{ base: "none", md: "table-cell" }}
                  >
                    SMS · WhatsApp
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="end">
                    Delivered
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {rows.map((a) => (
                  <Table.Row key={a.id}>
                    <Table.Cell whiteSpace="nowrap">
                      <Text textStyle="small-medium">
                        {formatCourtTime(a.created_at)}
                      </Text>
                      <Text textStyle="tiny-regular" color="gray.200">
                        {formatCourtDate(a.created_at).replace(/ \d{4}$/, "")}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        colorPalette={KIND_COLOR[a.kind]}
                        variant="subtle"
                        rounded="full"
                        whiteSpace="nowrap"
                      >
                        {KIND_LABEL[a.kind]}
                      </Badge>
                      <Text
                        textStyle="tiny-regular"
                        color="gray.200"
                        mt="1"
                        whiteSpace="nowrap"
                      >
                        {a.courtroom_id
                          ? courtroomLabel(a.courtroom_id)
                          : "Division"}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text textStyle="small-regular" lineClamp={2}>
                        {a.message}
                      </Text>
                      <Text textStyle="tiny-regular" color="gray.200">
                        by {a.actor}
                      </Text>
                    </Table.Cell>
                    <Table.Cell textAlign="end" textStyle="small-semibold">
                      {a.recipients.toLocaleString()}
                    </Table.Cell>
                    <Table.Cell
                      textAlign="end"
                      display={{ base: "none", md: "table-cell" }}
                      textStyle="small-regular"
                      color="gray.300"
                    >
                      {a.sms} · {a.whatsapp}
                    </Table.Cell>
                    <Table.Cell textAlign="end">
                      <Flex
                        justify="flex-end"
                        align="center"
                        gap="1"
                        color={a.failed ? "warning.700" : "success.400"}
                        textStyle="small-medium"
                      >
                        {a.delivered}/{a.recipients}
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        )}
      </SectionCard>
    </>
  );
}
