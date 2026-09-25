import { Button, Flex, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { PageHeader, SurfaceCard } from "@repo/ui/elements";
import { CustomInput } from "@repo/ui/input";
import {
  useGetRegistrars,
  useInviteRegistrar,
  useVerifyRegistrar,
} from "../api";
import { UserTable } from "../components/UserTable";

export function RegistrarsPage() {
  const { data, isLoading } = useGetRegistrars();
  const invite = useInviteRegistrar();
  const verify = useVerifyRegistrar();
  const [email, setEmail] = useState("");

  return (
    <Stack gap="5">
      <PageHeader
        title="Registrars"
        description="Invite court registrars and clerks by email, then verify them."
      />
      <SurfaceCard>
        <Flex
          gap="3"
          align="flex-end"
          direction={{ base: "column", sm: "row" }}
        >
          <CustomInput
            label="Invite by email"
            type="email"
            placeholder="registrar@lagosjudiciary.gov.ng"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
          <Button
            loading={invite.isPending}
            disabled={!email}
            onClick={() =>
              invite.mutate(
                { email, courtroom_ids: [] },
                { onSuccess: () => setEmail("") },
              )
            }
          >
            Send invite
          </Button>
        </Flex>
      </SurfaceCard>
      <UserTable
        users={data?.data ?? []}
        isLoading={isLoading}
        idLabel="Email"
        getId={(u) => u.email}
        onVerify={(id) => verify.mutate(id)}
        verifying={verify.isPending}
      />
    </Stack>
  );
}
