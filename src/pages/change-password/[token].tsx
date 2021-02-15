import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toErrorsMap } from "../../utils/toErrorsMap";
import { passwordExamination } from "../../utils/passwordExamination";
import { useRouter } from "next/router";

interface changePasswordProps {}

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const router = useRouter();
  const [{ fetching }, changePassword] = useChangePasswordMutation();
  const [tokenExpried, setTokenExpired] = useState(false);

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "", checkNewPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const { newPassword, checkNewPassword } = values;

          const checkError = passwordExamination(
            newPassword,
            checkNewPassword,
            "checkNewPassword"
          );
          if (checkError) {
            setErrors(toErrorsMap(checkError));
            return;
          }

          const response = await changePassword({ token, newPassword });

          if (response.data?.changePassword.errors) {
            const errorsMap = toErrorsMap(response.data.changePassword.errors);
            if ("token" in errorsMap) {
              setTokenExpired(true);
            }
            setErrors(errorsMap);
          } else if (response.data?.changePassword.user) {
              router.push('/')
          }
        }}
      >
        {({ isSubmitting, handleChange }) => (
          <Form>
            <InputField
              name="newPassword"
              label="新的密碼"
              placeholder="密碼長度不得低於 6 個字元"
              required={true}
              type="password"
              autoComplete="new-password"
            />
            <Box mt={4}>
              <InputField
                name="checkNewPassword"
                label="確認新的密碼"
                placeholder="請再次輸入密碼"
                type="password"
                autoComplete="new-password"
                required={true}
              />
            </Box>
            <Box mt={4}>
              {tokenExpried ? (
                <Box style={{ color: "red", fontSize: "small" }}>
                  憑證已過期
                </Box>
              ) : null}
            </Box>
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
        )}
      </Formik>
    </Wrapper>
  );
};

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default withUrqlClient(createUrqlClient)(ChangePassword as any);
