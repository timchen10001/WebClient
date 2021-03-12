import { Box, Flex, Heading, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { Footer } from "../components/Footer";
import { Wrapper } from "../components/Wrapper";

interface FixPageLayoutProps {}

export const FixPageLayout: React.FC<FixPageLayoutProps> = ({ children }) => {
  return (
    <Box minHeight="100vh">
      <Box
        p={6}
        top={0}
        zIndex={1}
        boxShadow="md"
        position={"sticky"}
        bgColor="#9EC9F7"
        borderBottomRadius="lg"
      >
        <Flex flex={1} m="auto" maxWidth={800}>
          <NextLink href="/">
            <Link _hover={{ border: "none" }}>
              <Heading fontFamily="serif">anotherbush</Heading>
            </Link>
          </NextLink>
        </Flex>
      </Box>
      <Wrapper variant="mobile">{children}</Wrapper>
      <Box mt={6}>
        <Footer />
      </Box>
    </Box>
  );
};
