import { useEffect, useState } from "react";

export function useMinuteRefresh() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTick((tick) => tick + 1);
    }, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);
}
