import { Box, Flex, Text } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import type { SidebarItem as SidebarItemType } from "./sidebar-config";

interface SidebarItemProps {
  item: SidebarItemType;
  badge?: number;
  onNavigate?: () => void;
}

function matchesPattern(pathname: string, pattern: string) {
  const re = new RegExp(`^${pattern.replace(/:[^/]+/g, "[^/]+")}($|/)`);
  return re.test(pathname);
}

export function isItemActive(pathname: string, item: SidebarItemType) {
  if (item.exact) return pathname === item.path;
  return (
    pathname === item.path ||
    pathname.startsWith(`${item.path}/`) ||
    Boolean(item.activePaths?.some((p) => matchesPattern(pathname, p)))
  );
}

export default function SidebarItem({
  item,
  badge,
  onNavigate,
}: SidebarItemProps) {
  const { pathname } = useLocation();
  const isActive = isItemActive(pathname, item);

  return (
    <Link
      to={item.path}
      style={{ textDecoration: "none" }}
      onClick={onNavigate}
    >
      <Flex
        align="center"
        gap="3"
        w="full"
        h="10"
        px="3"
        rounded="md"
        position="relative"
        textStyle="small-medium"
        color={isActive ? "primary.300" : "gray.300"}
        bg={isActive ? "primary.25" : "transparent"}
        fontWeight={isActive ? "600" : "500"}
        _hover={{
          bg: isActive ? "primary.25" : "gray.50",
          color: isActive ? "primary.300" : "gray.500",
        }}
        transition="all 0.12s"
      >
        {isActive && (
          <Box
            position="absolute"
            left="-3"
            top="2"
            bottom="2"
            w="3px"
            roundedRight="full"
            bg="primary.300"
          />
        )}
        <Flex
          fontSize="lg"
          flexShrink={0}
          color={isActive ? "primary.300" : "gray.200"}
        >
          {item.icon}
        </Flex>
        <Text flex="1" truncate>
          {item.label}
        </Text>
        {badge ? (
          <Flex
            minW="5"
            h="5"
            px="1.5"
            rounded="full"
            align="center"
            justify="center"
            bg={item.badge === "unposted" ? "warning.100" : "secondary.300"}
            color={item.badge === "unposted" ? "warning.800" : "white"}
            textStyle="tiny-semibold"
            fontSize="0.6875rem"
          >
            {badge}
          </Flex>
        ) : null}
      </Flex>
    </Link>
  );
}
