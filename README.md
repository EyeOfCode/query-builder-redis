# query-builder-redis [BETA]

Exp lib query mongoose by redis

# Installation

Install NPM

```js
$ npm i query-builder-redis --save
```


# Example

Use query builder redis
```js
const { queryBuilderRedis } = require('query-builder'); or const queryBuilderRedis = require('query-builder').queryBuilderRedis;
```

Use query builder mongoose
```js
const { queryBuilder } = require('query-builder'); or const queryBuilderRedis = require('query-builder').queryBuilder;
```

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