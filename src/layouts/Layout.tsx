import { Box } from "@chakra-ui/react";
import React from "react";
import { Footer } from "../components/Footer";
import { NavBar } from "../components/NavBar";
import { Wrapper } from "../components/Wrapper";
import useRWD from "../hooks/useRWD";

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
