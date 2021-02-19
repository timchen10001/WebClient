import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { UpdootSection } from "../components/UpdootSection";
import {
  PaginatedPosts,
  useDeletePostMutation,
  useMeQuery,
  usePostsQuery,
} from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { isServer } from "../utils/isServer";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | string,
  });

  const pause = isServer();
  const [{ data: meQuery }] = useMeQuery({ pause });
  const [{ data, fetching, error }] = usePostsQuery({
    variables,
    pause,
  });

  const [, deletePost] = useDeletePostMutation();
  const [deletedPostId, setDeletedPostId] = useState(-1);

  if (error) {
    return <div>錯誤 404</div>;
  }

  return (
    <Layout>
      <Heading as="h1" size="4xl">
        Posts
      </Heading>
      <br />
      {!data?.posts || fetching ? (
        <div>載入中···</div>
      ) : (
        <Stack spacing={8}>
          {data?.posts?.posts?.map((p) =>
            !p ? null : (
              <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                <UpdootSection post={p} />
                <Box flex={1}>
                  <NextLink href="/page/[id]" as={`/page/${p.id}`}>
                    <Link>
                      <Heading fontSize="larger">{p.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text color="gray" fontSize="sm">
                    posted by {p.creator?.username}
                  </Text>
                  <Flex align="center" mt={4}>
                    <Text flex={1}>
                      {p.textSnippet}
                      {p.text.length > p.textSnippet.length ? " ... " : null}
                    </Text>
                    {meQuery?.me?.id === p.creator?.id ? (
                      <IconButton
                        ml="auto"
                        aria-label="刪除貼文"
                        colorScheme="red"
                        color="white"
                        icon={<DeleteIcon />}
                        size={"sm"}
                        _hover={{ bgColor: "red" }}
                        isLoading={p.id === deletedPostId}
                        onClick={async () => {
                          setDeletedPostId(p.id);
                          await deletePost({ id: p.id });
                        }}
                      />
                    ) : null}
                  </Flex>
                </Box>
              </Flex>
            )
          )}
        </Stack>
      )}
      {data?.posts?.hasMore ? (
        <Flex>
          <Button
            size="sm"
            style={{ backgroundColor: "#dadcea" }}
            isLoading={fetching}
            onClick={() => {
              const { posts } = data.posts as PaginatedPosts;
              let size: number = posts.length - 1;
              // const lastPostInPagination = posts[size];
              while (size >= 0 && !posts[size]) {
                size--;
                // console.log(size);
              }
              const lastPostInPagination = posts[size];
              // console.log(lastPostInPagination);
              setVariables({
                limit: variables.limit,
                cursor: lastPostInPagination?.createdAt,
              });
            }}
            m="auto"
            my="8"
          >
            更多
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
