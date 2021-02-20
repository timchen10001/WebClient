import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
export const useIsAuth = (): void => {
  const pause = isServer();
  const router = useRouter();
  const [{ data, fetching }] = useMeQuery({ pause });
  useEffect(() => {
    if (!data?.me && !fetching) {
      router.replace("/login?next=" + router.pathname);
    }
  }, [fetching, data, router]);
};
