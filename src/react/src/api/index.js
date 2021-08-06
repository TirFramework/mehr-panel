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


const postCreate = async (module, data) => {
  const { response } = await axios.post(`${module}/create`, data);
  return await response;
};

const postEdit = async (module, id, data) => {
    const { response } = await axios.get(`${module}/${id}/edit`, data );
    return await response;
  };
  

export { getSidebar, getCols, getCreateFields, getEditFields, postCreate, postEdit };
