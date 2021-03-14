import { FieldError } from "../generated/graphql";
import strip from "./strip";

export function emailExamination(
  email: string,
  field: string
): FieldError[] | undefined {
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    return [
      {
        field,
        message: "電子信箱格式錯誤",
      },
    ];
  }
  return;
}

export function passwordExamination(
  password: string,
  checkPassword: string,
  field: string
): FieldError[] | undefined {
  if (password !== checkPassword) {
    return [
      {
        field,
        message: "與使用者密碼不符",
      },
    ];
  }

  return;
}

interface postInputField {
  title: string;
  text: string;
}

export function postInputExamination(
  title: string,
  text: string,
  fields: postInputField
): FieldError[] | undefined {
  const stripTitle = strip(title, ["\n", " "]);
  const stripText = strip(text, ["\n", " "]);

  if (!stripTitle) {
    return [
      {
        field: fields.title,
        message: "標題不可為空白",
      },
    ];
  }
  if (!stripText) {
    return [
      {
        field: fields.text,
        message: "請輸入內容",
      },
    ];
  }

  return;
}
