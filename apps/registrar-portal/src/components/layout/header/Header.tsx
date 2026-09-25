import { Box, Flex, Menu, Portal, Text } from "@chakra-ui/react";
import { CaretDownIcon, HamburgerIcon, SignOutIcon } from "@repo/ui/icons";
import { getInitials } from "@repo/utils";
import { useAuth, useCurrentUser } from "@/hooks";

interface HeaderProps {
  onMenuToggle?: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const { userData, fullName } = useCurrentUser();
  const { logout } = useAuth();

  return (
    <Flex
      as="header"
      align="center"
      h="64px"
      px={{ base: "4", md: "6" }}
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.75"
      gap="4"
      flexShrink={0}
    >
      <Box
        as="button"
        display={{ base: "flex", lg: "none" }}
        alignItems="center"
        justifyContent="center"
        w="40px"
        h="40px"
        rounded="md"
        border="1px solid"
        borderColor="gray.75"
        color="gray.400"
        _hover={{ bg: "gray.50" }}
        onClick={onMenuToggle}
        aria-label="Open menu"
      >
        <HamburgerIcon boxSize="5" />
      </Box>

      <Flex align="center" gap="3" ml="auto">
        <Menu.Root>
          <Menu.Trigger asChild>
            <Flex as="button" align="center" gap="2" cursor="pointer">
              <Flex
                boxSize="9"
                rounded="full"
                bg="secondary.50"
                color="secondary.400"
                align="center"
                justify="center"
                textStyle="tiny-semibold"
              >
                {getInitials(userData?.first_name, userData?.last_name)}
              </Flex>
              <CaretDownIcon boxSize="4" color="gray.300" />
            </Flex>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content minW="220px">
                <Box px="3" py="2">
                  <Text textStyle="small-semibold">{fullName}</Text>
                  <Text textStyle="tiny-regular" color="gray.200" truncate>
                    {userData?.email}
                  </Text>
                </Box>
                <Menu.Separator />
                <Menu.Item
                  value="logout"
                  color="error.300"
                  onClick={() => logout()}
                >
                  <SignOutIcon boxSize="4" /> Sign out
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Flex>
    </Flex>
  );
}
