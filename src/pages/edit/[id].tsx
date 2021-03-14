import { Box, Button, Flex, Spinner } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { InputField } from "../../components/InputField";
import { usePostQuery, useUpdatePostMutation } from "../../generated/graphql";
import { useGetPostIntId } from "../../hooks/useGetPostIntId";
import { Layout } from "../../components/layouts/Layout";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toErrorsMap } from "../../utils/toErrorsMap";
import { postInputExamination } from "../../utils/validators";

interface EditPostProps {}

const EditPost: React.FC<EditPostProps> = ({}) => {
  const router = useRouter();
  const intId = useGetPostIntId();
  const [{ data, fetching, error }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });
  const [editing, setEditing] = useState(false);
  const [, updatePost] = useUpdatePostMutation();

  let body: any = null;
  if (error) {
    body = <Box>{error.message}</Box>;
  } else if (fetching) {
    body = (
      <Flex alignItems="center">
        <Spinner size={"xl"} m="auto" />
      </Flex>
    );
  } else if (data?.post) {
    body = (
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values, { setErrors }) => {
          const { title, text } = values;
          setEditing(true);
          const checkError = postInputExamination(title, text, {
            title: "title",
            text: "text",
          });
          if (checkError) {
            setErrors(toErrorsMap(checkError));
            setEditing(false);
            return;
          }
          await updatePost({
            id: intId,
            input: {
              images: data.post?.images as string,
              ...values,
            },
          });

          router.back();
        }}
      >
        {({ isSubmitting, handleChange }) => (
          <Form>
            <InputField label="" name="title" disabled={editing} />
            <Box mt={4}>
              <InputField
                label=""
                name="text"
                minHeight="50vh"
                textArea
                disabled={editing}
              />
            </Box>
            <Flex mt={4}>
              <Button
                flex={1}
                type="submit"
                bgColor="Highlight"
                disabled={editing}
                isLoading={isSubmitting}
                onChange={handleChange}
              >
                修改
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    );
  }

  return (
    <Layout>
      <Box bgColor="#f9f7f7" borderRadius="lg" p={4}>
        {body}
      </Box>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(EditPost);
