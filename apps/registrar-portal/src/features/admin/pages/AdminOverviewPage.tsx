import {
  Badge,
  Box,
  Flex,
  Grid,
  SimpleGrid,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { CourtStatusBadge } from "@repo/ui/court";
import { PageHeader, StatCard } from "@repo/ui/elements";
import {
  ActivityIcon,
  BellIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "@repo/ui/icons";
import { SectionCard } from "@/components/common";
import { ActivityFeed } from "@/features/today/components/ActivityFeed";
import { useAdminOverview, useAllCourtrooms } from "@/shared/api";
import { RouteConstants } from "@/shared/constants/routes";

export function AdminOverviewPage() {
  const { data } = useAdminOverview();
  const courtrooms = useAllCourtrooms();
  const o = data?.data;
  const rooms = courtrooms.data?.data ?? [];
  const unmanaged = rooms.filter((r) => r.registrars.length === 0);

  return (
    <Stack gap="5">
      <PageHeader
        title="Platform overview"
        description="How the Lagos pilot is doing today."
      />
      <SimpleGrid columns={{ base: 2, lg: 4 }} gap="3">
        <StatCard
          label="Courtrooms reporting"
          value={o ? `${o.reporting_today}/${o.courtrooms}` : "—"}
          hint={
            o
              ? `${o.official_today} official · ${o.not_sitting_today} not sitting`
              : undefined
          }
          icon={<ActivityIcon />}
        />
        <StatCard
          label="Counsel alerted"
          value={o?.alerts_today.toLocaleString() ?? "—"}
          hint="last 24 hours"
          icon={<BellIcon />}
        />
        <StatCard
          label="Registrars"
          value={o?.registrars ?? "—"}
          hint={o ? `${o.registrars_pending} awaiting verification` : undefined}
          icon={<ShieldCheckIcon />}
        />
        <StatCard
          label="Litigators"
          value={o?.lawyers.toLocaleString() ?? "—"}
          hint={
            o
              ? `${o.lawyers_pending} awaiting verification · target 2,500`
              : undefined
          }
          icon={<UsersIcon />}
        />
      </SimpleGrid>

      <Grid
        templateColumns={{ base: "1fr", xl: "minmax(0, 1fr) 20rem" }}
        gap="5"
        alignItems="flex-start"
      >
        <SectionCard
          flush
          title="Every courtroom, right now"
          description={
            unmanaged.length
              ? `${unmanaged.length} courtrooms have no registrar — only spotters can report there.`
              : undefined
          }
        >
          <Box overflowX="auto">
            <Table.Root size="sm">
              <Table.Header>
                <Table.Row bg="gray.25">
                  <Table.ColumnHeader>Courtroom</Table.ColumnHeader>
                  <Table.ColumnHeader>Judge</Table.ColumnHeader>
                  <Table.ColumnHeader>Registrar</Table.ColumnHeader>
                  <Table.ColumnHeader>Status</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {rooms.map((r) => (
                  <Table.Row key={r.id}>
                    <Table.Cell>
                      <Link
                        to={RouteConstants.courtrooms.details.generate({
                          id: r.id,
                        })}
                      >
                        <Text textStyle="small-semibold" color="primary.300">
                          {r.name}
                        </Text>
                      </Link>
                      <Text textStyle="tiny-regular" color="gray.200">
                        {r.complex_name}
                      </Text>
                    </Table.Cell>
                    <Table.Cell textStyle="tiny-regular">
                      {r.judge?.name ?? "—"}
                    </Table.Cell>
                    <Table.Cell>
                      {r.registrars.length ? (
                        <Text textStyle="tiny-regular">
                          {r.registrars.join(", ")}
                        </Text>
                      ) : (
                        <Badge
                          colorPalette="warning"
                          variant="subtle"
                          size="sm"
                        >
                          None
                        </Badge>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {r.status ? (
                        <Flex gap="1.5" align="center">
                          <CourtStatusBadge
                            status={r.status.status}
                            live={r.status.verification !== "UNVERIFIED"}
                          />
                          {r.status.verification !== "OFFICIAL" && (
                            <Text textStyle="tiny-regular" color="gray.200">
                              {r.status.verification === "VERIFIED"
                                ? "crowd"
                                : "1 report"}
                            </Text>
                          )}
                        </Flex>
                      ) : (
                        <Text textStyle="tiny-regular" color="gray.200">
                          No reports
                        </Text>
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        </SectionCard>
        <ActivityFeed limit={10} />
      </Grid>
    </Stack>
  );
}
