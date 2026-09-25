import { Box, type BoxProps } from "@chakra-ui/react";

/** White card on the page surface — the default container for any section. */
export function SurfaceCard(props: BoxProps) {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.75"
      rounded="lg"
      p={{ base: "4", md: "5" }}
      {...props}
    />
  );
}
