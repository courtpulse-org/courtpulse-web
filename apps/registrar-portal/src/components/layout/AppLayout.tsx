import { Box, Flex } from "@chakra-ui/react";
import { SectionLoader } from "@repo/ui/elements";
import { Suspense, useState, type ReactNode } from "react";
import Header from "./header/Header";
import MobileTabBar from "./MobileTabBar";
import MobileSidebar from "./sidebar/MobileSidebar";
import Sidebar from "./sidebar/Sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Flex h="100dvh" overflow="hidden">
      <Box display={{ base: "none", lg: "block" }}>
        <Sidebar />
      </Box>
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <Flex direction="column" flex="1" minW="0">
        <Header onMenuToggle={() => setMobileOpen(true)} />
        <Box
          as="main"
          flex="1"
          overflowY="auto"
          css={{ overscrollBehaviorY: "contain" }}
          bg="surface"
        >
          <Box
            maxW="90rem"
            mx="auto"
            px={{ base: "4", md: "6", xl: "8" }}
            py={{ base: "5", md: "7" }}
          >
            <Suspense fallback={<SectionLoader />}>{children}</Suspense>
          </Box>
        </Box>
        <MobileTabBar />
      </Flex>
    </Flex>
  );
}
