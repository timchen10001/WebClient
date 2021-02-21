import { Box, Button, Spinner } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { InputField } from "../../components/InputField";
import { Layout } from "../../components/Layout";
import { usePostQuery, useUpdatePostMutation } from "../../generated/graphql";
import {
  useGetPostIntId,
} from "../../hooks/useGetPostIntId";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { postInputExamination } from "../../utils/postInputExamination";
import { toErrorsMap } from "../../utils/toErrorsMap";

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
    body = <Spinner size={"xl"} />;
  } else if (!data?.post) {
    body = <Box>貼文不存在···</Box>;
  } else if (data.post) {
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
              ...values,
            },
          });

          router.back();
        }}
      >
        {({ isSubmitting, handleChange }) => (
          <Form>
            <InputField label="標題" name="title" disabled={editing} />
            <Box mt={4}>
              <InputField
                label="內容"
                name="text"
                textArea
                disabled={editing}
              />
            </Box>
            <Box mt={4}>
              <Button
                type="submit"
                colorScheme="messenger"
                disabled={editing}
                isLoading={isSubmitting}
                onChange={handleChange}
              >
                修改
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    );
  }

  return <Layout variant="small">{body}</Layout>;
};

export default withUrqlClient(createUrqlClient)(EditPost);
