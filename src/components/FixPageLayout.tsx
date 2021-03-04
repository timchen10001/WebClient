import { Box, Flex, Heading, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { Footer } from "./Footer";
import { Wrapper, WrapperVariant } from "./Wrapper";

interface FixPageLayoutProps {
  variant: WrapperVariant;
}

export const FixPageLayout: React.FC<FixPageLayoutProps> = ({
  variant,
  children,
}) => {
  return (
    <Box bgColor="#e5e6ea" minHeight="100vh">
      <Box
        position={"sticky"}
        zIndex={1}
        bgColor="Highlight"
        p={6}
        borderBottomRadius="lg"
        boxShadow="md"
      >
        <Flex flex={1} m="auto" maxWidth={800}>
          <NextLink href="/">
            <Link _hover={{ border: "none" }}>
              <Heading fontFamily="serif">anotherbush</Heading>
            </Link>
          </NextLink>
        </Flex>
      </Box>
      <Wrapper variant={variant}>{children}</Wrapper>
      <Box mt={6}>
        <Footer />
      </Box>
    </Box>
  );
};
