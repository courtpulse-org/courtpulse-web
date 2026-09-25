import { Table, Text } from "@chakra-ui/react";
import {
  EmptyStateComponent,
  PageHeader,
  SectionLoader,
  SurfaceCard,
} from "@repo/ui/elements";
import { formatCourtDate, formatNaira, humanizeEnum } from "@repo/utils";
import { useGetEscrowLedger } from "../api";

export function EscrowPage() {
  const { data, isLoading } = useGetEscrowLedger();
  const rows = data?.data ?? [];

  return (
    <>
      <PageHeader title="Escrow history" />
      {isLoading ? (
        <SectionLoader />
      ) : rows.length === 0 ? (
        <EmptyStateComponent
          title="No escrow activity"
          description="Funding, holds and releases will show here."
        />
      ) : (
        <SurfaceCard p="0" overflowX="auto">
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Date</Table.ColumnHeader>
                <Table.ColumnHeader>Type</Table.ColumnHeader>
                <Table.ColumnHeader>Reference</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end">Amount</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {rows.map((r) => (
                <Table.Row key={r.id}>
                  <Table.Cell>{formatCourtDate(r.created_at)}</Table.Cell>
                  <Table.Cell>{humanizeEnum(r.type)}</Table.Cell>
                  <Table.Cell>
                    <Text textStyle="mono">{r.reference ?? "—"}</Text>
                  </Table.Cell>
                  <Table.Cell textAlign="end">
                    {formatNaira(r.amount)}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </SurfaceCard>
      )}
    </>
  );
}
