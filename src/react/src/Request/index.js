import { useMutation, useQuery } from "@tanstack/react-query";
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
    {
      queryKey: [`index-data-${pageModule}`, filter],
      queryFn: () => getData(pageModule, filter),
      ...options
    }
  );

  return query;
};

export const useGetColumns = (pageModule, filter, options) => {
  const query = useQuery({
    queryKey: [`index-columns-${pageModule}`],
    queryFn: () => getCols(pageModule, filter),
    ...options

  }
  );

  return query;
};

export const useDeleteRow = () => {
  const mutation = useMutation({
    mutationFn: deleteRow,
    onSuccess: (data) => {
      notification.success({
        message: data.message,
      });
    }
  });

  return mutation;
};

export const useSidebar = () => {
  const query = useQuery({
    queryKey: [`sidebar`],
    queryFn: () => getSidebar(),
  }
  );

  return query;
};

export const useFieldsQuery = ({ pageModule, id, type }, options) => {
  const query = useQuery({
    queryKey: [`${pageModule}-${id}-${type}`],
    queryFn: () => getFields(pageModule, id, type),
    options: options
  }
  );

  return query;
};

export const useGeneralQuery = () => {
  const query = useQuery(
    {
      queryKey: [`general`],
      queryFn: () => getGeneral()
    }

  );
  return query;
};

export const useAddFcmToken = () => {
  const mutation = useMutation({


    mutationFn: postAddFcmToken
  });
  return mutation;
};
