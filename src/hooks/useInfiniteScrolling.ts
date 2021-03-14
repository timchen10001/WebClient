import { useEffect, useState } from "react";
import { sleep } from "../utils/sleep";

type infiniteScrollingProps = {
  hasMore: boolean;
  changeCursor: () => void;
};

export const useInfiniteScrolling = ({
  hasMore,
  changeCursor,
}: infiniteScrollingProps) => {
  const [moreFetching, setMoreFetching] = useState(false);
  const [hasClick, setHasClicked] = useState(false);
  const [ableToClick, setAbleToClick] = useState(false);

  const handleInfiniteScrolling = () => {
    const viewDiff =
      document.documentElement.scrollHeight -
      document.documentElement.scrollTop -
      document.documentElement.clientHeight;
    if (viewDiff > 0 && viewDiff < 180) {
      setAbleToClick(true);
    } else {
      setAbleToClick(false);
    }
  };

  const fetchMoreByButton = async () => {
    setHasClicked(true);
    setMoreFetching(true);
    await sleep(2000);
    setMoreFetching(false);
    setHasClicked(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleInfiniteScrolling);
    return () => {
      window.removeEventListener("scroll", handleInfiniteScrolling);
    };
  }, []);

  if (hasMore && ableToClick && !hasClick) {
    fetchMoreByButton();
    changeCursor();
  }
  return { moreFetching };
};
