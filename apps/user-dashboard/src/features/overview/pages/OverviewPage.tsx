import { SimpleGrid, Stack, Text } from "@chakra-ui/react";
import {
  EmptyStateComponent,
  PageHeader,
  StatCard,
  SurfaceCard,
} from "@repo/ui/elements";
import { ActivityIcon, CoinsIcon, ListChecksIcon } from "@repo/ui/icons";
import { isMorningCourtHours } from "@repo/utils";
import { useCurrentUser } from "@/hooks";
import { useGetTodayMatches } from "@/features/watchlist/api";
import { useGetWalletSummary } from "@/features/wallet/api";

export function OverviewPage() {
  const { userData } = useCurrentUser();
  const today = useGetTodayMatches();
  const wallet = useGetWalletSummary();

  const greeting = isMorningCourtHours() ? "Good morning" : "Welcome back";

  return (
    <Stack gap="6">
      <PageHeader
        title={`${greeting}, ${userData?.first_name ?? "Counsel"}`}
        description="Today's court pulse across your watched matters."
      />

      <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap="4">
        <StatCard
          label="Matters listed today"
          value={today.data?.data?.length ?? "—"}
          hint="Matched from cause lists and registrar posts"
          icon={<ListChecksIcon />}
        />
        <StatCard
          label="Courtrooms live"
          value="—"
          hint="Verified statuses in your divisions"
          icon={<ActivityIcon />}
        />
        <StatCard
          label="Pulse Credits"
          value={wallet.data?.data?.credits_balance ?? "—"}
          hint="Earned from early verified reports"
          icon={<CoinsIcon />}
        />
      </SimpleGrid>

      <SurfaceCard>
        <Text textStyle="h4" mb="3">
          Today's matters
        </Text>
        <EmptyStateComponent
          size="inline"
          title="No matters listed yet"
          description="When a cause list scan or a registrar post matches a suit number on your watchlist, it shows up here."
        />
      </SurfaceCard>
    </Stack>
  );
}
