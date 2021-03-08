import { FieldError } from "../generated/graphql";

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
