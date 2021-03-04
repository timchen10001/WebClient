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
  const { id, title, text, createdAt, textSnippet } = post;

  const currentDate = new Date(parseInt(createdAt));

  return (
    <Box flex={1}>
      <NextLink href="/post/[id]" as={`/post/${id}`}>
        <Link>
          <Heading fontSize="larger">{title}</Heading>
        </Link>
      </NextLink>
      <Text color="gray" fontSize="sm">
        {currentDate.toLocaleTimeString()}
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
