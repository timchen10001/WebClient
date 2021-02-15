import { dedupExchange, fetchExchange } from "@urql/core";
import { cacheExchange } from "@urql/exchange-graphcache";
import {
  LoginMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";

export const createUrqlClient = (ssrExchange: any) => {
  // let cookie;
  // if (ctx.req.)

  return ({
    url: "http://localhost:4000/graphql",
    fetchOptions: {
      credentials: "include" as const,
      // headers:
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        updates: {
          Mutation: {

            login: (_result, args, cache, info) => {
              betterUpdateQuery<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (!result.login.user) {
                    return query;
                  }
                  return { me: result.login.user };
                }
              );
            },

            register: (_result, args, cache, info) => {
              betterUpdateQuery<RegisterMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (!result.register.user) {
                    return query;
                  }
                  return { me: result.register.user };
                }
              );
            },

            logout: (_result, args, cache, info) => {
              betterUpdateQuery<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                () => ({ me: null })
              );
            },

          },
        },
      }),
      ssrExchange,
      fetchExchange,
    ],
  });
};
