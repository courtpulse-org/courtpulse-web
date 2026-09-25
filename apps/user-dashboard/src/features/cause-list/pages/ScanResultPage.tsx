import { Badge, Stack, Table, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { PageHeader, SectionLoader, SurfaceCard } from "@repo/ui/elements";
import { useGetScan } from "../api";

export function ScanResultPage() {
  const { id = "" } = useParams();
  const { data, isLoading } = useGetScan(id);
  const scan = data?.data;

  if (isLoading || !scan) return <SectionLoader />;

  return (
    <>
      <PageHeader
        title="Scan result"
        description={
          scan.status === "PROCESSING"
            ? "Reading the cause list — this takes up to 30 seconds."
            : `${scan.extracted_items.length} items extracted.`
        }
        actions={
          <Badge
            colorPalette={
              scan.status === "COMPLETED"
                ? "success"
                : scan.status === "FAILED"
                  ? "error"
                  : "warning"
            }
          >
            {scan.status}
          </Badge>
        }
      />
      {scan.status === "PROCESSING" ? (
        <SectionLoader />
      ) : (
        <SurfaceCard p="0" overflowX="auto">
          <Table.Root size="md">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>#</Table.ColumnHeader>
                <Table.ColumnHeader>Suit number</Table.ColumnHeader>
                <Table.ColumnHeader>Parties</Table.ColumnHeader>
                <Table.ColumnHeader>Counsel</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {scan.extracted_items.map((item) => (
                <Table.Row key={item.item_number}>
                  <Table.Cell>
                    <Text textStyle="mono">{item.item_number}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text textStyle="mono">{item.suit_number}</Text>
                  </Table.Cell>
                  <Table.Cell>{item.parties ?? "—"}</Table.Cell>
                  <Table.Cell>
                    <Stack gap="0">
                      {(item.counsel ?? []).map((c) => (
                        <Text key={c} textStyle="tiny-regular">
                          {c}
                        </Text>
                      ))}
                    </Stack>
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
