'use strict';

module.exports = function convertSchema4To6(schema){
    schema.$id = schema.id;
    delete schema.$schema;
    delete schema.id;
    return schema;
};