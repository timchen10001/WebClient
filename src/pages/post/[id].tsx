import { Box, Container, Heading } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { CustomAlertDialog } from "../../components/CustomAlertDialog";
import { EditDeleteButtons } from "../../components/EditDeleteButtons";
import { FixPageLayout } from "../../components/FixPageLayout";
import { Layout } from "../../components/Layout";
import { alertFields } from "../../constants";
import { usePostQuery } from "../../generated/graphql";
import { useGetPostIntId } from "../../hooks/useGetPostIntId";
import { createUrqlClient } from "../../utils/createUrqlClient";

interface PostProps {}

const Post: React.FC<PostProps> = ({}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
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

    // 意外錯誤處理 (偵錯用)
    return (
      <Layout>
        <Box>貼文不存在或已遭刪除</Box>
      </Layout>
    );
  }

  return (
    <FixPageLayout variant="regular">
      <Container bgColor="#f9f7f7" borderRadius="lg" p={4} minHeight={"60vh"}>
        {!postQuery ? null : (
          <>
            <CustomAlertDialog
              fields={alertFields}
              selectPost={postQuery}
              hook={[isOpen, setIsOpen]}
            />
            <Heading mb={4}>{postQuery.title}</Heading>
            <Box>{postQuery.text}</Box>
            <EditDeleteButtons
              id={postQuery.id}
              creatorId={postQuery.creator?.id}
              onClick={() => {
                setIsOpen(true);
              }}
            />
          </>
        )}
      </Container>
    </FixPageLayout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
