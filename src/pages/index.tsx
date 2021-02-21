import { Button, Flex, Heading, Spinner, Stack } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { CustomAlertDialog } from "../components/CustomAlertDialog";
import { EditDeleteButtons } from "../components/EditDeleteButtons";
import { Layout } from "../components/Layout";
import { PostSnippetSection } from "../components/PostSnippetSection";
import { UpdootSection } from "../components/UpdootSection";
import { alertFields } from "../constants";
import {
  PaginatedPosts,
  PostSnippetFragment,
  usePostsQuery,
} from "../generated/graphql";
import { useIsPaginating } from "../hooks/useIsPaginating";
import { createUrqlClient } from "../utils/createUrqlClient";
import { isServer } from "../utils/isServer";

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

  const [{ data, fetching: loadingPosts, error }] = usePostsQuery({
    pause: isServer(),
    variables,
  });
  const [moreFetching, setMoreFetching] = useIsPaginating([data]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Layout>
      <Heading as="h1" size="4xl">
        Posts
      </Heading>
      <br />
      <CustomAlertDialog
        fields={alertFields}
        selectPost={selectPost}
        hook={[isOpen, setIsOpen]}
      />
      {loadingPosts || !data?.posts ? (
        <Spinner size={"lg"} />
      ) : (
        <Stack spacing={8}>
          {data.posts?.posts?.map((p) =>
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
      {!data?.posts?.hasMore ? null : (
        <Flex>
          <Button
            m="auto"
            my="8"
            size="sm"
            style={{ backgroundColor: "#dadcea" }}
            isLoading={moreFetching}
            onClick={() => {
              const { posts } = data.posts as PaginatedPosts;
              const size = posts.length - 1;
              const lastPostInPagination = posts[size];
              setVariables({
                limit: variables.limit,
                cursor: lastPostInPagination?.createdAt,
              });
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
