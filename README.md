# query-builder-redis

[![Version](https://img.shields.io/npm/v/query-builder-redis.svg)](https://npmjs.org/package/query-builder-redis)
[![Downloads/week](https://img.shields.io/npm/dw/query-builder-redis.svg)](https://npmjs.org/package/query-builder-redis)

lib query data through query builder by mongoose and redis

# Installation

Install NPM

```js
$ npm i query-builder-redis --save
```


# Example import

Use query builder redis
```js
const { queryBuilderRedis } = require('query-builder'); 
or 
const queryBuilderRedis = require('query-builder').queryBuilderRedis;
```

Use query builder mongoose
```js
const { queryBuilder } = require('query-builder'); 
or 
const queryBuilderRedis = require('query-builder').queryBuilder;
```

Config on env file
```env
REDIS_PORT=6379 (port redis)
REDIS_HOST=redis (ip host)
REDIS_DB=0
```
Config on docker (optional)
```yml
  redis:
    image: redis:5.0.3
    restart: always
    ports:
      - 6379:6379
    volumes:
      - redis-data:/data
```
```yml
volumes:
  redis-data:
    driver: local
```

# Example use

```js
const res = await queryBuilderRedis.getQuery(model, Query, 60);
or
const res = await queryBuilder.getQuery(model, Query, 60);
```

# Support

| Arguments  | Query | Description | Exp |
| --- | --- | --- |
| `getList`  | { find: `{}`, offset: `1`,size: `10`,sort: `{ updateAt: 1 }`} | Can use select = `{Object}` and `String` and populate = `{Object}` | `getList(model, query, exp)` exp = [int] |
| `getQuery`  | `{Object}` | Can use select = `{Object}` and `String` and populate = `{Object}` | `getQuery(model, query, select, populate, exp)` exp = [int] |
| `getById` | `{Object}` | Can use populate = `{Object}` | `getById(model, query, populate, exp)` exp = [int] |
| `getOne` | `{Object}` | Can use populate = `{Object}` | `getOne(model, query, populate, exp)` exp = [int] |
| `getSoftDelete` | `{Object}` | Can use populate = `{Object}` | `getSoftDelete(model, query, populate, exp)` exp = [int] |
| `create` | `{Object}` | ... | `create(model, data)` |
| `update` | `id`, `{Object}` | `func(model, id, {data})` | `update(model, id, data)` |
| `destroy` | `id` | ... | `destroy(model, id)` |
| `softDelete` | `id` | Change status deleted to `true` | `softDelete(model, id)` |
| `restore` | `id` | Change status deleted to `false` after soft delete | `restore(model, id)` |
| `getTotal` | `{Object}` | Count documents | `getTotal(model, query, exp)` exp = [int] |
| `destroyMany` | `{Object}` | ... | `destroyMany(model, data)` |
| `getPagination` | `{Object}`, page = `1`, perpage = `10` | Get pagination `func({data}, page, perpage)` | `getPagination(model, query, page, perpage, exp)` exp = [int] |
| `aggregateQuery` | `{Object}` | Can use script aggregate mongoose | `aggregateQuery(model, data, exp)` exp = [int] |
| `clearKeyRedis` |  | Clear key redis all | `clearKeyRedis()` |
| `getKeyRedis` |  | Get all key redis | `getKeyRedis()` |
| `clearKeyRedisById` | `key` | Clear redis by `key` | `clearKeyRedisById(id)` |