import { Box } from "@chakra-ui/react";
import React from "react";
import { Footer } from "./Footer";
import { NavBar } from "./NavBar";
import { Wrapper, WrapperVariant } from "./Wrapper";

interface LayoutProps {
  variant?: WrapperVariant;
}

export const Layout: React.FC<LayoutProps> = ({
  variant = "regular",
  children,
}) => {
  return (
    <Box bgColor="#e5e6ea" minHeight="100vh">
      <NavBar />
      <Wrapper variant={variant}>{children}</Wrapper>
      <Box mt={6}>
        <Footer />
      </Box>
    </Box>
  );
};
