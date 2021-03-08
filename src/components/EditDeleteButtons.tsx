import { Flex, IconButton } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useMeQuery } from "../generated/graphql";

interface EditDeleteButtonsProps {
  id: number;
  creatorId?: number;
  onClick?: () => void;
}

export const EditDeleteButtons: React.FC<EditDeleteButtonsProps> = ({
  id,
  creatorId,
  onClick,
}) => {
  const [{ data: meQuery }] = useMeQuery();
  const isNotEditable =
    typeof creatorId === "undefined" || meQuery?.me?.id !== creatorId;

  return isNotEditable ? null : (
    <Flex align="center" ml="auto" mt={-14}>
      <NextLink href="/edit/[id]" as={`/edit/${id}`}>
        <IconButton
          aria-label="修改貼文"
          icon={<EditIcon />}
          size={"sm"}
          bgColor={"#f2f2f2"}
          _hover={{ bgColor: "#9ec9f7" }}
        />
      </NextLink>
      <IconButton
        ml={2}
        aria-label="刪除貼文"
        icon={<DeleteIcon />}
        colorScheme="red"
        color="white"
        size={"sm"}
        _hover={{ bgColor: "red" }}
        onClick={onClick}
      />
    </Flex>
  );
};
