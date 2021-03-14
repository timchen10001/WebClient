import React from "react";
import NextLink from "next/link";
import { Button, Img } from "@chakra-ui/react";

interface GoogleOAuthIconProps {}

export const GoogleOAuthIcon: React.FC<GoogleOAuthIconProps> = ({}) => {
  return (
    <NextLink href={`${process.env.NEXT_PUBLIC_OAUTH_URL}/google`}>
      <Button
        variant="unstyled"
        maxWidth="fit-content"
        flex={1}
        _focus={{ border: "none" }}
      >
        <Img
          boxSize="9"
          alt="Google 登入"
          title="使用 Google 登入 anotherbush.com"
          src={
            "https://res.cloudinary.com/dunc6xvuh/image/upload/v1614944830/material/google-symbol_acleoo.png"
          }
        />
      </Button>
    </NextLink>
  );
};
