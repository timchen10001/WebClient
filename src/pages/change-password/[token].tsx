import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FixPageLayout } from "../../layouts/FixPageLayout";
import { InputField } from "../../components/InputField";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { passwordExamination } from "../../utils/validators";
import { toErrorsMap } from "../../utils/toErrorsMap";

const ChangePassword: NextPage<{ token: string }> = ({}) => {
  const router = useRouter();
  const [, changePassword] = useChangePasswordMutation();
  const [tokenExpried, setTokenExpired] = useState(false);

  return (
    <FixPageLayout>
      <Box bgColor="#f9f7f7" borderRadius="lg" p={10} mt={-3}>
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
                typeof router.query.token === "string"
                  ? router.query.token
                  : "",
            });

            if (response.data?.changePassword.errors) {
              const errorsMap = toErrorsMap(
                response.data.changePassword.errors
              );
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
                type="password"
                autoComplete="new-password"
                disabled={isSubmitting || tokenExpried}
                clearValue={tokenExpried}
                required={true}
              />
              <Box mt={4}>
                <InputField
                  name="checkNewPassword"
                  label="確認新的密碼"
                  placeholder="請再次輸入密碼"
                  type="password"
                  autoComplete="new-password"
                  disabled={isSubmitting || tokenExpried}
                  clearValue={tokenExpried}
                  required={true}
                />
              </Box>
              {tokenExpried ? (
                <Flex fontSize="14px" mt={2}>
                  <Box color="red">憑證已過期</Box>
                  <Box color="blue" ml="auto" textDecoration="underline">
                    <NextLink href="/forgetPassword">
                      <Link>重新取得密碼重置憑證</Link>
                    </NextLink>
                  </Box>
                </Flex>
              ) : (
                <Flex mt={4}>
                  <Button
                    flex={1}
                    type="submit"
                    onChange={handleChange}
                    isLoading={isSubmitting}
                    bgColor="#9EC9F7"
                  >
                    提交
                  </Button>
                </Flex>
              )}
            </Form>
          )}
        </Formik>
      </Box>
    </FixPageLayout>
  );
};

export default withUrqlClient(createUrqlClient)(ChangePassword as any);
