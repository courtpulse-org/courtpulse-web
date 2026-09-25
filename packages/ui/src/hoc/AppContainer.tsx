import { Container, type ContainerProps } from "@chakra-ui/react";

/** Page-width wrapper used by every dashboard/portal screen. */
export function AppContainer(props: ContainerProps) {
  return (
    <Container
      px={{ base: "1rem", md: "2rem" }}
      maxW="75rem"
      mx="auto"
      {...props}
    />
  );
}
