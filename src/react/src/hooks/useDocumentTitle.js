import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGeneral } from "../api";
import { getApiToken } from "../lib/authToken";

const DEFAULT_SITE_NAME = "Panel";

export const buildDocumentTitle = (pageTitle, { siteName, suffix } = {}) => {
  const appName = siteName || DEFAULT_SITE_NAME;
  const parts = [pageTitle, suffix].filter(Boolean);

  if (!parts.length) {
    return appName;
  }

  return `${parts.join(" - ")} | ${appName}`;
};

/**
 * Sets document.title reactively.
 * Reads the panel name from the cached general query when available.
 * Does NOT fetch /mehr-panel while logged out (avoids caching a 401 that
 * would break DefaultLayout after login).
 */
export default function useDocumentTitle(pageTitle, options = {}) {
  const { suffix } = options;
  const hasToken = Boolean(getApiToken());

  const { data: generalData } = useQuery({
    queryKey: ["general"],
    queryFn: getGeneral,
    staleTime: 5 * 60 * 1000,
    enabled: hasToken,
    retry: false,
    retryOnMount: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const siteName = generalData?.name;

  useEffect(() => {
    document.title = buildDocumentTitle(pageTitle, { siteName, suffix });
  }, [pageTitle, suffix, siteName]);
}
