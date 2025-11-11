import { useMutation, useQuery, keepPreviousData } from "@tanstack/react-query";
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

export const useGetData = (pageModule, filter, options) => {
  // Serialize filter to avoid unnecessary refetches when object reference changes
  const serializedFilter = JSON.stringify(filter || {});

  const query = useQuery({
    queryKey: [`index-data-${pageModule}`, serializedFilter],
    queryFn: () => getData(pageModule, filter),
    // staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    // placeholderData: keepPreviousData, // Keep previous data while fetching new data
    // refetchOnMount: "always", // Only refetch if data is stale
    // refetchOnWindowFocus: false, // Don't refetch on window focus
    ...options,
  });

  return query;
};

export const useGetColumns = (pageModule, filter, options) => {
  const query = useQuery({
    queryKey: [`index-columns-${pageModule}`],
    queryFn: () => getCols(pageModule, filter),
    // staleTime: 5 * 60 * 1000, // Consider columns fresh for 5 minutes
    // placeholderData: keepPreviousData, // Keep previous data while fetching new data
    // refetchOnMount: "always", // Only refetch if data is stale
    // refetchOnWindowFocus: false, // Don't refetch on window focus
    onSuccess: (res) => {},
    ...options,
  });

  return query;
};

export const useDeleteRow = () => {
  const mutation = useMutation({
    mutationFn: deleteRow,
    options: {
      onSuccess: (data) => {
        notification.success({
          message: data.message,
        });
      },
    },
  });

  return mutation;
};

export const useSidebar = () => {
  const query = useQuery({
    queryKey: [`sidebar`],
    queryFn: () => getSidebar(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
  return query;
};

export const useFieldsQuery = ({ pageModule, id, type }, options) => {
  const query = useQuery({
    queryKey: [`${pageModule}-${id}-${type}`],
    queryFn: () => getFields(pageModule, id, type),
    staleTime: 2 * 60 * 1000, // Consider fields fresh for 2 minutes
    placeholderData: keepPreviousData, // Keep previous data while fetching
    refetchOnWindowFocus: false, // Don't refetch on window focus
    ...options,
  });

  return query;
};

export const useGeneralQuery = () => {
  const query = useQuery({
    queryKey: [`general`],
    queryFn: () => getGeneral(),
  });
  return query;
};

export const useAddFcmToken = () => {
  const mutation = useMutation({
    mutationFn: postAddFcmToken,
  });
  return mutation;
};
