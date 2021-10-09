import axios from "../lib/axios";

const postLogin = async (body) => {
  const { data } = await axios.post(`/login`, body);
  return data;
};

const getSidebar = async () => {
  const { data } = await axios.get(`/sidebar`);
  return data;
};

const getCols = async (module) => {
  const { data } = await axios.get(`${module}`);
  return await data;
};

const getRows = async (module, page , result , filters) => {
  const { data } = await axios.get(`${module}/data`, {
    params: {
      page: page,
      result: result,
      filters,
    },
  });
  return await data;
};

const getCreateFields = async (module) => {
  const { data } = await axios.get(`${module}/create`);
  return await data;
};

const getEditFields = async (module, id) => {
  const { data } = await axios.get(`${module}/${id}/edit`);
  return await data;
};

const postCreate = async (module, body) => {
  const { data } = await axios.post(`${module}`, body);
  return await data;
};

const postEdit = async (module, id, body) => {
  const { data } = await axios.put(`${module}/${id}`, body);
  return await data;
};

const getSelect = async (dataUrl,q) => {
  const { data } = await axios.get(`${dataUrl}&search=${q}`);
  return await data;
};

const getSelectValue = async (dataUrl,id) => {
  const { data } = await axios.get(dataUrl, {
    params: {
      id: id
    },  
  });
  return await data;
};

const deleteRow = async (module, id) => {
  const { data } = await axios.delete(`${module}/${id}`);
  return await data;
};

export {
  postLogin,
  getSidebar,
  getCols,
  getRows,
  getCreateFields,
  getEditFields,
  postCreate,
  postEdit,
  getSelect,
  getSelectValue,
  deleteRow,
};
