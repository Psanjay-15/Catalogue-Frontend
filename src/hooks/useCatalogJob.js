import { useEffect, useRef, useState } from "react";
import { getCatalog, toErrorMessage } from "../services";
import { TERMINAL_STATUSES } from "../constants/options";


export function useCatalogJob(catalogId, { intervalMs = 2500 } = {}) {
  const [catalog, setCatalog] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(Boolean(catalogId));
  const timerRef = useRef(null);

  useEffect(() => {
    if (!catalogId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    async function tick() {
      try {
        const data = await getCatalog(catalogId);
        if (cancelled) return;
        setCatalog(data);
        setLoading(false);

        if (TERMINAL_STATUSES.includes(data.status)) {
          clearInterval(timerRef.current);
        }
      } catch (err) {
        if (cancelled) return;
        setError(toErrorMessage(err));
        setLoading(false);
        clearInterval(timerRef.current);
      }
    }

    tick(); 
    timerRef.current = setInterval(tick, intervalMs);

    return () => {
      cancelled = true;
      clearInterval(timerRef.current);
    };
  }, [catalogId, intervalMs]);

  const isTerminal =
    catalog && TERMINAL_STATUSES.includes(catalog.status);

  return { catalog, error, loading, isTerminal };
}

export default useCatalogJob;
