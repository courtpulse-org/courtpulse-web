import { Stack } from "@chakra-ui/react";
import {
  EmptyStateComponent,
  PageHeader,
  SectionLoader,
} from "@repo/ui/elements";
import { ActivityIcon } from "@repo/ui/icons";
import { useCurrentUser } from "@/hooks";
import { useGetMyCourtrooms } from "../api";
import { CourtroomStatusCard } from "../components/CourtroomStatusCard";

/** The registrar's home: one card per assigned courtroom, one tap to post. */
export function ConsolePage() {
  const { userData } = useCurrentUser();
  const { data, isLoading } = useGetMyCourtrooms();
  const rows = data?.data ?? [];

  return (
    <>
      <PageHeader
        title="Court Console"
        description="Tap the current status. It posts as Official and alerts every counsel tracking the courtroom."
      />
      {isLoading ? (
        <SectionLoader />
      ) : rows.length === 0 ? (
        <EmptyStateComponent
          icon={<ActivityIcon boxSize="10" />}
          title="No courtrooms assigned"
          description={
            userData?.is_verified
              ? "Ask an admin to assign your courtrooms."
              : "Your account is awaiting admin verification."
          }
        />
      ) : (
        <Stack gap="4">
          {rows.map((row) => (
            <CourtroomStatusCard key={row.courtroom.id} row={row} />
          ))}
        </Stack>
      )}
    </>
  );
}
