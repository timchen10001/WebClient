import { Box, Button, Flex, Img, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { Post } from "../../generated/graphql";
import { RWDVariant } from "../../hooks/useRWD";

interface ReplySectionProps {
  device: RWDVariant;
  index: number;
  post: Post;
}

export const ReplySection: React.FC<ReplySectionProps> = ({
  device,
  index,
  post,
}) => {
  const [repliesToShow, setRepliesToShow] = useState(2);
  const repliesSize = post.replies.length;
  const repliesMoreThanToShow = repliesSize - 1 > repliesToShow;
  const lastReplyIndex = repliesMoreThanToShow
    ? repliesSize - 1
    : repliesToShow;
  const replies = post.replies.slice(
    lastReplyIndex - repliesToShow,
    lastReplyIndex + 1
  );
  return (
    <>
      {!repliesMoreThanToShow ? null : (
        <Button
          variant="unstyled"
          _focus={{ border: "none" }}
          onClick={() => {
            setRepliesToShow(repliesToShow + 5);
          }}
        >
          還有 {repliesSize - repliesToShow - 1} 則留言 ....
        </Button>
      )}
      {replies.map((reply, idx) => (
        <Flex p={1} key={`post-${index}-replies-${idx}`}>
          <Img
            userSelect="none"
            src={reply.replier.avator}
            boxSize={device === "PC" ? "2.0rem" : "1.6rem"}
            borderRadius="full"
            mt={2}
            mr={1}
          />
          &nbsp;
          <Box bgColor="#EFF2F5" px={5} py={2} borderRadius="2xl" maxW="93%">
            <Text
              as="span"
              fontSize={device === "mobile" ? "1rem" : "1.2rem"}
              fontWeight="800"
            >
              {reply.replier.username}
            </Text>
            &nbsp; &nbsp;
            <Text
              as="span"
              fontSize={device === "mobile" ? "0.9rem" : "1.1rem"}
            >
              {reply.content}
            </Text>
            <br />
            <Text
              as="span"
              fontSize={device === "mobile" ? "0.5rem" : "0.6rem"}
            >
              {new Date(parseInt(reply.createdAt)).toLocaleString()}
            </Text>
          </Box>
        </Flex>
      ))}
    </>
  );
};
