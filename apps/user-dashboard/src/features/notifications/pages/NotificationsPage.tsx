import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  EmptyStateComponent,
  PageHeader,
  SectionLoader,
  SurfaceCard,
} from "@repo/ui/elements";
import { BellIcon } from "@repo/ui/icons";
import { timeAgo } from "@repo/utils";
import { useGetNotifications, useMarkNotificationRead } from "../api";

export function NotificationsPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetNotifications();
  const markRead = useMarkNotificationRead();
  const items = data?.data ?? [];

  return (
    <>
      <PageHeader
        title="Notifications"
        description="Status changes, cause list matches and registrar broadcasts."
      />
      {isLoading ? (
        <SectionLoader />
      ) : items.length === 0 ? (
        <EmptyStateComponent
          icon={<BellIcon boxSize="10" />}
          title="You're all caught up"
        />
      ) : (
        <Stack gap="2">
          {items.map((n) => (
            <SurfaceCard
              key={n.id}
              cursor="pointer"
              bg={n.read ? "white" : "primary.25"}
              onClick={() => {
                if (!n.read) markRead.mutate(n.id);
                if (n.link) navigate(n.link);
              }}
            >
              <Flex gap="3" align="flex-start">
                {!n.read && (
                  <Box
                    boxSize="2"
                    rounded="full"
                    bg="secondary.300"
                    mt="2"
                    flexShrink={0}
                  />
                )}
                <Box flex="1">
                  <Text textStyle="small-semibold">{n.title}</Text>
                  <Text textStyle="small-regular" color="gray.300">
                    {n.body}
                  </Text>
                </Box>
                <Text textStyle="tiny-regular" color="gray.200" flexShrink={0}>
                  {timeAgo(n.created_at)}
                </Text>
              </Flex>
            </SurfaceCard>
          ))}
        </Stack>
      )}
    </>
  );
}
