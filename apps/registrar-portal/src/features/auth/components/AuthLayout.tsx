import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { Logo } from "@repo/ui/elements";
import { BellIcon, CheckCircleIcon, ZapIcon } from "@repo/ui/icons";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

const POINTS = [
  {
    icon: <ZapIcon />,
    text: "Post a courtroom's status in one tap — from any phone browser.",
  },
  {
    icon: <BellIcon />,
    text: "Every counsel following the court gets it by SMS and WhatsApp within seconds.",
  },
  {
    icon: <CheckCircleIcon />,
    text: "Run the cause list, call matters and give new dates without a queue at the registry.",
  },
];

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <Flex minH="100dvh" bg="surface">
      <Flex
        display={{ base: "none", lg: "flex" }}
        flex="1"
        maxW="40rem"
        bg="primary.300"
        color="white"
        direction="column"
        justify="space-between"
        p="12"
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          right="-6rem"
          bottom="-6rem"
          boxSize="22rem"
          rounded="full"
          border="40px solid"
          borderColor="whiteAlpha.100"
        />
        <Logo color="light" />
        <Box maxW="28rem" position="relative">
          <Text
            textStyle="tiny-semibold"
            color="secondary.100"
            textTransform="uppercase"
            letterSpacing="0.08em"
            mb="3"
          >
            Registrar portal
          </Text>
          <Heading textStyle="h1" color="white" mb="6">
            No more paper notices on the courtroom door.
          </Heading>
          <Stack gap="4">
            {POINTS.map((p) => (
              <Flex key={p.text} gap="3" align="flex-start" color="primary.50">
                <Flex
                  boxSize="8"
                  rounded="md"
                  bg="whiteAlpha.200"
                  align="center"
                  justify="center"
                  flexShrink={0}
                  color="secondary.100"
                >
                  {p.icon}
                </Flex>
                <Text textStyle="small-regular" pt="1">
                  {p.text}
                </Text>
              </Flex>
            ))}
          </Stack>
        </Box>
        <Text textStyle="tiny-regular" color="primary.100">
          Lagos State pilot
        </Text>
      </Flex>

      <Flex
        flex="1"
        align="center"
        justify="center"
        p={{ base: "5", md: "10" }}
      >
        <Box w="full" maxW="27rem">
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
