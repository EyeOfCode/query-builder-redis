const redis = require("redis");
const bluebird = require("bluebird");

const redisOption = {
  port: process.env.REDIS_PORT || 6379,
  host: process.env.REDIS_HOST || "redis",
  db: process.env.REDIS_DB || 0,
  retry_strategy: (options) => {
    if (options.error && options.error.code === "ECONNREFUSED") {
      return new Error("The server refused the connection.");
    }
  },
};

const notSet = [
  "create",
  "findByIdAndUpdate",
  "update",
  "findByIdAndDelete",
  "delete",
  "restore",
  "deleteOne",
  "remove",
  "deleteMany",
  "aggregate",
  "update",
  "updateOne",
  "updateMany",
];

const getDB = async (model, arguments, findData) => {
  const { find, sort, size, offset } = findData.query;
  let queryData = await model[arguments](find ? find : findData.query);
  if (findData.populate) {
    queryData = await queryData.populate(findData.populate);
  }
  if (findData.select) {
    queryData = await queryData.select(findData.select);
  }
  if (findData.query.find) {
    if (sort) {
      queryData = await queryData.sort(sort);
    }
    if (sort && size && offset) {
      queryData = await queryData.limit(size).skip(size * (offset - 1));
    }
  }
  return queryData;
};

const postDB = async (model, arguments, query) => {
  const { data, id, _id } = query;
  return model[arguments](data || id || { _id });
};

const redisQuery = async (model, arguments, query, exp = 60) => {
  if (!model && !arguments) {
    return "requert model or argument";
  }

  let key = `${model.collection.name}-${arguments}`;
  if (query && (query.id || query._id || arguments === "findById")) {
    key = `${model.collection.name}-${arguments}-${
      query.id || query._id || query.query
    }`;
  }

  if (query.find) {
    key = `${key}-pagination`;
  }

  const findArguments = await notSet.filter(
    (filterKey) => filterKey === arguments
  );

  const client = await bluebird.promisifyAll(redis.createClient(redisOption));
  const cached = await client.getAsync(key);

  if (findArguments.length === 0) {
    const { find, sort, size, offset } = query.query;
    let filter = find;
    if (!filter && typeof query.query === "string") {
      filter = query.query;
    }

    if (cached) {
      const redis = await JSON.parse(cached);
      if (
        (redis && filter === redis.filter) ||
        sort === redis.sort ||
        size === redis.size ||
        offset === redis.offset
      ) {
        return JSON.parse(cached).data;
      }
    }

    const res = await getDB(model, arguments, query);
    await client.setAsync(
      key,
      JSON.stringify({ data: res, filter, sort, size, offset }),
      "EX",
      exp
    );
    return res;
  } else {
    await client.keys("*", async (err, keys) => {
      if (keys.length > 0) {
        for (let i = 0, len = keys.length; i < len; i++) {
          const key = keys[i].split("-");
          if (key[0] === model.collection.name) {
            await client.del(keys[i]);
          }
        }
      }
    });
    const res = await postDB(model, arguments, query);
    return res;
  }
};

const clearKey = async () => {
  const client = await bluebird.promisifyAll(redis.createClient(redisOption));
  const keys = [];

  try {
    await client.keys("*", async (err, keys) => {
      if (keys.length > 0) {
        for (let i = 0, len = keys.length; i < len; i++) {
          keys.push(keys[i]);
          await client.del(keys[i]);
        }
      }
    });
    return { keys, message: "success" };
  } catch (err) {
    return { keys, message: err };
  }
};

const clearKeyById = async (id) => {
  const client = await bluebird.promisifyAll(redis.createClient(redisOption));
  const cached = await client.getAsync(key);

  if (cached) {
    await client.del(id);
    return { key: id, message: "success" };
  }
  return { message: "id not found" };
};

const getKey = async () => {
  const client = await bluebird.promisifyAll(redis.createClient(redisOption));
  const keys = [];

  try {
    await client.keys("*", async (err, keys) => {
      if (keys.length > 0) {
        for (let i = 0, len = keys.length; i < len; i++) {
          keys.push(keys[i]);
        }
      }
    });
    return { keys };
  } catch (err) {
    return { message: err };
  }
};

module.exports = {
  redisQuery,
  clearKey,
  getKey,
  clearKeyById,
};
