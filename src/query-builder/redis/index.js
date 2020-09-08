const { redisQuery, clearKey, getKey, clearKeyById } = require("./query");

const getList = async (
  model,
  query = {
    find: {},
    offset: 1,
    size: 10,
    sort: { updateAt: 1 },
  },
  populate = "",
  select,
  exp
) => {
  return redisQuery(model, "find", { query, select, populate }, exp);
};

const getQuery = async (model, query = {}, select, populate, exp) => {
  return redisQuery(model, "find", { query, select, populate }, exp);
};

const getById = async (model, query, populate, exp) => {
  return redisQuery(model, "findById", { query, populate }, exp);
};

const getOne = async (model, query, populate, exp) => {
  return redisQuery(model, "findOne", { query, populate }, exp);
};

const getSoftDelete = async (model, query, populate, exp) => {
  return redisQuery(model, "findDeleted", { query, populate }, exp);
};

const create = async (model, data) => {
  return redisQuery(model, "create", { data });
};

const update = async (model, id, data) => {
  return redisQuery(model, "findByIdAndUpdate", { id, data });
};

const destroy = async (model, id) => {
  return redisQuery(model, "findByIdAndDelete", { id });
};

const softDelete = async (model, id) => {
  return redisQuery(model, "delete", { _id: id });
};

const restore = async (model, id) => {
  return redisQuery(model, "restore", { _id: id });
};

const getTotal = async (model, query = {}, exp) => {
  return redisQuery(model, "countDocuments", { query }, exp);
};

const destroyMany = async (model, data) => {
  return redisQuery(model, "deleteMany", { data });
};

const getPagination = async (model, query, page = 1, perpage = 10, exp) => {
  const totalDocument = await getTotal(model, query, exp);
  const totalPage = await Math.ceil(totalDocument / perpage);
  return {
    total: totalDocument,
    total_pages: totalPage,
    current_page: page,
    perpage: perpage,
  };
};

const aggregateQuery = async (model, data, exp) => {
  return redisQuery(model, "aggregate", { data }, exp);
};

const clearKeyRedis = async () => {
  return clearKey();
};

const getKeyRedis = async () => {
  return getKey();
};

const clearKeyRedisById = async (id) => {
  return clearKeyById(id);
};

module.exports = {
  getList,
  getById,
  getOne,
  create,
  update,
  destroy,
  softDelete,
  restore,
  getTotal,
  destroyMany,
  getQuery,
  getSoftDelete,
  getPagination,
  aggregateQuery,
  clearKeyRedis,
  getKeyRedis,
  clearKeyRedisById,
};
