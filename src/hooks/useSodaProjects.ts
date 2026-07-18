import { useEffect, useState } from "react";
import type { FetchState } from "../types";
import { fetchSodaProjects } from "../utils/fetchProjects";

export function useSodaProjects(): FetchState {
  const [state, setState] = useState<FetchState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    fetchSodaProjects()
      .then((items) => {
        if (cancelled) return;
        if (items.length === 0) {
          setState({ status: "empty" });
        } else {
          setState({ status: "success", items });
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "Unknown error occurred";
        setState({ status: "error", message });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
