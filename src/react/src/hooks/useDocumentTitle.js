import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGeneral } from "../api";

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
 */
export default function useDocumentTitle(pageTitle, options = {}) {
  const { suffix } = options;
  const { data: generalData } = useQuery({
    queryKey: ["general"],
    queryFn: getGeneral,
    enabled: false,
  });

  const siteName = generalData?.name;

  useEffect(() => {
    document.title = buildDocumentTitle(pageTitle, { siteName, suffix });
  }, [pageTitle, suffix, siteName]);
}
