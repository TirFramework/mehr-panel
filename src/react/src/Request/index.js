import { useQuery } from "react-query";
import { getCols, getData } from "../api";

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
