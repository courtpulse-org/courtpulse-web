import { Button, Stack } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import {
  EmptyStateComponent,
  PageHeader,
  SectionLoader,
} from "@repo/ui/elements";
import { BriefcaseIcon, PlusIcon } from "@repo/ui/icons";
import { RouteConstants } from "@/shared/constants/routes";
import { useGetNearbyBriefs } from "../api";
import { BriefCard } from "../components/BriefCard";

export function MarketplacePage() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetNearbyBriefs();
  const briefs = data?.data ?? [];

  return (
    <>
      <PageHeader
        title="Next-Door Counsel"
        description="Routine matters other counsel need held in the complex you're checked in to."
        actions={
          <>
            <Button variant="outlineSecondary" asChild>
              <Link to={RouteConstants.briefs.mine.path}>My briefs</Link>
            </Button>
            <Button asChild>
              <Link to={RouteConstants.briefs.new.path}>
                <PlusIcon boxSize="4" /> Request cover
              </Link>
            </Button>
          </>
        }
      />
      {isLoading ? (
        <SectionLoader />
      ) : briefs.length === 0 ? (
        <EmptyStateComponent
          icon={<BriefcaseIcon boxSize="10" />}
          title="No open requests near you"
          description="Check in to a courtroom on the Court Pulse board to see requests in that complex."
          buttonText="Request cover for my matter"
          onPrimaryClick={() => navigate(RouteConstants.briefs.new.path)}
        />
      ) : (
        <Stack gap="3">
          {briefs.map((b) => (
            <BriefCard key={b.id} brief={b} />
          ))}
        </Stack>
      )}
    </>
  );
}
