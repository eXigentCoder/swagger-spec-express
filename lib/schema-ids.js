'use strict';
var prefix = 'https://raw.githubusercontent.com/eXigentCoder/swagger-spec-express/master/lib/schemas/';
var official = require('swagger-schema-official/schema.json');
official = official.id || official.$id;

function build(name) {
    return prefix + name + '.json';
}

module.exports = {
    prefix: prefix,
    official: official,
    parameter: {
        body: build('body-parameter'),
        formData: build('form-data-parameter-sub-schema'),
        header: build('header-parameter-sub-schema'),
        path: build('path-parameter-sub-schema'),
        query: build('query-parameter-sub-schema')
    },
    schema: build('schema'),
    response: build('response'),
    tag: build('tag'),
    header: build('header'),
    metaData: build('meta-data')
};