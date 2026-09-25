import { Button, SimpleGrid, Stack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { PageHeader, StatCard } from "@repo/ui/elements";
import { CoinsIcon, WalletIcon } from "@repo/ui/icons";
import { formatNaira } from "@repo/utils";
import { RouteConstants } from "@/shared/constants/routes";
import { useGetWalletSummary } from "../api";

export function WalletPage() {
  const { data } = useGetWalletSummary();
  const w = data?.data;

  return (
    <Stack gap="6">
      <PageHeader
        title="Wallet & Credits"
        description="Escrow for brief-holding fees, and the Pulse Credits you've earned as a Spotter."
      />
      <SimpleGrid columns={{ base: 1, md: 3 }} gap="4">
        <StatCard
          label="Escrow available"
          value={w ? formatNaira(w.escrow_balance) : "—"}
          icon={<WalletIcon />}
        />
        <StatCard
          label="Held in escrow"
          value={w ? formatNaira(w.escrow_held) : "—"}
          hint="Locked against open requests"
        />
        <StatCard
          label="Pulse Credits"
          value={w?.credits_balance ?? "—"}
          hint="Redeem for fee discounts"
          icon={<CoinsIcon />}
        />
      </SimpleGrid>
      <Stack direction={{ base: "column", sm: "row" }} gap="3">
        <Button variant="outline" asChild>
          <Link to={RouteConstants.wallet.escrow.path}>Escrow history</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to={RouteConstants.wallet.credits.path}>Credits history</Link>
        </Button>
      </Stack>
    </Stack>
  );
}
