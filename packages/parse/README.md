# @thinql/parse

Parse ThinQL queries to ASTs

## Installation

```sh
# npm
npm install @thinql/parse

# yarn
yarn add @thinql/parse
```

## Example

```js
import assert from 'assert'
import isEqual from 'lodash.isequal'
import parse from '@thinql/parse'

const result = parse('hello world')

assert(result.toString() === 'hello world')

assert(isEqual(result.toJSON(), {
  $type: 'Statement',
  expression: [
    {
      $type: 'LogicalAndExpression',
      assertions: [
        {
          $type: 'Assertion',
          assertion: {
            $type: 'FullTextSearch',
            value: {
              $type: 'Value',
              content: 'hello',
              literal: false,
            },
          },
          negated: false,
        },
        {
          $type: 'Assertion',
          assertion: {
            $type: 'FullTextSearch',
            value: {
              $type: 'Value',
              content: 'world',
              literal: false,
            },
          },
          negated: false,
        },
      ],
    },
  ],
}))
```
