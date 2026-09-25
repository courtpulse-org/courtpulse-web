import { Badge, Box, Flex, Menu, Portal, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@repo/ui/elements";
import {
  CaretDownIcon,
  GearIcon,
  HamburgerIcon,
  SignOutIcon,
} from "@repo/ui/icons";
import { formatCourtTime, formatLongDate, getInitials } from "@repo/utils";
import { useAuth, useCurrentUser } from "@/hooks";
import { RouteConstants } from "@/shared/constants/routes";

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

export default function Header({
  onMenuToggle,
}: {
  onMenuToggle?: () => void;
}) {
  const { userData, fullName, isAdmin } = useCurrentUser();
  const { logout } = useAuth();
  const now = useClock();

  return (
    <Flex
      as="header"
      align="center"
      h="64px"
      px={{ base: "4", md: "6" }}
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.75"
      gap="3"
      flexShrink={0}
    >
      <Box
        as="button"
        display={{ base: "flex", lg: "none" }}
        alignItems="center"
        justifyContent="center"
        boxSize="10"
        rounded="md"
        border="1px solid"
        borderColor="gray.75"
        color="gray.400"
        _hover={{ bg: "gray.50" }}
        onClick={onMenuToggle}
        aria-label="Open menu"
        fontSize="lg"
      >
        <HamburgerIcon />
      </Box>
      <Box display={{ base: "block", lg: "none" }}>
        <Logo />
      </Box>

      <Flex
        display={{ base: "none", md: "flex" }}
        align="center"
        gap="2"
        color="gray.300"
        textStyle="small-medium"
      >
        <Text>{formatLongDate(now)}</Text>
        <Text color="gray.100">·</Text>
        <Text textStyle="mono" fontSize="sm">
          {formatCourtTime(now)} WAT
        </Text>
      </Flex>

      <Flex align="center" gap="3" ml="auto">
        {isAdmin && (
          <Badge
            colorPalette="secondary"
            variant="subtle"
            rounded="full"
            display={{ base: "none", sm: "inline-flex" }}
          >
            Admin
          </Badge>
        )}
        <Menu.Root positioning={{ placement: "bottom-end" }}>
          <Menu.Trigger asChild>
            <Flex as="button" align="center" gap="2" cursor="pointer">
              <Flex
                boxSize="9"
                rounded="full"
                bg="primary.300"
                color="white"
                align="center"
                justify="center"
                textStyle="tiny-semibold"
              >
                {getInitials(userData?.first_name, userData?.last_name)}
              </Flex>
              <CaretDownIcon
                color="gray.300"
                display={{ base: "none", sm: "block" }}
              />
            </Flex>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content minW="230px">
                <Box px="3" py="2">
                  <Text textStyle="small-semibold">{fullName}</Text>
                  <Text textStyle="tiny-regular" color="gray.200" truncate>
                    {userData?.email}
                  </Text>
                </Box>
                <Menu.Separator />
                <Menu.Item value="settings" asChild>
                  <Link to={RouteConstants.settings.base.path}>
                    <GearIcon /> Settings
                  </Link>
                </Menu.Item>
                <Menu.Item
                  value="logout"
                  color="error.300"
                  onClick={() => logout()}
                >
                  <SignOutIcon /> Sign out
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Flex>
    </Flex>
  );
}
