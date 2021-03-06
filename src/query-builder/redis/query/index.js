const redis = require("handy-redis");

const redisOption = {
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  db: process.env.REDIS_DB,
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
  "updateOne",
  "updateMany",
];

const getDB = async (model, arguments, findData) => {
  const { find, sort, size, offset } = findData.query;
  let queryData = await model[arguments](find ? find : findData.query)
    .populate(findData.populate || "")
    .select(findData.select)
    .sort(sort);
  if (findData.query.find) {
    if (sort && size && offset) {
      queryData = await model[arguments](find ? find : findData.query)
        .populate(findData.populate || "")
        .select(findData.select)
        .sort(sort)
        .limit(size)
        .skip(size * (offset - 1));
    }
  }
  return queryData;
};

const postDB = async (model, arguments, query) => {
  const { data, id, _id } = query;
  const keyArgument = arguments.split("findByIdAnd");
  if (keyArgument.length > 1) {
    return model[arguments](id, { ...data });
  }
  return model[arguments]({ ...data } || id || _id);
};

const allKeys = async (client) => {
  const setKey = [];

  new Promise(() => {
    client.keys("*", (err, keys) => {
      if (keys.length > 0) {
        for (let i = 0; i < keys.length; i++) {
          setKey.push(keys[i]);
        }
      }
    });
  });
  return setKey;
};

const redisQuery = async (model, arguments, query, exp) => {
  if (!model && !arguments) {
    return "requert model or argument";
  }

  let key = `${model.collection.name}-${arguments}`;
  if (query.id) {
    key = `${model.collection.name}-${arguments}-${query.id}`;
  }
  if (query._id) {
    key = `${model.collection.name}-${arguments}-${query._id}`;
  }
  if ((query.query && query.query._id) || arguments === "findById") {
    key = `${model.collection.name}-${arguments}-${
      typeof query.query === "string" ? query.query : query.query._id
    }`;
  }

  if (query.find) {
    key = `${key}-pagination`;
  }

  const findArguments = await notSet.filter(
    (filterKey) => filterKey === arguments
  );

  const client = await redis.createHandyClient(redisOption);
  const cached = await client.get(key);

  if (findArguments.length === 0) {
    const { find, sort, size, offset } = query.query;
    let filter = find;
    if (!filter && typeof query.query === "string") {
      filter = query.query;
    } else if (!filter && typeof query.query === "object") {
      filter = JSON.stringify(query.query);
    }

    if (cached) {
      const redis = await JSON.parse(cached);
      if (
        redis.data &&
        filter === redis.filter &&
        sort === redis.sort &&
        size === redis.size &&
        offset === redis.offset
      ) {
        return JSON.parse(cached).data;
      }
    }

    const res = await getDB(model, arguments, query);
    await client.set(
      key,
      JSON.stringify({ data: res, filter, sort, size, offset }),
      "EX",
      typeof exp === "number" ? +exp : 60
    );
    return res;
  } else {
    const keys = await allKeys(client);
    if (keys.length > 0) {
      keys.forEach((id) => {
        const key = id.split("-");
        if (key[0] === model.collection.name) {
          client.del(key);
        }
      });
    }

    const res = await postDB(model, arguments, query);
    return res;
  }
};

const clearKey = async () => {
  const client = await redis.createHandyClient(redisOption);
  const key = [];

  try {
    const keys = await allKeys(client);
    if (keys.length > 0) {
      keys.forEach((id) => {
        key.push(id);
        client.del(id);
      });
    }
    return { remove: key, message: "success" };
  } catch (err) {
    return { remove: [], message: "id not found" };
  }
};

const clearKeyById = async (id) => {
  const client = await redis.createHandyClient(redisOption);
  const cached = await client.get(id);

  if (cached) {
    await client.del(id);
    return { remove: id, message: "success" };
  }
  return { message: "id not found" };
};

const getKey = async () => {
  const client = await redis.createHandyClient(redisOption);

  try {
    const keys = await allKeys(client);
    return keys;
  } catch (err) {
    return { message: "key not found" };
  }
};

module.exports = {
  redisQuery,
  clearKey,
  getKey,
  clearKeyById,
};
