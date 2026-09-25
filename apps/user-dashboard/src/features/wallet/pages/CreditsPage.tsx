import { Table, Text } from "@chakra-ui/react";
import {
  EmptyStateComponent,
  PageHeader,
  SectionLoader,
  SurfaceCard,
} from "@repo/ui/elements";
import { formatCourtDate, humanizeEnum } from "@repo/utils";
import { useGetCreditsLedger } from "../api";

export function CreditsPage() {
  const { data, isLoading } = useGetCreditsLedger();
  const rows = data?.data ?? [];

  return (
    <>
      <PageHeader
        title="Pulse Credits"
        description="Earned from early, verified Spotter reports."
      />
      {isLoading ? (
        <SectionLoader />
      ) : rows.length === 0 ? (
        <EmptyStateComponent
          title="No credits yet"
          description="Check in to a courtroom and be first to report a status that gets verified."
        />
      ) : (
        <SurfaceCard p="0" overflowX="auto">
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Date</Table.ColumnHeader>
                <Table.ColumnHeader>Reason</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end">Credits</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {rows.map((r) => (
                <Table.Row key={r.id}>
                  <Table.Cell>{formatCourtDate(r.created_at)}</Table.Cell>
                  <Table.Cell>{humanizeEnum(r.reason)}</Table.Cell>
                  <Table.Cell textAlign="end">
                    <Text
                      textStyle="mono"
                      color={r.amount >= 0 ? "success.300" : "error.300"}
                    >
                      {r.amount >= 0 ? `+${r.amount}` : r.amount}
                    </Text>
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
