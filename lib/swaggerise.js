'use strict';
var validator = require('./validator');
var schemaIds = require('./schema-ids');
/**
 * Adds the .describe function onto the provided object. The object should either be an express app or express router.
 * @param {object} item the item to apply
 * @return {void}
 */
module.exports = function swaggerize(item) {
    item.describe = describe;
    /**
     * Allows you describe an app our router route.
     * @paramSchema metaData ./lib/schemas/meta-data.json
     * @param {string[]} [metaData.tags] - A list of tags used by the specification with additional metadata. The order of the tags can be used to reflect on their order by the parsing tools. Not all tags that are used by the [Operation Object](swagger.io/specification/#operationObject) must be declared. The tags that are not declared may be organized randomly or based on the tools' logic. Each tag name in the list MUST be unique. See {@link http://swagger.io/specification/#tagObject Tag Object}. (Generated)
     * @return {void}
     */
    function describe(metaData) {
        if (item.stack) {
            return describeRouterRoute(item, metaData);
        }
        describeRouterRoute(item._router, metaData);
    }
};
function describeRouterRoute(router, metaData) {
    if (!metaData) {
        throw new Error('Metadata must be set when calling describe');
    }
    if (!router) {
        throw new Error('router was null, either the item that swaggerize & describe was called on is not an express app/router or you have called describe before adding at least one route');
    }
    if (!router.stack) {
        throw new Error('router.stack was null, either the item that swaggerize & describe was called on is not an express app/router or you have called describe before adding at least one route');
    }
    var lastRoute = router.stack[router.stack.length - 1];
    if (!lastRoute.route) {
        throw new Error('Unable to add swagger metadata to last route since the last item in the stack was not a route. Route name :' + lastRoute.name + '. Metadata :' + JSON.stringify(metaData));
    }
    var verb = Object.keys(lastRoute.route.methods)[0];
    if (!verb) {
        throw new Error('Unable to add swagger metadata to last route since the last route\'s methods property was empty' + lastRoute.name + '. Metadata :' + JSON.stringify(metaData));
    }
    validator.ensureValid(schemaIds.metaData, metaData);
    metaData.path = lastRoute.route.path;
    metaData.verb = verb;
    lastRoute.route.swaggerData = metaData;
}