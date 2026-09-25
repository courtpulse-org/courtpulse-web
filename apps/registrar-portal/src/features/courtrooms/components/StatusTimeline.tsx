import { Badge, Box, Flex, Stack, Text } from "@chakra-ui/react";
import { COURT_STATUS_LABEL } from "@repo/types";
import { COURT_STATUS_COLOR } from "@repo/theme";
import { formatCourtTime } from "@repo/utils";
import { SectionCard } from "@/components/common";
import { useStatusTimeline } from "@/shared/api";

export function StatusTimeline({
  courtroomId,
  date,
}: {
  courtroomId: string;
  date: string;
}) {
  const { data } = useStatusTimeline(courtroomId, date);
  const rows = data?.data ?? [];
  return (
    <SectionCard
      title="Status timeline"
      description="Every post today — yours are official; spotter reports feed the crowd consensus."
    >
      {rows.length === 0 ? (
        <Text textStyle="small-regular" color="gray.200">
          No posts yet.
        </Text>
      ) : (
        <Stack gap="0">
          {rows.map((r, idx) => (
            <Flex key={r.id} gap="3">
              <Flex direction="column" align="center">
                <Box
                  boxSize="3"
                  rounded="full"
                  mt="1.5"
                  bg={`${COURT_STATUS_COLOR[r.status]}.solid`}
                  flexShrink={0}
                />
                {idx < rows.length - 1 && (
                  <Box w="2px" flex="1" bg="gray.75" my="1" />
                )}
              </Flex>
              <Box pb="4" minW="0">
                <Flex gap="2" align="center" wrap="wrap">
                  <Text textStyle="small-semibold">
                    {COURT_STATUS_LABEL[r.status]}
                  </Text>
                  <Badge
                    size="sm"
                    variant={r.source === "REGISTRAR" ? "solid" : "outline"}
                    colorPalette={
                      r.source === "REGISTRAR"
                        ? "primary"
                        : r.verification === "VERIFIED"
                          ? "success"
                          : "gray"
                    }
                  >
                    {r.source === "REGISTRAR"
                      ? "Official"
                      : r.verification === "VERIFIED"
                        ? "Spotter · verified"
                        : "Spotter"}
                  </Badge>
                </Flex>
                <Text textStyle="tiny-regular" color="gray.200">
                  {formatCourtTime(r.created_at)} · {r.reporter_name}
                  {r.note ? ` · ${r.note}` : ""}
                </Text>
              </Box>
            </Flex>
          ))}
        </Stack>
      )}
    </SectionCard>
  );
}
