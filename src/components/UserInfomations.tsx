import {
  Button,
  Flex,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { default as React } from "react";
import { useInviteMutation, User } from "../generated/graphql";

interface UserInfomationsProps {
  creator: User;
  me: User | undefined | null;
}

export const UserInfomations: React.FC<UserInfomationsProps> = ({
  creator,
  me,
}) => {
  const [, invite] = useInviteMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const friendsID = me?.friends?.map((friend) => friend.ID);
  const hasBeenFriend = friendsID?.includes(creator.id);
  const isSelf = me?.id === creator.id;

  return (
    <>
      <Flex alignItems="center">
        <Image
          mr="12px"
          boxSize="2.3rem"
          borderRadius="full"
          cursor="pointer"
          alt={`${creator.id}`}
          src={
            !creator.avator ? "https://placekitten.com/100/100" : creator.avator
          }
          onClick={() => {
            if (me && !isSelf && !hasBeenFriend) {
              onOpen();
            }
          }}
        />
        <Heading fontSize="1.0rem">{creator.username}</Heading>
      </Flex>
      {isSelf || hasBeenFriend ? null : (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent m="auto" bgColor="#FFFFFF" borderRadius="xl" minW="40%">
            <ModalHeader>好友邀請</ModalHeader>
            <ModalCloseButton _focus={{ border: "none" }} />
            <ModalBody>
              <Text fontWeight="bold" mb="1rem">
                {`👋 要對 ${creator.username} 送出好友邀請嗎？👋`}
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={async () => {
                  const response = await invite({ id: creator.id });
                  if (response.data?.invite.done) {
                    onClose();
                  }
                }}
                _focus={{ border: "none" }}
              >
                確定
              </Button>
              <Button _focus={{ border: "none" }} onClick={onClose}>
                取消
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};
