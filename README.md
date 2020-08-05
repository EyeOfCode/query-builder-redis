# query-builder-redis [BETA]

Exp lib query mongoose by redis

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

# Example use

```js
const res = await queryBuilderRedis.getQuery(model, Query);
or
const res = await queryBuilder.getQuery(model, Query);
```

| Arguments  | Query | Description |
| --- | --- |
| `getList`  | { find: `{}`, offset: `1`,size: `10`,sort: `{ updateAt: 1 }`} | Can use select = `{Object}` and `String` and populate = `{Object}` |
| `getQuery`  | `{Object}` | Can use select = `{Object}` and `String` and populate = `{Object}` |
| `getById` | `{Object}` | Can use populate = `{Object}` |
| `getOne` | `{Object}` | Can use populate = `{Object}` |
| `getSoftDelete` | `{Object}` | Can use populate = `{Object}` |
| `create` | `{Object}` | ... |
| `update` | `id`, `{Object}` | `func(model, id, {data})` |
| `destroy` | `id` | ... |
| `softDelete` | `id` | Change status deleted to `true` |
| `restore` | `id` | Change status deleted to `false` after soft delete |
| `getTotal` | `{Object}` | Count documents |
| `destroyMany` | `{Object}` | ... |
| `getPagination` | `{Object}`, page = `1`, perpage = `10` | Get pagination `func({data}, page, perpage)` |
| `aggregateQuery` | `{Object}` | Can use script aggregate mongoose |
| `clearKeyRedis` |  | Clear key redis all |
| `getKeyRedis` |  | Get all key redis |
| `clearKeyRedisById` | `key` | Clear redis by `key` |

Config on env file
```env
REDIS_PORT=6379
REDIS_HOST=redis
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