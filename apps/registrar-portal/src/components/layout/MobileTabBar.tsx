import { Box, Flex, Text } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { isItemActive } from "./sidebar/SidebarItem";
import { mobileTabs } from "./sidebar/sidebar-config";
import { useNavBadges } from "./sidebar/useNavBadges";

/** Thumb-reach navigation on phones — the registrar is often standing in court. */
export default function MobileTabBar() {
  const { pathname } = useLocation();
  const badges = useNavBadges();
  return (
    <Flex
      as="nav"
      display={{ base: "flex", lg: "none" }}
      bg="white"
      borderTop="1px solid"
      borderColor="gray.75"
      pb="env(safe-area-inset-bottom)"
      flexShrink={0}
    >
      {mobileTabs.map((item) => {
        const active = isItemActive(pathname, item);
        const count = item.badge ? badges[item.badge] : 0;
        return (
          <Link key={item.path} to={item.path} style={{ flex: 1 }}>
            <Flex
              direction="column"
              align="center"
              gap="0.5"
              py="2"
              color={active ? "primary.300" : "gray.200"}
              position="relative"
            >
              <Box fontSize="xl" position="relative">
                {item.icon}
                {count > 0 && (
                  <Box
                    position="absolute"
                    top="-1"
                    right="-2"
                    minW="4"
                    h="4"
                    px="1"
                    rounded="full"
                    bg="secondary.300"
                    color="white"
                    fontSize="0.625rem"
                    fontWeight="700"
                    textAlign="center"
                    lineHeight="1rem"
                  >
                    {count}
                  </Box>
                )}
              </Box>
              <Text fontSize="0.6875rem" fontWeight={active ? "600" : "500"}>
                {item.label}
              </Text>
            </Flex>
          </Link>
        );
      })}
    </Flex>
  );
}
