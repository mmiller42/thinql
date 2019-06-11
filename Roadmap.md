# Roadmap

* [ ] CI
* [ ] Linting
* **cli**
  * [ ] Docs
* **parse**: Parse ThinQL queries to ASTs
  * [ ] Unit tests
  * [ ] Generate docs and/or use TypeScript
* **model**: Define resource property names and value data validations, function signatures, and joins on related resources
  * [ ] APIs
  * [ ] Unit tests
  ```js
  import {
    Func,
    Model,
    Schema,
    Type,
    // convenient built-in types
    booleanType,
    nullType,
    numberType,
    requiredArgumentType,
    stringType,
  } from '@thinql/model'

  const id = new Type({
    comparisonOperators: ['=', '!='],
    pattern: /^[1-9]+\d*$/,
  })

  const number = new Type({
    comparisonOperators: ['=', '!=', '>', '>=', '<', '<='],
    pattern: /^-?\d*\.?\d*$/,
    // default: transform: value => value.content
    transform: value => parseInt(value.content, 10),
  })

  const dateString = new Type({
    comparisonOperators: ['=', '!=', '>', '>=', '<', '<='],
    pattern: /^\d{4}-\d{2}-\d{2}$/,
  })

  const permissionSlug = new Type({
    comparisonOperators: ['=', '!='],
    // async is supported but like SQL this can be a runtime error and not
    // necessary to validate as the query is composed. parsing execution
    // errors might be more efficient than making validation queries but
    // provides a less direct way to troubleshoot. also, note that this query
    // of course cannot be atomic.
    transform: async value => {
      const permission = await findPermissionBySlug(value.content)
      if (permission) {
        return value.content
      } else {
        throw new Error('The permission slug is invalid')
      }
    },
  })

  const string = new Type({
    comparisonOperators: ['=', '!=', '*='],
  })

  // extend from all of the classes (essentially just Object.assign their configs, but also runs transform calls sequentially)
  const email = string.extend({
    pattern: /^.+?@.+$/,
    transform: value => value.content.trim().toLowerCase(),
  })

  const requiredArgument = new Type({
    transform: value => {
      // value can literally only be undefined in the case of fewer arguments passed to a function than were in the signature
      if (value === undefined) {
        throw new Error('argument is required')
      } else {
        return value.content
      }
    },
  })

  const propertyArgument = requiredArgument.extend({
    transform: property => {
      // Schema#properties can be used to recursively find property names even on relationships
      if (!get(user.properties, property.content)) {
        throw new Error('property is invalid')
      } else {
        return property.content
      }
    },
  })

  const user = new Schema({
    id: { title: 'User ID', desc: 'The User ID', type: id },
    firstName: { title: 'First name', desc: "The user's first name", type: string },
    owner: () => ({ label: 'Owner', type: user }), // for self-references, use CB style like node graphql
    pet: () => ({ label: 'Pet', type: pet }),
  })

  const pet = new Schema({
    name: { title: 'Name', desc: "The pet's name", examples: ['Paco'], type: string },
    owner: { label: 'Owner', type: user },
  })

  const length = new OperandFunction({
    arguments: [
      { name: 'property', desc: 'The property whose string length is being computed', type: propertyArgument }
    ],
    desc: 'Get the length of the value of the given property',
    returnType: number,
  })

  const isActive = new StandaloneFunction({
    desc: 'Users who are active',
    // knex.QueryBuilder indicates it can be called directly in the query
    // Otherwise it may be a Type if it returns a string, or another value here.
    // it will just be a primitive or an instanceof check, so:
    // null, undefined, Number, String, RegExp, Date, Object, etc.
    returnType: StandaloneFunction.QueryBuilder,
  })

  const now = new StandaloneFunction({
    desc: 'Get the current date/time instance',
    returnType: Date,
  })

  const getDate = new StandaloneFunction({
    arguments: [
      { name: 'date', desc: 'The date object', type: Date },
    ],
    desc: 'Get a date string (YYYY-MM-DD) from the date/time instance',
    returnType: dateString,
  }

  export default new Model({
    fullTextSearch: false /* disable */ | true /* no restrictions, default */ | Type,
    functions: {
      getDate,
      isActive,
      length,
      now,
    },
    schema: user,
  })
  ```
* **conform**: Validate and transform the AST of a ThinQL query based on models
  * [ ] Create validator
  * [ ] Unit tests
  ```js
  const thinqlMiddleware = model => async (req, res, next) => {
    if (!req.query.q) {
      next()
      return
    }

    let ast = parse(req.query.q)

    try {
      ast = await conform(ast, model)
    } catch (err) {
      if (err.code === '@thinql/model') {
        res.status(400).send(err.toString())
      } else {
        next(err)
      }
      return
    }

    res.locals.thinql = ast
    next()
  })
  ```

* **monarch-language**: Provide highlighting and IntelliSense ThinQL query editing with Monaco based on models
  * [ ] Define syntax
  * [ ] Add IntelliSense property and function suggestions when tied to a model
  * [ ] Support nested properties for related resources
* **to-knex**: Transform a ThinQL AST to a Knex.js query
  * [x] Create transformer
  * [ ] Unit tests
* **sandbox**: Generate and examine ASTs, write and test models, try the Monaco editor, etc. in a GitHub Pages environment.
  * [ ] Basic input textarea -> AST output
  * [ ] Code textarea that can be eval()'d to define functions, models, schemas, and types in JS code
  * [ ] Once the model is valid, you can additionally validate and conform the query AST
  * [ ] Embed a Monaco editor that uses the defined model to provide support
