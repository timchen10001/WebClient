import { Cache } from "@urql/exchange-graphcache";

export const reRenderFieldsByCache = (
  cache: Cache,
  entity: string,
  fieldName: string
): void => {
  const allFields = cache.inspectFields(entity);
  const fieldsInfos = allFields.filter((fi) => fi.fieldName === fieldName);
  fieldsInfos.forEach((fi) => {
    cache.invalidate(entity, fieldName, fi.arguments || {});
  });
};
