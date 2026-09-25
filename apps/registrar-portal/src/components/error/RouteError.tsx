import { Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useRouteError } from "react-router-dom";
import { Loader } from "@repo/ui/elements";
import { isChunkLoadError, reloadForNewDeploy } from "@/utils/chunk-reload";

export const RouteError = () => {
  const error: any = useRouteError();

  // Decide during render so the error UI never flashes before a reload.
  const [isStale] = useState(
    () =>
      isChunkLoadError(error?.statusText) || isChunkLoadError(error?.message),
  );
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (isStale && !reloadForNewDeploy()) setShowError(true);
  }, [isStale]);

  if (isStale && !showError) return <Loader full />;

  return (
    <Flex h="100dvh" w="full" justify="center" align="center" bg="surface">
      <VStack textAlign="center" gap="3" p="6">
        <Heading textStyle="h2">Something went wrong</Heading>
        <Text color="gray.200" textStyle="small-regular">
          {error?.statusText ||
            error?.message ||
            "An unexpected error occurred."}
        </Text>
        <Button asChild mt="2">
          <Link to="/">Return home</Link>
        </Button>
      </VStack>
    </Flex>
  );
};
