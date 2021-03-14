import { Image, Img } from '@chakra-ui/image';
import { Flex, Text } from '@chakra-ui/react';
import { Maybe } from 'graphql/jsutils/Maybe';
import React from 'react'
import { RWDVariant } from '../../hooks/useRWD';

interface DowndootIconProps {
    device: RWDVariant;
    voteStatus: Maybe<number> | undefined;
}

export const DowndootIcon: React.FC<DowndootIconProps> = ({
    device,
  voteStatus,
}) => {
    const isMobile = device === "mobile";
    return (
      <Flex alignItems="center" justifyContent="cneter">
        <Img
          style={{ imageRendering: "-moz-crisp-edges" }}
          maxW={isMobile ? "20px" : "24px"}
          alt=""
          src={
            voteStatus === -1
              ? "https://res.cloudinary.com/dunc6xvuh/image/upload/v1615707137/material/dislike_2_ulmofe.png"
              : "https://res.cloudinary.com/dunc6xvuh/image/upload/v1615707141/material/dislike_3_qfngs2.png"
          }
        />
        &nbsp; &nbsp;
        <Text as="span" fontSize={isMobile ? "16px" : "19px"}>
          噓
        </Text>
      </Flex>
    );
  };
  