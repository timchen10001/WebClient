import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import React from "react";
import { InputField } from "../components/InputField";
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { postInputExamination } from "../utils/postInputExamination";
import { toErrorsMap } from "../utils/toErrorsMap";
import { useRouter } from "next/router";
import { Layout } from "../components/Layout";
import { useIsAuth } from "../utils/useIsAuth";

interface createPostProps {}

const CreatePost: React.FC<createPostProps> = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [, createPost] = useCreatePostMutation();
  return (
    <Layout variant="small">
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
          if (!error) {
            await router.replace("/");
          }
          console.log(error);
        }}
      >
        {({ isSubmitting, handleChange }) => (
          <Form>
            <InputField
              label="標題"
              name="postTitle"
              placeholder="請輸入標題···"
              textArea={true}
            />
            <Box mt={4}>
              <InputField
                name="postText"
                label="內容"
                placeholder="請輸入Po文內容···"
                textArea={true}
              />
            </Box>
            <Box mt={4}>
              <Button
                isLoading={isSubmitting}
                onChange={handleChange}
                type="submit"
                colorScheme="messenger"
              >
                Post!
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
