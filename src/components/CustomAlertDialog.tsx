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
import React from "react";
import {
  PostSnippetFragment,
  useDeletePostMutation,
} from "../generated/graphql";

export type AlertDialogField = {
  header: string;
  body: any;
  comfirm: string;
  cancel: string;
};

interface CustomAlertDialogProps {
  fields: AlertDialogField;
  selectPost: PostSnippetFragment;
  hook: any;
}

export const CustomAlertDialog: React.FC<CustomAlertDialogProps> = ({
  fields,
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
            {fields.header}
          </AlertDialogHeader>

          <AlertDialogBody>
            {fields.body}
            <Text mt={2} fontSize="xx-small">
              {selectPost.title}
            </Text>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={undefined} onClick={onClose}>
              {fields.cancel}
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
                  onClose();
                }
              }}
            >
              {fields.comfirm}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
