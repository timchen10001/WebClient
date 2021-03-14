import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { FixPageLayout } from "../layouts/FixPageLayout";
import { InputField } from "../components/InputField";
import {
  useRegisterMutation,
  UsernameEmailPassword,
} from "../generated/graphql";
import { useIsLogin } from "../hooks/useIsLogin";
import { createUrqlClient } from "../utils/createUrqlClient";
import { passwordExamination } from "../utils/validators";
import { toErrorsMap } from "../utils/toErrorsMap";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  useIsLogin();
  const [, register] = useRegisterMutation();
  const router = useRouter();
  return (
    <FixPageLayout>
      <Box bgColor="#f9f7f7" borderRadius="lg" p={10} mt={-3}>
        <Heading fontFamily="fantasy" fontSize="3xl">
          會員註冊
        </Heading>
        <br />
        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
            checkPassword: "",
          }}
          onSubmit={async (values, { setErrors }) => {
            const checkError = passwordExamination(
              values.password,
              values.checkPassword,
              "checkPassword"
            );
            if (checkError) {
              setErrors(toErrorsMap(checkError));
              return;
            }

            const input = {
              username: values.username,
              email: values.email,
              password: values.password,
            } as UsernameEmailPassword;

            const response = await register({ input });

            if (!response.data?.register) {
              console.log("hi");
            } else if (response.data.register.errors) {
              setErrors(toErrorsMap(response.data.register.errors));
            } else if (response.data.register.user) {
              router.push("/");
            }
          }}
        >
          {({ isSubmitting, handleChange }) => (
            <Form>
              <InputField
                name="username"
                label="使用者名稱"
                placeholder="使用者名稱長度需至少 3 字元"
                autoComplete={"username"}
                disabled={isSubmitting}
                required={true}
              />
              <Box mt={2}>
                <InputField
                  name="email"
                  label="電子信箱"
                  placeholder="請輸入電子信箱"
                  autoComplete={"email"}
                  disabled={isSubmitting}
                  required={true}
                />
              </Box>
              <Box mt={2}>
                <InputField
                  name="password"
                  label="使用者密碼"
                  autoComplete={"new-password"}
                  placeholder="密碼長度需至少 6 字元"
                  type="password"
                  disabled={isSubmitting}
                  required={true}
                />
              </Box>
              <Box mt={4}>
                <InputField
                  name="checkPassword"
                  label="確認使用者密碼"
                  placeholder="重複使用者密碼"
                  type="password"
                  autoComplete={"new-password"}
                  disabled={isSubmitting}
                  required={true}
                />
              </Box>
              <Flex mt={6}>
                <Button
                  flex={1}
                  bgColor="#9EC9F7"
                  isLoading={isSubmitting}
                  onChange={handleChange}
                  type="submit"
                >
                  提交
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Box>
    </FixPageLayout>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
