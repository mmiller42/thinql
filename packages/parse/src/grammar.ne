@{%
  import {
    Assertion,
    Call,
    Comparison,
    FullTextSearch,
    LogicalAndExpression,
    LogicalOrExpression,
    Property,
    Statement,
    Value,
  } from './types/index.js'
  import lexer from './lexer.js'
%}

@lexer lexer

# Full examples

# Call examples
# current_time()      -> The current timestamp
# sum(6 15)           -> The sum of 6 and 15
# lower_case(name)    -> The name converted to lower case
# !is_null(user_id)   -> The user id is not null
# cart_count(user_id) -> The number of items in the user's cart

# Comparison examples
# a = b                             -> a is b
# a != b                            -> a is not b
# a > b                             -> a is greater than b
# a >= b                            -> a is greater than or equal to b
# a < b                             -> a is less than b
# a <= b                            -> a is less than or equal to b
# a *= b                            -> a matches b
# lower_case(name) *= matt          -> The name converted to lowercase matches "matt"
# published_date < today()          -> The publish date is before today's date
# to_date(published_time) = today() -> The date of the publish timestamp equals today's date
# active(editor) = !active(author)  -> Either the editor or author are inactive but not both

# Full Text Search examples
# "Matt Miller" -> Text contains "Matt Miller"
# !Matt         -> Text does not contain "Matt"

# Group/Logical Expression examples
# a                 -> a
# a b               -> a and b
# a b c             -> a and b and c
# a + b             -> a or b
# a + b + c         -> a or b or c
# (a + b) c         -> (a or b) and c
# a + (b c)         -> a or (b and c)
# a + b + (c d e)   -> a or b or (c and d and e)
# a + (b (c + d) e) -> a or (b and (c or d) and e)
# !a                -> not a
# !a b              -> (not a) and b
# !(a b)            -> not (a and b)
# !a + b + (c !e)   -> (not a) or b or (a and (not e))

# Value examples
# Matt               -> Matt
# Mátt               -> Mátt
# email@email.com    -> email@email.com
# #trending          -> #trending
# https://gmail.com/ -> https://gmail.com/
# "foo bar"          -> foo bar
# "foo \" bar\""     -> foo "bar"
# "foo \
# bar"               -> foo \nbar
# 'foo\' "bar"'      -> foo' "bar"

# Tokens
# <json5 string regex> quotedString
# >|>=|<|<=|*=|!=|= comparisonOperator
# + logicalOr
# ( openBracket
# ) closeBracket
# ! negator
# \s+ whitespace
# [^"'`>=<*!+()\s]+ unquotedString

# Primitive tokens

## Main
main -> Statement {%
  ([statement]) => statement
%}

## Optional whitespace
_ -> (null | %whitespace) {%
  () => null
%}

## Required whitespace
__ -> %whitespace {%
  () => true
%}

## The function identifier in a function call
callee -> %unquotedString {%
  ([callee]) => callee
%}

## A comparison operator between two operands in a comparison
comparisonOperator -> %comparisonOperator {%
  ([comparisonOperator]) => comparisonOperator
%}

## An exclamation point that negates the following assertion
negator -> %negator {%
  () => true
%}

## An optionally quoted string literal
string -> (%quotedString | %unquotedString) {%
  ([[string]]) => string
%}

# Abstract nodes

## An argument that can be passed to a function call or compared
## against in a comparison: a value or function call return value
_Argument -> (Call | Value) {%
  ([[argument]]) => argument
%}

## A logical expression or a single assertion
_LogicalExpression -> (LogicalAndExpression | LogicalOrExpression) {%
  ([[expression]]) => expression
%}

# Nodes

## A negatable requirement that the search results must satisfy
Assertion -> negator:? _ (Comparison | (%openBracket _LogicalExpression %closeBracket) | Call | FullTextSearch) {%
  ([negator, , [assertionGroup]]) => {
    let assertion = assertionGroup

    if (Array.isArray(assertion)) {
      ([, assertion] = assertionGroup)
    }

    return new Assertion(
      { assertion, negated: negator !== null },
      negator || assertion
    )
  }
%}

## A function call with zero or more space-separated arguments
Call -> callee %openBracket _ (_Argument (__ _Argument):*):? _ %closeBracket {%
  ([callee, , , argList]) => {
    const args = []

    if (argList) {
      const [firstArgument, moreArguments] = argList

      args.push(firstArgument)

      if (moreArguments) {
        for (const [, argument] of moreArguments) {
          args.push(argument)
        }
      }
    }

    return new Call({ arguments: args, callee: callee.value }, callee)
  }
%}

## An expression that compares a property or function call
## return value with an argument
Comparison -> (Call | Property) _ comparisonOperator _ _Argument {%
  ([[left], , { value: comparisonOperator }, , right]) =>
    new Comparison({ comparisonOperator, left, right }, left)
%}

## A full text search query
FullTextSearch -> Value {%
  ([value]) => new FullTextSearch({ value }, value)
%}

## An expression containing multiple assertions separated by a
## whitespace logical and operator
LogicalAndExpression -> Assertion (__ Assertion):+ {%
  ([firstAssertion, moreAssertions]) => {
    const assertions = [firstAssertion]

    for (const [, assertion] of moreAssertions) {
      assertions.push(assertion)
    }

    return new LogicalAndExpression({ assertions }, assertions[0])
  }
%}

## An expression containing multiple assertions separated by a +
## logical or operator
LogicalOrExpression -> Assertion (__ %logicalOrOperator __ Assertion):+ {%
  ([firstAssertion, moreAssertions]) => {
    const assertions = [firstAssertion]

    for (const [, , , assertion] of moreAssertions) {
      assertions.push(assertion)
    }

    return new LogicalOrExpression({ assertions }, assertions[0])
  }
%}

## A property to compare on the record against a value or call
## return value
Property -> string {%
  ([content]) => new Property({ content: content.value }, content)
%}

## A statement
Statement -> _ (_LogicalExpression | Assertion) _ {%
  ([, [expression]]) => new Statement({ expression }, expression)
%}

## A value is a string
Value -> string {%
  ([content]) => {
    const { type, value } = content
    const literal = type === 'quotedString'
    return new Value({ content: value, literal }, content)
  }
%}
