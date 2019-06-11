# ThinQL

ThinQL is a query language for reducing the selection of an entity collection with powerful, intuitive, user-friendly, and environment-extendable syntax.

* Filter records by full text search
* Filter records by comparing a property to a value with `=`, `!=`, `>`, `>=`, `<`, `<=`, or `*=`
* Combine assertions with *and* and *or* operators and group expressions with `()`
* Negate assertions with `!`
* Write whitespace, newlines, special characters, and escape sequences with JSON5 string values
* Call contextually defined functions with arbitrary arguments and assert, compare, negate, and pass their return values

For details, see the [full specification](Specification.md).

## Examples

|Query|Description|
|:---|:---|
|`Matt`|Filter to records with the full text containing `Matt`|
|`!Matt`|Filter to records without the full text containing `Matt`|
|`Matt Miller`|Filter to records with the full text containing `Matt` and `Miller`|
|`"Matt Miller"`|Filter to records with the full text containing `Matt Miller`|
|`name = "Matt Miller"`|Filter to records with name `Matt Miller`|
|`first_name = Matt last_name = Miller`|Filter to records with first_name `Matt` and last_name `Miller`|
|`first_name = Matt + first_name = Matthew`|Filter to records with first_name `Matt` or `Matthew`|
|`(first_name = Matt + first_name = Matthew) last_name = Miller`|Filter to records with (first_name `Matt` or `Matthew`) and last_name `Miller`|
|`birthday = today()`|Filter to records with birthday the result of the `today()` function|
|`get_date(birthdate) = get_date(today())`|Filter to records where the result of the `get_date()` function passed `birthdate` equals the result of the `get_date()` function passed the result of the `today()` function.|
|`active != true age >= 35 subject *= priority`|Filter to records with active not set to `true`, age greater than or equal to `35`, and subject matching `priority`.|
|`!(email *= @gmail.com + session.login_method = login_method_id('google sso'))`|Filter to records without email matching `@gmail.com` or session.login_method set to the result of the function `login_method_id` passed `google sso`.|

## Packages

|Name|Description|
|:---|:---|
|[**@thinql/cli**](packages/cli/)|Parse ThinQL queries to stdout as ThinQL or JSON AST|
|**@thinql/conform**|Validate and transform the AST of a ThinQL query based on models|
|**@thinql/model**|Define resource property names and value data validations, function signatures, and joins on related resources|
|**@thinql/monarch-language**|Provide highlighting and IntelliSense ThinQL query editing with Monaco based on models|
|[**@thinql/parse**](packages/parse/)|Parse ThinQL queries to ASTs|
|**@thinql/sandbox**|Generate and examine ASTs, write and test models, try the Monaco editor, etc. in a GitHub Pages environment|
|[**@thinql/to-knex**](packages/to-knex/)|Build SQL queries from ThinQL ASTs with Knex.js|
