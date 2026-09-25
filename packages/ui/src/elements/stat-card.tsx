import { Flex, Text, type BoxProps } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { SurfaceCard } from "./surface-card";

interface StatCardProps extends BoxProps {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  ...props
}: StatCardProps) {
  return (
    <SurfaceCard {...props}>
      <Flex justify="space-between" align="flex-start" gap="3">
        <Text
          textStyle="tiny-medium"
          color="gray.200"
          textTransform="uppercase"
        >
          {label}
        </Text>
        {icon && (
          <Flex color="primary.300" fontSize="lg">
            {icon}
          </Flex>
        )}
      </Flex>
      <Text textStyle="h2" color="gray.500" mt="2">
        {value}
      </Text>
      {hint && (
        <Text textStyle="tiny-regular" color="gray.200" mt="1">
          {hint}
        </Text>
      )}
    </SurfaceCard>
  );
}
