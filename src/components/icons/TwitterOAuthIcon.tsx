import { Button, Img } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";

interface TwitterOAuthIconProps {}

export const TwitterOAuthIcon: React.FC<TwitterOAuthIconProps> = ({}) => {
  return (
    <NextLink href={`${process.env.NEXT_PUBLIC_OAUTH_URL}/twitter`}>
      <Button
        variant="unstyled"
        flex={1}
        maxWidth="fit-content"
        _focus={{ border: "none" }}
      >
        <Img
          boxSize="9"
          alt="Twitter 登入"
          title="使用 Twitter 登入 anotherbush.com"
          src={
            "https://res.cloudinary.com/dunc6xvuh/image/upload/v1614946082/material/twitter_jrdxsw.png"
          }
        />
      </Button>
    </NextLink>
  );
};
