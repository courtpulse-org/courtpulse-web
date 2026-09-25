import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { formatCourtTime, getInitials } from "@repo/utils";
import { SectionCard } from "@/components/common";
import { useActivity } from "@/shared/api";

export function ActivityFeed({ limit = 8 }: { limit?: number }) {
  const { data } = useActivity();
  const rows = (data?.data ?? []).slice(0, limit);
  return (
    <SectionCard
      title="Registry activity"
      description="What's been posted today"
    >
      {rows.length === 0 ? (
        <Text textStyle="small-regular" color="gray.200">
          Nothing yet today.
        </Text>
      ) : (
        <Stack gap="3.5">
          {rows.map((a) => (
            <Flex key={a.id} gap="3" align="flex-start">
              <Flex
                boxSize="7"
                rounded="full"
                bg="primary.50"
                color="primary.300"
                align="center"
                justify="center"
                textStyle="tiny-semibold"
                flexShrink={0}
              >
                {getInitials(...(a.actor.split(" ") as [string, string]))}
              </Flex>
              <Box minW="0">
                <Text textStyle="small-regular" color="gray.400">
                  <b>{a.actor}</b> {a.action} ·{" "}
                  <Text as="span" color="gray.300">
                    {a.target}
                  </Text>
                </Text>
                <Text textStyle="tiny-regular" color="gray.200">
                  {formatCourtTime(a.created_at)}
                </Text>
              </Box>
            </Flex>
          ))}
        </Stack>
      )}
    </SectionCard>
  );
}
