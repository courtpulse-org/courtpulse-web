import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { Logo } from "@repo/ui/elements";
import { useCurrentUser } from "@/hooks";
import SidebarItem from "./SidebarItem";
import { adminItems, registrarItems, settingsNavItem } from "./sidebar-config";

function SectionLabel({ children }: { children: string }) {
  return (
    <Text
      textStyle="tiny-semibold"
      color="gray.200"
      textTransform="uppercase"
      letterSpacing="0.06em"
      px="3"
      pt="4"
      pb="1"
    >
      {children}
    </Text>
  );
}

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { isAdmin } = useCurrentUser();

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
        <Logo tag={isAdmin ? "Admin" : "Registrar"} />
      </Flex>

      <Stack as="nav" gap="1" flex="1" overflowY="auto" px="3" py="4">
        {registrarItems.map((item) => (
          <SidebarItem key={item.path} item={item} onNavigate={onNavigate} />
        ))}
        {isAdmin && (
          <>
            <SectionLabel>System admin</SectionLabel>
            {adminItems.map((item) => (
              <SidebarItem
                key={item.path}
                item={item}
                onNavigate={onNavigate}
              />
            ))}
          </>
        )}
      </Stack>

      <Box px="3" py="4" borderTop="1px solid" borderColor="gray.75">
        <SidebarItem item={settingsNavItem} onNavigate={onNavigate} />
      </Box>
    </Flex>
  );
}
