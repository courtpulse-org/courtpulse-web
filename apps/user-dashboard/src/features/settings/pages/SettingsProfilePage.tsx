import { Stack, Text } from "@chakra-ui/react";
import { PageHeader, SurfaceCard } from "@repo/ui/elements";
import { useCurrentUser } from "@/hooks";

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <Stack gap="0.5">
      <Text textStyle="tiny-medium" color="gray.200" textTransform="uppercase">
        {label}
      </Text>
      <Text textStyle="default-regular">{value || "—"}</Text>
    </Stack>
  );
}

export function SettingsProfilePage() {
  const { userData, fullName, isVerified } = useCurrentUser();
  return (
    <>
      <PageHeader
        title="Profile"
        description="Your identity on CourtPulse. Contact support to change your enrolment number."
      />
      <SurfaceCard maxW="36rem">
        <Stack gap="4">
          <Row label="Name" value={fullName} />
          <Row label="Enrolment number" value={userData?.enrolment_number} />
          <Row label="Phone" value={userData?.phone} />
          <Row label="Email" value={userData?.email} />
          <Row
            label="Verification"
            value={isVerified ? "Verified" : "Pending verification"}
          />
        </Stack>
      </SurfaceCard>
    </>
  );
}
