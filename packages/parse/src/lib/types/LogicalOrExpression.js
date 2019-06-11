import _LogicalExpression from './_LogicalExpression.js'
import { registerType } from './_Node.js'

export default class LogicalOrExpression extends _LogicalExpression {
  static get joiner() {
    return ' + '
  }

  static get name() {
    return 'LogicalOrExpression'
  }
}

registerType(LogicalOrExpression)
