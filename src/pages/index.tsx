import { Button, Flex, Spinner, Stack } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { CustomAlertDialog } from "../components/CustomAlertDialog";
import { RegularPost } from "../components/RegularPost";
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
    privateMode: false,
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
              <RegularPost
                index={idx}
                post={p}
                device={device}
                me={meQuery?.me}
                setSelectPost={setSelectPost}
                setIsOpen={setIsOpen}
              />
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
                privateMode: variables.privateMode,
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
