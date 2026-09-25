import { Box, Checkbox, Stack, Text } from "@chakra-ui/react";
import { useAllCourtrooms } from "@/shared/api";

/** Courtrooms grouped by complex, as checkboxes. */
export function CourtroomPicker({
  value,
  onChange,
}: {
  value: string[];
  onChange: (ids: string[]) => void;
}) {
  const rooms = useAllCourtrooms().data?.data ?? [];
  const groups = rooms.reduce<Record<string, typeof rooms>>((acc, r) => {
    (acc[r.complex_name ?? ""] ??= []).push(r);
    return acc;
  }, {});
  return (
    <Stack gap="4" maxH="22rem" overflowY="auto">
      {Object.entries(groups).map(([complex, list]) => (
        <Box key={complex}>
          <Text
            textStyle="tiny-semibold"
            color="gray.200"
            textTransform="uppercase"
            mb="2"
          >
            {complex}
          </Text>
          <Stack gap="2">
            {list.map((r) => (
              <Checkbox.Root
                key={r.id}
                colorPalette="primary"
                checked={value.includes(r.id)}
                onCheckedChange={(e) =>
                  onChange(
                    e.checked
                      ? [...value, r.id]
                      : value.filter((x) => x !== r.id),
                  )
                }
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>
                  <Text textStyle="small-medium">
                    {r.name}{" "}
                    <Text as="span" color="gray.200" fontWeight="400">
                      · {r.judge?.name ?? "no judge"}
                      {r.registrars.length
                        ? ` · ${r.registrars.join(", ")}`
                        : ""}
                    </Text>
                  </Text>
                </Checkbox.Label>
              </Checkbox.Root>
            ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}
