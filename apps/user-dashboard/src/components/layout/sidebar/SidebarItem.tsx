import { Box, Flex, Text } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import type { SidebarItem as SidebarItemType } from "./sidebar-config";

interface SidebarItemProps {
  item: SidebarItemType;
  onNavigate?: () => void;
}

function matchesPattern(pathname: string, pattern: string) {
  // "/dock/:courtroomId" -> /^\/dock\/[^/]+($|\/)/
  const re = new RegExp(`^${pattern.replace(/:[^/]+/g, "[^/]+")}($|/)`);
  return re.test(pathname);
}

export default function SidebarItem({ item, onNavigate }: SidebarItemProps) {
  const { pathname } = useLocation();

  const isActive =
    pathname === item.path ||
    (item.path !== "/" && pathname.startsWith(`${item.path}/`)) ||
    Boolean(item.activePaths?.some((p) => matchesPattern(pathname, p)));

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
        py="2.5"
        px="3"
        rounded="md"
        textStyle="small-medium"
        color={isActive ? "white" : "gray.300"}
        bg={isActive ? "primary.300" : "transparent"}
        _hover={{ bg: isActive ? "primary.300" : "gray.50" }}
        transition="all 0.15s"
      >
        <Box fontSize="lg" flexShrink={0} display="flex">
          {item.icon}
        </Box>
        <Text flex="1" truncate>
          {item.label}
        </Text>
      </Flex>
    </Link>
  );
}
