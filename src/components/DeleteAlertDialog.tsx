import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Text,
} from "@chakra-ui/react";
import { HookCallbacks } from "async_hooks";
import React, { useState } from "react";
import {
  PostSnippetFragment,
  useDeletePostMutation,
} from "../generated/graphql";

interface DeleteAlertDialogProps {
  selectPost: PostSnippetFragment;
  hook: any;
}

export const DeleteAlertDialog: React.FC<DeleteAlertDialogProps> = ({
  selectPost,
  hook,
}) => {
  const [{ fetching: deletingPost }, deletePost] = useDeletePostMutation();
  const [isOpen, setIsOpen] = hook;
  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={undefined}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent bgColor="lightgray">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            刪除貼文警告
          </AlertDialogHeader>

          <AlertDialogBody>
            確定刪除這則貼文？
            <Text mt={2} fontSize="xx-small">
              {selectPost.title}
            </Text>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={undefined} onClick={onClose}>
              取消
            </Button>
            <Button
              ml={3}
              colorScheme="red"
              isLoading={deletingPost}
              onClick={async () => {
                const success = await deletePost({
                  id: selectPost.id,
                });
                if (success) {
                  console.log("確認刪除: ", selectPost);
                  onClose();
                }
              }}
            >
              刪除
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
