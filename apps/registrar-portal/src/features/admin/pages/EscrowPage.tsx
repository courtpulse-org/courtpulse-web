import { SimpleGrid } from "@chakra-ui/react";
import { PageHeader, StatCard } from "@repo/ui/elements";
import { formatNaira } from "@repo/utils";
import { useGetEscrowOverview } from "../api";

export function EscrowPage() {
  const { data } = useGetEscrowOverview();
  const e = data?.data;
  return (
    <>
      <PageHeader
        title="Escrow"
        description="Brief-holding funds across the platform."
      />
      <SimpleGrid columns={{ base: 1, md: 3 }} gap="4">
        <StatCard
          label="Held in escrow"
          value={e ? formatNaira(e.total_held) : "—"}
        />
        <StatCard
          label="Released today"
          value={e ? formatNaira(e.total_released_today) : "—"}
        />
        <StatCard label="Pending payouts" value={e?.pending_payouts ?? "—"} />
      </SimpleGrid>
    </>
  );
}
