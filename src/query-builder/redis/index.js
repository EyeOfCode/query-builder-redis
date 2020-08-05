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
  select
) => {
  return redisQuery(model, "find", { query, select, populate });
};

const getQuery = async (model, query = {}, select, populate) => {
  return redisQuery(model, "find", { query, select, populate });
};

const getById = async (model, query, populate) => {
  return redisQuery(model, "findById", { query, populate });
};

const getOne = async (model, query, populate) => {
  return redisQuery(model, "findOne", { query, populate });
};

const getSoftDelete = async (model, query, populate) => {
  return redisQuery(model, "findDeleted", { query, populate });
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

const getTotal = async (model, query = {}) => {
  return redisQuery(model, "countDocuments", { query });
};

const destroyMany = async (model, data) => {
  return redisQuery(model, "deleteMany", { data });
};

const getPagination = async (model, query, page = 1, perpage = 10) => {
  const totalDocument = await getTotal(model, query);
  const totalPage = await Math.ceil(totalDocument / perpage);
  return {
    total: totalDocument,
    total_pages: totalPage,
    current_page: page,
    perpage: perpage,
  };
};

const aggregateQuery = async (model, data) => {
  return redisQuery(model, "aggregate", { data });
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
