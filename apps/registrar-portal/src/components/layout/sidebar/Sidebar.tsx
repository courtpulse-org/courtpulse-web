import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { Logo } from "@repo/ui/elements";
import { getInitials } from "@repo/utils";
import { useCurrentUser } from "@/hooks";
import SidebarItem from "./SidebarItem";
import { adminItems, registrarItems, settingsNavItem } from "./sidebar-config";
import { useNavBadges } from "./useNavBadges";

function SectionLabel({ children }: { children: string }) {
  return (
    <Text
      textStyle="tiny-semibold"
      color="gray.200"
      textTransform="uppercase"
      letterSpacing="0.08em"
      px="3"
      pt="5"
      pb="1.5"
    >
      {children}
    </Text>
  );
}

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { isAdmin, userData, fullName } = useCurrentUser();
  const badges = useNavBadges();

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

      <Stack
        as="nav"
        gap="0.5"
        flex="1"
        overflowY="auto"
        px="3"
        py="3"
        className="custom-scroll-bar"
      >
        <SectionLabel>Registry</SectionLabel>
        {registrarItems.map((item) => (
          <SidebarItem
            key={item.path}
            item={item}
            badge={item.badge ? badges[item.badge] : undefined}
            onNavigate={onNavigate}
          />
        ))}
        {isAdmin && (
          <>
            <SectionLabel>Administration</SectionLabel>
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

      <Box px="3" py="3" borderTop="1px solid" borderColor="gray.75">
        <SidebarItem item={settingsNavItem} onNavigate={onNavigate} />
        <Flex align="center" gap="3" px="3" pt="3">
          <Flex
            boxSize="8"
            rounded="full"
            bg="secondary.50"
            color="secondary.400"
            align="center"
            justify="center"
            textStyle="tiny-semibold"
            flexShrink={0}
          >
            {getInitials(userData?.first_name, userData?.last_name)}
          </Flex>
          <Box minW="0">
            <Text textStyle="small-semibold" truncate>
              {fullName}
            </Text>
            <Text textStyle="tiny-regular" color="gray.200" truncate>
              {userData?.staff_title}
            </Text>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
