'use strict';
var _ = require('lodash');
var state = require('./state-manager');
var validator = require('./validator');
var schemaIds = require('./schema-ids');
module.exports = {
    addTag: addTag,
    addHeaderParameter: addHeaderParameter,
    addBodyParameter: addBodyParameter,
    addQueryParameter: addQueryParameter,
    addFormDataParameter: addFormDataParameter,
    addPathParameter: addPathParameter,
    addResponse: addResponse,
    addResponseHeader: addResponseHeader,
    addModel: addModel,
    _validate: validator.ensureValid,
    _addToCommon: addToCommon
};
/** Adds a common tag for later use.
 * @param-Schema tag ./lib/schemas/tag.json
 * @param {object} tag Allows adding meta data to a single tag that is used by the Operation Object. It is not mandatory to have a Tag Object per tag used there. (Generated)
 * @param {string} tag.name - Required. The name of the tag. (Generated)
 * @param {string} [tag.description] - A short description for the tag. GFM syntax can be used for rich text representation. (Generated)
 * @param {object} [tag.externalDocs] - information about external documentation (Generated)
 * @param {string} [tag.externalDocs.description] - A short description of the target documentation. GFM syntax can be used for rich text representation. (Generated)
 * @param {string} tag.externalDocs.url - Required. The URL for the target documentation. Value MUST be in the format of a URL. (Generated)
 * @param {AddCommonItemOptions} options - Options to apply when adding the provided item.
 * @returns {void}
 */
function addTag(tag, options) {
    addToCommon({
        schemaKey: schemaIds.tag,
        object: tag,
        targetObject: state.common.tags,
        displayName: 'Tag'
    }, options);
}
/** Adds a common header for later use.
 * @paramSchema header ./lib/schemas/header.json
 * @param {object} header todo (Generated)
 * @param {string} header.type - **Required.** The type of the parameter. Since the parameter is not located at the request body, it is limited to simple types (that is, not an object). The value MUST be one of `string`, `number`, `integer`, `boolean`, `array` or `file`. If type is `file`, the [consumes](http://swagger.io/specification/#operationConsumes) MUST be either `multipart/form-data`, `application/x-www-form-urlencoded` or both and the parameter MUST be in `formData`. (Generated)
 * @param {string} [header.format] - The extending format for the previously mentioned [type](http://swagger.io/specification/#parameterType). See [Data Type Formats](http://swagger.io/specification/#dataTypeFormat) for further details. (Generated)
 * @param {object} [header.items] - Required if [type](http://swagger.io/specification/#parameterType) is `array`. Describes the type of items in the array. (Generated)
 * @param {string} [header.collectionFormat] - Determines the format of the array if type array is used. Possible values are:

- csv comma separated values foo,bar.
- ssv space separated values foo bar.
- tsv tab separated values foo	bar.
- pipes pipe separated values foo|bar.
- multi corresponds to multiple parameter instances instead of multiple values for a single instance foo=bar&foo=baz. This is valid only for parameters in `query` or `formData`.

Default value is csv. (Generated)
 * @param {number} [header.maximum] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor17). (Generated)
 * @param {boolean} [header.exclusiveMaximum] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor17). (Generated)
 * @param {number} [header.minimum] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor21). (Generated)
 * @param {boolean} [header.exclusiveMinimum] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor21). (Generated)
 * @param {number} [header.maxLength] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor26). (Generated)
 * @param {number} [header.minLength] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor29). (Generated)
 * @param {string} [header.pattern] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor33). (Generated)
 * @param {number} [header.maxItems] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor42). (Generated)
 * @param {number} [header.minItems] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor45). (Generated)
 * @param {boolean} [header.uniqueItems] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor49). (Generated)
 * @param {Array.} [header.enum] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor76). (Generated)
 * @param {number} [header.multipleOf] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor14). (Generated)
 * @param {string} [header.description] - A short description of the header. (Generated)
 * @param {string} header.name - The name used to refer to this header at a later stage. (Generated)
 * @param {string} [header.collectionFormat] - Determines the format of the array if type array is used. Possible values are:

- csv comma separated values foo,bar.
- ssv space separated values foo bar.
- tsv tab separated values foo	bar.
- pipes pipe separated values foo|bar.
- multi corresponds to multiple parameter instances instead of multiple values for a single instance foo=bar&foo=baz. This is valid only for parameters in `query` or `formData`.

Default value is csv. (Generated)
 * @param {string} [header.collectionFormat] - Determines the format of the array if type array is used. Possible values are:

- csv comma separated values foo,bar.
- ssv space separated values foo bar.
- tsv tab separated values foo	bar.
- pipes pipe separated values foo|bar.
- multi corresponds to multiple parameter instances instead of multiple values for a single instance foo=bar&foo=baz. This is valid only for parameters in `query` or `formData`.

Default value is csv. (Generated)
 * @param {string} [header.collectionFormat] - Determines the format of the array if type array is used. Possible values are:

- csv comma separated values foo,bar.
- ssv space separated values foo bar.
- tsv tab separated values foo	bar.
- pipes pipe separated values foo|bar.
- multi corresponds to multiple parameter instances instead of multiple values for a single instance foo=bar&foo=baz. This is valid only for parameters in `query` or `formData`.

Default value is csv. (Generated)
 * @param {string} [header.collectionFormat] - Determines the format of the array if type array is used. Possible values are:

- csv comma separated values foo,bar.
- ssv space separated values foo bar.
- tsv tab separated values foo	bar.
- pipes pipe separated values foo|bar.
- multi corresponds to multiple parameter instances instead of multiple values for a single instance foo=bar&foo=baz. This is valid only for parameters in `query` or `formData`.

Default value is csv. (Generated)
 * @param {string} [header.collectionFormat] - Determines the format of the array if type array is used. Possible values are:

- csv comma separated values foo,bar.
- ssv space separated values foo bar.
- tsv tab separated values foo	bar.
- pipes pipe separated values foo|bar.
- multi corresponds to multiple parameter instances instead of multiple values for a single instance foo=bar&foo=baz. This is valid only for parameters in `query` or `formData`.

Default value is csv. (Generated)
 * @param {string} [header.collectionFormat] - Determines the format of the array if type array is used. Possible values are:

- csv comma separated values foo,bar.
- ssv space separated values foo bar.
- tsv tab separated values foo	bar.
- pipes pipe separated values foo|bar.
- multi corresponds to multiple parameter instances instead of multiple values for a single instance foo=bar&foo=baz. This is valid only for parameters in `query` or `formData`.

Default value is csv. (Generated)
 * @param {AddCommonItemOptions} options - Options to apply when adding the provided item.
 * @returns {void}
 */
function addHeaderParameter(header, options) {
    addToCommon({
        schemaKey: schemaIds.parameter.header,
        in: 'header',
        object: header,
        targetObject: state.common.parameters.header,
        displayName: 'header parameter'
    }, options);
}
/** Adds a common body parameter for later use.
 * @param-Schema body ./lib/schemas/body-parameter.json
 * @param {object} body The payload that's appended to the HTTP request. Since there can only be one payload, there can only be one body parameter. The name of the body parameter has no effect on the parameter itself and is used for documentation purposes only. Since Form parameters are also in the payload, body and form parameters cannot exist together for the same operation. (Generated)
 * @param {string} [body.description] - A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed. (Generated)
 * @param {string} [body.name] - The name of the parameter. (Generated)
 * @param {string} [body.in] - Determines the location of the parameter. (Generated)
 * @param {boolean} [body.required] - Determines whether or not this parameter is required or optional. (Generated)
 * @param {object} [body.schema] - A deterministic version of a JSON Schema object. (Generated)
 * @param {string} [body.model] - The name of the model produced or consumed. (Generated)
 * @param {string} [body.arrayOfModel] - The name of the model produced or consumed as an array. (Generated)
 * @param {AddCommonItemOptions} options - Options to apply when adding the provided item.
 * @returns {void}
 */
function addBodyParameter(body, options) {
    addToCommon({
        schemaKey: schemaIds.parameter.body,
        in: 'body',
        object: body,
        targetObject: state.common.parameters.body,
        displayName: 'body parameter'
    }, options);
}
/** Adds a common query parameter for later use.
 * @param-Schema query ./lib/schemas/query-parameter-sub-schema.json
 * @param {object} query Parameters that are appended to the URL. For example, in `/items?id=###`, the query parameter is id (Generated)
 * @param {boolean} [query.required] - Determines whether or not this parameter is required or optional. (Generated)
 * @param {string} query.in - Determines the location of the parameter. (Generated)
 * @param {string} [query.description] - A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed. (Generated)
 * @param {string} query.name - The name of the parameter. (Generated)
 * @param {boolean} [query.allowEmptyValue] - allows sending a parameter by name only or with an empty value. (Generated)
 * @param {string} query.type - **Required.** The type of the parameter. Since the parameter is not located at the request body, it is limited to simple types (that is, not an object). The value MUST be one of `string`, `number`, `integer`, `boolean`, `array` or `file`. If type is `file`, the [consumes](http://swagger.io/specification/#operationConsumes) MUST be either `multipart/form-data`, `application/x-www-form-urlencoded` or both and the parameter MUST be in `formData`. (Generated)
 * @param {string} [query.format] - The extending format for the previously mentioned [type](http://swagger.io/specification/#parameterType). See [Data Type Formats](http://swagger.io/specification/#dataTypeFormat) for further details. (Generated)
 * @param {object} [query.items] - Required if [type](http://swagger.io/specification/#parameterType) is `array`. Describes the type of items in the array. (Generated)
 * @param {string} [query.collectionFormat] - Determines the format of the array if type array is used. Possible values are:

- csv comma separated values foo,bar.
- ssv space separated values foo bar.
- tsv tab separated values foo	bar.
- pipes pipe separated values foo|bar.
- multi corresponds to multiple parameter instances instead of multiple values for a single instance foo=bar&foo=baz. This is valid only for parameters in `query` or `formData`.

Default value is csv. (Generated)
 * @param {number} [query.maximum] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor17). (Generated)
 * @param {boolean} [query.exclusiveMaximum] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor17). (Generated)
 * @param {number} [query.minimum] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor21). (Generated)
 * @param {boolean} [query.exclusiveMinimum] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor21). (Generated)
 * @param {number} [query.maxLength] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor26). (Generated)
 * @param {number} [query.minLength] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor29). (Generated)
 * @param {string} [query.pattern] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor33). (Generated)
 * @param {number} [query.maxItems] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor42). (Generated)
 * @param {number} [query.minItems] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor45). (Generated)
 * @param {boolean} [query.uniqueItems] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor49). (Generated)
 * @param {Array.} [query.enum] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor76). (Generated)
 * @param {number} [query.multipleOf] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor14). (Generated)
 * @param {string} [query.collectionFormat] - Determines the format of the array if type array is used. Possible values are:

- csv comma separated values foo,bar.
- ssv space separated values foo bar.
- tsv tab separated values foo	bar.
- pipes pipe separated values foo|bar.
- multi corresponds to multiple parameter instances instead of multiple values for a single instance foo=bar&foo=baz. This is valid only for parameters in `query` or `formData`.

Default value is csv. (Generated)
 * @param {string} [query.collectionFormat] - Determines the format of the array if type array is used. Possible values are:

- csv comma separated values foo,bar.
- ssv space separated values foo bar.
- tsv tab separated values foo	bar.
- pipes pipe separated values foo|bar.
- multi corresponds to multiple parameter instances instead of multiple values for a single instance foo=bar&foo=baz. This is valid only for parameters in `query` or `formData`.

Default value is csv. (Generated)
 * @param {string} [query.collectionFormat] - Determines the format of the array if type array is used. Possible values are:

- csv comma separated values foo,bar.
- ssv space separated values foo bar.
- tsv tab separated values foo	bar.
- pipes pipe separated values foo|bar.
- multi corresponds to multiple parameter instances instead of multiple values for a single instance foo=bar&foo=baz. This is valid only for parameters in `query` or `formData`.

Default value is csv. (Generated)
 * @param {string} [query.collectionFormat] - Determines the format of the array if type array is used. Possible values are:

- csv comma separated values foo,bar.
- ssv space separated values foo bar.
- tsv tab separated values foo	bar.
- pipes pipe separated values foo|bar.
- multi corresponds to multiple parameter instances instead of multiple values for a single instance foo=bar&foo=baz. This is valid only for parameters in `query` or `formData`.

Default value is csv. (Generated)
 * @param {AddCommonItemOptions} options - Options to apply when adding the provided item.
 * @returns {void}
 */
function addQueryParameter(query, options) {
    addToCommon({
        schemaKey: schemaIds.parameter.query,
        in: 'query',
        object: query,
        targetObject: state.common.parameters.query,
        displayName: 'query parameter'
    }, options);
}
/** Adds a common form data parameter for later use.
 * @param-Schema formData ./lib/schemas/form-data-parameter-sub-schema.json
 * @param {object} formData Used to describe the payload of an HTTP request when either application/x-www-form-urlencoded, multipart/form-data or both are used as the content type of the request (in Swagger's definition, the consumes property of an operation). This is the only parameter type that can be used to send files, thus supporting the file type. Since form parameters are sent in the payload, they cannot be declared together with a body parameter for the same operation. Form parameters have a different format based on the content-type used (for further details, consult http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4):
- application/x-www-form-urlencoded Similar to the format of Query parameters but as a payload. For example, foo=1&bar=swagger both foo and bar are form parameters. This is normally used for simple parameters that are being transferred.
- multipart/form-data each parameter takes a section in the payload with an internal header. For example, for the header Content-Disposition: form-data; name="submit-name" the name of the parameter is submit-name. This type of form parameters is more commonly used for file transfers. (Generated)
 * @param {boolean} [formData.required] - Determines whether or not this parameter is required or optional. (Generated)
 * @param {string} formData.in - Determines the location of the parameter. (Generated)
 * @param {string} [formData.description] - A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed. (Generated)
 * @param {string} formData.name - The name of the parameter. (Generated)
 * @param {boolean} [formData.allowEmptyValue] - allows sending a parameter by name only or with an empty value. (Generated)
 * @param {string} formData.type - **Required.** The type of the parameter. Since the parameter is not located at the request body, it is limited to simple types (that is, not an object). The value MUST be one of `string`, `number`, `integer`, `boolean`, `array` or `file`. If type is `file`, the [consumes](http://swagger.io/specification/#operationConsumes) MUST be either `multipart/form-data`, `application/x-www-form-urlencoded` or both and the parameter MUST be in `formData`. (Generated)
 * @param {string} [formData.format] - The extending format for the previously mentioned [type](http://swagger.io/specification/#parameterType). See [Data Type Formats](http://swagger.io/specification/#dataTypeFormat) for further details. (Generated)
 * @param {object} [formData.items] - Required if [type](http://swagger.io/specification/#parameterType) is `array`. Describes the type of items in the array. (Generated)
 * @param {string} [formData.collectionFormat] - Determines the format of the array if type array is used. Possible values are:

- csv comma separated values foo,bar.
- ssv space separated values foo bar.
- tsv tab separated values foo	bar.
- pipes pipe separated values foo|bar.
- multi corresponds to multiple parameter instances instead of multiple values for a single instance foo=bar&foo=baz. This is valid only for parameters in `query` or `formData`.

Default value is csv. (Generated)
 * @param {number} [formData.maximum] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor17). (Generated)
 * @param {boolean} [formData.exclusiveMaximum] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor17). (Generated)
 * @param {number} [formData.minimum] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor21). (Generated)
 * @param {boolean} [formData.exclusiveMinimum] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor21). (Generated)
 * @param {number} [formData.maxLength] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor26). (Generated)
 * @param {number} [formData.minLength] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor29). (Generated)
 * @param {string} [formData.pattern] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor33). (Generated)
 * @param {number} [formData.maxItems] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor42). (Generated)
 * @param {number} [formData.minItems] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor45). (Generated)
 * @param {boolean} [formData.uniqueItems] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor49). (Generated)
 * @param {Array.} [formData.enum] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor76). (Generated)
 * @param {number} [formData.multipleOf] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor14). (Generated)
 * @param {object} formData Used to describe the payload of an HTTP request when either application/x-www-form-urlencoded, multipart/form-data or both are used as the content type of the request (in Swagger's definition, the consumes property of an operation). This is the only parameter type that can be used to send files, thus supporting the file type. Since form parameters are sent in the payload, they cannot be declared together with a body parameter for the same operation. Form parameters have a different format based on the content-type used (for further details, consult http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4):
- application/x-www-form-urlencoded Similar to the format of Query parameters but as a payload. For example, foo=1&bar=swagger both foo and bar are form parameters. This is normally used for simple parameters that are being transferred.
- multipart/form-data each parameter takes a section in the payload with an internal header. For example, for the header Content-Disposition: form-data; name="submit-name" the name of the parameter is submit-name. This type of form parameters is more commonly used for file transfers. (Generated)
 * @param {string} [formData.collectionFormat] - Determines the format of the array if type array is used. Possible values are:

- csv comma separated values foo,bar.
- ssv space separated values foo bar.
- tsv tab separated values foo	bar.
- pipes pipe separated values foo|bar.
- multi corresponds to multiple parameter instances instead of multiple values for a single instance foo=bar&foo=baz. This is valid only for parameters in `query` or `formData`.

Default value is csv. (Generated)
 * @param {object} formData Used to describe the payload of an HTTP request when either application/x-www-form-urlencoded, multipart/form-data or both are used as the content type of the request (in Swagger's definition, the consumes property of an operation). This is the only parameter type that can be used to send files, thus supporting the file type. Since form parameters are sent in the payload, they cannot be declared together with a body parameter for the same operation. Form parameters have a different format based on the content-type used (for further details, consult http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4):
- application/x-www-form-urlencoded Similar to the format of Query parameters but as a payload. For example, foo=1&bar=swagger both foo and bar are form parameters. This is normally used for simple parameters that are being transferred.
- multipart/form-data each parameter takes a section in the payload with an internal header. For example, for the header Content-Disposition: form-data; name="submit-name" the name of the parameter is submit-name. This type of form parameters is more commonly used for file transfers. (Generated)
 * @param {string} [formData.collectionFormat] - Determines the format of the array if type array is used. Possible values are:

- csv comma separated values foo,bar.
- ssv space separated values foo bar.
- tsv tab separated values foo	bar.
- pipes pipe separated values foo|bar.
- multi corresponds to multiple parameter instances instead of multiple values for a single instance foo=bar&foo=baz. This is valid only for parameters in `query` or `formData`.

Default value is csv. (Generated)
 * @param {object} formData Used to describe the payload of an HTTP request when either application/x-www-form-urlencoded, multipart/form-data or both are used as the content type of the request (in Swagger's definition, the consumes property of an operation). This is the only parameter type that can be used to send files, thus supporting the file type. Since form parameters are sent in the payload, they cannot be declared together with a body parameter for the same operation. Form parameters have a different format based on the content-type used (for further details, consult http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4):
- application/x-www-form-urlencoded Similar to the format of Query parameters but as a payload. For example, foo=1&bar=swagger both foo and bar are form parameters. This is normally used for simple parameters that are being transferred.
- multipart/form-data each parameter takes a section in the payload with an internal header. For example, for the header Content-Disposition: form-data; name="submit-name" the name of the parameter is submit-name. This type of form parameters is more commonly used for file transfers. (Generated)
 * @param {string} [formData.collectionFormat] - Determines the format of the array if type array is used. Possible values are:

- csv comma separated values foo,bar.
- ssv space separated values foo bar.
- tsv tab separated values foo	bar.
- pipes pipe separated values foo|bar.
- multi corresponds to multiple parameter instances instead of multiple values for a single instance foo=bar&foo=baz. This is valid only for parameters in `query` or `formData`.

Default value is csv. (Generated)
 * @param {object} formData Used to describe the payload of an HTTP request when either application/x-www-form-urlencoded, multipart/form-data or both are used as the content type of the request (in Swagger's definition, the consumes property of an operation). This is the only parameter type that can be used to send files, thus supporting the file type. Since form parameters are sent in the payload, they cannot be declared together with a body parameter for the same operation. Form parameters have a different format based on the content-type used (for further details, consult http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4):
- application/x-www-form-urlencoded Similar to the format of Query parameters but as a payload. For example, foo=1&bar=swagger both foo and bar are form parameters. This is normally used for simple parameters that are being transferred.
- multipart/form-data each parameter takes a section in the payload with an internal header. For example, for the header Content-Disposition: form-data; name="submit-name" the name of the parameter is submit-name. This type of form parameters is more commonly used for file transfers. (Generated)
 * @param {string} [formData.collectionFormat] - Determines the format of the array if type array is used. Possible values are:

- csv comma separated values foo,bar.
- ssv space separated values foo bar.
- tsv tab separated values foo	bar.
- pipes pipe separated values foo|bar.
- multi corresponds to multiple parameter instances instead of multiple values for a single instance foo=bar&foo=baz. This is valid only for parameters in `query` or `formData`.

Default value is csv. (Generated)
 * @param {AddCommonItemOptions} options - Options to apply when adding the provided item.
 * @returns {void}
 */
function addFormDataParameter(formData, options) {
    addToCommon({
        schemaKey: schemaIds.parameter.formData,
        in: 'formData',
        object: formData,
        targetObject: state.common.parameters.formData,
        displayName: 'formData parameter'
    }, options);
}
/** Adds a common path parameter for later use.
 * @param-Schema path ./lib/schemas/path-parameter-sub-schema.json
 * @param {object} path Used together with [Path Templating](http://swagger.io/specification/#pathTemplating), where the parameter value is actually part of the operation's URL. This does not include the host or base path of the API. For example, in `/items/{itemId}`, the path parameter is itemId. (Generated)
 * @param {boolean} path.required - Determines whether or not this parameter is required or optional. (Generated)
 * @param {string} path.in - Determines the location of the parameter. (Generated)
 * @param {string} [path.description] - A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed. (Generated)
 * @param {string} path.name - The name of the parameter. (Generated)
 * @param {string} path.type - **Required.** The type of the parameter. Since the parameter is not located at the request body, it is limited to simple types (that is, not an object). The value MUST be one of `string`, `number`, `integer`, `boolean`, `array` or `file`. If type is `file`, the [consumes](http://swagger.io/specification/#operationConsumes) MUST be either `multipart/form-data`, `application/x-www-form-urlencoded` or both and the parameter MUST be in `formData`. (Generated)
 * @param {string} [path.format] - The extending format for the previously mentioned [type](http://swagger.io/specification/#parameterType). See [Data Type Formats](http://swagger.io/specification/#dataTypeFormat) for further details. (Generated)
 * @param {object} [path.items] - Required if [type](http://swagger.io/specification/#parameterType) is `array`. Describes the type of items in the array. (Generated)
 * @param {string} [path.collectionFormat] - Determines the format of the array if type array is used. Possible values are:

- csv comma separated values foo,bar.
- ssv space separated values foo bar.
- tsv tab separated values foo	bar.
- pipes pipe separated values foo|bar.
- multi corresponds to multiple parameter instances instead of multiple values for a single instance foo=bar&foo=baz. This is valid only for parameters in `query` or `formData`.

Default value is csv. (Generated)
 * @param {number} [path.maximum] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor17). (Generated)
 * @param {boolean} [path.exclusiveMaximum] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor17). (Generated)
 * @param {number} [path.minimum] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor21). (Generated)
 * @param {boolean} [path.exclusiveMinimum] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor21). (Generated)
 * @param {number} [path.maxLength] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor26). (Generated)
 * @param {number} [path.minLength] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor29). (Generated)
 * @param {string} [path.pattern] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor33). (Generated)
 * @param {number} [path.maxItems] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor42). (Generated)
 * @param {number} [path.minItems] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor45). (Generated)
 * @param {boolean} [path.uniqueItems] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor49). (Generated)
 * @param {Array.} [path.enum] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor76). (Generated)
 * @param {number} [path.multipleOf] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor14). (Generated)
 * @param {string} [path.collectionFormat] - Determines the format of the array if type array is used. Possible values are:

- csv comma separated values foo,bar.
- ssv space separated values foo bar.
- tsv tab separated values foo	bar.
- pipes pipe separated values foo|bar.
- multi corresponds to multiple parameter instances instead of multiple values for a single instance foo=bar&foo=baz. This is valid only for parameters in `query` or `formData`.

Default value is csv. (Generated)
 * @param {string} [path.collectionFormat] - Determines the format of the array if type array is used. Possible values are:

- csv comma separated values foo,bar.
- ssv space separated values foo bar.
- tsv tab separated values foo	bar.
- pipes pipe separated values foo|bar.
- multi corresponds to multiple parameter instances instead of multiple values for a single instance foo=bar&foo=baz. This is valid only for parameters in `query` or `formData`.

Default value is csv. (Generated)
 * @param {string} [path.collectionFormat] - Determines the format of the array if type array is used. Possible values are:

- csv comma separated values foo,bar.
- ssv space separated values foo bar.
- tsv tab separated values foo	bar.
- pipes pipe separated values foo|bar.
- multi corresponds to multiple parameter instances instead of multiple values for a single instance foo=bar&foo=baz. This is valid only for parameters in `query` or `formData`.

Default value is csv. (Generated)
 * @param {string} [path.collectionFormat] - Determines the format of the array if type array is used. Possible values are:

- csv comma separated values foo,bar.
- ssv space separated values foo bar.
- tsv tab separated values foo	bar.
- pipes pipe separated values foo|bar.
- multi corresponds to multiple parameter instances instead of multiple values for a single instance foo=bar&foo=baz. This is valid only for parameters in `query` or `formData`.

Default value is csv. (Generated)
 * @param {AddCommonItemOptions} options - Options to apply when adding the provided item.
 * @returns {void}
 */
function addPathParameter(path, options) {
    addToCommon({
        schemaKey: schemaIds.parameter.path,
        in: 'path',
        object: path,
        targetObject: state.common.parameters.path,
        displayName: 'path parameter'
    }, options);
}
/** Adds a common response for later use.
 * @param-Schema response ./lib/schemas/response.json
 * @param {object} response Describes a single response from an API Operation. (Generated)
 * @param {string} response.description - **Required.** A short description of the response. [GFM syntax](https://help.github.com/articles/github-flavored-markdown) can be used for rich text representation. (Generated)
 * @param {object} [response.schema] - A definition of the response structure. It can be a primitive, an array or an object. If this field does not exist, it means no content is returned as part of the response. As an extension to the [Schema Object](http://swagger.io/specification/#schemaObject), its root type value may also be `file`. This SHOULD be accompanied by a relevant produces mime-type. (Generated)
 * @param {object} [response.headers] - A list of headers that are sent with the response. See [http://swagger.io/specification/#headersObject](http://swagger.io/specification/#headersObject) (Generated)
 * @param {object} [response.examples] - An example of the response message. See [http://swagger.io/specification/#exampleObject](http://swagger.io/specification/#exampleObject) (Generated)
 * @param {string} response.name - The name or http status code used to refer to this response at a later stage. (Generated)
 * @param {string} [response.model] - The name of the model produced or consumed. (Generated)
 * @param {string} [response.arrayOfModel] - The name of the model produced or consumed as an array. (Generated)
 * @param {AddCommonItemOptions} options - Options to apply when adding the provided item.
 * @returns {void}
 */
function addResponse(response, options) {
    addToCommon({
        schemaKey: schemaIds.response,
        object: response,
        targetObject: state.common.responses,
        displayName: 'response'
    }, options);
}
/** Adds a common response header for later use.
 * @param-Schema responseHeader ./lib/schemas/header.json
 * @param {object} responseHeader todo (Generated)
 * @param {string} responseHeader.type - **Required.** The type of the parameter. Since the parameter is not located at the request body, it is limited to simple types (that is, not an object). The value MUST be one of `string`, `number`, `integer`, `boolean`, `array` or `file`. If type is `file`, the [consumes](http://swagger.io/specification/#operationConsumes) MUST be either `multipart/form-data`, `application/x-www-form-urlencoded` or both and the parameter MUST be in `formData`. (Generated)
 * @param {string} [responseHeader.format] - The extending format for the previously mentioned [type](http://swagger.io/specification/#parameterType). See [Data Type Formats](http://swagger.io/specification/#dataTypeFormat) for further details. (Generated)
 * @param {object} [responseHeader.items] - Required if [type](http://swagger.io/specification/#parameterType) is `array`. Describes the type of items in the array. (Generated)
 * @param {string} [responseHeader.collectionFormat] - Determines the format of the array if type array is used. Possible values are:

- csv comma separated values foo,bar.
- ssv space separated values foo bar.
- tsv tab separated values foo	bar.
- pipes pipe separated values foo|bar.
- multi corresponds to multiple parameter instances instead of multiple values for a single instance foo=bar&foo=baz. This is valid only for parameters in `query` or `formData`.

Default value is csv. (Generated)
 * @param {number} [responseHeader.maximum] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor17). (Generated)
 * @param {boolean} [responseHeader.exclusiveMaximum] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor17). (Generated)
 * @param {number} [responseHeader.minimum] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor21). (Generated)
 * @param {boolean} [responseHeader.exclusiveMinimum] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor21). (Generated)
 * @param {number} [responseHeader.maxLength] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor26). (Generated)
 * @param {number} [responseHeader.minLength] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor29). (Generated)
 * @param {string} [responseHeader.pattern] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor33). (Generated)
 * @param {number} [responseHeader.maxItems] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor42). (Generated)
 * @param {number} [responseHeader.minItems] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor45). (Generated)
 * @param {boolean} [responseHeader.uniqueItems] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor49). (Generated)
 * @param {Array.} [responseHeader.enum] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor76). (Generated)
 * @param {number} [responseHeader.multipleOf] - See [json-schema.org](http://json-schema.org/latest/json-schema-validation.html#anchor14). (Generated)
 * @param {string} [responseHeader.description] - A short description of the header. (Generated)
 * @param {string} responseHeader.name - The name used to refer to this header at a later stage. (Generated)
 * @param {string} [responseHeader.collectionFormat] - Determines the format of the array if type array is used. Possible values are:

- csv comma separated values foo,bar.
- ssv space separated values foo bar.
- tsv tab separated values foo	bar.
- pipes pipe separated values foo|bar.
- multi corresponds to multiple parameter instances instead of multiple values for a single instance foo=bar&foo=baz. This is valid only for parameters in `query` or `formData`.

Default value is csv. (Generated)
 * @param {string} [responseHeader.collectionFormat] - Determines the format of the array if type array is used. Possible values are:

- csv comma separated values foo,bar.
- ssv space separated values foo bar.
- tsv tab separated values foo	bar.
- pipes pipe separated values foo|bar.
- multi corresponds to multiple parameter instances instead of multiple values for a single instance foo=bar&foo=baz. This is valid only for parameters in `query` or `formData`.

Default value is csv. (Generated)
 * @param {string} [responseHeader.collectionFormat] - Determines the format of the array if type array is used. Possible values are:

- csv comma separated values foo,bar.
- ssv space separated values foo bar.
- tsv tab separated values foo	bar.
- pipes pipe separated values foo|bar.
- multi corresponds to multiple parameter instances instead of multiple values for a single instance foo=bar&foo=baz. This is valid only for parameters in `query` or `formData`.

Default value is csv. (Generated)
 * @param {string} [responseHeader.collectionFormat] - Determines the format of the array if type array is used. Possible values are:

- csv comma separated values foo,bar.
- ssv space separated values foo bar.
- tsv tab separated values foo	bar.
- pipes pipe separated values foo|bar.
- multi corresponds to multiple parameter instances instead of multiple values for a single instance foo=bar&foo=baz. This is valid only for parameters in `query` or `formData`.

Default value is csv. (Generated)
 * @param {AddCommonItemOptions} options - Options to apply when adding the provided item.
 * @returns {void}
 */
function addResponseHeader(responseHeader, options) {
    addToCommon({
        schemaKey: schemaIds.header,
        object: responseHeader,
        targetObject: state.common.responseHeaders,
        displayName: 'header response',
        deleteNameFromCommon: true
    }, options);
}
/** Adds a common model for later use.
 * @param {object} model The model object to add.
 * @param {AddCommonItemOptions} inputOptions - Options to apply when adding the provided item.
 * @returns {void}
 */
function addModel(model, inputOptions) {
    var options = {
        schemaKey: schemaIds.schema,
        object: model,
        targetObject: state.common.models,
        displayName: 'Model',
        deleteNameFromCommon: true
    };
    applyDefaults(options, inputOptions);
    ensureObjectExists(options);
    cloneObject(options);
    delete options.object.$schema;
    delete options.object.id;
    var definitions = options.object.definitions;
    delete options.object.definitions;
    applyValidation(options);
    ensureHasName(options);
    ensureNotAlreadyAdded(options);
    setObjectOnTarget(options);
    applyNameDeletion(options);
    if (!definitions) {
        return;
    }
    Object.keys(definitions).forEach(function (key) {
        var definition = _.cloneDeep(definitions[key]);
        definition.name = key;
        addModel(definition, inputOptions);
    });
}
function addToCommon(options, inputOptions) {
    applyDefaults(options, inputOptions);
    ensureObjectExists(options);
    cloneObject(options);
    if (!_.isNil(options.in)) {
        options.object.in = options.in;
    }
    applyValidation(options);
    ensureHasName(options);
    ensureNotAlreadyAdded(options);
    setObjectOnTarget(options);
    applyNameDeletion(options);
}
/**
 * Applies the defaults or input options to the options class
 * @param {object} options - The provided options.
 * @param {AddCommonItemOptions} inputOptions - The provided input options.
 * @returns {void}
 * @private
 */
function applyDefaults(options, inputOptions) {
    if (!options) {
        throw new Error('Options is required');
    }
    var defaults = {
        validation: 'throw',
        //warn, ignore,
        deleteNameFromCommon: false
    };
    inputOptions = inputOptions || {};
    var keys = Object.keys(defaults);
    inputOptions = _.pick(inputOptions, keys);
    _.defaults(options, inputOptions, defaults);
}
function ensureObjectExists(options) {
    if (!options.displayName) {
        throw new Error('displayName is required.');
    }
    if (!options.object) {
        throw new Error(options.displayName + ' is required.');
    }
    if (!_.isObject(options.object)) {
        throw new Error(options.displayName + ' must be an object');
    }
}
function cloneObject(options) {
    options.object = _.cloneDeep(options.object);
}
function applyValidation(options) {
    if (options.validation === 'ignore') {
        return;
    }
    if (options.validation === 'throw') {
        return validator.ensureValid(options.schemaKey, options.object);
    }
    var result = validator.validate(options.schemaKey, options.object);
    if (result.valid) {
        return;
    }
    console.warn(result.message, result.error);
}
function ensureHasName(options) {
    if (!options.object.name) {
        throw new Error('Name is required');
    }
    if (!_.isString(options.object.name)) {
        throw new Error('Name must be a string');
    }
}
function ensureNotAlreadyAdded(options) {
    var existingObject = options.targetObject[options.object.name];
    if (existingObject) {
        existingObject.name = options.object.name;
        if (!_.isEqual(existingObject, options.object)) {
            throw new Error('There already is a ' + options.displayName.toLowerCase() + ' with the name ' + options.object.name + ' and the objects themselves were not equal. Existing ' + JSON.stringify(existingObject) + ' Object to add :' + JSON.stringify(options.object));
        }
    }
}
function setObjectOnTarget(options) {
    options.targetObject[options.object.name] = options.object;
}
function applyNameDeletion(options) {
    if (options.deleteNameFromCommon) {
        delete options.targetObject[options.object.name].name;
    }
}    /**
      * @name AddCommonItemOptions
      * @prop {string} validation - Controls how validation works, can either be warn (Sends message to console.warn), throw (Throws an Error) or ignore.
      * @prop deleteNameFromCommon - Controls if, after adding the item to common, if it should remove the name in order to pass the Swagger schema validation.
      */