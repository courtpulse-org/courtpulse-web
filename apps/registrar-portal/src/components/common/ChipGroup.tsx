import { Flex, type FlexProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface ChipGroupProps<T extends string> extends Omit<FlexProps, "onChange"> {
  value: T | null | undefined;
  onChange: (value: T) => void;
  options: { value: T; label: ReactNode }[];
  colorPalette?: string;
}

/** Big tappable choices — faster than a dropdown on a phone. */
export function ChipGroup<T extends string>({
  value,
  onChange,
  options,
  colorPalette = "primary",
  ...props
}: ChipGroupProps<T>) {
  return (
    <Flex gap="2" wrap="wrap" colorPalette={colorPalette} {...props}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Flex
            key={o.value}
            as="button"
            align="center"
            gap="1.5"
            px="3.5"
            h="10"
            rounded="full"
            border="1px solid"
            borderColor={active ? "colorPalette.solid" : "gray.75"}
            bg={active ? "colorPalette.subtle" : "white"}
            color={active ? "colorPalette.fg" : "gray.400"}
            textStyle="small-medium"
            fontWeight={active ? "600" : "500"}
            cursor="pointer"
            transition="all 0.12s"
            _hover={{ borderColor: "colorPalette.muted" }}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </Flex>
        );
      })}
    </Flex>
  );
}
