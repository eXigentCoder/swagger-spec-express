'use strict';
var swaggerSchema = require('swagger-schema-official/schema.json');
var metaDataSchema = require('./schemas/meta-data.json');
var jsonSchema4 = require('./schemas/json-schema-4.0.json');
var convertSchema4to6 = require('./convertSchema4To6');
var added = false;
module.exports = function addSchemas(validator) {
    if(added){
        return;
    }
    added = true;
    validator.addSchema(convertSchema4to6(jsonSchema4));
    validator.addSchema(convertSchema4to6(swaggerSchema));
    validator.addSchema(metaDataSchema);
    /* eslint-disable global-require */
    validator.addSchema([
        require('./schemas/body-parameter.json'),
        require('./schemas/form-data-parameter-sub-schema.json'),
        require('./schemas/header-parameter-sub-schema.json'),
        require('./schemas/path-parameter-sub-schema.json'),
        require('./schemas/query-parameter-sub-schema.json'),
        require('./schemas/schema.json'),
        require('./schemas/response.json'),
        require('./schemas/tag.json'),
        require('./schemas/header.json')
    ]);
    /* eslint-enable global-require */
};