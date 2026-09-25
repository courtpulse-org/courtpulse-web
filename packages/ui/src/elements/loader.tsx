import { Center, Spinner, type SpinnerProps } from "@chakra-ui/react";

export function Loader({
  full = false,
  spinnerProps,
}: {
  full?: boolean;
  spinnerProps?: SpinnerProps;
}) {
  return (
    <Center h={full ? "100dvh" : "100%"} w="100%">
      <Spinner size="xl" color="primary.solid" {...spinnerProps} />
    </Center>
  );
}
