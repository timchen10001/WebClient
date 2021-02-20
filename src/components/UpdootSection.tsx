import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [, vote] = useVoteMutation();
  const { id: postId, voteStatus } = post;

  const bgc = "#f2f2f2";
  const updootBgc = voteStatus === 1 ? "lightgreen" : bgc;
  const downdoorBgc = voteStatus === -1 ? "red" : bgc;

  return (
    <Flex
      flexDirection={"column"}
      alignItems="center"
      justifyContent="center"
      mr={4}
    >
      <IconButton
        size="sm"
        aria-label="updoot post"
        icon={<TriangleUpIcon />}
        style={{ backgroundColor: updootBgc }}
        isLoading={loadingState === "updoot-loading"}
        onClick={async () => {
          setLoadingState("updoot-loading");
          await vote({ postId, value: 1 });
          setLoadingState("not-loading");
        }}
      />
      {post.points}
      <IconButton
        size="sm"
        aria-label="downdoot post"
        icon={<TriangleDownIcon focusable="false" />}
        style={{ backgroundColor: downdoorBgc }}
        isLoading={loadingState === "downdoot-loading"}
        onClick={async () => {
          setLoadingState("downdoot-loading");
          await vote({ postId, value: -1 });
          setLoadingState("not-loading");
        }}
      />
    </Flex>
  );
};
