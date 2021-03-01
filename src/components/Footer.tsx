import { Box, Flex, Link } from "@chakra-ui/react";
import React from "react";

interface FooterProps {}

export const Footer: React.FC<FooterProps> = ({}) => {
  return (
    <Flex justifyContent="center" pb={12}>
      <Box m="auto">
        © Powered by{" "}
        <Link as="a" href="https://github.com/timchen10001" textDecoration="underline">
          Tim Chen
        </Link>
      </Box>
    </Flex>
  );
};
