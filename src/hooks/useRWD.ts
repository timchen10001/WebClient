import { useEffect, useState } from "react";

export type RWDVariant = "mobile" | "PC" | "tablet";

const useRWD = (): RWDVariant => {
  const [device, setDevice] = useState("mobile" as const);

  const handleRWD = () => {
    if (window.innerWidth > 768) {
      setDevice("PC" as any) ;
    } else if (window.innerWidth <= 768 && window.innerWidth > 576) {
      setDevice("tablet" as any);
    } else if (window.innerWidth <= 576) {
      setDevice("mobile" as any);
    }
  };

  useEffect(() => {
      window.addEventListener('resize', handleRWD);
      handleRWD();
      return (() => {
          window.removeEventListener('resize', handleRWD)
      })
  }, [])

  return device;
};

export default useRWD;