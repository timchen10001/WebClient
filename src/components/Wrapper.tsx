import { Box } from "@chakra-ui/react";
import React from "react";

export type WrapperVariant = "PC" | "tablet" | "mobile";

interface WrapperProps {
  variant?: WrapperVariant;
}

export const Wrapper: React.FC<WrapperProps> = ({
  variant = "PC",
  children,
}) => {
  let maxW: string;
  switch(variant) {
    case "PC":
      maxW = "800px";
      break;
    case "tablet":
      maxW = "600px";
      break;
    case "mobile":
      maxW = "450px";
      break;
  }
  return (
    <Box
      mt={8}
      mx="auto"
      maxWidth={maxW}
      w="100%"
    >
      {children}
    </Box>
  );
};
