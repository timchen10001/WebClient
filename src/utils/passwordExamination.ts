import { FieldError } from "../generated/graphql";

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
