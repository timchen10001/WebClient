import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import NextLink from "next/link";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data }] = useMeQuery({ pause: isServer() });

  let body = null;

  if (!data?.me) {
    body = (
      <>
        <Box>
          <NextLink href="/login">
            <Link>登入</Link>
          </NextLink>
        </Box>
        <Box ml={2}>
          <NextLink href="/register">
            <Link>註冊</Link>
          </NextLink>
        </Box>
      </>
    );
  } else {
    body = (
      <>
        <Box>嗨，{data.me.username} !</Box>
        <Button
          ml={2}
          isLoading={logoutFetching}
          onClick={async () => await logout()}
          colorScheme="messenger"
          type="button"
          variant="link"
        >
          登出
        </Button>
      </>
    );
  }

  return (
    <Flex bg="messenger.500" position="sticky" top="0" zIndex="1" p={4}>
      <Box ml="auto">
        <Flex>{body}</Flex>
      </Box>
    </Flex>
  );
};
