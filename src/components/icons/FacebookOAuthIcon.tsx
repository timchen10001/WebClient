import React from "react";
import NextLink from "next/link";
import { Button, Img } from "@chakra-ui/react";

interface FacebookOAuthIconProps {}

export const FacebookOAuthIcon: React.FC<FacebookOAuthIconProps> = ({}) => {
  return (
    <NextLink href={`${process.env.NEXT_PUBLIC_OAUTH_URL}/facebook`}>
      <Button
        variant="unstyled"
        flex={1}
        maxWidth="fit-content"
        _focus={{ border: "none" }}
      >
        <Img
          boxSize="9"
          alt="Facebook 登入"
          title="使用 Facebook 登入 anotherbush.com"
          src={
            "https://res.cloudinary.com/dunc6xvuh/image/upload/v1614946075/material/facebook_1_j2etka.png"
          }
        />
      </Button>
    </NextLink>
  );
};
