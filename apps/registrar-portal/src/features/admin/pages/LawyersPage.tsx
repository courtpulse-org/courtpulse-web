import { Badge, Box, Button, Table, Text } from "@chakra-ui/react";
import { PageHeader, SectionLoader } from "@repo/ui/elements";
import { SectionCard } from "@/components/common";
import { useLawyers, useVerifyUser } from "@/shared/api";

export function LawyersPage() {
  const { data, isLoading } = useLawyers();
  const verify = useVerifyUser();
  const rows = [...(data?.data ?? [])].sort(
    (a, b) => Number(a.is_verified) - Number(b.is_verified),
  );
  return (
    <>
      <PageHeader
        title="Lawyers"
        description="Self-registered litigators. Check the enrolment number against the Supreme Court roll before verifying."
      />
      <SectionCard flush>
        {isLoading ? (
          <SectionLoader />
        ) : (
          <Box overflowX="auto">
            <Table.Root>
              <Table.Header>
                <Table.Row bg="gray.25">
                  <Table.ColumnHeader>Name</Table.ColumnHeader>
                  <Table.ColumnHeader>Enrolment no.</Table.ColumnHeader>
                  <Table.ColumnHeader>Firm</Table.ColumnHeader>
                  <Table.ColumnHeader>Called</Table.ColumnHeader>
                  <Table.ColumnHeader>Status</Table.ColumnHeader>
                  <Table.ColumnHeader />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {rows.map((u) => (
                  <Table.Row key={u.id}>
                    <Table.Cell>
                      <Text textStyle="small-semibold">
                        {u.first_name} {u.last_name}
                      </Text>
                      <Text textStyle="tiny-regular" color="gray.200">
                        {u.phone}
                      </Text>
                    </Table.Cell>
                    <Table.Cell textStyle="mono">
                      {u.enrolment_number}
                    </Table.Cell>
                    <Table.Cell textStyle="small-regular">{u.firm}</Table.Cell>
                    <Table.Cell textStyle="small-regular">
                      {u.year_of_call}
                    </Table.Cell>
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
                          loading={verify.isPending}
                          onClick={() => verify.mutate(u.id)}
                        >
                          Verify
                        </Button>
                      )}
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
