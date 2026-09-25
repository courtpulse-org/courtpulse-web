import { Box, Flex, Text } from "@chakra-ui/react";
import { MessageIcon } from "@repo/ui/icons";

/** What counsel will actually receive, shown before the registrar sends it. */
export function MessagePreview({
  message,
  label = "Message preview",
}: {
  message: string;
  label?: string;
}) {
  return (
    <Box
      bg="gray.50"
      border="1px dashed"
      borderColor="gray.100"
      rounded="md"
      p="3"
    >
      <Flex align="center" gap="1.5" mb="2" color="gray.200">
        <MessageIcon />
        <Text
          textStyle="tiny-semibold"
          textTransform="uppercase"
          letterSpacing="0.04em"
        >
          {label}
        </Text>
      </Flex>
      <Box
        bg="white"
        rounded="md"
        roundedTopLeft="xs"
        px="3"
        py="2"
        boxShadow="sm"
        maxW="28rem"
      >
        <Text textStyle="small-regular" color="gray.500" whiteSpace="pre-wrap">
          <Text as="span" fontWeight="700">
            CourtPulse:{" "}
          </Text>
          {message}
        </Text>
      </Box>
    </Box>
  );
}
