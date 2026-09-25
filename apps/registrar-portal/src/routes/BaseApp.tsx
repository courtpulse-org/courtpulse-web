import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

export const BaseApp = () => {
  return (
    <Box minH="100dvh">
      <Outlet />
    </Box>
  );
};
