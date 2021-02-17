import { TriangleUpIcon, TriangleDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import { RegularPostFragment, useVoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
  post: RegularPostFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [{ fetching }, vote] = useVoteMutation();

  return (
    <Flex
      flexDirection={"column"}
      alignItems="center"
      justifyContent="center"
      mr={4}
    >
      <IconButton
        size="md"
        aria-label="updoot post"
        icon={<TriangleUpIcon />}
        style={{ backgroundColor: "#f2f2f2" }}
        isLoading={loadingState === 'updoot-loading'}
        onClick={async () => {
          setLoadingState("updoot-loading");
          await vote({ postId: post.id, value: 1 });
          setLoadingState('not-loading');
        }}
      />
      {post.points}
      <IconButton
        size="md"
        aria-label="downdoot post"
        icon={<TriangleDownIcon />}
        style={{ backgroundColor: "#f2f2f2" }}
        isLoading={loadingState === 'downdoot-loading'}
        onClick={async () => {
          setLoadingState("downdoot-loading");
          await vote({ postId: post.id, value: -1 });
          setLoadingState('not-loading');
        }}
      />
    </Flex>
  );
};
