import { FieldError } from "../generated/graphql";

export function emailExamination(
  email: string,
  field: string
): FieldError[] | undefined {
  if (!email.includes("@")) {
    return [
      {
        field,
        message: "電子信箱格式錯誤",
      },
    ];
  }
  return
}
