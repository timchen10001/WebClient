import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { FacebookOAuthIcon } from "../components/icons/FacebookOAuthIcon";
import { GoogleOAuthIcon } from "../components/icons/GoogleOAuthIcon";
import { TwitterOAuthIcon } from "../components/icons/TwitterOAuthIcon";
import { InputField } from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { useIsLogin } from "../hooks/useIsLogin";
import { FixPageLayout } from "../components/layouts/FixPageLayout";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorsMap } from "../utils/toErrorsMap";

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
  useIsLogin();
  const router = useRouter();
  const [{ fetching }, login] = useLoginMutation();

  return (
    <FixPageLayout>
      <Box bgColor="#f9f7f7" borderRadius="lg" p={10} mt={-3}>
        <Heading fontFamily="fantasy" fontSize="3xl">
          會員登入
        </Heading>
        <br />
        <Formik
          initialValues={{ usernameOrEmail: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await login(values);

            if (response.data?.login.errors) {
              setErrors(toErrorsMap(response.data.login.errors));
            } else if (response.data?.login.user) {
              if (typeof router.query?.next === "string") {
                router.push(router.query.next);
              } else {
                router.push("/");
              }
            }
          }}
        >
          {({ isSubmitting, handleChange }) => (
            <Form>
              <InputField
                disabled={fetching}
                name="usernameOrEmail"
                label="使用者名稱或電子信箱"
                placeholder="輸入您的使用者名稱或電子信箱"
                autoComplete="username"
                required={true}
              />
              <Box mt={2}>
                <InputField
                  disabled={fetching}
                  name="password"
                  label="使用者密碼"
                  placeholder="使用者密碼長度不得低於 6 個字元"
                  autoComplete="current-password"
                  type="password"
                  required={true}
                />
              </Box>
              <Flex mt={4}>
                <Button
                  flex={1}
                  isLoading={isSubmitting}
                  onChange={handleChange}
                  bgColor="#9EC9F7"
                  type="submit"
                >
                  送出
                </Button>
              </Flex>
              <Flex
                mt={6}
                maxW="15rem"
                alignItems="center"
                justifyContent="space-around"
                mx="auto"
              >
                <GoogleOAuthIcon />
                <FacebookOAuthIcon />
                <TwitterOAuthIcon />
              </Flex>
              <Flex mt={4} mb={-4}>
                <NextLink href="/forgetPassword">
                  <Link m="auto" color="red" textDecoration="underline">
                    忘記密碼?
                  </Link>
                </NextLink>
              </Flex>
            </Form>
          )}
        </Formik>
      </Box>
      <Flex
        mt={2}
        bgColor="#f9f7f7"
        borderRadius="lg"
        p={4}
        justifyContent="center"
      >
        <Box>
          沒有帳號嗎？
          <NextLink href="/register">
            <Link ml="auto" color="green" textDecoration="underline">
              註冊帳號
            </Link>
          </NextLink>
        </Box>
      </Flex>
    </FixPageLayout>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
