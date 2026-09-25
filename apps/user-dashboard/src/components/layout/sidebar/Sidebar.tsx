import { Box, Flex, Stack } from "@chakra-ui/react";
import { Logo } from "@repo/ui/elements";
import SidebarItem from "./SidebarItem";
import { sidebarItems, settingsNavItem } from "./sidebar-config";

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Flex
      as="aside"
      direction="column"
      w="16rem"
      minW="16rem"
      h="100dvh"
      bg="white"
      borderRight="1px solid"
      borderColor="gray.75"
    >
      <Flex
        align="center"
        px="6"
        h="64px"
        flexShrink={0}
        borderBottom="1px solid"
        borderColor="gray.75"
      >
        <Logo />
      </Flex>

      <Stack as="nav" gap="1" flex="1" overflowY="auto" px="3" py="4">
        {sidebarItems.map((item) => (
          <SidebarItem key={item.path} item={item} onNavigate={onNavigate} />
        ))}
      </Stack>

      <Box px="3" py="4" borderTop="1px solid" borderColor="gray.75">
        <SidebarItem item={settingsNavItem} onNavigate={onNavigate} />
      </Box>
    </Flex>
  );
}
