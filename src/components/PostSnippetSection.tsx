import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { PostSnippetFragment } from "../generated/graphql";
import useRWD from "../hooks/useRWD";

interface PostSnippetSectionProps {
  post: PostSnippetFragment;
}

export const PostSnippetSection: React.FC<PostSnippetSectionProps> = ({
  post,
}) => {
  const { title, text, createdAt, textSnippet } = post;
  const currentDate = new Date(parseInt(createdAt));
  const device = useRWD();
  
  const sliceTextSnippet = textSnippet.slice(0, device === "mobile" ? 35 : 50);

  return (
    <Box flex={1}>
      {/* <NextLink href="/post/[id]" as={`/post/${id}`}>
        <Link> */}
          <Heading fontSize="1rem">{title}</Heading>
        {/* </Link>
      </NextLink> */}
      <Text color="gray" fontSize="10px">
        {currentDate.toLocaleTimeString()}
      </Text>
      <Flex align="center" mt={2}>
        <Text flex={1}>
          {sliceTextSnippet}
          {text.length > sliceTextSnippet.length ? " ... " : null}
        </Text>
      </Flex>
    </Box>
  );
};
