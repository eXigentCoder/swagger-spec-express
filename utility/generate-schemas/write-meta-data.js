'use strict';
var fs = require('fs');
var schemas = require('./schemas-to-generate');
var _ = require('lodash');
var schemaIds = require('../../lib/schema-ids');

module.exports = function writeMetaDataFile(data, callback) {
    var operationSchema = require('../../lib/schemas/operation.json');
    Object.keys(operationSchema.definitions).forEach(function (definitionName) {
        if (schemas.schemaNames.indexOf(definitionName) < 0) {
            return;
        }
        var customisedSchema = _.cloneDeep(require('../../lib/schemas/' + _.kebabCase(definitionName).toLowerCase() + '.json'));
        delete customisedSchema.definitions;
        delete customisedSchema.$schema;
        delete customisedSchema.id;
        if (schemas.nameRequiredForCommon.indexOf(definitionName) >= 0) {
            delete customisedSchema.properties.name;
            if (customisedSchema.required) {
                _.remove(customisedSchema.required, function (propertyName) {
                    return propertyName === 'name';
                });
                if (customisedSchema.required.length === 0) {
                    delete customisedSchema.required;
                }
            }
        }
        operationSchema.definitions[definitionName] = customisedSchema;
    });
    var operationExtraDataSchema = require('./schemas/operation-extra-data.json');
    var schema = _.merge({}, operationSchema, operationExtraDataSchema);
    delete schema.required;
    schema.title = "Metadata";
    var fileName = 'meta-data.json';
    schema.id = schemaIds.prefix + fileName;
    fs.writeFile('./lib/schemas/' + fileName, JSON.stringify(schema, null, 4), null, function (err) {
        return callback(err, data);
    });
};