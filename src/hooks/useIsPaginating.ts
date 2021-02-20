import { useEffect, useState } from "react";

export function useIsPaginating(
  deps: React.DependencyList | undefined
): boolean {
  const hook = useState(false);
  const [moreFetching, setMoreFetching] = hook;
  useEffect(() => {
    if (moreFetching) {
      setMoreFetching(false);
    } else {
      setMoreFetching(true);
    }
  }, deps);
  return moreFetching;
}
