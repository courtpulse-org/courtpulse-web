import { Button, Stack, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader, SectionLoader, SurfaceCard } from "@repo/ui/elements";
import { formatCourtDate } from "@repo/utils";
import { RouteConstants } from "@/shared/constants/routes";
import { useDeleteWatchlistCase, useGetWatchlistCase } from "../api";

export function CaseDetailsPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetWatchlistCase(id);
  const remove = useDeleteWatchlistCase();
  const matter = data?.data;

  if (isLoading || !matter) return <SectionLoader />;

  return (
    <>
      <PageHeader
        title={matter.suit_number}
        description={matter.title}
        actions={
          <Button
            variant="dangerOutline"
            loading={remove.isPending}
            onClick={async () => {
              await remove.mutateAsync(matter.id);
              navigate(RouteConstants.watchlist.base.path);
            }}
          >
            Remove
          </Button>
        }
      />
      <SurfaceCard maxW="36rem">
        <Stack gap="3">
          <Text textStyle="small-regular">
            <Text as="span" color="gray.200">
              Scheduled:
            </Text>{" "}
            {formatCourtDate(matter.scheduled_date)}
          </Text>
          <Text textStyle="small-regular">
            <Text as="span" color="gray.200">
              Cause list:
            </Text>{" "}
            {matter.cause_list_item
              ? `Item #${matter.cause_list_item}`
              : "Not listed today"}
          </Text>
          <Button
            variant="outline"
            alignSelf="flex-start"
            onClick={() =>
              navigate(
                RouteConstants.pulse.courtroom.generate({
                  id: matter.courtroom_id,
                }),
              )
            }
          >
            View courtroom status
          </Button>
        </Stack>
      </SurfaceCard>
    </>
  );
}
