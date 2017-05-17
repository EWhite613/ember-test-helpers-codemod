const { migrateSelector, makeParentFunctionAsync, isJQuerySelectExpression, addImportStatement } = require('../utils');

/**
 * Create `await click(selector)` expression
 * @param j
 * @param args
 * @returns {*}
 */
function createExpression(j, args) {
  return j.awaitExpression(
    j.callExpression(
      j.identifier('click'),
      args.map(s => migrateSelector(j, s))
    )
  );
}

/**
 * Check if `node` is a `this.$(selector).click()` expression
 *
 * @param j
 * @param node
 * @returns {*|boolean}
 */
function isJQueryExpression(j, node) {
  return j.CallExpression.check(node)
    && j.MemberExpression.check(node.callee)
    && isJQuerySelectExpression(j, node.callee.object)
    && j.Identifier.check(node.callee.property)
    && node.callee.property.name === 'click';
}

/**
 * Transform `this.$(selector).click()` to `await click(selector)`
 *
 * @param file
 * @param api
 * @returns {*|string}
 */
function transform(file, api) {
  let source = file.source;
  let j = api.jscodeshift;

  let root = j(source);

  let replacements = root
    .find(j.CallExpression)
    .filter(({ node }) => isJQueryExpression(j, node))
    .replaceWith(({ node }) => createExpression(j, node.callee.object.arguments))
    .forEach((path) => makeParentFunctionAsync(j, path))
    ;

  if (replacements.length > 0) {
    addImportStatement(j, root, ['click']);
  }

  return root.toSource({ quote: 'single' });
}

module.exports = transform;