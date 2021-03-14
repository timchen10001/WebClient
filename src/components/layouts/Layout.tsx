import { Box } from "@chakra-ui/react";
import React from "react";
import { Footer } from "../Footer";
import { NavBar } from "../NavBar";
import { Wrapper } from "../Wrapper";
import useRWD from "../../hooks/useRWD";

interface LayoutProps {}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const device = useRWD();
  return (
    <Box minHeight="100vh">
      <NavBar />
      <Wrapper variant={device}>{children}</Wrapper>
      <Box mt={6}>
        <Footer />
      </Box>
    </Box>
  );
};
