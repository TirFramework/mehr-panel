import { useMutation, useQuery } from "react-query";
import {
  deleteRow,
  getCols,
  getCreateOrEditFields,
  getData,
  getFields,
  getGeneral,
  getSidebar,
  postAddFcmToken,
} from "../api";
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

export const useSidebar = () => {
  const query = useQuery([`sidebar`], () => getSidebar());

  return query;
};

export const useFieldsQuery = ({ pageModule, id, type }, options) => {
  const query = useQuery(
    [`${pageModule}-${id}-${type}`],
    () => getFields(pageModule, id, type),
    options
  );

  return query;
};

export const useGeneralQuery = () => {
  const query = useQuery([`general`], () => getGeneral());
  return query;
};

export const useAddFcmToken = () => {
  const mutation = useMutation(postAddFcmToken);
  return mutation;
};
