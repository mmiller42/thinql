# @thinql/to-knex

Build SQL queries from ThinQL ASTs with Knex.js

## Installation

```sh
# npm
npm install @thinql/parse @thinql/to-knex

# yarn
yarn add @thinql/parse @thinql/to-knex
```

## Example

```js
import assert from 'assert'
import knex from 'knex'
import parse from '@thinql/parse'
import toKnex from '@thinql/to-knex'

const pad = n => String(n).padStart(2, '0')

const client = knex({ client: 'pg' })
const statement = parse(`
  is_active()
  developer
  (
    first_name = Matt +
    first_name = Matthew
  )
  lower(last_name) = miller
  created_at < get_date(now())
`)

const clause = toKnex(statement, {
  fullTextSearch: (builder, value) =>
    builder.where('bio', 'ilike', value.content),
  functions: {
    get_date: ([date]) =>
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-` +
      `${pad(date.getDate())}`,
    is_active: (args, builder) => builder.whereNull('deactivated_at'),
    lower: ([property]) => client.raw('lower(??)', [property.content]),
    now: () => new Date(),
  },
})

const query = client('users').select('id').where(clause)

assert.strictEqual(
  query.toString(),
  `
    select
      "id"
    from "users"
    where (
      "deactivated_at" is null and
      ("bio" ilike 'developer') and
      (
        "first_name" = 'Matt' or
        "first_name" = 'Matthew'
      ) and
      lower("last_name") = 'miller' and
      "created_at" < '2019-06-10'
    )
  `.trim().replace(/[\w]+/g, ' ')
)
```
