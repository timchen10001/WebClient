import { Button, Flex, Img, Stack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { Post, User, useReplyMutation } from "../generated/graphql";
import { RWDVariant } from "../hooks/useRWD";
import { toErrorsMap } from "../utils/toErrorsMap";
import { CustomMenuListButton } from "./CustomMenuListButton";
import { InputField } from "./InputField";
import { PaginatedImage } from "./PaginatedImage";
import { PostSnippetSection } from "./sections/PostSnippetSection";
import { ReplySection } from "./sections/ReplySection";
import { UpdootSection } from "./sections/UpdootSection";
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
  const [clearInputField, setClearInputField] = useState(false);
  const [, reply] = useReplyMutation();

  const isMobile = device === "mobile";
  return (
    <Formik
      initialValues={{ content: "" }}
      onSubmit={async (values, { setErrors }) => {
        if (typeof values.content === "undefined" || !values.content.length) {
          setErrors({ content: "留言不可留白" });
        }
        const response = await reply({
          replyInput: { content: values.content, postId: post.id },
        });
        if (response.data?.reply.errors) {
          setErrors(toErrorsMap(response.data.reply.errors));
        } else if (response.data?.reply.reply) {
          document.getElementById(`clear-reply-${index}-input-value`)?.click();
        }
      }}
    >
      {() => (
        <Flex
          position="relative"
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
          <Flex
            key={`post-section-${post.id}`}
            w={isMobile ? "90%" : "95%"}
            mt={isMobile ? 3 : 5}
          >
            <PostSnippetSection device={device} post={post} />
          </Flex>
          {!post.images ? null : <PaginatedImage images={post.images} />}
          <Flex
            key={`updoot-section-${post.id}`}
            w="95%"
            mt={device === "mobile" ? 3 : 5}
          >
            <UpdootSection device={device} post={post} />
          </Flex>
          <Stack mt={isMobile ? 1 : 2} w="95%">
            <ReplySection index={index} post={post} />

            {!me ? null : (
              <Form
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Img
                  userSelect="none"
                  src={me?.avator}
                  boxSize={"1.8rem"}
                  borderRadius="full"
                />
                &nbsp; &nbsp;
                <InputField
                  name="content"
                  placeholder="留言......"
                  style={{
                    flex: "1",
                    maxHeight: "2rem",
                    borderRadius: "20px",
                    background: "#EFF2F5",
                    border: "none",
                  }}
                />
                <Button
                  id={`clear-reply-${index}-input-value`}
                  type="reset"
                  variant="ghost"
                />
              </Form>
            )}
          </Stack>
        </Flex>
      )}
    </Formik>
  );
};
