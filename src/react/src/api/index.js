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
  return [
    {
      type: "text",
      name: "job",
      valueType: "string",
      additional: false,
      value: "shakiba",
      display: "job",
      placeholder: "",
      id: "name",
      class: "name",
      group: "all",
      col: 12,
      disable: false,
      readonly: false,
      showOnIndex: true,
      showOnDetail: true,
      showOnCreating: true,
      showOnEditing: true,
      sortable: true,
      searchable: false,
      rules: ["required"],
      creationRules: "",
      updateRules: "",
      options: [],
      filter: [],
      filterable: false,
      multiple: false,
      comment: [],
    },
    {
      type: "text",
      name: "email",
      valueType: "string",
      additional: false,
      value: "email",
      display: "job",
      placeholder: "",
      id: "name",
      class: "name",
      group: "all",
      col: 12,
      disable: false,
      readonly: false,
      showOnIndex: true,
      showOnDetail: true,
      showOnCreating: true,
      showOnEditing: true,
      sortable: true,
      searchable: false,
      rules: ["required"],
      creationRules: "",
      updateRules: "",
      options: [],
      filter: [],
      filterable: false,
      multiple: false,
      comment: [],
    },
    {
      type: "text",
      name: "firetname.1",
      valueType: "string",
      additional: true,
      value: "1111111111111",
      display: "firetname 1",
      placeholder: "",
      id: "name",
      class: "name",
      group: "all",
      col: 12,
      disable: false,
      readonly: false,
      showOnIndex: true,
      showOnDetail: true,
      showOnCreating: true,
      showOnEditing: true,
      sortable: true,
      searchable: false,
      rules: ["required"],
      creationRules: "",
      updateRules: "",
      options: [],
      filter: [],
      filterable: false,
      multiple: false,
      comment: [],
    },
    {
      type: "text",
      name: "firetname.2",
      valueType: "string",
      additional: true,
      value: "22222222222",
      display: "firetname 2",
      placeholder: "",
      id: "name",
      class: "name",
      group: "all",
      col: 12,
      disable: false,
      readonly: false,
      showOnIndex: true,
      showOnDetail: true,
      showOnCreating: true,
      showOnEditing: true,
      sortable: true,
      searchable: false,
      rules: ["required"],
      creationRules: "",
      updateRules: "",
      options: [],
      filter: [],
      filterable: false,
      multiple: false,
      comment: [],
    },
    {
      type: "text",
      name: "firetname.3",
      valueType: "string",
      additional: true,
      value: "3333333333333",
      display: "firetname 3",
      placeholder: "",
      id: "name",
      class: "name",
      group: "all",
      col: 12,
      disable: false,
      readonly: false,
      showOnIndex: true,
      showOnDetail: true,
      showOnCreating: true,
      showOnEditing: true,
      sortable: true,
      searchable: false,
      rules: ["required"],
      creationRules: "",
      updateRules: "",
      options: [],
      filter: [],
      filterable: false,
      multiple: false,
      comment: [],
    },

    {
      type: "text",
      name: "firetname.4",
      valueType: "string",
      additional: true,
      value: "44444444444",
      display: "firetname 4",
      placeholder: "",
      id: "name",
      class: "name",
      group: "all",
      col: 12,
      disable: false,
      readonly: false,
      showOnIndex: true,
      showOnDetail: true,
      showOnCreating: true,
      showOnEditing: true,
      sortable: true,
      searchable: false,
      rules: ["required"],
      creationRules: "",
      updateRules: "",
      options: [],
      filter: [],
      filterable: false,
      multiple: false,
      comment: [],
    },
    {
      type: "text",
      name: "firetname.5",
      valueType: "string",
      additional: true,
      value: "55555555555555",
      display: "firetname 5",
      placeholder: "",
      id: "name",
      class: "name",
      group: "all",
      col: 12,
      disable: false,
      readonly: false,
      showOnIndex: true,
      showOnDetail: true,
      showOnCreating: true,
      showOnEditing: true,
      sortable: true,
      searchable: false,
      rules: ["required"],
      creationRules: "",
      updateRules: "",
      options: [],
      filter: [],
      filterable: false,
      multiple: false,
      comment: [],
    },
    {
      type: "text",
      name: "lastname",
      valueType: "string",
      additional: false,
      value: "shakiba",
      display: "Name",
      placeholder: "",
      id: "name",
      class: "name",
      group: "all",
      col: 6,
      disable: false,
      readonly: false,
      showOnIndex: true,
      showOnDetail: true,
      showOnCreating: true,
      showOnEditing: true,
      sortable: true,
      searchable: false,
      rules: ["required"],
      creationRules: "",
      updateRules: "",
      options: [],
      filter: [],
      filterable: false,
      multiple: false,
      comment: [],
    },

    {
      type: "Group",
      name: "picture.1",
      children: [
        {
          type: "text",
          name: "small.1",
          valueType: "string",
          additional: false,
          value: "shakiba",
          display: "small 1 ",
          placeholder: "",
          id: "name",
          class: "name",
          group: "all",
          col: 12,
          disable: false,
          readonly: false,
          showOnIndex: true,
          showOnDetail: true,
          showOnCreating: true,
          showOnEditing: true,
          sortable: true,
          searchable: false,
          rules: ["required"],
          creationRules: "",
          updateRules: "",
          options: [],
          filter: [],
          filterable: false,
          multiple: false,
          comment: [],
        },
        {
          type: "text",
          name: "big.1",
          valueType: "string",
          additional: false,
          value: "shakiba",
          display: "big 1",
          placeholder: "",
          id: "name",
          class: "name",
          group: "all",
          col: 12,
          disable: false,
          readonly: false,
          showOnIndex: true,
          showOnDetail: true,
          showOnCreating: true,
          showOnEditing: true,
          sortable: true,
          searchable: false,
          rules: ["required"],
          creationRules: "",
          updateRules: "",
          options: [],
          filter: [],
          filterable: false,
          multiple: false,
          comment: [],
        },
      ],
      valueType: "string",
      additional: true,
      value: "shakiba",
      display: "picture 1",
      placeholder: "",
      id: "name",
      class: "name",
      group: "all",
      col: 12,
      disable: false,
      readonly: false,
      showOnIndex: true,
      showOnDetail: true,
      showOnCreating: true,
      showOnEditing: true,
      sortable: true,
      searchable: false,
      rules: ["required"],
      creationRules: "",
      updateRules: "",
      options: [],
      filter: [],
      filterable: false,
      multiple: false,
      comment: [],
    },

    {
      type: "text",
      name: "fathername",
      valueType: "string",
      additional: false,
      value: "shakiba",
      display: "Name",
      placeholder: "",
      id: "name",
      class: "name",
      group: "all",
      col: 6,
      disable: false,
      readonly: false,
      showOnIndex: true,
      showOnDetail: true,
      showOnCreating: true,
      showOnEditing: true,
      sortable: true,
      searchable: false,
      rules: ["required"],
      creationRules: "",
      updateRules: "",
      options: [],
      filter: [],
      filterable: false,
      multiple: false,
      comment: [],
    },
  ];

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
