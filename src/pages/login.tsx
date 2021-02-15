import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useLoginMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorsMap } from "../utils/toErrorsMap";
import { useRouter } from "next/router";
import NextLink from "next/link";

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
  const [, login] = useLoginMutation();
  const router = useRouter();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);

          if (response.data?.login.errors) {
            setErrors(toErrorsMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            if (typeof router.query.next === "string") {
              await router.push(router.query.next);
            }
          } else {
            router.replace("/");
          }
        }}
      >
        {({ isSubmitting, handleChange }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              label="使用者名稱或電子信箱"
              placeholder="輸入您的使用者名稱或電子信箱"
              autoComplete="username"
              required={true}
            />
            <Box mt={2}>
              <InputField
                name="password"
                label="使用者密碼"
                placeholder="使用者密碼長度不得低於 6 個字元"
                autoComplete="current-password"
                type="password"
                required={true}
              />
            </Box>
            <Flex mt={2}>
              <NextLink href="/forgetPassword">
                <Link
                  ml="auto"
                  fontSize="small"
                  color="red"
                  textDecoration="underline"
                >
                  忘記密碼
                </Link>
              </NextLink>
            </Flex>
            <Box>
              <Button
                isLoading={isSubmitting}
                onChange={handleChange}
                colorScheme="messenger"
                type="submit"
              >
                送出
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
