import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import {
  useRegisterMutation,
  UsernameEmailPassword,
} from "../generated/graphql";
import { toErrorsMap } from "../utils/toErrorsMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { passwordExamination } from "../utils/passwordExamination";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const [, register] = useRegisterMutation();
  const router = useRouter();
  return (
    <Wrapper variant="small">
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
          // console.log(response);

          if (response.data?.register.errors) {
            setErrors(toErrorsMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting, handleChange }) => (
          <Form>
            <InputField
              name="username"
              label="使用者名稱"
              placeholder="使用者名稱長度需至少 3字元"
              disabled={isSubmitting}
              required={true}
            />
            <Box mt={2}>
              <InputField
                name="email"
                label="電子信箱"
                placeholder="請輸入電子信箱"
                disabled={isSubmitting}
                required={true}
              />
            </Box>
            <Box mt={2}>
              <InputField
                name="password"
                label="使用者密碼"
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
                disabled={isSubmitting}
                required={true}
              />
            </Box>
            <Box mt={4}>
              <Button
                isLoading={isSubmitting}
                onChange={handleChange}
                colorScheme="messenger"
                type="submit"
              >
                提交
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
