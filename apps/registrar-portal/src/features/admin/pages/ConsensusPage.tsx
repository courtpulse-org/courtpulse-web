import { Button, SimpleGrid, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { PageHeader, SectionLoader, SurfaceCard } from "@repo/ui/elements";
import { CustomInput } from "@repo/ui/input";
import {
  useGetConsensusConfig,
  useUpdateConsensusConfig,
  type IConsensusConfig,
} from "../api";

const FIELDS: { key: keyof IConsensusConfig; label: string; hint: string }[] = [
  {
    key: "min_reports",
    label: "Reports to verify",
    hint: "PRD: 2–3 independent Spotters.",
  },
  {
    key: "window_minutes",
    label: "Consensus window (min)",
    hint: "Older reports don't count.",
  },
  {
    key: "credit_first_n",
    label: "Credit first N reporters",
    hint: "Early reporters earn credits.",
  },
  {
    key: "credit_amount",
    label: "Credits per report",
    hint: "Pulse Credits awarded each.",
  },
];

export function ConsensusPage() {
  const { data, isLoading } = useGetConsensusConfig();
  const update = useUpdateConsensusConfig();
  const [cfg, setCfg] = useState<IConsensusConfig>({
    min_reports: 2,
    window_minutes: 20,
    credit_first_n: 3,
    credit_amount: 5,
  });

  useEffect(() => {
    if (data?.data) setCfg(data.data);
  }, [data]);

  if (isLoading) return <SectionLoader />;

  return (
    <>
      <PageHeader
        title="Consensus rules"
        description="How crowd reports are promoted from Unverified to Verified."
      />
      <SurfaceCard maxW="40rem">
        <Stack gap="5">
          <SimpleGrid columns={{ base: 1, sm: 2 }} gap="4">
            {FIELDS.map((f) => (
              <CustomInput
                key={f.key}
                label={f.label}
                helperText={f.hint}
                type="number"
                value={cfg[f.key]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCfg((c) => ({ ...c, [f.key]: Number(e.target.value) }))
                }
              />
            ))}
          </SimpleGrid>
          <Button
            alignSelf="flex-end"
            loading={update.isPending}
            onClick={() => update.mutate(cfg)}
          >
            Save rules
          </Button>
        </Stack>
      </SurfaceCard>
    </>
  );
}
