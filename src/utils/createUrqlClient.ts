import { dedupExchange, fetchExchange } from "@urql/core";
import { cacheExchange } from "@urql/exchange-graphcache";
import { Exchange } from "urql";
import { pipe, tap } from "wonka";
import {
  CreatePostMutation,
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  PostsDocument,
  PostsQuery,
  RegisterMutation,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import Router from "next/router";

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(async ({ error }) => {
      if (error?.message.includes("尚未登入")) {
        console.log("尚未登入！");
        Router.replace('/login');
      }
    })
  );
};

export const createUrqlClient = (ssrExchange: any) => {
  return {
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

            // createPost: (_result, args, cache, info) => {
            //   betterUpdateQuery<CreatePostMutation, PostsQuery>(
            //     cache,
            //     { query: PostsDocument },
            //     _result,
            //     (result, query) => {
            //       if (!result.createPost) {
            //         return query;
            //       }
            //       return query;
            //     }
            //   )
            // },

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
              betterUpdateQuery<LogoutMutation, MeQuery>(
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
      errorExchange,
      fetchExchange,
    ],
  };
};
