'use strict';
var state = require('./state-manager');
var swaggerize = require('./swaggerise');
var _ = require('lodash');

/**
 * Will initialise your app with the required swaggers-spec information.
 * In addition you can pass in some options which will be used when generating the swagger JSON document later on.
 * Both British and American spelling supported.
 * @param {object} app The express app class that you want to describe using swagger
 * @param {object} options The options object, used to control how the swagger document will be generated
 * @param {object} [options.document] An existing or manually created swagger document to use as a base document and expanded upon. Note that the other options will override the base items in this supplied document. See {@link http://swagger.io/specification/} for info on how to manually construct a document.
 * @param {string} [options.title] - The title of the application.
 * @param {string} [options.description] A short description of the application. [GFM syntax](A short description of the application. GFM syntax can be used for rich text representation.) can be used for rich text representation.
 * @param {string} [options.termsOfService] The Terms of Service for the API.
 * @param {object} [options.contact] The contact information for the exposed API. See {@link http://swagger.io/specification/#contactObject Contact Object}.
 * @param {string} [options.contact.name] The identifying name of the contact person/organization.
 * @param {string} [options.contact.url] The URL pointing to the contact information. MUST be in the format of a URL.
 * @param {string} [options.contact.email] The email address of the contact person/organization. MUST be in the format of an email address.
 * @param {object} [options.license] The license information for the exposed API. See {@link http://swagger.io/specification/#licenseObject License Object}.
 * @param {string} options.license.name Required. The license name used for the API.
 * @param {string} [options.license.url] A URL to the license used for the API. MUST be in the format of a URL.
 * @param {string} [options.version] Provides the version of the application API.
 * @param {string} [options.host] The host (name or ip) serving the API. This MUST be the host only and does not include the scheme nor sub-paths. It MAY include a port. If the host is not included, the host serving the documentation is to be used (including the port). The host does not support {@link http://swagger.io/specification/#pathTemplating Path Templating}.
 * @param {string} [options.basePath=/] The base path on which the API is served, which is relative to the host. If it is not included, the API is served directly under the host. The value MUST start with a leading slash (/). The basePath does not support {@link http://swagger.io/specification/#pathTemplating Path Templating}.
 * @param {string[]} [options.schemes] The transfer protocol of the API. Values MUST be from the list: "http", "https", "ws", "wss". If the schemes is not included, the default scheme to be used is the one used to access the Swagger definition itself.
 * @param {string[]} [options.consumes] A list of MIME types the APIs can consume. This is global to all APIs but can be overridden on specific API calls. Value MUST be as described under {@link http://swagger.io/specification/#mimeTypes Mime Types}.
 * @param {string[]} [options.produces] A list of MIME types the APIs can produce. This is global to all APIs but can be overridden on specific API calls. Value MUST be as described under {@link http://swagger.io/specification/#mimeTypes Mime Types}.
 * @param {object} [options.paths] The available paths and operations for the API. See {@link http://swagger.io/specification/#pathsObject Paths Object}.
 * @param {object} [options.definitions] An object to hold data types produced and consumed by operations. See {@link http://swagger.io/specification/#definitionsObject Definitions Object}.
 * @param {object} [options.parameters] An object to hold parameters that can be used across operations. This property does not define global parameters for all operations. See {@link http://swagger.io/specification/#parametersDefinitionsObject Parameter Definitions Object}.
 * @param {object} [options.responses] An object to hold responses that can be used across operations. This property does not define global responses for all operations. See {@link http://swagger.io/specification/#responsesDefinitionsObject Response Definitions Object}.
 * @param {object} [options.securityDefinitions] Security scheme definitions that can be used across the specification. See {@link http://swagger.io/specification/#securityDefinitionsObject Security Definitions Object}.
 * @param {object} [options.security] A declaration of which security schemes are applied for the API as a whole. The list of values describes alternative security schemes that can be used (that is, there is a logical OR between the security requirements). Individual operations can override this definition. See {@link http://swagger.io/specification/#securityRequirementObject Security Requirement Object}.
 * @param {string|string[]} [options.defaultSecurity] The default security schema to use on a route when the security parameter is set to **true**. Must be a single {@link http://swagger.io/specification/#securityRequirementObject Security Requirement Object}.
 * @param {object} [options.tags] A list of tags used by the specification with additional metadata. The order of the tags can be used to reflect on their order by the parsing tools. Not all tags that are used by the [Operation Object](swagger.io/specification/#operationObject) must be declared. The tags that are not declared may be organized randomly or based on the tools' logic. Each tag name in the list MUST be unique. See {@link http://swagger.io/specification/#tagObject Tag Object}.
 * @param {string} options.tags.name Required. The name of the tag.
 * @param {string} [options.tags.description] A short description for the tag. GFM syntax can be used for rich text representation.
 * @param {object} [options.tags.externalDocs] Additional external documentation for this tag.
 * @param {string} [options.tags.externalDocs.description] A short description of the target documentation. GFM syntax can be used for rich text representation.
 * @param {string} options.tags.externalDocs.url Required. The URL for the target documentation. Value MUST be in the format of a URL.
 * @param {object} [options.externalDocs] Additional external documentation. See {@link http://swagger.io/specification/#externalDocumentationObject External Documentation Object}.
 * @param {string} [options.externalDocs.description] A short description of the target documentation. GFM syntax can be used for rich text representation.
 * @param {string} options.externalDocs.url Required. The URL for the target documentation. Value MUST be in the format of a URL.
 * @returns {void}
 * @throws {Error} if already initialised, should call reset first if reinitialisation required
 * @throws {Error} if no app object provided
 * @throws {Error} if no options object provided
 * @example <caption>Minimal</caption>
 * var express = require('express');
 * var swagger = require('swagger-spec-express');
 * var packageJson = require('./package.json');
 * var app = express();
 *
 * swagger.initialise(app, options);
 * @example <caption>Extensive</caption>
 * var express = require('express');
 * var swagger = require('swagger-spec-express');
 * var packageJson = require('./package.json');
 * var app = express();
 * var options = {
 *    document: {
 *        // An existing swagger json spec file that you may want to build on
 *    },
 *    title: packageJson.title,
 *    description: packageJson.description,
 *    termsOfService: 'You may only use this api for reasons!',
 *    contact: {
 *        name: '',
 *        url: '',
 *        email: ''
 *    },
 *    license: {
 *        name: '',
 *        url: ''
 *    },
 *    version: packageJson.version,
 *    host: 'localhost',
 *    basePath: '/',
 *    schemes: ['http', 'https'],
 *    consumes: ['application/json'],
 *    produces: ['application/json'],
 *    paths: {
 *        //manual paths here if desired, not required.
 *    },
 *    definitions: {
 *        //manual definitions here if desired, not required.
 *    },
 *    parameters: {
 *        //manual definitions here if desired, not required.
 *    },
 *    responses: {
 *        //manual responses here if desired, not required.
 *    },
 *    securityDefinitions: {
 *        basicAuth: {
 *            type: "basic",
 *            description: "HTTP Basic Authentication. Works over HTTPS"
 *        }
 *    },
 *    security: [{basicAuth: []}],
 *    defaultSecurity: "basicAuth",
 *    tags: [
 *        {
 *            name: 'My Manual Tag',
 *            description: 'Manually added to swagger',
 *            externalDocs: {
 *                description: 'This doc describes how to make tags',
 *                url: 'https://github.com/eXigentCoder/swagger-spec-express'
 *            }
 *        }
 *    ],
 *    externalDocs: {
 *        description: 'This doc describes how to use swagger spec express',
 *        url: 'https://github.com/eXigentCoder/swagger-spec-express'
 *    }
 *};
 * swagger.initialise(app, options);
 */
module.exports = function initialise(app, options) {
    if (!app) {
        throw new Error("app must be set when calling initialise");
    }
    if (!options) {
        throw new Error("options must be set when calling initialise");
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

/**
 * @private
 * @param {object} options The options object passed into initialise
 * @param {string} key The property name (key) for the option to merge
 * @return {void}
 */
function mergeOptions(options, key) {
    var merged = {};
    _.defaults(merged, options[key], state[key]);
    state[key] = merged;
    delete options[key];
}

/**
 * @private
 * @param {object} options The options object passed into initialise
 * @param {string} key The property name (key) for the option to set
 * @return {void}
 */
function setOption(options, key) {
    state.common[key] = options[key];
    delete options[key];
}