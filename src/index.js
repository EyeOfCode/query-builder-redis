const redisQuery = require("helper/radis");

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
  return redisQuery(model, "findByIdAndUpdate", { data: { id, data } });
};

const destroy = async (model, id) => {
  return model.findByIdAndDelete(id).exec();
};

const softDelete = async (model, id) => {
  return model.delete({ _id: id }).exec();
};

const restore = async (model, id) => {
  return model.restore({ _id: id }).exec();
};

const getTotal = async (model, query = {}) => {
  return redisQuery(model, "countDocuments", { query });
};

const destroyMany = async (model, data) => {
  return model.deleteMany(data).exec();
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

const aggregateQuery = async (model, query) => {
  return model.aggregate(query);
};

const clearUserAgent = async (model, date) => {
  return model.deleteMany({ createdAt: { $lt: date } }).exec();
};

module.exports = {
  clearUserAgent,
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
};
