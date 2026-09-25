import { Button, Flex, Progress, Stack, Text } from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import { PageHeader, SectionLoader, SurfaceCard } from "@repo/ui/elements";
import { timeAgo } from "@repo/utils";
import { useGetCourtroomStatus } from "@/shared/api";
import { RouteConstants } from "@/shared/constants/routes";
import { useGetDock } from "../api";

export function CourtroomDockPage() {
  const { courtroomId = "" } = useParams();
  const dock = useGetDock(courtroomId);
  const status = useGetCourtroomStatus(courtroomId);

  if (dock.isLoading) return <SectionLoader />;

  const entry = dock.data?.data;
  const canTakeRemoteDate =
    status.data?.data?.status === "NOT_SITTING" &&
    status.data?.data?.verification !== "UNVERIFIED";

  return (
    <Stack gap="4">
      <PageHeader
        title="Order of business"
        actions={
          canTakeRemoteDate ? (
            <Button asChild>
              <Link
                to={RouteConstants.dock.remoteDate.generate({ courtroomId })}
              >
                Take a date remotely
              </Link>
            </Button>
          ) : undefined
        }
      />
      <SurfaceCard>
        {entry ? (
          <>
            <Flex justify="space-between" align="baseline" mb="3">
              <Text textStyle="h1" color="primary.300">
                Item #{entry.current_item}
              </Text>
              <Text textStyle="small-regular" color="gray.200">
                of {entry.total_items} ·{" "}
                {entry.source === "REGISTRAR" ? "Registrar" : "Spotters"} ·{" "}
                {timeAgo(entry.updated_at)}
              </Text>
            </Flex>
            <Progress.Root
              value={(entry.current_item / entry.total_items) * 100}
              colorPalette="primary"
            >
              <Progress.Track>
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>
          </>
        ) : (
          <Text color="gray.200">
            No call order posted for this courtroom yet today.
          </Text>
        )}
      </SurfaceCard>
    </Stack>
  );
}
