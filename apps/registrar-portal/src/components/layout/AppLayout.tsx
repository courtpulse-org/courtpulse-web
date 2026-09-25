import { Box, Flex } from "@chakra-ui/react";
import { SectionLoader } from "@repo/ui/elements";
import { Suspense, useState, type ReactNode } from "react";
import Sidebar from "./sidebar/Sidebar";
import MobileSidebar from "./sidebar/MobileSidebar";
import Header from "./header/Header";

export default function AppLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Flex direction="column" h="100dvh" overflow="hidden">
      <Flex flex="1" minH="0" overflow="hidden">
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
            p={{ base: "4", md: "6" }}
            bg="surface"
          >
            <Suspense fallback={<SectionLoader />}>{children}</Suspense>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
}
