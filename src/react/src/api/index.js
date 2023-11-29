import Config from "../constants/config";
import axios from "../lib/axios";
import { getColsNormalize } from "../lib/utils";

export const postLogout = async () => {
  const { data } = await axios.post(`/logout`);
  return data;
};

export const postLogin = async (body) => {
  const { data } = await axios.post(`/login`, body);
  return data;
};

export const getSidebar = async () => {
  const { data } = await axios.get(`/sidebar`);
  return data;
};

export const getGeneral = async () => {
  const { data } = await axios.get(`/mehr-panel`);
  return data;
};

export const getRows = async (module, props) => {
  const { data } = await axios.get(`${module}/data`, {
    params: {
      page: props.current,
      result: props.pageSize,
      filters: props.filters,
      search: props.search,
      sorter: props.sorter,
      locale: "all",
    },
  });
  return await data;
};

export const getDetailFields = async (module, id) => {
  const { data } = await axios.get(`${module}/${id}`);
  return await data;
};

export const getCreateOrEditFields = async (module, id = null) => {
  if (id) {
    const { data } = await axios.get(`${module}/${id}/edit?locale=all`);
    return await data;
  } else {
    const { data } = await axios.get(`${module}/create`);
    return await data;
  }
};

export const postCreate = async (module, body) => {
  const { data } = await axios.post(`${module}`, body);
  return await data;
};

export const postEdit = async (module, id, body) => {
  const { data } = await axios.put(`${module}/${id}`, body);
  return await data;
};

export const postEditOrCreate = async (module, id, body) => {
  if (id) {
    const { data } = await axios.put(`${module}/${id}`, body);
    return await data;
  } else {
    const { data } = await axios.post(`${module}`, body);
    return await data;
  }
};

export const getSelect = async (dataUrl, q) => {
  const { data } = await axios.get(`${dataUrl}&locale=all&search=${q}`);
  return await data;
};

export const getSelectValue = async (dataUrl, id) => {
  const { data } = await axios.get(dataUrl, {
    params: {
      id: id,
    },
  });
  return await data;
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await axios.post(`/file-manager/upload`, formData);

  return await data;
};

export const getCols = async (pageModule, filter) => {
  const res = await axios({
    method: "get",
    url: `${pageModule}`,
  });

  return getColsNormalize(res.data, filter, pageModule);
};

export const getData = async (pageModule, params) => {
  const res = await axios.get(`${pageModule}/data`, {
    params: params,
  });
  return res.data;
};

export const deleteRow = async ({ pageModule, id }) => {
  const res = await axios({
    method: "delete",
    url: `${pageModule}/${id}`,
  });

  return res.data;
};
