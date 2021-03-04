import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, IconButton, Input } from "@chakra-ui/react";
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
import { uploadImage } from "../utils/uploadImage";

interface createPostProps {}

const CreatePost: React.FC<createPostProps> = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [, createPost] = useCreatePostMutation();

  let imgFileList: any = [];
  return (
    <Layout variant="regular">
      <Box bgColor="#f9f7f7" borderRadius="lg" p={4}>
        <Formik
          initialValues={{ postTitle: "", postText: "", interfaceFile: "" }}
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

            let images = "";
            if (imgFileList.length !== 0) {
              const formData = new FormData();
              formData.append("image", imgFileList[0]);
              try {
                const imgInfo = await uploadImage(formData);
                images = imgInfo.data.path;
              } catch (err) {
                console.log(err);
                return;
              }
            }

            imgFileList = null;

            const { error } = await createPost({
              input: { title, text, images },
            });
            if (error) {
              console.log(error);
            } else {
              router.push("/");
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
                <Input
                  id="hiddenFile"
                  style={{ display: "none" }}
                  type="file"
                  name="image"
                  onChange={(e) => {
                    imgFileList = e.target.files;
                  }}
                />
                <IconButton
                  id={"interfaceFile"}
                  flex={1}
                  colorScheme="facebook"
                  aria-label="上傳相片"
                  _focus={{ border: "none" }}
                  icon={<AddIcon boxSize="4" />}
                  onClick={() => {
                    document.getElementById("hiddenFile")?.click();
                  }}
                />
              </Flex>
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
