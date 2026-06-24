import { useState, useCallback } from "react";
import axios from "../lib/axios";

/**
 * Calls the model-specific AI filter endpoint and returns extracted filters.
 *
 * @param {string} module  The pageModule slug (e.g. "profile").
 *                         The endpoint convention is: POST /{module}/ai-filter
 */
function useAiSearch(module) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const extractFilters = useCallback(
    async (query) => {
      if (!query?.trim()) return {};

      setLoading(true);
      setError(null);

      try {
        const { data } = await axios.post(`${module}/ai-filter`, { query });
        return data?.filters ?? {};
      } catch (err) {
        setError(err);
        return {};
      } finally {
        setLoading(false);
      }
    },
    [module]
  );

  return { extractFilters, loading, error };
}

export default useAiSearch;
