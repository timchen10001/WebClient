import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, IconButton, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { PostSnippetFragment, useMeQuery } from "../generated/graphql";

interface EditDeletePostSectionProps {
  post: PostSnippetFragment;
  onClick: () => void;
}

export const EditDeletePostSection: React.FC<EditDeletePostSectionProps> = ({
  post,
  onClick,
}) => {
  const { id, title, text, creator, textSnippet } = post;
  const [{ data: meQuery }] = useMeQuery();

  return (
    <Box flex={1}>
      <NextLink href="/post/[id]" as={`/post/${id}`}>
        <Link>
          <Heading fontSize="larger">{title}</Heading>
        </Link>
      </NextLink>
      <Text color="gray" fontSize="sm">
        posted by {creator?.username}
      </Text>
      <Flex align="center" mt={4}>
        <Text flex={1}>
          {textSnippet}
          {text.length > textSnippet.length ? " ... " : null}
        </Text>
        {meQuery?.me?.id !== creator?.id ? null : (
          <Flex align="center" ml="auto">
            <NextLink href="/edit/[id]" as={`/edit/${id}`}>
              <IconButton
                aria-label="修改貼文"
                icon={<EditIcon />}
                size={"sm"}
                bgColor={"#f2f2f2"}
                _hover={{ bgColor: "lightgreen" }}
              />
            </NextLink>
            <IconButton
              ml={2}
              aria-label="刪除貼文"
              icon={<DeleteIcon />}
              colorScheme="red"
              color="white"
              size={"sm"}
              _hover={{ bgColor: "red" }}
              onClick={onClick}
            />
          </Flex>
        )}
      </Flex>
    </Box>
  );
};
