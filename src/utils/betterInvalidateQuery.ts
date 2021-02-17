import { Cache } from "@urql/exchange-graphcache";
export function betterInvalidateQuery(
  cache: Cache,
  entityKey: string = "Query",
  fieldName: string,
): void {
  const allFields = cache.inspectFields(entityKey);
  const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
  // invalid all of the queries
  fieldInfos.forEach((fi) => {
    cache.invalidate(entityKey, fieldName, fi.arguments || {});
  });
}
