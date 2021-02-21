import { Box, Flex, Heading, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { PostSnippetFragment } from "../generated/graphql";

interface PostSnippetSectionProps {
  post: PostSnippetFragment;
}

export const PostSnippetSection: React.FC<PostSnippetSectionProps> = ({
  post,
}) => {
  const { id, title, text, creator, textSnippet } = post;

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
      </Flex>
    </Box>
  );
};
