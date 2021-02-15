import { FieldError } from "../generated/graphql";
import strip from "../utils/strip";

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
