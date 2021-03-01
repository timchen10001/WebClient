import {
  BellIcon,
  CheckIcon,
  SmallCloseIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Icon,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import React from "react";
import {
  useReceivesQuery,
  useResponseToReceiveMutation,
} from "../generated/graphql";

interface MessengerControllProps {}

export const MessengerControll: React.FC<MessengerControllProps> = ({}) => {
  const [{ data, fetching, error }] = useReceivesQuery();
  const [, respondToReceive] = useResponseToReceiveMutation();
  if (error) {
    return <>{error}</>;
  } else if (fetching) {
    // return <Spinner />;
    console.log("fetching Receives···");
  }

  const withMessenge = data?.receives?.length;

  return (
    <Box aria-label="通知">
      <Menu>
        <MenuButton
          p={1}
          m={0}
          as={Button}
          bg={"none"}
          _focus={{ border: "none" }}
          _hover={{ bgColor: "none" }}
        >
          <BellIcon fontSize="xl" />
          {!withMessenge ? null : (
            <Icon
              viewBox="0 0 200 200"
              color="red.500"
              fontSize={"xx-small"}
              mb={4}
              ml={-1}
            >
              <path
                fill="currentColor"
                d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
              />
            </Icon>
          )}
        </MenuButton>

        <MenuList bgColor="ActiveBorder" cursor="text">
          {!withMessenge ? (
            <MenuItem minH="48px">
              <TimeIcon mr={2} />
              <span>目前沒有新的訊息唷～</span>
            </MenuItem>
          ) : (
            data?.receives?.map((receive, i) => (
              <MenuItem key={`receive-${i}`} minH="48px">
                <Image
                  boxSize="2rem"
                  borderRadius="full"
                  src="https://placekitten.com/100/100"
                  alt="Fluffybuns the destroyer"
                  mr="12px"
                />
                <span>
                  <b>{receive.name}</b> 想成為你的朋友
                </span>
                <IconButton
                  ml={1}
                  aria-label="接受邀請"
                  icon={<CheckIcon color="green" />}
                  onClick={async () =>
                    await respondToReceive({ inviterId: receive.ID, value: 1 })
                  }
                />
                <IconButton
                  aria-label="拒絕邀請"
                  icon={<SmallCloseIcon fontSize="2xl" color="red" />}
                  onClick={async () =>
                    await respondToReceive({ inviterId: receive.ID, value: 0 })
                  }
                />
              </MenuItem>
            ))
          )}
        </MenuList>
      </Menu>
    </Box>
  );
};
