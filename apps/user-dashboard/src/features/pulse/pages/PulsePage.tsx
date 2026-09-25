import { Stack } from "@chakra-ui/react";
import {
  EmptyStateComponent,
  PageHeader,
  SectionLoader,
} from "@repo/ui/elements";
import { ActivityIcon } from "@repo/ui/icons";
import { useGetLiveBoard } from "@/shared/api";
import { LiveBoardRow } from "../components/LiveBoardRow";

/** "Waze for Courts" — the live board of courtroom statuses. */
export function PulsePage() {
  const { data, isLoading } = useGetLiveBoard();
  const rows = data?.data ?? [];

  return (
    <>
      <PageHeader
        title="Court Pulse"
        description="Live courtroom status, verified by lawyers on the ground. Rows with a gold edge hold one of your matters."
      />
      {isLoading ? (
        <SectionLoader />
      ) : rows.length === 0 ? (
        <EmptyStateComponent
          icon={<ActivityIcon boxSize="10" />}
          title="Nothing on the board yet"
          description="Courtrooms appear here once a Spotter or Registrar posts a status, or you add a matter to your watchlist."
        />
      ) : (
        <Stack gap="3">
          {rows.map((row) => (
            <LiveBoardRow key={row.courtroom.id} row={row} />
          ))}
        </Stack>
      )}
    </>
  );
}
