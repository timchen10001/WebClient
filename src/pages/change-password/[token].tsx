import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { passwordExamination } from "../../utils/passwordExamination";
import { toErrorsMap } from "../../utils/toErrorsMap";

const ChangePassword: NextPage<{ token: string }> = ({}) => {
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

          const response = await changePassword({
            newPassword,
            token:
              typeof router.query.token === "string" ? router.query.token : "",
          });

          if (response.data?.changePassword.errors) {
            const errorsMap = toErrorsMap(response.data.changePassword.errors);
            if ("token" in errorsMap) {
              setTokenExpired(true);
            }
            setErrors(errorsMap);
          } else if (response.data?.changePassword.user) {
            router.push("/");
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
              disabled={tokenExpried}
              autoComplete="new-password"
            />
            <Box mt={4}>
              <InputField
                name="checkNewPassword"
                label="確認新的密碼"
                placeholder="請再次輸入密碼"
                type="password"
                autoComplete="new-password"
                disabled={tokenExpried}
                required={true}
              />
            </Box>
            <Box mt={4}>
              {tokenExpried ? (
                <Flex fontSize="14px">
                  <Box color="red">憑證已過期</Box>
                  <Box color="blue" ml="auto" textDecoration="underline">
                    <NextLink href="/forgetPassword">
                      <Link>重新取得密碼重置憑證</Link>
                    </NextLink>
                  </Box>
                </Flex>
              ) : (
                <Button
                  type="submit"
                  onChange={handleChange}
                  isLoading={isSubmitting}
                  colorScheme="messenger"
                >
                  提交
                </Button>
              )}
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ChangePassword as any);
