import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import type { IDiaryDay } from "@repo/types";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

function loadColor(d: IDiaryDay) {
  if (d.blocked) return "gray";
  const ratio = d.booked / d.capacity;
  return ratio >= 0.9 ? "error" : ratio >= 0.6 ? "warning" : "success";
}

interface DiaryGridProps {
  days: IDiaryDay[];
  onSelect?: (day: IDiaryDay) => void;
  selected?: string | null;
}

/** The judge's diary as a Mon–Fri grid: how full each day already is. */
export function DiaryGrid({ days, onSelect, selected }: DiaryGridProps) {
  if (!days.length) return null;
  const first = new Date(`${days[0]!.date}T12:00:00Z`).getUTCDay(); // 1 = Mon
  const lead = Math.max(0, first - 1);
  return (
    <Box>
      <Grid templateColumns="repeat(5, minmax(0, 1fr))" gap="2" mb="2">
        {WEEKDAYS.map((w) => (
          <Text
            key={w}
            textStyle="tiny-semibold"
            color="gray.200"
            textAlign="center"
          >
            {w}
          </Text>
        ))}
      </Grid>
      <Grid templateColumns="repeat(5, minmax(0, 1fr))" gap="2">
        {Array.from({ length: lead }).map((_, i) => (
          <Box key={`lead-${i}`} />
        ))}
        {days.map((d) => {
          const palette = loadColor(d);
          const date = new Date(`${d.date}T12:00:00Z`);
          const active = selected === d.date;
          return (
            <Flex
              key={d.date}
              as={onSelect ? "button" : "div"}
              direction="column"
              gap="1.5"
              p={{ base: "1.5", md: "2.5" }}
              rounded="md"
              border="1px solid"
              borderColor={active ? "primary.300" : "gray.75"}
              boxShadow={active ? "0 0 0 1px {colors.primary.300}" : "none"}
              bg={d.blocked ? "gray.50" : "white"}
              backgroundImage={
                d.blocked
                  ? "repeating-linear-gradient(135deg, transparent 0 6px, rgba(22,27,38,0.04) 6px 12px)"
                  : undefined
              }
              textAlign="left"
              cursor={onSelect ? "pointer" : "default"}
              _hover={onSelect ? { borderColor: "primary.100" } : undefined}
              onClick={onSelect ? () => onSelect(d) : undefined}
              minW="0"
            >
              <Flex justify="space-between" align="baseline" gap="1">
                <Text
                  textStyle="small-semibold"
                  color={d.blocked ? "gray.200" : "gray.500"}
                >
                  {date.getUTCDate()}
                </Text>
                <Text
                  textStyle="tiny-regular"
                  color="gray.200"
                  display={{ base: "none", md: "block" }}
                >
                  {date.toLocaleString("en-NG", {
                    month: "short",
                    timeZone: "UTC",
                  })}
                </Text>
              </Flex>
              {d.blocked ? (
                <Text
                  textStyle="tiny-regular"
                  color="gray.200"
                  lineClamp={2}
                  fontSize={{ base: "0.625rem", md: "xs" }}
                >
                  {d.block_reason ?? "Blocked"}
                </Text>
              ) : (
                <>
                  <Box h="1.5" bg="gray.75" rounded="full" overflow="hidden">
                    <Box
                      h="full"
                      w={`${Math.min(100, (d.booked / d.capacity) * 100)}%`}
                      bg={`${palette}.${palette === "warning" ? "500" : "300"}`}
                      rounded="full"
                    />
                  </Box>
                  <Text
                    textStyle="tiny-regular"
                    color="gray.300"
                    fontSize={{ base: "0.625rem", md: "xs" }}
                  >
                    {d.booked}/{d.capacity}
                    <Text as="span" display={{ base: "none", md: "inline" }}>
                      {" "}
                      matters
                    </Text>
                  </Text>
                </>
              )}
            </Flex>
          );
        })}
      </Grid>
    </Box>
  );
}
