import { Button } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import {
  EmptyStateComponent,
  PageHeader,
  SectionLoader,
} from "@repo/ui/elements";
import { ListChecksIcon, PlusIcon } from "@repo/ui/icons";
import { RouteConstants } from "@/shared/constants/routes";
import { useGetWatchlist } from "../api";
import { WatchlistTable } from "../components/WatchlistTable";

export function WatchlistPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetWatchlist();
  const cases = data?.data ?? [];

  return (
    <>
      <PageHeader
        title="My Watchlist"
        description="Matters you're tracking. We alert you when any is listed or its courtroom status changes."
        actions={
          <Button asChild>
            <Link to={RouteConstants.watchlist.new.path}>
              <PlusIcon boxSize="4" /> Add matter
            </Link>
          </Button>
        }
      />
      {isLoading ? (
        <SectionLoader />
      ) : cases.length === 0 ? (
        <EmptyStateComponent
          icon={<ListChecksIcon boxSize="10" />}
          title="Your watchlist is empty"
          description="Add your active matters by suit number, courtroom and date."
          buttonText="Add a matter"
          onPrimaryClick={() => navigate(RouteConstants.watchlist.new.path)}
        />
      ) : (
        <WatchlistTable cases={cases} />
      )}
    </>
  );
}
