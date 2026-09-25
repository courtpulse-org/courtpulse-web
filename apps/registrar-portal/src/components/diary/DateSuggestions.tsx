import { Flex, Input, Skeleton, Text } from "@chakra-ui/react";
import type { IDiaryDay } from "@repo/types";
import { formatCourtDate } from "@repo/utils";
import { useDiary } from "@/shared/api";

interface Props {
  courtroomId: string;
  value: string;
  onChange: (date: string) => void;
  /** Only offer these dates (e.g. counsel's proposals). */
  restrictTo?: string[];
  count?: number;
}

/** Next open dates from the judge's diary, with how full each already is. */
export function DateSuggestions({
  courtroomId,
  value,
  onChange,
  restrictTo,
  count = 8,
}: Props) {
  const { data, isLoading } = useDiary(courtroomId, 45);
  const days: IDiaryDay[] = (data?.data ?? []).filter((d) =>
    restrictTo
      ? restrictTo.includes(d.date)
      : !d.blocked && d.booked < d.capacity,
  );
  const shown = restrictTo ? days : days.slice(0, count);

  if (isLoading) return <Skeleton h="5rem" rounded="md" />;

  return (
    <Flex direction="column" gap="2">
      <Flex gap="2" wrap="wrap">
        {shown.map((d) => {
          const active = d.date === value;
          const full = d.booked / d.capacity;
          return (
            <Flex
              key={d.date}
              as="button"
              direction="column"
              align="flex-start"
              px="3"
              py="2"
              rounded="md"
              border="1px solid"
              borderColor={active ? "primary.300" : "gray.75"}
              bg={active ? "primary.25" : "white"}
              boxShadow={active ? "0 0 0 1px {colors.primary.300}" : "none"}
              cursor={d.blocked ? "not-allowed" : "pointer"}
              opacity={d.blocked ? 0.5 : 1}
              onClick={() => !d.blocked && onChange(d.date)}
              minW="7.5rem"
            >
              <Text
                textStyle="small-semibold"
                color={active ? "primary.300" : "gray.500"}
              >
                {formatCourtDate(d.date).replace(/ \d{4}$/, "")}
              </Text>
              <Text
                textStyle="tiny-regular"
                color={
                  d.blocked
                    ? "gray.200"
                    : full >= 0.9
                      ? "error.300"
                      : full >= 0.6
                        ? "warning.600"
                        : "success.400"
                }
              >
                {d.blocked
                  ? (d.block_reason ?? "Blocked")
                  : `${d.booked} of ${d.capacity} booked`}
              </Text>
            </Flex>
          );
        })}
      </Flex>
      {!restrictTo && (
        <Flex align="center" gap="2">
          <Text textStyle="tiny-regular" color="gray.200">
            Or pick another date
          </Text>
          <Input
            type="date"
            size="sm"
            maxW="11rem"
            h="8"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </Flex>
      )}
    </Flex>
  );
}
