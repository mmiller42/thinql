@{%
  const { lexer } = require('./lexer')
  const {
    Call,
    ComparisonOperator,
    Condition,
    FullTextSearch,
    Group,
    LogicalExpression,
    LogicalOperator,
    Property,
    Value,
  } = require('./types')
%}

@lexer lexer

main -> _ MainExpression {% ([, expression]) => expression %}

@{%
  const extractExpression = ([firstAssertion, moreAssertions]) => {
    if (moreAssertions.length === 0) {
      return firstAssertion
    }

    const buildLogicalExpression = () => {
      const [, operator, assertion] = moreAssertions.pop()
      return new LogicalExpression({
        operator: operator
          ? operator[0]
          : new LogicalOperator({ kind: LogicalOperator.symbolFor('and') }, null),
        left: moreAssertions.length > 0 ? buildLogicalExpression() : firstAssertion,
        right: assertion,
      }, assertion.token)
    }

    return buildLogicalExpression()
  }
%}

MainExpression -> Assertion (Space (LogicalOperator Space):? Assertion):* %eof
  {% extractExpression %}

Assertion ->
  Condition {% id %} |
  FullTextSearch {% id %} |
  Group {% id %} |
  StandaloneCall {% id %}

Group -> %openGroup _ (Assertion (Space (LogicalOperator Space):? Assertion):*) _ %closeGroup
  {% ([openGroup, , rawExpression]) => new Group({
    expression: extractExpression(rawExpression),
    negate: openGroup.value.negate,
  }, openGroup) %}

Condition -> (Property | ComparisonCall) _ ComparisonOperator _ ConditionValue
  {% ([[property], , operator, , value]) => (
    new Condition({ property, operator, value }, property.token)
  ) %}

Property -> StringWithoutFlags
  {% ([string]) => new Property({ name: string.value }, string) %}

ConditionValue ->
  Value {% id %} |
  ComparisonCall {% id %}

Value ->
  StringWithFlags
    {% ([string]) => (
      new Value({ value: string.value.value, flags: string.value.flags }, string)
    ) %}

FullTextSearch ->
  Value
    {% ([value]) => new FullTextSearch({ value, negate: false }, value.token) %} |
  %negatedFullTextSearch
    {% ([string]) => new FullTextSearch({
      value: new Value({ value: string.value.value, flags: string.value.flags }, string),
      negate: true,
    }, string.token) %}

StringWithoutFlags ->
  %quotedStringWithoutFlags {% id %} |
  %unquotedString {% id %}

StringWithFlags ->
  StringWithoutFlags {% ([string]) => ({ ...string, value: { value: string.value, flags: '' } }) %} |
  %quotedStringWithFlags {% id %}

StandaloneCall ->
  %negatedCallee CallArgs
    {% ([string, args]) => new Call({
      callee: string.value,
      negate: true,
      arguments: args,
    }, string) %} |
  ComparisonCall {% id %}

ComparisonCall -> %unquotedString CallArgs
  {% ([string, args]) => new Call({
    callee: string.value,
    negate: null,
    arguments: args,
  }, string) %}

CallArgs -> "(" _ (ConditionValue (Space ConditionValue):*):? _ ")"
  {% ([, , possibleArgs]) => {
    let args = []
    if (possibleArgs) {
      const [firstArg, moreArgs] = possibleArgs
      args = [
        firstArg,
        ...moreArgs.map(([, value]) => value),
      ]
    }

    return args
  } %}

@{%
  const extractComparisonOperator = ([token]) => (
    new ComparisonOperator({ kind: token.type }, token)
  )
%}
ComparisonOperator ->
  %eq {% extractComparisonOperator %} |
  %ne {% extractComparisonOperator %} |
  %lt {% extractComparisonOperator %} |
  %lte {% extractComparisonOperator %} |
  %gt {% extractComparisonOperator %} |
  %gte {% extractComparisonOperator %} |
  %match {% extractComparisonOperator %}

@{%
  const extractLogicalOperator = ([token]) => (
    new LogicalOperator({ kind: token.type }, token)
  )
%}
LogicalOperator ->
  %and {% extractLogicalOperator %} |
  %or {% extractLogicalOperator %}

_ -> null | Space

Space -> %space {% () => null %}
