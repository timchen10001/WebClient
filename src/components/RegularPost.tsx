import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import { Post, User } from "../generated/graphql";
import { RWDVariant } from "../hooks/useRWD";
import { CustomMenuListButton } from "./CustomMenuListButton";
import { PaginatedImage } from "./PaginatedImage";
import { PostSnippetSection } from "./PostSnippetSection";
import { UpdootSection } from "./UpdootSection";
import { UserInfomations } from "./UserInfomations";

interface RegularPostProps {
  index: number;
  post: Post;
  device: RWDVariant;
  me: User | null | undefined;
  setSelectPost: any;
  setIsOpen: any;
}

export const RegularPost: React.FC<RegularPostProps> = ({
  index,
  post,
  device,
  me,
  setSelectPost,
  setIsOpen,
}) => {
  return (
    <Flex
      position="relative"
      key={`post-${index}`}
      direction="column"
      alignItems="center"
      py={device === "mobile" ? 5 : 6}
      px={device === "mobile" ? 0 : 6}
      shadow="md"
      borderWidth="1px"
      bgColor="#f9f7f7"
      borderRadius="lg"
    >
      <Flex
        w="100%"
        mr="auto"
        alignItems="center"
        px={2}
        justifyContent="space-between"
      >
        <UserInfomations creator={post.creator} me={me} />
        <CustomMenuListButton
          id={post.id}
          creatorId={post.creator?.id}
          onClick={() => {
            setSelectPost(post);
            setIsOpen(true);
          }}
        />
      </Flex>
      <Flex key={post.id} minW="100%" mt={4} px={3}>
        <UpdootSection post={post} />
        <Box ml={3}>
          <PostSnippetSection post={post} />
        </Box>
      </Flex>
      {!post.images ? null : <PaginatedImage images={post.images} />}
    </Flex>
  );
};
