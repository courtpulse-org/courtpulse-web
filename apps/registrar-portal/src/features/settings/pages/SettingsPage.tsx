import { Badge, Button, Flex, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { PageHeader } from "@repo/ui/elements";
import { RefreshIcon } from "@repo/ui/icons";
import { SectionCard } from "@/components/common";
import { useCurrentUser } from "@/hooks";
import { resetDemoData } from "@/mock/api";
import { courtroomLabel } from "@/shared/api";

export function SettingsPage() {
  const { userData, fullName } = useCurrentUser();
  const rows: [string, string | undefined][] = [
    ["Name", fullName],
    ["Title", userData?.staff_title],
    ["Email", userData?.email],
    ["Phone", userData?.phone],
  ];
  return (
    <>
      <PageHeader title="Settings" />
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap="5" alignItems="flex-start">
        <SectionCard
          title="Your account"
          actions={
            <Badge
              colorPalette={userData?.is_verified ? "success" : "warning"}
              variant="subtle"
            >
              {userData?.is_verified ? "Verified" : "Awaiting verification"}
            </Badge>
          }
        >
          <Stack gap="4">
            {rows.map(([label, value]) => (
              <Flex key={label} justify="space-between" gap="4">
                <Text textStyle="small-regular" color="gray.200">
                  {label}
                </Text>
                <Text textStyle="small-medium" textAlign="right">
                  {value || "—"}
                </Text>
              </Flex>
            ))}
            <Flex justify="space-between" gap="4">
              <Text textStyle="small-regular" color="gray.200">
                Courtrooms
              </Text>
              <Text textStyle="small-medium" textAlign="right">
                {userData?.role === "ADMIN"
                  ? "All"
                  : (userData?.courtroom_ids ?? [])
                      .map(courtroomLabel)
                      .join(", ") || "None"}
              </Text>
            </Flex>
          </Stack>
        </SectionCard>
        <SectionCard
          title="Demo data"
          description="This portal runs on sample Lagos data stored in your browser. It resets itself each day."
        >
          <Button
            variant="outline"
            onClick={() => {
              resetDemoData();
              window.location.reload();
            }}
          >
            <RefreshIcon /> Reset demo data now
          </Button>
        </SectionCard>
      </SimpleGrid>
    </>
  );
}
