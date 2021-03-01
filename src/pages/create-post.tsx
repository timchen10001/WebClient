import { Box, Button, Flex } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useCreatePostMutation } from "../generated/graphql";
import { useIsAuth } from "../hooks/useIsAuth";
import { createUrqlClient } from "../utils/createUrqlClient";
import { postInputExamination } from "../utils/postInputExamination";
import { toErrorsMap } from "../utils/toErrorsMap";

interface createPostProps {}

const CreatePost: React.FC<createPostProps> = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [, createPost] = useCreatePostMutation();
  return (
    <Layout variant="regular">
      <Box bgColor="#f9f7f7" borderRadius="lg" p={4}>
        <Formik
          initialValues={{ postTitle: "", postText: "" }}
          onSubmit={async (values, { setErrors }) => {
            const { postTitle: title, postText: text } = values;

            const checkError = postInputExamination(title, text, {
              title: "postTitle",
              text: "postText",
            });

            if (checkError) {
              setErrors(toErrorsMap(checkError));
              return;
            }

            const { error } = await createPost({ input: { title, text } });
            if (error) {
              console.log(error);
            } else {
              await router.push("/");
            }
          }}
        >
          {({ isSubmitting, handleChange }) => (
            <Form>
              <InputField
                label=""
                name="postTitle"
                placeholder="請輸入標題···"
              />
              <Box mt={-3}>
                <InputField
                  name="postText"
                  label=""
                  placeholder="請輸入Po文內容···"
                  minHeight="50vh"
                  textArea={true}
                />
              </Box>
              <Flex mt={4}>
                <Button
                  flex={1}
                  type="submit"
                  bgColor="Highlight"
                  isLoading={isSubmitting}
                  onChange={handleChange}
                >
                  貼文
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Box>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
