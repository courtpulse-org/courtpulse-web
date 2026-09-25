import { Button, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader, SurfaceCard } from "@repo/ui/elements";
import { CustomInput } from "@repo/ui/input";
import { RouteConstants } from "@/shared/constants/routes";
import { useCreateRemoteDateRequest } from "../api";

export function RemoteDatePage() {
  const { courtroomId = "" } = useParams();
  const navigate = useNavigate();
  const create = useCreateRemoteDateRequest();
  const [suitNumber, setSuitNumber] = useState("");
  const [dates, setDates] = useState<string[]>(["", "", ""]);

  const proposed = dates.filter(Boolean);

  return (
    <>
      <PageHeader
        title="Take a date remotely"
        description="Court isn't sitting today. Propose up to three dates; the registrar confirms one."
      />
      <SurfaceCard maxW="36rem">
        <Stack gap="5">
          <CustomInput
            label="Suit number"
            required
            value={suitNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSuitNumber(e.target.value)
            }
          />
          <Text textStyle="tiny-semibold" color="field.label">
            Proposed dates
          </Text>
          {dates.map((d, i) => (
            <CustomInput
              key={i}
              type="date"
              value={d}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDates((prev) =>
                  prev.map((v, j) => (j === i ? e.target.value : v)),
                )
              }
            />
          ))}
          <Button
            size="lg"
            disabled={!suitNumber || proposed.length === 0}
            loading={create.isPending}
            onClick={async () => {
              await create.mutateAsync({
                suit_number: suitNumber,
                courtroom_id: courtroomId,
                proposed_dates: proposed,
              });
              navigate(RouteConstants.dock.courtroom.generate({ courtroomId }));
            }}
          >
            Send to registrar
          </Button>
        </Stack>
      </SurfaceCard>
    </>
  );
}
