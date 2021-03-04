import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Image,
  Text,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { FixPageLayout } from "../components/FixPageLayout";
import { InputField } from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { useIsLogin } from "../hooks/useIsLogin";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorsMap } from "../utils/toErrorsMap";

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
  useIsLogin();
  const router = useRouter();
  const [{ fetching }, login] = useLoginMutation();

  return (
    <FixPageLayout variant="small">
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
                  bgColor="Highlight"
                  type="submit"
                >
                  送出
                </Button>
              </Flex>
              <Flex mt={4}>
                <NextLink href={`${process.env.NEXT_PUBLIC_OAUTH_URL}/google`}>
                  <Button
                    variant="unstyled"
                    flex={1}
                    bgColor="#F53E29"
                    color="white"
                    _focus={{ border: "none" }}
                  >
                    <Flex alignItems="center" justifyContent="center">
                      <Image
                        src={
                          "https://res.cloudinary.com/dunc6xvuh/image/upload/v1614853664/material/google_ivvqdm.png"
                        }
                        boxSize={"9"}
                        mr={1}
                      />
                      Google+
                    </Flex>
                  </Button>
                </NextLink>
              </Flex>
              <Flex mt={3} mb={-6}>
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
          沒有帳號？
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
