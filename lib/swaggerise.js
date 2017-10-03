'use strict';
var validator = require('./validator');
var schemaIds = require('./schema-ids');
/**
 * Adds the .describe function onto the provided object. The object should either be an express app or express router.
 * @param {object} item the item to apply
 * @return {void}
 * @example
 * var swagger = require('swagger-spec-express');
 * var express = require('express');
 * var app = express();
 * swagger.swaggerize(app);
 * var router = new express.Router();
 * swagger.swaggerize(router);
 */
module.exports = function swaggerize(item) {
    item.describe = describe;
    /**
     * Allows you describe an app our router route.
     * @paramSchema metaData ./lib/schemas/meta-data.json
     * @param {object} metaData Metadata about a route. At least one of metaData.responses or metaData.common.responses must be specified.
     * @param {string[]} [metaData.tags] - A list of tags used by the specification with additional metadata. The order of the tags can be used to reflect on their order by the parsing tools. Not all tags that are used by the [Operation Object](swagger.io/specification/#operationObject) must be declared. The tags that are not declared may be organized randomly or based on the tools' logic. Each tag name in the list MUST be unique. See {@link http://swagger.io/specification/#tagObject Tag Object}.
     * @param {string} [metaData.summary] - A brief summary of the operation.
     * @param {string} [metaData.description] - A longer description of the operation, GitHub Flavored Markdown is allowed.
     * @param {object} [metaData.externalDocs] - information about external documentation
     * @param {string} [metaData.externalDocs.description] - A short description of the target documentation. GFM syntax can be used for rich text representation.
     * @param {string} metaData.externalDocs.url - Required. The URL for the target documentation. Value MUST be in the format of a URL.
     * @param {string} [metaData.operationId] - A unique identifier of the operation.
     * @param {string[]} [metaData.produces] - A list of MIME types the API can produce.
     * @param {string[]} [metaData.consumes] - A list of MIME types the API can consume.
     * @param {object|string} [metaData.parameters] - An object to hold parameters that can be used across operations. This property does not define global parameters for all operations. See {@link http://swagger.io/specification/#parametersDefinitionsObject Parameter Definitions Object}.
     * @param {object} [metaData.responses] - Response objects names can either be any valid HTTP status code or 'default'.
     * @param {string[]} [metaData.schemes] - The transfer protocol of the API.
     * @param {boolean} [metaData.deprecated] - Declares this operation to be deprecated. Usage of the declared operation should be refrained. Default value is false.
     * @param {array|boolean|string} [metaData.security] - A declaration of which security schemes are applied for the API as a whole. The list of values describes alternative security schemes that can be used (that is, there is a logical OR between the security requirements). Individual operations can override this definition. See {@link http://swagger.io/specification/#securityRequirementObject Security Requirement Object}.
     * @param {object} [metaData.common] - A collection of common data to include in this route.
     * @param {string[]} [metaData.common.responses] - Common responses as added by calling common.addResponse
     * @param {object} [metaData.common.parameters] - A collection of common parameters to use for this route.
     * @param {string[]} [metaData.common.parameters.header] - A common header parameter as added by calling common.parameters.addHeader
     * @param {string[]} [metaData.common.parameters.body] - A common body parameter as added by calling common.parameters.addBody
     * @param {string[]} [metaData.common.parameters.query] - A common query string parameter as added by calling common.parameters.addQuery
     * @param {string[]} [metaData.common.parameters.formData] - A common form data parameter as added by calling common.parameters.addFormData
     * @param {string[]} [metaData.common.parameters.path] - A common path parameter as added by calling common.parameters.addPath
     * @link http://swagger.io/specification/#tagObject Tag Object}.
     * @link http://swagger.io/specification/#parametersDefinitionsObject Parameter Definitions Object}.
     * @link http://swagger.io/specification/#securityRequirementObject Security Requirement Object}.
     * @link http://swagger.io/specification/#tagObject Tag Object}. (Generated)
     * @link http://swagger.io/specification/#parametersDefinitionsObject Parameter Definitions Object}. (Generated)
     * @link http://swagger.io/specification/#securityRequirementObject Security Requirement Object}. (Generated)
     * @return {object} the router or app object to allow for fluent calls.
     * @example
     * var swagger = require('swagger-spec-express');
     * var express = require('express');
     * var router = new express.Router();
     * swagger.swaggerize(router);
     * router.get('/', function (req, res) {
     *     //...
     * }).describe({
     *     //...
     * });
     */
    function describe(metaData) {
        if (item.stack) {
            describeRouterRoute(item, metaData);
            return item;
        }
        describeRouterRoute(item._router, metaData);
        return item;
    }
};

function describeRouterRoute(router, metaData) {
    if(metaData.described){
        console.warn("Route already described");
        return;
    }
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
    ensureAtLeastOneResponse(metaData);
    metaData.path = lastRoute.route.path;
    metaData.verb = verb;
    lastRoute.route.swaggerData = metaData;
    metaData.described = true;
}

function ensureAtLeastOneResponse(metaData) {
    if (metaData.responses && Object.keys(metaData.responses).length > 0) {
        return;
    }
    if (metaData.common && metaData.common.responses.length > 0) {
        return;
    }
    throw new Error("Each metadata description for a route must have at least one response, either specified in metaData.responses or metaData.common.responses.");
}