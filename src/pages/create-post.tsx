import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, IconButton, Input } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { useCreatePostMutation } from "../generated/graphql";
import { useIsAuth } from "../hooks/useIsAuth";
import { Layout } from "../components/layouts/Layout";
import { createUrqlClient } from "../utils/createUrqlClient";
import { getFormDataFromFileList } from "../utils/getFormDataFromFileList";
import { toErrorsMap } from "../utils/toErrorsMap";
import { uploadImage } from "../utils/uploadImage";
import { postInputExamination } from "../utils/validators";

interface createPostProps {}

const CreatePost: React.FC<createPostProps> = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [, createPost] = useCreatePostMutation();

  let imgFileList: any = [];
  return (
    <Layout>
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

            let images = "";
            if (imgFileList.length !== 0) {
              const formData = getFormDataFromFileList(imgFileList, "image");
              try {
                images = await uploadImage(formData);
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
                maxLength={20}
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
                  multiple={true}
                  name="image"
                  onChange={(e) => {
                    imgFileList = e.target.files;
                  }}
                />
                <IconButton
                  pr={2}
                  id={"interfaceFile"}
                  flex={1}
                  bgColor="#dae4ef"
                  aria-label="上傳相片"
                  _focus={{ border: "none" }}
                  icon={<AddIcon boxSize="4" />}
                  onClick={() => {
                    document.getElementById("hiddenFile")?.click();
                  }}
                />
                {/* <Select
                  pl={2}
                  maxW="50%"
                  variant="filled"
                  bgColor={"#dae4ef"}
                  onChange={(e) => {
                    if (e.target.value === "public") {
                      setIsPublic(true);
                    } else {
                      setIsPublic(false);
                    }
                  }}
                  _focus={{ border: "none" }}
                >
                  <option value="public">公開</option>
                  <option value="private">私人</option>
                </Select> */}
              </Flex>
              <Flex mt={4}>
                <Button
                  flex={1}
                  type="submit"
                  bgColor="#9EC9F7"
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
