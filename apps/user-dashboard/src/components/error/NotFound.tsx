import { Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <Flex h="100dvh" w="full" justify="center" align="center" bg="surface">
      <VStack textAlign="center" gap="3" p="6">
        <Text textStyle="mono" color="secondary.300">
          404
        </Text>
        <Heading textStyle="h2">Page not found</Heading>
        <Text color="gray.200" textStyle="small-regular">
          The page you're looking for doesn't exist or has moved.
        </Text>
        <Button asChild mt="2">
          <Link to="/">Return home</Link>
        </Button>
      </VStack>
    </Flex>
  );
};
