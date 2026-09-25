import { Flex, Text, type FlexProps } from "@chakra-ui/react";

interface LogoProps extends FlexProps {
  /** Shown as a small tag next to the wordmark, e.g. "Registrar". */
  tag?: string;
  color?: "dark" | "light";
}

/**
 * Wordmark: a pulse-line glyph in brass beside "CourtPulse" in the serif.
 * Inline SVG so both apps share it without an asset pipeline.
 */
export function Logo({ tag, color = "dark", ...props }: LogoProps) {
  const ink = color === "dark" ? "primary.300" : "white";
  return (
    <Flex align="center" gap="2" {...props}>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
        <rect width="28" height="28" rx="7" fill="#1F3A66" />
        <path
          d="M4 15h5l2-6 4 12 3-9 2 3h4"
          stroke="#D2AB46"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <Text
        fontFamily="serif"
        fontWeight="semibold"
        fontSize="lg"
        letterSpacing="-0.02em"
        color={ink}
        lineHeight="1"
      >
        CourtPulse
      </Text>
      {tag && (
        <Text
          textStyle="tiny-semibold"
          color="secondary.400"
          bg="secondary.50"
          px="1.5"
          py="0.5"
          rounded="sm"
          textTransform="uppercase"
          letterSpacing="0.04em"
        >
          {tag}
        </Text>
      )}
    </Flex>
  );
}
