import { Box, Flex, Heading, Text, type FlexProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface PageHeaderProps extends FlexProps {
  title: string;
  description?: string;
  /** Right-aligned actions — usually one primary button. */
  actions?: ReactNode;
}

export function PageHeader({
  title,
  description,
  actions,
  ...props
}: PageHeaderProps) {
  return (
    <Flex
      justify="space-between"
      align={{ base: "flex-start", md: "center" }}
      direction={{ base: "column", md: "row" }}
      gap="3"
      mb="6"
      {...props}
    >
      <Box>
        <Heading textStyle="h2" color="gray.500">
          {title}
        </Heading>
        {description && (
          <Text textStyle="small-regular" color="gray.200" mt="1">
            {description}
          </Text>
        )}
      </Box>
      {actions && (
        <Flex gap="2" flexShrink={0}>
          {actions}
        </Flex>
      )}
    </Flex>
  );
}
