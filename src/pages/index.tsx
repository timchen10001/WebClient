import { Box, Link, Stack } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { Layout } from "../components/Layout";
import NextPage from "next/link";
import { useMeQuery, usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { isServer } from "../utils/isServer";
import { useIsAuth } from "../utils/useIsAuth";

const Index = () => {
  useIsAuth();

  const pause = isServer();
  const [{ data: meData }] = useMeQuery({ pause });
  const [{ data: postData, fetching: postsFetching }] = usePostsQuery({
    variables: { limit: 5 },
    pause,
  });

  let body: any = null;

  if (postsFetching) {
    body = <Box>載入中···</Box>;
  } else if (meData && postData?.posts) {
    body = (
      <Stack id="posts" height="fit-content" spacing={8}>
        {postData.posts.map((p) => (
          <Box key={p.id} mt={4}>
            <h1>{p.title}</h1>
            <p>{p.text}</p>
          </Box>
        ))}
      </Stack>
    );
  }
  return (
    <Layout variant="regular">
      <NextPage href="/create-post">
        <Link style={{ color: "red", textDecoration: "underline" }}>PO文</Link>
      </NextPage>
      {body}
      <br />
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
