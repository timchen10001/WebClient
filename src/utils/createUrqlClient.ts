import { dedupExchange, fetchExchange, stringifyVariables } from "@urql/core";
import { cacheExchange, Resolver } from "@urql/exchange-graphcache";
import gql from "graphql-tag";
import { SSRExchange } from "next-urql";
import Router from "next/router";
import { ClientOptions, Exchange } from "urql";
import { pipe, tap } from "wonka";
import {
  DeletePostMutationVariables,
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
  VoteMutationVariables,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import { isServer } from "./isServer";
import { reRenderFieldsByCache } from "./reRenderFieldsByCache";

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(async ({ error }) => {
      if (error?.message.includes("尚未登入")) {
        console.log("您尚未登入！");
        Router.replace("/login");
      } else if (error?.message.includes("已登入")) {
        console.log("您已登入 !");
        Router.replace("/");
      }
    })
  );
};


const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);

    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);

    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }
    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCache = cache.resolve(
      cache.resolve(entityKey, fieldKey) as string,
      "posts"
    );
    info.partial = !isItInTheCache;
    let hasMore: boolean = true;
    const result: string[] = [];

    // console.log({
    //   allFields,
    //   fieldInfos,
    //   fieldKey,
    //   isItInTheCache
    // })
    fieldInfos.forEach((fi) => {
      const key = cache.resolve(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, "posts") as string[];
      const _hasMore = cache.resolve(key, "hasMore") as boolean;
      // console.log({
      //   key,
      //   data,
      //   _hasMore,
      // });
      if (!_hasMore) {
        hasMore = _hasMore;
      }
      result.push(...data);
    });

    return {
      __typename: "PaginatedPosts",
      hasMore,
      posts: result,
    };

    // const visited = new Set();
    // let result: NullArray<string> = [];
    // let prevOffset: number | null = null;

    // for (let i = 0; i < size; i++) {
    //   const { fieldKey, arguments: args } = fieldInfos[i];
    //   if (args === null || !compareArgs(fieldArgs, args)) {
    //     continue;
    //   }

    //   const links = cache.resolve(entityKey, fieldKey) as string[];
    //   const currentOffset = args[offsetArgument];

    //   if (
    //     links === null ||
    //     links.length === 0 ||
    //     typeof currentOffset !== 'number'
    //   ) {
    //     continue;
    //   }

    //   const tempResult: NullArray<string> = [];

    //   for (let j = 0; j < links.length; j++) {
    //     const link = links[j];
    //     if (visited.has(link)) continue;
    //     tempResult.push(link);
    //     visited.add(link);
    //   }

    //   if (
    //     (!prevOffset || currentOffset > prevOffset) ===
    //     (mergeMode === 'after')
    //   ) {
    //     result = [...result, ...tempResult];
    //   } else {
    //     result = [...tempResult, ...result];
    //   }

    //   prevOffset = currentOffset;
    // }

    // const hasCurrentPage = cache.resolve(entityKey, fieldName, fieldArgs);
    // if (hasCurrentPage) {
    //   return result;
    // } else if (!(info as any).store.schema) {
    //   return undefined;
    // } else {
    //   info.partial = true;
    //   return result;
    // }
  };
};

export const createUrqlClient = (
  ssrExchange: SSRExchange,
  ctx: any
): ClientOptions => {
  let cookie: string = "";
  if (isServer()) {
    cookie = ctx?.req.headers.cookie;
  }

  return {
    url: process.env.NEXT_PUBLIC_API_URL as string,
    fetchOptions: {
      credentials: "include" as const,
      headers: cookie ? { cookie } : undefined,
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        keys: {
          PaginatedPosts: () => null,
          Friend: () => null,
        },
        resolvers: {
          Query: {
            posts: cursorPagination(),
            // receives: invitationReceives(),
          },
        },
        updates: {
          Mutation: {
            deletePost: (_result, args, cache, info) => {
              cache.invalidate({
                __typename: "Post",
                id: (args as DeletePostMutationVariables).id,
              });
            },

            vote: (_result, args, cache, info) => {
              const { postId, value } = args as VoteMutationVariables;
              const data = cache.readFragment(
                gql`
                  fragment _ on Post {
                    id
                    points
                    voteStatus
                  }
                `,
                { id: postId } as any
              );
              // console.log({
              //   data,
              // });
              if (data) {
                const sameDoot = data.voteStatus === value;
                const oldPoints = data.points as number;
                const newPoints = sameDoot
                  ? oldPoints - value
                  : oldPoints + (!data.voteStatus ? 1 : 2) * value;
                const newVoteStatus = sameDoot ? null : value;

                cache.writeFragment(
                  gql`
                    fragment _ on Post {
                      id
                      points
                      voteStatus
                    }
                  `,
                  {
                    id: postId,
                    points: newPoints,
                    voteStatus: newVoteStatus,
                  } as any
                );
              }
            },

            respondToReceive: (_result, args, cache, info) => {
              reRenderFieldsByCache(cache, "Query", "receives");
            },

            createPost: (_result, args, cache, info) => {
              reRenderFieldsByCache(cache, "Query", "posts");
              // cache.invalidate({ __typename: "PaginatedPosts" });
            },

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
              reRenderFieldsByCache(cache, "Query", "receives");
              reRenderFieldsByCache(cache, "Query", "posts");
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
      errorExchange,
      ssrExchange,
      fetchExchange,
    ],
  };
};
