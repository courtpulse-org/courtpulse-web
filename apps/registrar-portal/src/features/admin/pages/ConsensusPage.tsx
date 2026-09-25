import { Button, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { PageHeader, SectionLoader } from "@repo/ui/elements";
import { CustomInput } from "@repo/ui/input";
import { SectionCard } from "@/components/common";
import { useConsensus, useUpdateConsensus } from "@/shared/api";

type Config = {
  min_reports: number;
  window_minutes: number;
  credit_first_n: number;
  credit_amount: number;
};
const FIELDS: { key: keyof Config; label: string; hint: string }[] = [
  {
    key: "min_reports",
    label: "Matching reports to verify",
    hint: "PRD: 2–3 independent spotters in the same courtroom.",
  },
  {
    key: "window_minutes",
    label: "Consensus window (minutes)",
    hint: "Older reports don't count toward agreement.",
  },
  {
    key: "credit_first_n",
    label: "Credit the first N spotters",
    hint: "Rewards reporting early.",
  },
  {
    key: "credit_amount",
    label: "Pulse Credits per report",
    hint: "Redeemable against brief-holding fees.",
  },
];

export function ConsensusPage() {
  const { data, isLoading } = useConsensus();
  const update = useUpdateConsensus();
  const [cfg, setCfg] = useState<Config | null>(null);
  useEffect(() => {
    if (data?.data) setCfg(data.data);
  }, [data]);
  if (isLoading || !cfg) return <SectionLoader />;
  return (
    <>
      <PageHeader
        title="Consensus rules"
        description="How spotter reports become Verified where no registrar has posted. A registrar's post always overrides the crowd."
      />
      <SectionCard maxW="44rem">
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
                  setCfg({ ...cfg, [f.key]: Number(e.target.value) })
                }
              />
            ))}
          </SimpleGrid>
          <Text
            textStyle="small-regular"
            color="gray.300"
            bg="gray.25"
            p="3"
            rounded="md"
          >
            With these rules, {cfg.min_reports} spotters reporting the same
            status within {cfg.window_minutes} minutes verifies it, and the
            first {cfg.credit_first_n} earn {cfg.credit_amount} credits each.
          </Text>
          <Button
            alignSelf="flex-end"
            loading={update.isPending}
            onClick={() => update.mutate(cfg)}
          >
            Save rules
          </Button>
        </Stack>
      </SectionCard>
    </>
  );
}
