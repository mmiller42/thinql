#!/usr/bin/env node

const { parse } = require('./parse')

const [, , input, format] = process.argv

const tree = parse(input)

switch (format) {
  case 'json':
    console.log(JSON.stringify(tree, null, 2))
    break
  case 'query':
  default:
    console.log(tree.toString({ colorize: true }))
    break
}
