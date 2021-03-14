import { Box, Flex, Heading, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { PostSnippetFragment } from "../../generated/graphql";
import { RWDVariant } from "../../hooks/useRWD";
interface PostSnippetSectionProps {
  post: PostSnippetFragment;
  device: RWDVariant;
}

export const PostSnippetSection: React.FC<PostSnippetSectionProps> = ({
  device,
  post,
}) => {
  const router = useRouter();
  const { id, title, text, createdAt, textSnippet } = post;
  const currentDate = new Date(parseInt(createdAt));
  const isMobile = device === "mobile";
  const isInPostPage = router.pathname.includes("post");
  const sliceTextSnippet = textSnippet.slice(0, isMobile ? 38 : 68);
  const textSnippetFontSize = device === "mobile" ? "1rem" : "1.15rem";
  const titleComponent = (
    <Heading fontSize="1.3rem" mt={isMobile ? 2 : 1}>
      {title}
    </Heading>
  );

  return (
    <Box flex={1} width="100%">
      {isInPostPage ? (
        titleComponent
      ) : (
        <NextLink href="/post/[id]" as={`/post/${id}`}>
          <Link>{titleComponent}</Link>
        </NextLink>
      )}
      <Text as="span" color="gray" mt={1} fontSize="10px">
        {currentDate.toLocaleTimeString()}
      </Text>
      <Flex align="center" mt={2}>
        <Text as="span" overflowX="scroll" fontSize={textSnippetFontSize}>
          {isInPostPage ? (
            <>{post.text}</>
          ) : (
            <>
              {sliceTextSnippet}
              {text.length > sliceTextSnippet.length ? " ... " : null}
            </>
          )}
        </Text>
      </Flex>
    </Box>
  );
};
