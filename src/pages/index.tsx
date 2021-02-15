import { Box } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { Layout } from "../components/Layout";
import { NavBar } from "../components/NavBar";
import { Wrapper } from "../components/Wrapper";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [{ data: postData, fetching: getPostFetching }] = usePostsQuery();

  let body: any = null;

  if (getPostFetching) {
    body = <Box>載入中···</Box>;
  } else if (postData?.posts) {
    body = (
      <Box>
        {postData.posts.map((p) => (
          <Box key={p.id} mt={4}>
            <Box>{p.title}</Box>
            <Box>{p.text}</Box>
          </Box>
        ))}
      </Box>
    );
  }
  return (
    <Layout variant="small">
      <Box>Hello World</Box>
      {body}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
