See [parser readme](packages/parse/README.md).
[Specification](Specification.md)

# ThinQL

ThinQL is a query language for reducing the selection of an entity collection with intuitive, user-friendly syntax.

Users can express filters by asserting full text search queries or comparing specific entity properties against literal string values.

The environment in which ThinQL is executed can also extend the capabilities by defining *functions* and *flags*. Functions can be passed arbitrary arguments in the query and their return values may be compared against literals or other function calls. Flags offer a more concise syntax to mark a value, e.g. to indicate case sensitivity.

## Example

```
(firstName=Matt and length(lastName)=6 and address*="UT"c) or ("hello world" age<=42)
```

Todos:

* [x] Write formal spec
* Grammar change considerations
  * [ ] Determine a better EOF solution than the manual `;` insertion
  * [ ] Rewrite tokens at some point
  * [ ] Restrict flags to prevent accidental missing whitespace from being interpreted as flags (e.g. `"foo"bar`)
  * [ ] Expand characters allowed in unquoted strings (internationalize too)
* [ ] CI
* [ ] Linting
* **parse**: Parse ThinQL queries
  * [ ] Unit tests
* **model**: Define data types, properties, functions, and flags
  * [ ] APIs
  * [ ] Unit tests
* **conform**: Validate and transform a parsed query based on a model
  * [ ] Create validator
  * [ ] Unit tests
* **monarch-language**: Write ThinQL queries in Monaco
  * [ ] Define syntax
  * [ ] Add IntelliSense property, function, and flag suggestions
  * [ ] Support nested properties for related resources
* **to-sql**: Transform a ThinQL query to SQL
  * [ ] Create transformer
  * [ ] Unit tests
