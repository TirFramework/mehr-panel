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
  // return [
  //   {
  //     type: "Additional",
  //     originalName: "test",
  //     name: "test",
  //     valueType: "string",
  //     value: null,
  //     display: "Test",
  //     placeholder: "",
  //     id: "test",
  //     class: "test",
  //     group: "all",
  //     col: 24,
  //     disable: false,
  //     readonly: false,
  //     showOnIndex: true,
  //     showOnDetail: true,
  //     showOnCreating: true,
  //     showOnEditing: true,
  //     sortable: true,
  //     searchable: false,
  //     rules: "",
  //     creationRules: "",
  //     updateRules: "",
  //     options: [],
  //     filter: [],
  //     filterable: false,
  //     multiple: false,
  //     comment: [],
  //     additional: false,
  //     children: [
  //       {
  //         type: "Text",
  //         originalName: "name",
  //         name: "name.0",
  //         valueType: "string",
  //         value: null,
  //         display: "Name",
  //         placeholder: "",
  //         id: "name",
  //         class: "name",
  //         group: "all",
  //         col: 24,
  //         disable: false,
  //         readonly: false,
  //         showOnIndex: true,
  //         showOnDetail: true,
  //         showOnCreating: true,
  //         showOnEditing: true,
  //         sortable: true,
  //         searchable: false,
  //         rules: "",
  //         creationRules: "",
  //         updateRules: "",
  //         options: [],
  //         filter: [],
  //         filterable: false,
  //         multiple: false,
  //         comment: [],
  //         additional: false,
  //       },
  //     ],
  //     template: [
  //       {
  //         type: "Text",
  //         originalName: "name",
  //         name: "name.0",
  //         valueType: "string",
  //         value: null,
  //         display: "Name",
  //         placeholder: "",
  //         id: "name",
  //         class: "name",
  //         group: "all",
  //         col: 24,
  //         disable: false,
  //         readonly: false,
  //         showOnIndex: true,
  //         showOnDetail: true,
  //         showOnCreating: true,
  //         showOnEditing: true,
  //         sortable: true,
  //         searchable: false,
  //         rules: "",
  //         creationRules: "",
  //         updateRules: "",
  //         options: [],
  //         filter: [],
  //         filterable: false,
  //         multiple: false,
  //         comment: [],
  //         additional: false,
  //       },
  //     ],
  //   },
  // ];
  // return [
  //   {
  //     type: "Additional",
  //     originalName: "test",
  //     name: "test",
  //     valueType: "string",
  //     value: null,
  //     display: "Test",
  //     placeholder: "",
  //     id: "test",
  //     class: "test",
  //     group: "all",
  //     col: 12,
  //     disable: false,
  //     readonly: false,
  //     showOnIndex: true,
  //     showOnDetail: true,
  //     showOnCreating: true,
  //     showOnEditing: true,
  //     sortable: true,
  //     searchable: false,
  //     rules: "",
  //     creationRules: "",
  //     updateRules: "",
  //     options: [],
  //     filter: [],
  //     filterable: false,
  //     multiple: false,
  //     comment: [],
  //     additional: false,
  //     children: [
  //       [
  //         {
  //           type: "Group",
  //           originalName: "test-group",
  //           name: "test-group.0",
  //           valueType: "string",
  //           value: null,
  //           display: "Test-group",
  //           placeholder: "",
  //           id: "test-group",
  //           class: "test-group",
  //           group: "all",
  //           col: 24,
  //           disable: false,
  //           readonly: false,
  //           showOnIndex: true,
  //           showOnDetail: true,
  //           showOnCreating: true,
  //           showOnEditing: true,
  //           sortable: true,
  //           searchable: false,
  //           rules: "",
  //           creationRules: "",
  //           updateRules: "",
  //           options: [],
  //           filter: [],
  //           filterable: false,
  //           multiple: false,
  //           comment: [],
  //           additional: false,
  //           subInputs: [{}, {}],
  //           children: [
  //             {
  //               type: "Text",
  //               originalName: "name",
  //               name: "name.0",
  //               valueType: "string",
  //               value: null,
  //               display: "Name",
  //               placeholder: "",
  //               id: "name",
  //               class: "name",
  //               group: "all",
  //               col: 12,
  //               disable: false,
  //               readonly: false,
  //               showOnIndex: true,
  //               showOnDetail: true,
  //               showOnCreating: true,
  //               showOnEditing: true,
  //               sortable: true,
  //               searchable: false,
  //               rules: "",
  //               creationRules: "",
  //               updateRules: "",
  //               options: [],
  //               filter: [],
  //               filterable: false,
  //               multiple: false,
  //               comment: [],
  //               additional: false,
  //             },
  //             {
  //               type: "Text",
  //               originalName: "firstName",
  //               name: "firstName.0",
  //               valueType: "string",
  //               value: null,
  //               display: "firstName",
  //               placeholder: "",
  //               id: "firstName",
  //               class: "firstName",
  //               group: "all",
  //               col: 12,
  //               disable: false,
  //               readonly: false,
  //               showOnIndex: true,
  //               showOnDetail: true,
  //               showOnCreating: true,
  //               showOnEditing: true,
  //               sortable: true,
  //               searchable: false,
  //               rules: "",
  //               creationRules: "",
  //               updateRules: "",
  //               options: [],
  //               filter: [],
  //               filterable: false,
  //               multiple: false,
  //               comment: [],
  //               additional: false,
  //             },
  //           ],
  //         },
  //       ],
  //     ],
  //     template: [
  //       {
  //         type: "Group",
  //         originalName: "test-group",
  //         name: "test-group.0",
  //         valueType: "string",
  //         value: null,
  //         display: "Test-group",
  //         placeholder: "",
  //         id: "test-group",
  //         class: "test-group",
  //         group: "all",
  //         col: 24,
  //         disable: false,
  //         readonly: false,
  //         showOnIndex: true,
  //         showOnDetail: true,
  //         showOnCreating: true,
  //         showOnEditing: true,
  //         sortable: true,
  //         searchable: false,
  //         rules: "",
  //         creationRules: "",
  //         updateRules: "",
  //         options: [],
  //         filter: [],
  //         filterable: false,
  //         multiple: false,
  //         comment: [],
  //         additional: false,
  //         subInputs: [{}, {}],
  //         children: [
  //           {
  //             type: "Text",
  //             originalName: "name",
  //             name: "name.0",
  //             valueType: "string",
  //             value: null,
  //             display: "Name",
  //             placeholder: "",
  //             id: "name",
  //             class: "name",
  //             group: "all",
  //             col: 12,
  //             disable: false,
  //             readonly: false,
  //             showOnIndex: true,
  //             showOnDetail: true,
  //             showOnCreating: true,
  //             showOnEditing: true,
  //             sortable: true,
  //             searchable: false,
  //             rules: "",
  //             creationRules: "",
  //             updateRules: "",
  //             options: [],
  //             filter: [],
  //             filterable: false,
  //             multiple: false,
  //             comment: [],
  //             additional: false,
  //           },
  //           {
  //             type: "Text",
  //             originalName: "firstName",
  //             name: "firstName.0",
  //             valueType: "string",
  //             value: null,
  //             display: "firstName",
  //             placeholder: "",
  //             id: "firstName",
  //             class: "firstName",
  //             group: "all",
  //             col: 12,
  //             disable: false,
  //             readonly: false,
  //             showOnIndex: true,
  //             showOnDetail: true,
  //             showOnCreating: true,
  //             showOnEditing: true,
  //             sortable: true,
  //             searchable: false,
  //             rules: "",
  //             creationRules: "",
  //             updateRules: "",
  //             options: [],
  //             filter: [],
  //             filterable: false,
  //             multiple: false,
  //             comment: [],
  //             additional: false,
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // ];

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
