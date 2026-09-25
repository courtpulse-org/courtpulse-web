import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { Logo } from "@repo/ui/elements";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/** Centered card with a navy brand panel on desktop; full-bleed on phones. */
export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <Flex minH="100dvh" bg="surface">
      <Flex
        display={{ base: "none", lg: "flex" }}
        flex="1"
        bg="primary.300"
        color="white"
        direction="column"
        justify="space-between"
        p="12"
      >
        <Logo color="light" tag="Registrar" />
        <Box maxW="28rem">
          <Heading textStyle="h1" color="white" mb="4">
            One tap tells every counsel in the division.
          </Heading>
          <Text color="primary.75" textStyle="default-regular">
            Post official sitting status, broadcast announcements and run the
            live order of business from any phone browser. No installs, no
            training.
          </Text>
        </Box>
        <Text textStyle="tiny-regular" color="primary.100">
          Lagos State pilot · Independent rollout
        </Text>
      </Flex>

      <Flex
        flex="1"
        align="center"
        justify="center"
        p={{ base: "5", md: "10" }}
      >
        <Box w="full" maxW="26rem">
          <Box display={{ base: "block", lg: "none" }} mb="8">
            <Logo />
          </Box>
          <Heading textStyle="h2" mb="2">
            {title}
          </Heading>
          {subtitle && (
            <Text textStyle="small-regular" color="gray.200" mb="8">
              {subtitle}
            </Text>
          )}
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}
