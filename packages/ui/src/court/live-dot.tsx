import { Box, type BoxProps } from "@chakra-ui/react";

/** A dot with an expanding ring — marks a status that is live/verified. */
export function LiveDot({ colorPalette = "success", ...props }: BoxProps) {
  return (
    <Box
      position="relative"
      boxSize="0.5rem"
      flexShrink={0}
      colorPalette={colorPalette}
      {...props}
    >
      <Box
        position="absolute"
        inset="0"
        rounded="full"
        bg="colorPalette.solid"
        animation="pulseRing 1.8s ease-out infinite"
      />
      <Box
        position="absolute"
        inset="0"
        rounded="full"
        bg="colorPalette.solid"
      />
    </Box>
  );
}
