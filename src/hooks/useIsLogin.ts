import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

export const useIsLogin = (): void => {
  const pause = isServer();
  const router = useRouter();
  const [{ data, fetching }] = useMeQuery({ pause });
  useEffect(() => {
    if (!fetching && data?.me) {
      router.replace("/");
    }
  }, [data, fetching, router]);
};
