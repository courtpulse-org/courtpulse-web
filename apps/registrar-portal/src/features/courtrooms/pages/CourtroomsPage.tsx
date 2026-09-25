import { Badge, Box, Flex, Progress, SimpleGrid, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  EmptyStateComponent,
  PageHeader,
  SectionLoader,
} from "@repo/ui/elements";
import { ArrowRightIcon } from "@repo/ui/icons";
import { StatusSummary } from "@/components/status/StatusSummary";
import { useCurrentUser } from "@/hooks";
import { todayLagos, useMyCourtrooms } from "@/shared/api";
import { RouteConstants } from "@/shared/constants/routes";

export function CourtroomsPage() {
  const { isAdmin } = useCurrentUser();
  const { data, isLoading } = useMyCourtrooms(todayLagos());
  const rows = data?.data ?? [];

  const groups = rows.reduce<Record<string, typeof rows>>((acc, r) => {
    const key = r.courtroom.complex_name ?? "Other";
    (acc[key] ??= []).push(r);
    return acc;
  }, {});

  return (
    <>
      <PageHeader
        title="Courtrooms"
        description={
          isAdmin
            ? "Every courtroom on CourtPulse."
            : "The courtrooms you manage. Open one to run its cause list."
        }
      />
      {isLoading ? (
        <SectionLoader />
      ) : rows.length === 0 ? (
        <EmptyStateComponent title="No courtrooms assigned" />
      ) : (
        Object.entries(groups).map(([complex, list]) => (
          <Box key={complex} mb="6">
            <Text
              textStyle="tiny-semibold"
              color="gray.200"
              textTransform="uppercase"
              letterSpacing="0.06em"
              mb="2"
            >
              {complex}
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap="3">
              {list.map((r) => {
                const pct = r.list?.total
                  ? Math.round((r.list.done / r.list.total) * 100)
                  : 0;
                return (
                  <Link
                    key={r.courtroom.id}
                    to={RouteConstants.courtrooms.details.generate({
                      id: r.courtroom.id,
                    })}
                  >
                    <Box
                      bg="white"
                      border="1px solid"
                      borderColor="gray.75"
                      rounded="lg"
                      p="4"
                      h="full"
                      _hover={{ borderColor: "primary.100", boxShadow: "sm" }}
                      transition="all 0.15s"
                    >
                      <Flex justify="space-between" align="flex-start" mb="1">
                        <Text textStyle="h4">{r.courtroom.name}</Text>
                        <ArrowRightIcon color="gray.100" />
                      </Flex>
                      <Text
                        textStyle="tiny-regular"
                        color="gray.300"
                        mb="3"
                        truncate
                      >
                        {r.courtroom.judge_name}
                      </Text>
                      <StatusSummary status={r.status} compact />
                      <Flex align="center" gap="2" mt="4">
                        <Progress.Root
                          value={pct}
                          size="xs"
                          colorPalette="primary"
                          flex="1"
                        >
                          <Progress.Track rounded="full">
                            <Progress.Range />
                          </Progress.Track>
                        </Progress.Root>
                        <Text
                          textStyle="tiny-medium"
                          color="gray.300"
                          whiteSpace="nowrap"
                        >
                          {r.list
                            ? `${r.list.done}/${r.list.total}`
                            : "No list"}
                        </Text>
                        {r.pending_date_requests > 0 && (
                          <Badge
                            colorPalette="secondary"
                            variant="subtle"
                            rounded="full"
                          >
                            {r.pending_date_requests} date req.
                          </Badge>
                        )}
                      </Flex>
                    </Box>
                  </Link>
                );
              })}
            </SimpleGrid>
          </Box>
        ))
      )}
    </>
  );
}
