import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import React, { useEffect, useState } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useForgetPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { emailExamination } from "../utils/emailExamination";
import { toErrorsMap } from "../utils/toErrorsMap";

interface forgetPasswordProps {}

const ForgetPassword: React.FC<forgetPasswordProps> = ({}) => {
  const [, forgetPassword] = useForgetPasswordMutation();
  const [tokenSend, setTokenSend] = useState(false);

  return (
    <Wrapper variant="small">
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
            <Box style={{ color: "red", fontSize: "small" }}>
              密碼重設認證已寄送至信箱
            </Box>
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
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ForgetPassword);
