# @thinql/cli

Parse ThinQL queries to stdout as ThinQL or JSON AST

## Installation

```sh
# npm
npm install @thinql/cli

# yarn
yarn add @thinql/cli
```

## Examples

```sh
thinql 'hello world'
```

```
hello world
---
Statement [1:1] {
  expression: LogicalAndExpression [1:1] {
    assertions: [
      Assertion [1:1] {
        assertion: FullTextSearch [1:1] {
          value: Value [1:1] {
            content: 'hello',
            literal: false
          }
        },
        negated: false
      },
      Assertion [1:7] {
        assertion: FullTextSearch [1:7] {
          value: Value [1:7] {
            content: 'world',
            literal: false
          }
        },
        negated: false
      }
    ]
  }
}
```

***

```sh
thinql 'hello world' --query
```

```
hello world
---
hello world
```

***

```sh
$ thinql 'hello world' --json
```

```
hello world
---
hello world
---
{
  "$type": "Statement",
  "expression": {
    "$type": "LogicalAndExpression",
    "assertions": [
      {
        "$type": "Assertion",
        "assertion": {
          "$type": "FullTextSearch",
          "value": {
            "$type": "Value",
            "content": "hello",
            "literal": false
          }
        },
        "negated": false
      },
      {
        "$type": "Assertion",
        "assertion": {
          "$type": "FullTextSearch",
          "value": {
            "$type": "Value",
            "content": "world",
            "literal": false
          }
        },
        "negated": false
      }
    ]
  }
}
```
