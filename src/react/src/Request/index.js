import { useMutation, useQuery } from "react-query";
import { deleteRow, getCols, getData } from "../api";
import { notification } from "antd";

export const useGetData = (pageModule, filter, options) => {
  const query = useQuery(
    [`index-data-${pageModule}`, filter],
    () => getData(pageModule, filter),
    options
  );

  return query;
};

export const useGetColumns = (pageModule, filter, options) => {
  const query = useQuery(
    [`index-columns-${pageModule}`],
    () => getCols(pageModule, filter),
    options
  );

  return query;
};

export const useDeleteRow = () => {
  const mutation = useMutation(deleteRow, {
    onSuccess: (data) => {
      notification.success({
        message: data.message,
      });
    },
  });

  return mutation;
};
