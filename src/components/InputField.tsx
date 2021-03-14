import {
  FormControl,
  FormErrorMessage, FormLabel,
  Input,
  Textarea
} from "@chakra-ui/react";
import { useField } from "formik";
import React, { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  name: string;
  textArea?: boolean;
  minHeight?: string;
  clearValue?: boolean;
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  size: _,
  minHeight = "",
  textArea = false,
  required = false,
  disabled = false,
  clearValue = false,
  ...props
}) => {
  let C: any = Input;
  if (textArea) {
    C = Textarea;
  }

  const [field, { error }] = useField(props);
  return (
    <FormControl
      isInvalid={!!error}
      isRequired={required}
      isDisabled={disabled}
    >
      {label ? <FormLabel htmlFor={field.name}>{label}</FormLabel> : null}
      <C
        {...field}
        {...props}
        minHeight={minHeight}
        _focus={{ borderColor: "lightgray", boxShadow: "sm"  }}
        value={clearValue ? "" : field.value}
        // id={field.name}
      />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
