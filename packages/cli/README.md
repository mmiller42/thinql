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
hello world
```

***

```sh
$ thinql 'hello world' --json
```

```
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
