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
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={undefined}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent bgColor="white" m="auto" minW="40%">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {fields.header}
          </AlertDialogHeader>

          <AlertDialogBody>
            {fields.body}
            <Text mt={4} fontSize="xx-small">
              {selectPost.title}
            </Text>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={undefined}
              onClick={onClose}
              _focus={{ border: "none" }}
            >
              {fields.cancel}
            </Button>
            <Button
              ml={3}
              colorScheme="red"
              isLoading={deletingPost}
              _focus={{ border: "none" }}
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
