'use strict';
module.exports = function mapSwaggerDataToOperation(common, metadata) {
    var data = {
        operation: {
            tags: metadata.tags || [],
            summary: metadata.summary,
            description: metadata.description || "",
            responses: {},
            parameters: [],
            verb: metadata.verb
        },
        common: common,
        metadata: metadata,
        addedQueryParamaters: {}
    };
    //todo
    return data.operation;
};
