import { useState, useEffect } from "react";

/**Laxy countdown utility
 * @example
 * ```const resendRemaining = useCountdown(resendAvailableAt);```
 */
export function useCountdown(targetTime?: number) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!targetTime) {
      setRemaining(0);
      return;
    }

    const tick = () => {
      setRemaining(Math.max(0, Math.floor((targetTime - Date.now()) / 1000)));
    };

    tick(); // immediate sync

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetTime]);

  return remaining;
}
