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
  return model
    .find(query.find)
    .populate(populate)
    .select(select)
    .sort(query.sort)
    .limit(query.size)
    .skip(query.size * (query.offset - 1))
    .exec();
};

const getQuery = async (model, query = {}, select, populate) => {
  return model.find(query).populate(populate).select(select).exec();
};

const getById = async (model, query, populate) => {
  return model.findById(query).populate(populate).exec();
};

const getOne = async (model, query, populate) => {
  return model.findOne(query).populate(populate).exec();
};

const getAllSoftDeleteOnly = async (model, query, populate) => {
  return model.findDeleted(query).populate(populate).exec();
};

const getOneSoftDeleteOnly = async (model, query, populate) => {
  return model.findOneDeleted(query).populate(populate).exec();
};

const getSoftDeleteOne = async (model, query, populate) => {
  return model.findOneWithDeleted(query).populate(populate).exec();
};

const getAllSoftDelete = async (
  model,
  query = {
    find: {},
    sort: { updateAt: 1 },
  },
  select,
  populate = ""
) => {
  return model
    .findWithDeleted(query)
    .populate(populate)
    .select(select)
    .sort(sort)
    .exec();
};

const create = async (model, data) => {
  return model.create(data);
};

const update = async (model, id, data) => {
  return model.findByIdAndUpdate(id, data).exec();
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
  return model.countDocuments(query).exec();
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
  getPagination,
  aggregateQuery,
  getAllSoftDeleteOnly,
  getOneSoftDeleteOnly,
  getSoftDeleteOne,
  getAllSoftDelete,
};
