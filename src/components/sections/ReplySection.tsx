import { Box, Button, Flex, Img, Stack, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { Post } from "../../generated/graphql";
import { RWDVariant } from "../../hooks/useRWD";

interface ReplySectionProps {
  device: RWDVariant;
  index: number;
  post: Post;
}

export const ReplySection: React.FC<ReplySectionProps> = ({ device, index, post }) => {
  const [repliesToShow, setRepliesToShow] = useState(2);
  const repliesSize = post.replies.length;
  const repliesMoreThanToShow = repliesSize > repliesToShow;
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
          還有 {repliesSize - repliesToShow} 則留言 ....
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
            <span style={{ fontSize: "1.1rem", fontWeight: 800 }}>
              {reply.replier.username}
            </span>
            &nbsp; &nbsp;
            <span style={{ fontSize: "1.1rem" }}>{reply.content}</span>
            <br />
            <span style={{ fontSize: "0.6rem" }}>
              {new Date(parseInt(reply.createdAt)).toLocaleString()}
            </span>
          </Box>
        </Flex>
      ))}
    </>
  );
};
