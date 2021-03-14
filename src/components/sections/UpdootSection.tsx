import { Flex, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import { PostSnippetFragment, useVoteMutation } from "../../generated/graphql";
import { RWDVariant } from "../../hooks/useRWD";
import { DootPointsIcon } from "../icons/DootPointsIcon";
import { DowndootIcon } from "../icons/DowndootIcon";
import { UpdootIcon } from "../icons/UpdootIcon";

interface UpdootSectionProps {
  post: PostSnippetFragment;
  device: RWDVariant;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({
  device,
  post,
}) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [, vote] = useVoteMutation();
  const { id: postId, voteStatus } = post;

  const baseFontbgc = "black";
  const updootFontBgc = voteStatus === 1 ? "#9ec9f7" : baseFontbgc;
  const downdootFontBgc = voteStatus === -1 ? "red" : baseFontbgc;

  return (
    <Flex
      mt={device === "mobile" ? 8 : 9}
      width="100%"
      alignItems="center"
      justifyContent="space-between"
      borderY={"1px solid #CDD0D4"}
    >
      <IconButton
        width="33%"
        bgColor="none"
        cursor={device === "PC" ? "pointer" : "none"}
        aria-label="updoot post"
        _focus={{ border: "none" }}
        icon={<UpdootIcon device={device} voteStatus={voteStatus} />}
        color={updootFontBgc}
        isLoading={loadingState === "updoot-loading"}
        onClick={async () => {
          setLoadingState("updoot-loading");
          await vote({ postId, value: 1 });
          setLoadingState("not-loading");
        }}
      />
      <IconButton
        width="33%"
        bgColor="none"
        color={downdootFontBgc}
        aria-label="downdoot post"
        _focus={{ border: "none" }}
        cursor={device === "PC" ? "pointer" : "none"}
        icon={<DowndootIcon device={device} voteStatus={voteStatus} />}
        isLoading={loadingState === "downdoot-loading"}
        onClick={async () => {
          setLoadingState("downdoot-loading");
          await vote({ postId, value: -1 });
          setLoadingState("not-loading");
        }}
      />
      <IconButton
        width="33%"
        bgColor="none"
        aria-label="points"
        cursor="text"
        _focus={{ border: "none" }}
        icon={<DootPointsIcon device={device} points={post.points} />}
      />
    </Flex>
  );
};
