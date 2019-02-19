# thinql-parse

Parse ThinQL queries.

## Installation

```sh
# npm
npm install thinql-parse

# yarn
yarn add thinql-parse
```

## Example

```js
const { parse } = require('thinql-parse')

const result = parse('hello world')

expect(result.toThinQL({ alwaysQuoteValues: true })).toEqual('"hello" "world"')

expect(result.toJSON()).toMatchObject({
  type: 'LogicalExpression',
  operator: {
    type: 'LogicalOperator',
    kind: 'and',
  },
  left: {
    type: 'FullTextSearch',
    value: {
      type: 'Value',
      value: 'hello',
      flags: '',
    },
    negate: false,
  },
  right: {
    type: 'FullTextSearch',
    value: {
      type: 'Value',
      value: 'world',
      flags: '',
    },
    negate: false,
  },
})
```

## API

### Exports

#### grammarPath: string

The absolute path to the compiled [nearley](https://github.com/kach/nearley) grammar specification.

#### lexer: moo.Lexer

The [Moo](https://github.com/no-context/moo) lexer instance.

#### parse(query: string): Node

Parses a ThinQL query and returns the root node of the resultant AST, which is a subclass of Node.

#### types: Object&lt;string, { new(): Node }

A map of all node type classes.

### Types

#### abstract Node

|Member|Type/Return Type|Description|
|:---|:---|:---|
|`#token`|moo.Token \| null|The token matched by the lexer, which includes information such as the line and column position of the node. Null for implied tokens.|
|`#toJSON()`|Object|Converts the node and its descendants into a plain serializable object recursively. Each node will include a `type` property whose value is the name of one of the subclasses of Node.|
|`#toString()`|string|Converts the node and its descendants recursively into a string for inspection.|
|`#toThinQL(options: toThinQLOptions)`|string|Converts the node and its descendants recursively into a ThinQL query.|

#### Call extends Node

A node that represents an invocation of an environment-defined function.

|Member|Type/Return Type|Description|
|:---|:---|:---|
|`.type`|`'Call'`|The node type.|
|`#callee`|string|The name of the function.|
|`#negate`|boolean \| null|Whether to negate the result. Will be `null` if negating is syntactically invalid, such as when a call's return value is compared.|
|`#type`|string|The node type (as an instance member).|
|`#arguments`|Array&lt;Value \| Call&gt;|The arguments passed into the function.|

#### abstract Operator extends Node

|Member|Type/Return Type|Description|
|:--|:---|:---|
`.symbolFor(kind: string)`|string|Get a symbol sequence that represents this operator in a query.|
|`.operators`|Object&lt;string, string \| Array&lt;string&gt;&gt;|A map of operator token names to corresponding symbol sequence(s).|

#### ComparisonOperator extends Operator

A node that represents an operator for comparison.

|Member|Type/Return Type|Description|
|:---|:---|:---|
|`.type`|`'ComparisonOperator'`|The node type.|
|`.operators.eq`|`'='`|Kind for the "is equal to" operator.|
|`.operators.gt`|`'>'`|Kind for the "is greater than" operator.|
|`.operators.gte`|`'>='`|Kind for the "is greater than or equal to" operator.|
|`.operators.lt`|`'<'`|Kind for the "is less than" operator.|
|`.operators.lte`|`'<='`|Kind for the "less than or equal to" operator.|
|`.operators.match`|`'*='`|Kind for the "matches" operator.|
|`.operators.ne`|`'!='`|Kind for the "is not equal to" operator.|
|`#kind`|`'eq'` \| `'gt'` \| `'gte'` \| `'lt'` \| `'lte'` \| `'match'` \| `'ne'`|A keyword that represents the comparison operator.|

#### Condition extends Node

A node that represents a condition in which a property or call return value is compared against a value or return value.

|Member|Type/Return Type|Description|
|:---|:---|:---|
|`.type`|`'Condition'`|The node type.|
|`#property`|Property \| Call|The property or call result being compared.|
|`#operator`|ComparisonOperator|The comparison operator.|
|`#value`|Value \| Call|The value or call result the property is compared against.|

#### FullTextSearch extends Node

A node that represents a search query against no particular field.

|Member|Type/Return Type|Description|
|:---|:---|:---|
|`.type`|`'FullTextSearch'`|The node type.|
|`#value`|Value|The value to search for.|
|`#negate`|boolean|Whether to negate this filter.|

#### Group extends Node

A node that represents an expression that will be evaluated as a group.

|Member|Type/Return Type|Description|
|:---|:---|:---|
|`.type`|`'Group'`|The node type.|
|`#expression`|LogicalExpression|The expression wrapped inside the group.|
|`#negate`|boolean|Whether to negate this filter.|

#### LogicalExpression extends Node

A node that joins two expressions to produce a criterion in which either or both must be satisfied.

|Member|Type/Return Type|Description|
|:---|:---|:---|
|`.type`|`'LogicalExpression'`|The node type.|
|`#operator`|LogicalOperator|The logical operator that joins the operands.|
|`#left`|Condition \| FullTextSearch \| Group \| Call|The assertion on the left.|
|`#right`|Condition \| FullTextSearch \| Group \| Call|The assertion on the right.|

#### LogicalOperator extends Operator

A node that represents a logical operator.

|Member|Type/Return Type|Description|
|:---|:---|:---|
|`.type`|`'ComparisonOperator'`|The node type.|
|`.operators.and`|`['and', 'AND']`|Requires both criteria to be satisfied.|
|`.operators.or`|`['or', 'OR']`|Requires either criteria to be satisfied.|
|`#kind`|`'and'` \| `'or'`|A keyword that represents the logical operator.|

#### Property extends Node

A node that represents a property that can be compared to a value.

|Member|Type/Return Type|Description|
|:---|:---|:---|
|`.type`|`'Property'`|The node type.|
|`#name`|string|The name of the property being compared.|

#### Value extends Node

A node that represents any value: full text search, comparison subject, or function argument.

|Member|Type/Return Type|Description|
|:---|:---|:---|
|`.type`|`'Property'`|The node type.|
|`#value`|string|The value text.|
|`#flags`|string|Any flags appended to the value.|

#### toThinQLOptions

Options which can be passed to `Node#toThinQL()` to affect the output formatting.

|Property|Type|Description|Default|
|:---|:---|:---|:---|
|`alwaysQuoteProperties`|boolean|Always wrap property names with quotation marks.|`false`|
|`alwaysQuoteValues`|boolean|Always wrap values with quotation marks.|`false`|
|`propertyQuoteSymbol`|`'"'` \| `'"'`|The quotation mark symbol to wrap property names with.|`'"'`|
|`valueQuoteSymbol`|`'"'` \| `'"'`|The quotation mark symbol to wrap values with.|`'"'`|
