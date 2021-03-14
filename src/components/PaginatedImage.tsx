import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Flex, Img } from "@chakra-ui/react";
import React, { useState } from "react";
import useRWD from "../hooks/useRWD";

interface PaginatedImageProps {
  images: string;
}

export const PaginatedImage: React.FC<PaginatedImageProps> = ({ images }) => {
  const device = useRWD();
  const imagesUrls = images.split("&");
  const maxLength = imagesUrls.length - 1;
  const [selectImageIndex, setSelectimageIndex] = useState(0);
  return (
    <Flex
      mt={4}
      minW="100%"
      position="relative"
      alignItems="center"
      justifyContent="center"
      minH={device === "PC" ? "480px" : "300px"}
    >
      {maxLength === 1 ? null : (
        <Box
          left={0}
          top={0}
          h="full"
          w="50%"
          position="absolute"
          _focus={{ border: "none" }}
          cursor={device !== "PC" ? "none" : "pointer"}
          onClick={() =>
            setSelectimageIndex(
              selectImageIndex === 0 ? maxLength - 1 : selectImageIndex - 1
            )
          }
        >
          <ChevronLeftIcon
            left={0}
            top="50%"
            opacity="50%"
            fontSize="2xl"
            position="absolute"
          />
        </Box>
      )}
      {imagesUrls.map((src, index) => (
        <Img
          borderRadius="md"
          maxHeight={device === "PC" ? "480px" : "420px"}
          key={`image-${index}`}
          src={src}
          hidden={index !== selectImageIndex}
        />
      ))}
      {maxLength === 1 ? null : (
        <Box
          top={0}
          right={0}
          h="full"
          w="50%"
          position="absolute"
          _focus={{ border: "none" }}
          cursor={device !== "PC" ? "none" : "pointer"}
          onClick={() =>
            setSelectimageIndex(
              selectImageIndex + 1 === maxLength ? 0 : selectImageIndex + 1
            )
          }
        >
          <ChevronRightIcon
            right={0}
            top="50%"
            opacity="50%"
            fontSize="2xl"
            position="absolute"
          />
        </Box>
      )}
    </Flex>
  );
};
