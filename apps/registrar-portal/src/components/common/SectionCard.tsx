import { Box, Flex, Heading, Text, type BoxProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface SectionCardProps extends Omit<BoxProps, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** Removes body padding, for tables that run edge to edge. */
  flush?: boolean;
}

export function SectionCard({
  title,
  description,
  actions,
  flush,
  children,
  ...props
}: SectionCardProps) {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.75"
      rounded="lg"
      overflow="hidden"
      {...props}
    >
      {(title || actions) && (
        <Flex
          px={{ base: "4", md: "5" }}
          py="3.5"
          align={{ base: "flex-start", sm: "center" }}
          justify="space-between"
          gap="3"
          direction={{ base: "column", sm: "row" }}
          borderBottom="1px solid"
          borderColor="gray.75"
        >
          <Box minW="0">
            {title && (
              <Heading as="h3" textStyle="h4" color="gray.500">
                {title}
              </Heading>
            )}
            {description && (
              <Text textStyle="tiny-regular" color="gray.200" mt="0.5">
                {description}
              </Text>
            )}
          </Box>
          {actions && (
            <Flex gap="2" wrap="wrap" flexShrink={0}>
              {actions}
            </Flex>
          )}
        </Flex>
      )}
      <Box p={flush ? 0 : { base: "4", md: "5" }}>{children}</Box>
    </Box>
  );
}
