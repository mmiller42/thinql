const chalk = require('chalk')
const { divide, escape } = require('./utils')

class Node {
  constructor(attributes, token = null) {
    Object.assign(this, attributes)
    this.token = token
  }

  get type() {
    return this.constructor.type
  }

  toJSON() {
    return { type: this.type, ...this }
  }

  toString(options = { colorize: false }, level = 0) {
    const colorize = (color, string) => (options.colorize ? chalk.bold[color](string) : string)
    const { constructor: { type }, token, ...attributes } = this
    const pairs = Object.keys(attributes).sort().map(name => ({ name, value: attributes[name] }))
    const [childNodes, scalars] = divide(pairs, pair => pair.value instanceof Node)
    const indent = '  '.repeat(level)
    return [
      `${colorize('blue', type)} {`,
      ...scalars.map(({ name, value }) => `  ${colorize('cyan', name)}: ${colorize('gray', JSON.stringify(value))}`),
      ...childNodes.map(({ name, value }) => `  ${colorize('cyan', name)}: ${value.toString(options, level + 1).trim()}`),
      '}'
    ].map(line => `${indent}${line}`).join('\n')
  }
}

exports.Node = Node

// { callee: string, negate: boolean | null, arguments: Array<Value|Call> }
class Call extends Node {
  static get type() {
    return 'Call'
  }

  toThinQL(options) {
    return `${this.negate ? '!' : ''}${this.callee}(${this.arguments.map(value => value.toThinQL(options)).join(' ')})`
  }
}

exports.Call = Call

class Operator extends Node {
  static symbolFor(kind) {
    const symbol = this.operators[kind]
    return Array.isArray(symbol) ? symbol[0] : symbol
  }

  toThinQL() {
    return this.constructor.symbolFor(this.kind)
  }
}

exports.Operator = Operator

// { kind: string }
class ComparisonOperator extends Operator {
  static get type() {
    return 'ComparisonOperator'
  }

  static get operators() {
    return {
      eq: '=',
      gt: '>',
      gte: '>=',
      lt: '<',
      lte: '<=',
      match: '*=',
      ne: '!=',
    }
  }
}

exports.ComparisonOperator = ComparisonOperator

// { property: Property|Call, operator: ComparisonOperator, value: Value|Call }
class Condition extends Node {
  static get type() {
    return 'Condition'
  }

  toThinQL(options) {
    return `${this.property.toThinQL(options)} ${this.operator.toThinQL(options)} ${this.value.toThinQL(options)}`
  }
}

exports.Condition = Condition

// { value: Value, negate: boolean }
class FullTextSearch extends Node {
  static get type() {
    return 'FullTextSearch'
  }

  toThinQL(options) {
    let valueOptions = options
    if (this.negate) {
      valueOptions = { ...options, alwaysQuoteValues: true }
    }
    return `${this.negate ? '!' : ''}${this.value.toThinQL(valueOptions)}`
  }
}

exports.FullTextSearch = FullTextSearch

// { expression: LogicalExpression, negate: boolean }
class Group extends Node {
  static get type() {
    return 'Group'
  }

  toThinQL(options) {
    return `${this.negate ? '!' : ''}(${this.expression.toThinQL(options)})`
  }
}

exports.Group = Group

// { operator: LogicalOperator, left: Condition | FullTextSearch | Group | Call, right: Condition | FullTextSearch | Group | Call }
class LogicalExpression extends Node {
  static get type() {
    return 'LogicalExpression'
  }

  toThinQL(options) {
    return `${this.left.toThinQL(options)} ${this.operator.toThinQL(options)} ${this.right.toThinQL(options)}`
  }
}

exports.LogicalExpression = LogicalExpression

// { kind: string }
class LogicalOperator extends Operator {
  static get type() {
    return 'LogicalOperator'
  }

  static get operators() {
    return {
      and: ['and', 'AND'],
      or: ['or', 'OR'],
    }
  }
}

exports.LogicalOperator = LogicalOperator

// { name: string }
class Property extends Node {
  static get type() {
    return 'Property'
  }

  toThinQL({ alwaysQuoteProperties = false, propertyQuoteSymbol = '"' } = {}) {
    return escape(this.name, {
      alwaysQuote: alwaysQuoteProperties,
      symbol: propertyQuoteSymbol,
    })
  }
}

exports.Property = Property

// { value: string, flags: string }
class Value extends Node {
  static get type() {
    return 'Value'
  }

  toThinQL({ alwaysQuoteValues = false, valueQuoteSymbol = '"' } = {}) {
    const alwaysQuote = alwaysQuoteValues || this.flags
    return `${escape(this.value, { alwaysQuote, symbol: valueQuoteSymbol })}${this.flags}`
  }
}

exports.Value = Value
