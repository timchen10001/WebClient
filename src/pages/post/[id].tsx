import { Box } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { RegularPost } from "../../components/RegularPost";
import { useMeQuery, usePostQuery } from "../../generated/graphql";
import { useGetPostIntId } from "../../hooks/useGetPostIntId";
import useRWD from "../../hooks/useRWD";
import { Layout } from "../../components/layouts/Layout";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { isServer } from "../../utils/isServer";

interface PostProps {}

const Post: React.FC<PostProps> = ({}) => {
  const router = useRouter();
  const device = useRWD();
  const [{ data: meQuery }] = useMeQuery({ pause: isServer() });
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

  const postQuery = data?.post;
  if (!fetching && !postQuery) {
    // 如果請求資料結束後，沒有資料，回到上個節點
    router.back();
  }

  return !fetching && postQuery ? (
    <Layout>
      <RegularPost
        device={device}
        post={postQuery as any}
        me={meQuery?.me}
        index={postQuery.id}
        setIsOpen={() => {}}
        setSelectPost={() => {}}
      />
    </Layout>
  ) : null;
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
