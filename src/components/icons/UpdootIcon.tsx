import { Flex, Image, Text } from "@chakra-ui/react";
import React from "react";
import { Maybe } from "../../generated/graphql";
import { RWDVariant } from "../../hooks/useRWD";

interface UpdootIconProps {
  device: RWDVariant;
  voteStatus: Maybe<number> | undefined;
}

export const UpdootIcon: React.FC<UpdootIconProps> = ({
  device,
  voteStatus,
}) => {
  const isMobile = device === "mobile";
  return (
    <Flex alignItems="center" justifyContent="cneter">
      <Image
        maxW={isMobile ? "20px" : "24px"}
        alt=""
        src={
          voteStatus === 1
            ? "https://res.cloudinary.com/dunc6xvuh/image/upload/v1615707123/material/like_2_rdze4o.png"
            : "https://res.cloudinary.com/dunc6xvuh/image/upload/v1615707130/material/like_3_l8aqg5.png"
        }
      />
      &nbsp; &nbsp;
      <Text as="span" fontSize={isMobile ? "16px" : "19px"}>
        讚
      </Text>
    </Flex>
  );
};
