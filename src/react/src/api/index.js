import axios from "../lib/axios";

const getSidebar = async () => {
  const { data } = await axios.get(`/sidebar`);
  return data;
};

const getCols = async () => {
  const { data } = await axios.get(`/user`);
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
  console.log("🚀 ~ file: index.js ~ line 37 ~ getSelect ~ data", data)
  return await data;
};

export {
  getSidebar,
  getCols,
  getCreateFields,
  getEditFields,
  postCreate,
  postEdit,
  getSelect,
};
