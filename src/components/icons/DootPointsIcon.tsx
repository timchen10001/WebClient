import { Flex, Img, Text } from "@chakra-ui/react";
import { Maybe } from "graphql/jsutils/Maybe";
import React from "react";
import { RWDVariant } from "../../hooks/useRWD";

interface DootPointsIconProps {
  device: RWDVariant;
  points: Maybe<number> | undefined;
}

export const DootPointsIcon: React.FC<DootPointsIconProps> = ({
  device,
  points,
}) => {
  const isMobile = device === "mobile";
  const disPlayScore = typeof points === "number" && points > 0;
  return (
    <Flex alignItems="center" justifyContent="cneter">
      <Img
        maxW={isMobile ? "16px" : "24px"}
        alt=""
        src={
          disPlayScore
            ? "https://res.cloudinary.com/dunc6xvuh/image/upload/v1615724850/material/star_1_qycv6v.png"
            : "https://res.cloudinary.com/dunc6xvuh/image/upload/v1615724853/material/star_zsb42c.png"
        }
      />
      &nbsp; &nbsp;
      <Text as="span" fontSize={isMobile ? "16px" : "19px"}>
        {disPlayScore ? `${points} 分` : "-"}
      </Text>
    </Flex>
  );
};
