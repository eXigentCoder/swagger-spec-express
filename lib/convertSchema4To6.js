'use strict';

module.exports = function convertSchema4To6(schema){
    if(!schema.$id && schema.id){
        schema.$id = schema.id;
        delete schema.id;
    }
    delete schema.$schema;
    return schema;
};