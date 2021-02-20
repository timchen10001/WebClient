import { useRouter } from "next/router";

export const useGetPostIntId = (): number => {
  const router = useRouter();
  const intId =
    typeof router.query?.id === "string" ? parseInt(router.query.id) : -1;

  return intId;
};
