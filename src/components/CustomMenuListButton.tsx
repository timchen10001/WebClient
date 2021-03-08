import { HamburgerIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Modal,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { useMeQuery } from "../generated/graphql";

type CustomMenuListButtonProps = {
  id: number;
  creatorId?: number;
  onClick?: () => void;
};

export const CustomMenuListButton: React.FC<CustomMenuListButtonProps> = ({
  id,
  creatorId,
  onClick,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [{ data: meQuery }] = useMeQuery();
  const isNotEditable =
    typeof creatorId === "undefined" || meQuery?.me?.id !== creatorId;
  return isNotEditable ? null : (
    <>
      <IconButton
        onClick={onOpen}
        color="black"
        variant="unstyled"
        aria-label="Options"
        icon={<HamburgerIcon />}
        _focus={{ border: "none" }}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          m="auto"
          bgColor="#FFFFFF"
          borderRadius="xl"
          minW="40%"
        >
          <Stack
            spacing={0}
            fontSize="17px"
            fontWeight="500"
            textAlign="center"
          >
            <Text
              cursor="pointer"
              p={3}
              color="red"
              borderBottom="1px solid #DBDBDB"
              onClick={() => {
                if (onClick) {
                  onClick();
                  onClose();
                }
              }}
            >
              刪除
            </Text>
            <NextLink href="/edit/[id]" as={`/edit/${id}`}>
              <Text
                cursor="pointer"
                p={3}
                borderBottom="1px solid #DBDBDB"
              >
                編輯
              </Text>
            </NextLink>
            <Text cursor="pointer" p={3} onClick={onClose}>
              取消
            </Text>
          </Stack>
        </ModalContent>
      </Modal>
    </>
  );
};