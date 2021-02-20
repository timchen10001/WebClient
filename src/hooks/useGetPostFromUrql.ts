import { useRouter } from "next/router";
import { UseQueryResponse } from "urql";
import { PostQuery, usePostQuery } from "../generated/graphql";

export const useGetPostFromUrql = (): UseQueryResponse<PostQuery, object> => {
  const router = useRouter();
  const intId =
    typeof router.query?.id === "string" ? parseInt(router.query.id) : -1;

  return usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });
};
