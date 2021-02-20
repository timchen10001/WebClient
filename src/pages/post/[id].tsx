import { Box, Container, Heading, Spinner } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { Layout } from "../../components/Layout";
import { usePostQuery } from "../../generated/graphql";
import { useGetPostIntId } from "../../hooks/useGetPostIntId";
import { createUrqlClient } from "../../utils/createUrqlClient";

interface PostProps {}

const Post: React.FC<PostProps> = ({}) => {
  const intId = useGetPostIntId();
  const [{ data, fetching, error }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });

  if (error) {
    return <Box>{error.message}</Box>;
  }

  let body: any;
  if (fetching) {
    body = <Spinner size={"xl"} />;
  } else if (!data) {
    body = <Box>貼文不存在···</Box>;
  } else if (data && data.post) {
    body = (
      <>
        <Heading mb={4}>{data.post.title}</Heading>
        {data.post.text}
      </>
    );
  }

  return (
    <Layout>
      <Container>{body}</Container>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
