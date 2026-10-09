import * as React from "react";

const emptySubscribe = () => () => {};

/**
 * True after hydration. Interactive widgets that Radix renders with generated
 * ARIA wiring (Sheet triggers) can be gated behind this flag so that the
 * server and the first client render match exactly.
 */
export function useMounted(): boolean {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
