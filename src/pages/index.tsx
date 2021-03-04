import {
  Button,
  Flex,
  Spinner,
  Stack,
  Image,
  Box,
  Heading,
} from "@chakra-ui/react";
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
import { createUrqlClient } from "../utils/createUrqlClient";
import { getNewCursor } from "../utils/getNewCursor";
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
      {postFetching || !postsQuery ? (
        <Flex alignItems="center">
          <Spinner m="auto" size={"lg"} />
        </Flex>
      ) : (
        <Stack spacing={4}>
          {posts?.map((p, idx) =>
            !p ? null : (
              <Flex
                key={`post-${idx}`}
                direction="column"
                alignItems="center"
                p={6}
                shadow="md"
                borderWidth="1px"
                bgColor="#f9f7f7"
                borderRadius="lg"
              >
                <Flex mr="auto" alignItems="center" px={2}>
                  <Image
                    boxSize="2.5rem"
                    borderRadius="full"
                    src={
                      !p.creator.avator
                        ? "https://placekitten.com/100/100"
                        : p.creator.avator
                    }
                    alt="Fluffybuns the destroyer"
                    mr="12px"
                  />
                  <Heading fontSize="lg">{p.creator.username}</Heading>
                </Flex>
                <Flex key={p.id} minW="100%" mt={3} px={3}>
                  <UpdootSection post={p} />
                  <Box ml={3}>
                    <PostSnippetSection post={p} />
                  </Box>
                  <EditDeleteButtons
                    id={p.id}
                    creatorId={p.creator?.id}
                    onClick={() => {
                      setSelectPost(p);
                      setIsOpen(true);
                    }}
                  />
                </Flex>
                {!p.images ? null : (
                  <Image
                    mt={5}
                    borderRadius="md"
                    src={p.images}
                    maxHeight="500px"
                  />
                )}
              </Flex>
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
