import { Button, Stack, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import {
  EmptyStateComponent,
  PageHeader,
  SectionLoader,
  SurfaceCard,
} from "@repo/ui/elements";
import { MegaphoneIcon, PlusIcon } from "@repo/ui/icons";
import { timeAgo } from "@repo/utils";
import { useGetBroadcasts } from "@/features/console/api";
import { RouteConstants } from "@/shared/constants/routes";

export function BroadcastsPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetBroadcasts();
  const items = data?.data ?? [];

  return (
    <>
      <PageHeader
        title="Broadcasts"
        description="Urgent announcements to every counsel tracking cases in your division."
        actions={
          <Button asChild>
            <Link to={RouteConstants.broadcasts.new.path}>
              <PlusIcon boxSize="4" /> New broadcast
            </Link>
          </Button>
        }
      />
      {isLoading ? (
        <SectionLoader />
      ) : items.length === 0 ? (
        <EmptyStateComponent
          icon={<MegaphoneIcon boxSize="10" />}
          title="No broadcasts yet"
          description='e.g. "Court 3 sitting suspended until 11:30 AM due to chamber meeting."'
          buttonText="New broadcast"
          onPrimaryClick={() => navigate(RouteConstants.broadcasts.new.path)}
        />
      ) : (
        <Stack gap="2">
          {items.map((b) => (
            <SurfaceCard key={b.id}>
              <Text textStyle="small-regular">{b.message}</Text>
              <Text textStyle="tiny-regular" color="gray.200" mt="1">
                {timeAgo(b.created_at)}
              </Text>
            </SurfaceCard>
          ))}
        </Stack>
      )}
    </>
  );
}
