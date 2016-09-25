'use strict';
var state = require('./state-manager');
var swaggerize = require('./swaggerise');
var _ = require('lodash');

/**
 * Will initialise your app with the required swaggers-spec information.
 * In addition you can pass in some options which will be used when generating the swagger JSON document later on.
 * Both British and American spelling supported.
 * @param {Object} app The express app class that you want to describe using swagger
 * @param {InitialisationOptions} options The options object, used to control how the swagger document will be generated
 * @returns {void}
 */
module.exports = function initialise(app, options) {
    if (!app) {
        throw new Error("options.app must be set when calling initialise");
    }
    if (state.initialised) {
        throw new Error("Already initialised, call reset first if you want to reinitialise");
    }
    state.app = app;
    state.options = options;
    setOption(options, 'defaultSecurity');
    mergeOptions(options, 'document');
    swaggerize(app);
    state.initialised = true;
};

function mergeOptions(options, key) {
    var merged = {};
    _.defaults(merged, options[key], state[key]);
    state[key] = merged;
    delete options[key];
}

function setOption(options, key) {
    state.common[key] = options[key];
    delete options[key];
}

/**
 * @class InitialisationOptions
 * @property {Object} document An existing or manually created swagger document to use as a base document and expanded upon. Note that the following options will override the base items in this supplied document
 * @property {String} title The title of the application.
 * @property {string} description A short description of the application. [GFM syntax](A short description of the application. GFM syntax can be used for rich text representation.) can be used for rich text representation.
 * @property {string} termsOfServiceThe Terms of Service for the API.
 * @property {object} contact The contact information for the exposed API.
 * @property {object} license The license information for the exposed API.
 * @property {string} version Provides the version of the application API.
 * @property {string} host The host (name or ip) serving the API. This MUST be the host only and does not include the scheme nor sub-paths. It MAY include a port. If the host is not included, the host serving the documentation is to be used (including the port). The host does not support [path templating](http://swagger.io/specification/#pathTemplating).
 * @property {string} basePath The base path on which the API is served, which is relative to the host. If it is not included, the API is served directly under the host. The value MUST start with a leading slash (/). The basePath does not support [path templating](http://swagger.io/specification/#pathTemplating). Default '/'
 * @property {array} schemes The transfer protocol of the API. Values MUST be from the list: "http", "https", "ws", "wss". If the schemes is not included, the default scheme to be used is the one used to access the Swagger definition itself.
 * @property {string[]} consumes A list of MIME types the APIs can consume. This is global to all APIs but can be overridden on specific API calls. Value MUST be as described under [Mime Types](http://swagger.io/specification/#mimeTypes).
 * @property {string[]} produces A list of MIME types the APIs can produce. This is global to all APIs but can be overridden on specific API calls. Value MUST be as described under [Mime Types](http://swagger.io/specification/#mimeTypes).
 * @property {object} paths The available paths and operations for the API.
 * @property {object} definitions An object to hold data types produced and consumed by operations.
 * @property {object} parameters An object to hold parameters that can be used across operations. This property does not define global parameters for all operations.
 * @property {object} responses An object to hold responses that can be used across operations. This property does not define global responses for all operations.
 * @property {object} securityDefinitions Security scheme definitions that can be used across the specification.
 * @property {object} security A declaration of which security schemes are applied for the API as a whole. The list of values describes alternative security schemes that can be used (that is, there is a logical OR between the security requirements). Individual operations can override this definition.
 * @property {string|array} defaultSecurity The default security schema to use on a route when the security parameter is set to **true**
 * @property {object} tags A list of tags used by the specification with additional metadata. The order of the tags can be used to reflect on their order by the parsing tools. Not all tags that are used by the [Operation Object](swagger.io/specification/#operationObject) must be declared. The tags that are not declared may be organized randomly or based on the tools' logic. Each tag name in the list MUST be unique.
 * @property {object} externalDocs Additional external documentation.
 */