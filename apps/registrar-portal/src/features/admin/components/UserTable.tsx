import { Badge, Button, Table, Text } from "@chakra-ui/react";
import type { IUser } from "@repo/types";
import {
  EmptyStateComponent,
  SectionLoader,
  SurfaceCard,
} from "@repo/ui/elements";

interface UserTableProps {
  users: IUser[];
  isLoading: boolean;
  idLabel: string;
  getId: (u: IUser) => string | undefined;
  onVerify: (id: string) => void;
  verifying?: boolean;
}

export function UserTable({
  users,
  isLoading,
  idLabel,
  getId,
  onVerify,
  verifying,
}: UserTableProps) {
  if (isLoading) return <SectionLoader />;
  if (users.length === 0)
    return <EmptyStateComponent size="inline" title="No accounts yet" />;

  return (
    <SurfaceCard p="0" overflowX="auto">
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>{idLabel}</Table.ColumnHeader>
            <Table.ColumnHeader>Phone</Table.ColumnHeader>
            <Table.ColumnHeader>Status</Table.ColumnHeader>
            <Table.ColumnHeader />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.map((u) => (
            <Table.Row key={u.id}>
              <Table.Cell>
                {u.first_name} {u.last_name}
              </Table.Cell>
              <Table.Cell>
                <Text textStyle="mono">{getId(u) ?? "—"}</Text>
              </Table.Cell>
              <Table.Cell>{u.phone}</Table.Cell>
              <Table.Cell>
                <Badge
                  colorPalette={u.is_verified ? "success" : "warning"}
                  variant="subtle"
                >
                  {u.is_verified ? "Verified" : "Pending"}
                </Badge>
              </Table.Cell>
              <Table.Cell textAlign="end">
                {!u.is_verified && (
                  <Button
                    size="sm"
                    loading={verifying}
                    onClick={() => onVerify(u.id)}
                  >
                    Verify
                  </Button>
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </SurfaceCard>
  );
}
