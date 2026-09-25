import { Badge, Table, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import type { IWatchlistCase } from "@repo/types";
import { SurfaceCard } from "@repo/ui/elements";
import { formatCourtDate } from "@repo/utils";
import { RouteConstants } from "@/shared/constants/routes";

export function WatchlistTable({ cases }: { cases: IWatchlistCase[] }) {
  return (
    <SurfaceCard p="0" overflowX="auto">
      <Table.Root size="md" variant="line">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Suit number</Table.ColumnHeader>
            <Table.ColumnHeader>Matter</Table.ColumnHeader>
            <Table.ColumnHeader>Date</Table.ColumnHeader>
            <Table.ColumnHeader>Cause list</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {cases.map((c) => (
            <Table.Row key={c.id}>
              <Table.Cell>
                <Link
                  to={RouteConstants.watchlist.details.generate({ id: c.id })}
                >
                  <Text textStyle="mono" color="primary.300">
                    {c.suit_number}
                  </Text>
                </Link>
              </Table.Cell>
              <Table.Cell>{c.title ?? "—"}</Table.Cell>
              <Table.Cell>{formatCourtDate(c.scheduled_date)}</Table.Cell>
              <Table.Cell>
                {c.cause_list_item ? (
                  <Badge colorPalette="success" variant="subtle">
                    Item #{c.cause_list_item}
                  </Badge>
                ) : (
                  <Text color="gray.200">Not listed</Text>
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </SurfaceCard>
  );
}
