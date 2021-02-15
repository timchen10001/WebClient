import { FieldError } from "../generated/graphql";

export const toErrorsMap = (errors: FieldError[]) => {
    const errorsMap: Record<string, string> = {};
    errors.forEach(({ field, message }) => {
        errorsMap[field] = message;
    });
    return errorsMap;
}