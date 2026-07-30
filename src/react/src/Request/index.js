import { useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteRow,
  getCols,
  getData,
  getFields,
  getGeneral,
  getSidebar,
  postAddFcmToken,
} from "../api";
import { notification } from "antd";
import { getApiToken } from "../lib/authToken";
import {
  isAccessDeniedError,
  moduleLoadQueryOptions,
} from "../lib/queryErrors";
import {
  readSidebarCache,
  writeSidebarCache,
} from "../lib/sidebarCache";

export const useGetData = (pageModule, filter, options) => {
  const serializedFilter = JSON.stringify(filter || {});

  const query = useQuery({
    queryKey: [`index-data-${pageModule}`, serializedFilter],
    queryFn: () => getData(pageModule, filter),
    ...moduleLoadQueryOptions,
    ...options,
  });

  return query;
};

export const useGetColumns = (pageModule, filter, options) => {
  const query = useQuery({
    queryKey: [`index-columns-${pageModule}`],
    queryFn: () => getCols(pageModule, filter),
    ...moduleLoadQueryOptions,
    ...options,
  });

  return query;
};

export const useDeleteRow = () => {
  const mutation = useMutation({
    mutationFn: deleteRow,
    onSuccess: (data) => {
      notification.success({
        message: data.message,
      });
    },
  });

  return mutation;
};

export const useSidebar = () => {
  const cached = readSidebarCache();

  const query = useQuery({
    queryKey: [`sidebar`],
    queryFn: async () => {
      const data = await getSidebar();
      writeSidebarCache(data);
      return data;
    },
    // Hydrate from localStorage so refresh never flashes loading when cache exists.
    initialData: cached?.data,
    initialDataUpdatedAt: cached?.updatedAt,
    // Always treat as stale → background refetch; UI keeps showing cache.
    staleTime: 0,
    gcTime: 1000 * 60 * 60 * 24 * 7,
    enabled: !!getApiToken(),
    retry: false,
    retryOnMount: false,
    refetchOnMount: "always",
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    refetchInterval: (query) =>
      query.state.status === "success" ? 5 * 60 * 1000 : false,
  });

  return query;
};

export const useFieldsQuery = ({ pageModule, id, type }, options) => {
  const query = useQuery({
    queryKey: [`${pageModule}-${id}-${type}`],
    queryFn: () => getFields(pageModule, id, type),
    ...moduleLoadQueryOptions,
    ...options,
  });

  return query;
};

export const useGeneralQuery = () => {
  const query = useQuery({
    queryKey: [`general`],
    queryFn: () => getGeneral(),
    staleTime: 5 * 60 * 1000,
    enabled: !!getApiToken(),
    retry: false,
    // Never remount-retry 403/404; only soft-retry other cached errors (e.g. old anonymous fail)
    retryOnMount: (query) => {
      if (isAccessDeniedError(query.state.error)) return false;
      return query.state.status === "error";
    },
    refetchOnMount: (query) => {
      if (isAccessDeniedError(query.state.error)) return false;
      return false;
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  return query;
};

export const useAddFcmToken = () => {
  const mutation = useMutation({
    mutationFn: postAddFcmToken,
  });

  return mutation;
};
