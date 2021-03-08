import { Box, Button, Flex, Spinner, Stack } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { CustomAlertDialog } from "../components/CustomAlertDialog";
import { CustomMenuListButton } from "../components/CustomMenuListButton";
import { PaginatedImage } from "../components/PaginatedImage";
import { PostSnippetSection } from "../components/PostSnippetSection";
import { UpdootSection } from "../components/UpdootSection";
import { UserInfomations } from "../components/UserInfomations";
import { alertFields } from "../constants";
import {
  PaginatedPosts,
  PostSnippetFragment,
  useMeQuery,
  usePostsQuery,
} from "../generated/graphql";
import useRWD from "../hooks/useRWD";
import { Layout } from "../layouts/Layout";
import { createUrqlClient } from "../utils/createUrqlClient";
import { getNewCursor } from "../utils/getNewCursor";
import { isServer } from "../utils/isServer";
import { sleep } from "../utils/sleep";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | string,
  });
  const [selectPost, setSelectPost] = useState({
    id: -1,
    title: "",
    text: "",
  } as PostSnippetFragment);
  const pause = isServer();
  const [{ data, fetching: postFetching, error }] = usePostsQuery({
    pause,
    variables,
  });
  const [{ data: meQuery }] = useMeQuery({ pause });
  const device = useRWD();
  const [isOpen, setIsOpen] = useState(false);
  const [moreFetching, setMoreFetching] = useState(false);

  if (error) {
    return <div>{error}</div>;
  }

  const postsQuery = data?.posts as PaginatedPosts;
  const hasMore = postsQuery?.hasMore;
  const posts = postsQuery?.posts;

  return (
    <Layout>
      <CustomAlertDialog
        fields={alertFields}
        selectPost={selectPost}
        hook={[isOpen, setIsOpen]}
      />
      {postFetching || !postsQuery ? (
        <Flex alignItems="center">
          <Spinner m="auto" size={"lg"} />
        </Flex>
      ) : (
        <Stack spacing={4}>
          {posts?.map((p, idx) =>
            !p ? null : (
              <Flex
                position="relative"
                key={`post-${idx}`}
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
                  <UserInfomations creator={p.creator} me={meQuery?.me} />
                  <CustomMenuListButton
                    id={p.id}
                    creatorId={p.creator?.id}
                    onClick={() => {
                      setSelectPost(p);
                      setIsOpen(true);
                    }}
                  />
                </Flex>
                <Flex key={p.id} minW="100%" mt={4} px={3}>
                  <UpdootSection post={p} />
                  <Box ml={3}>
                    <PostSnippetSection post={p} />
                  </Box>
                </Flex>
                {!p.images ? null : <PaginatedImage images={p.images} />}
              </Flex>
            )
          )}
        </Stack>
      )}
      {!hasMore ? null : (
        <Flex>
          <Button
            m="auto"
            my="5"
            size="sm"
            style={{ backgroundColor: "#dadcea" }}
            isLoading={moreFetching}
            onClick={async () => {
              setMoreFetching(true);
              const newCursor = getNewCursor(posts);
              setVariables({
                limit: variables.limit,
                cursor: newCursor,
              });
              await sleep(2000);
              setMoreFetching(false);
            }}
          >
            更多
          </Button>
        </Flex>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
