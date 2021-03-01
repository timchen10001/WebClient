import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React, { useState } from "react";
import { FixPageLayout } from "../components/FixPageLayout";
import { InputField } from "../components/InputField";
import { useForgetPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { emailExamination } from "../utils/emailExamination";
import { toErrorsMap } from "../utils/toErrorsMap";

interface forgetPasswordProps {}

const ForgetPassword: React.FC<forgetPasswordProps> = ({}) => {
  const [, forgetPassword] = useForgetPasswordMutation();
  const [tokenSend, setTokenSend] = useState(false);

  return (
    <FixPageLayout variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values, { setErrors }) => {
          const checkError = emailExamination(values.email, "email");
          if (checkError) {
            setErrors(toErrorsMap(checkError));
            return;
          }

          const response = await forgetPassword({ email: values.email });

          if (response.data?.forgetPassword) {
            console.log(response.data.forgetPassword);
            setTokenSend(true);
          }
        }}
      >
        {({ isSubmitting, handleChange }) =>
          tokenSend ? (
            <>
              <Box style={{ color: "red", fontSize: "small" }}>
                密碼重設認證已寄送至信箱
              </Box>
              <br />
              <Flex>
                <NextLink href="/">
                  <Link colorScheme="blue">回主頁</Link>
                </NextLink>
                <NextLink href="/login">
                  <Link ml={2}>登入</Link>
                </NextLink>
              </Flex>
            </>
          ) : (
            <Form>
              <InputField
                label="使用者信箱"
                name="email"
                placeholder="輸入電子信箱，以重設密碼"
                disabled={isSubmitting}
                required={true}
              />
              <Box mt={4}>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  onChange={handleChange}
                  colorScheme="messenger"
                >
                  提交
                </Button>
              </Box>
            </Form>
          )
        }
      </Formik>
    </FixPageLayout>
  );
};

export default withUrqlClient(createUrqlClient)(ForgetPassword);
