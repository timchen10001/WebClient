import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextPage from "next/link";
import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { UpdootSection } from "../components/UpdootSection";
import { PaginatedPosts, usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { isServer } from "../utils/isServer";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | string,
  });

  const pause = isServer();
  const [{ data, fetching, error }] = usePostsQuery({
    variables,
    pause,
  });

  if (error) {
    return <div>錯誤 404</div>;
  }

  return (
    <Layout>
      <Flex alignItems="center">
        <Heading as="h1" size="4xl">
          Posts
        </Heading>
        <NextPage href="/create-post">
          <Link ml="auto" color="red" textDecoration="underline">
            PO文
          </Link>
        </NextPage>
      </Flex>
      <br />
      {!data?.posts || fetching ? (
        <div>載入中···</div>
      ) : (
        <Stack spacing={8}>
          {data?.posts?.posts?.map((p) => (
            <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
              <UpdootSection post={p} />
              <Box>
                <Heading as="h2" size="lg">
                  {p.title}
                </Heading>
                <Text color="gray" fontSize="sm">
                  posted by {p.creator?.username}
                </Text>
                <Text mt={4}>{p.textSnippet}</Text>
              </Box>
            </Flex>
          ))}
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
              setVariables({
                limit: variables.limit,
                cursor: posts[posts.length - 1]?.createdAt,
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
