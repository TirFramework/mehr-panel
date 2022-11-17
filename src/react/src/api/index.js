import Config from "../constants/config";
import axios from "../lib/axios";

const postLogin = async (body) => {
  const { data } = await axios.post(`/login`, body);
  return data;
};

const getSidebar = async () => {
  const { data } = await axios.get(`/sidebar`);
  return data;
};

export const getGeneral = async () => {
  const { data } = await axios.get(`/mehr-panel`);
  return data;
};

const getCols = async (module) => {
  const { data } = await axios.get(`${module}`);
  return await data;
};

const getRows = async (module, props) => {
  const { data } = await axios.get(`${module}/data`, {
    params: {
      page: props.current,
      result: props.pageSize,
      filters: props.filters,
      search: props.search,
      locale: "all",
    },
  });
  return await data;
};

// const getRows = async (module, page, result, filters, search) => {
//   const { data } = await axios.get(`${module}/data`, {
//     params: {
//       page: page,
//       result: result,
//       filters,
//       search,
//       locale: "all",
//     },
//   });
//   return await data;
// };

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

const getSelect = async (dataUrl, q) => {
  const { data } = await axios.get(`${dataUrl}&locale=all&search=${q}`);
  return await data;
};

const getSelectValue = async (dataUrl, id) => {
  const { data } = await axios.get(dataUrl, {
    params: {
      id: id,
    },
  });
  return await data;
};

const deleteRow = async (module, id) => {
  const { data } = await axios.delete(`${module}/${id}?locale=all`);
  return await data;
};

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  console.log("🚀 ~ file: index.js ~ line 72 ~ uploadImage ~ file", file);
  const { data } = await axios.post(`/file-manager/upload`, formData);

  return await data;
};

export {
  postLogin,
  getSidebar,
  getCols,
  getRows,
  // postCreate,
  // postEditOrCreate,
  getSelect,
  getSelectValue,
  deleteRow,
  uploadImage,
};
