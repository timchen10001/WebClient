import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Heading, IconButton, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { MessengerControll } from "./MessengerControll";

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
            <Link fontFamily={"sans-serif"}>登入</Link>
          </NextLink>
        </Box>
        <Box ml={2} mr={4}>
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
          <IconButton
            // bg="whitesmoke"
            bg={"none"}
            _focus={{ border: "none" }}
            _hover={{ bgColor: "none" }}
            aria-label="新增貼文"
            icon={<AddIcon />}
          />
        </NextLink>
        <MessengerControll />
        <Box ml={2} fontWeight="600">
          {data.me.username}
        </Box>
        <Button
          ml={2}
          mr={4}
          isLoading={logoutFetching}
          onClick={async () => await logout()}
          colorScheme="black"
          type="button"
          variant="link"
          fontSize="sm"
        >
          登出
        </Button>
      </>
    );
  }

  return (
    <Box
      bg={"#9ec9f7"}
      position="sticky"
      zIndex="1"
      top="0"
      px={1.2}
      py={3}
      borderBottomRadius="lg"
      boxShadow="md"
    >
      <Flex flex={1} m="auto" align="center" maxW={800}>
        <NextLink href="/">
          <Button
            colorScheme="none"
            variant="solid"
            _focus={{ border: "none" }}
          >
            <Heading size="lg" fontFamily={"serif"} color="black">
              anotherbush
            </Heading>
          </Button>
        </NextLink>
        <Box ml="auto">
          <Flex align="center">{body}</Flex>
        </Box>
      </Flex>
    </Box>
  );
};
