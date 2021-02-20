import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

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
        <NextLink href="/create-post">
          <Button mr={4} bg="whiteAlpha.800">
            發布文章
          </Button>
        </NextLink>
        <Box fontWeight="600">{data.me.username}</Box>
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
    <Box bg="messenger.500" position="sticky" zIndex="1" top="0" p={4}>
      <Flex flex={1} m="auto" align="center" maxW={800}>
        <NextLink href="/">
          <Button colorScheme="none" variant="solid">
            <Heading size="lg">PortfolioMe</Heading>
          </Button>
        </NextLink>
        <Box ml="auto">
          <Flex align="center">{body}</Flex>
        </Box>
      </Flex>
    </Box>
  );
};
