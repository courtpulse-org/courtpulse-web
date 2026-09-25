import { Flex, type FlexProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface Option<T extends string> {
  value: T;
  label: ReactNode;
}

interface SegmentedControlProps<T extends string> extends Omit<
  FlexProps,
  "onChange"
> {
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
}

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  ...props
}: SegmentedControlProps<T>) {
  return (
    <Flex
      bg="gray.50"
      border="1px solid"
      borderColor="gray.75"
      rounded="md"
      p="1"
      gap="1"
      {...props}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Flex
            key={o.value}
            as="button"
            align="center"
            justify="center"
            gap="1.5"
            flex="1"
            px="3"
            h="8"
            rounded="sm"
            textStyle="small-medium"
            whiteSpace="nowrap"
            color={active ? "primary.300" : "gray.300"}
            bg={active ? "white" : "transparent"}
            boxShadow={active ? "sm" : "none"}
            fontWeight={active ? "600" : "500"}
            cursor="pointer"
            transition="all 0.15s"
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </Flex>
        );
      })}
    </Flex>
  );
}
