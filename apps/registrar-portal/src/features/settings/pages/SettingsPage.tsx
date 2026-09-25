import { Stack, Text } from "@chakra-ui/react";
import { PageHeader, SurfaceCard } from "@repo/ui/elements";
import { useCurrentUser } from "@/hooks";

export function SettingsPage() {
  const { userData, fullName } = useCurrentUser();
  const rows: [string, string | undefined][] = [
    ["Name", fullName],
    ["Email", userData?.email],
    ["Phone", userData?.phone],
    ["Role", userData?.role],
    [
      "Verification",
      userData?.is_verified ? "Verified" : "Awaiting admin verification",
    ],
  ];
  return (
    <>
      <PageHeader title="Settings" />
      <SurfaceCard maxW="36rem">
        <Stack gap="4">
          {rows.map(([label, value]) => (
            <Stack key={label} gap="0.5">
              <Text
                textStyle="tiny-medium"
                color="gray.200"
                textTransform="uppercase"
              >
                {label}
              </Text>
              <Text>{value || "—"}</Text>
            </Stack>
          ))}
        </Stack>
      </SurfaceCard>
    </>
  );
}
