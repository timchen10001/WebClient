import { Button, Flex, Heading, Spinner, Stack } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useEffect, useState } from "react";
import { CustomAlertDialog } from "../components/CustomAlertDialog";
import { EditDeleteButtons } from "../components/EditDeleteButtons";
import { Layout } from "../components/Layout";
import { PaginateButton } from "../components/PaginateButton";
import { PostSnippetSection } from "../components/PostSnippetSection";
import { UpdootSection } from "../components/UpdootSection";
import { alertFields } from "../constants";
import {
  PaginatedPosts,
  PostSnippetFragment,
  usePostsQuery,
} from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
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
  const [isOpen, setIsOpen] = useState(false);

  const [{ data, fetching: postFetching, error }] = usePostsQuery({
    pause: isServer(),
    variables,
  });
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
      <Heading as="h1" size="4xl">
        Posts
      </Heading>
      <br />
      {postFetching || !postsQuery ? (
        <Spinner size={"lg"} />
      ) : (
        <Stack spacing={8}>
          {posts?.map((p) =>
            !p ? null : (
              <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                <UpdootSection post={p} />
                <PostSnippetSection post={p} />
                <EditDeleteButtons
                  id={p.id}
                  creatorId={p.creator?.id}
                  onClick={() => {
                    setSelectPost(p);
                    setIsOpen(true);
                  }}
                />
              </Flex>
            )
          )}
        </Stack>
      )}
      {!hasMore ? null : (
        <Flex>
        <Button
          m="auto"
          my="8"
          size="sm"
          style={{ backgroundColor: "#dadcea" }}
          isLoading={moreFetching}
          onClick={async() => {
            setMoreFetching(true);
            const size = posts.length - 1;
            const lastPostInPagination = posts[size];
            setVariables({
              limit: variables.limit,
              cursor: lastPostInPagination?.createdAt,
            });
            await sleep(2000)
            setMoreFetching(false);
          }}
        >
          更多
        </Button>
      </Flex>
      )}
      <br />
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
