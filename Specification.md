# Specification

The following is a general specification of the ThinQL query syntax.

## General Rules

### Order of Operations

It is noteworthy that the logical operators `and` and `or` have *equal* precedence in ThinQL. All logical expressions are represented internally as a single operator joined by a left and right.

Most programming languages consider an *and* operator to have higher precedence. We instead encourage users to always favor explicit grouping over implied operator precedence. We found that while `a and b or c and d` was fairly straightforward, `a or b and c or d` is easily misread. By evaluating from left to right, the user's instinctual troubleshooting by reading the expression from left to right should be intuitive.

### Whitespace

Whitespace is ignored between and within most nonliteral tokens, with the following exceptions:

* Whitespace is **NOT ALLOWED** between a negating `!` and a function call.
* Whitespace is **NOT ALLOWED** between a negating `!` and a full text search.
* Whitespace is **NOT ALLOWED** between a negating `!` and a group opening `(`.
* Whitespace is **NOT ALLOWED** between a function callee and the opening `(`.
* Whitespace is **NOT ALLOWED** between a string's closing `"` or `'` and its flags.
* Whitespace is **ALLOWED** in a quoted string and conforms to the [JSON5](https://json5.org) specification.
* Whitespace is **REQUIRED** between function arguments.
* Whitespace is **REQUIRED** between assertions and logical operators.
* Whitespace is **REQUIRED** between two assertions if the logical operator is omitted.

In addition, quoted literals are parsed according to the [JSON5](https://json5.org) specification for strings; therefore, they may include newlines iff the preceding line ends with a `\`.

## Tokens

### Nodes

#### Assertion

```
Condition | FullTextSearch | Group | BooleanCall
```

#### BooleanCall

A boolean call is a function call whose result is not directly comparable, but instead is itself a complete assertion. Unlike a call used in a comparison, a boolean call may be negated if prefixed with a `!`.

```
"!":? Call
```

#### Call

A call is an invocation of an environment-defined function. It is passed zero or more space-separated arguments.

```
unquotedString "(" (ConditionValue (" " ConditionValue):*):? ")"
```

#### Condition

A condition presents a comparison between a property or the result of a function invocation, and a value.

```
(Property | Call) ComparisonOperator ConditionValue
```

#### ConditionValue

```
Value | Call
```

#### Expression

An expression contains one or more assertions, joined by logical operators. The `and` operator is implied if two assertions have no operator between them.

```
Assertion (" " (LogicalOperator " "):? Assertion):*
```

#### FullTextSearch

A full text search is any value not attached to a comparison or function argument. It may be negated if prefixed with a `!`, in which case the value *must* be quoted.

```
Value | ("!":? QuotedValue)
```

#### Group

A group wraps an expression to enforce that it is evaluated at higher precedence. It may be negated if prefixed with a `!`.

```
"!":? "(" Expression ")"
```

#### Property

A property represents an identifier for a queryable field on the entities. Like values, properties may contain any characters if they are quoted and escaped.

```
stringWithoutFlags
```

#### QuotedValue

```
quotedStringWithFlags | quotedStringWithoutFlags
```

#### Value

A value is a literal that may represent a full text search, subject of comparison, or function argument.

```
QuotedValue | unquotedString
```


### Primitives

#### flags

Flags may be appended to a quoted value to act as environment-defined modifiers.

```re
/[A-Za-z0-9~@#\$%\^&\-_\+\|\?:,\./]+/
```

#### quotedStringWithFlags

```
quotedStringWithoutFlags flags
```

#### quotedStringWithoutFlags

Quoted strings adhere to the JSON5 specification: they may be wrapped in either `'` or `"` quotation marks, and may span multiple newlines if the character preceding the newline is a `\`.

```re
/"(?:[^"\\\n]*|\\["\\bfnrt\/]|\\u[0-9a-f]{4}|\\\n)*"/ |
/'(?:[^'\\\n]*|\\['\\bfnrt\/]|\\u[0-9a-f]{4}|\\\n)*'/
```

#### unquotedString

Simple properties and values do not require being wrapped in quotation marks. They may only contain `A-Z`, `a-z`, `0-9`, `.`, `_`, `-`.

```re
/[A-Za-z0-9._-]+/
```
