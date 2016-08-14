'use strict';
var path = require('path');
var _ = require('lodash');

module.exports = function getSwaggerDataFromRouteStack(stack, pathPrefix) {
    pathPrefix = pathPrefix || "";
    var routes = [];
    if (!stack || stack.length === 0) {
        return routes;
    }
    var swaggerRoutes = _.filter(stack, 'route.swaggerData');
    var routerRoutes = _.filter(stack, {name: 'router'});
    swaggerRoutes.forEach(function (middleware) {
        middleware.route.swaggerData.path = addPrefixToPath(pathPrefix, middleware.route.path);
        routes.push(middleware.route.swaggerData);
    });
    routerRoutes.forEach(function (middleware) {
        var newPrefix = getPathFromRegex(middleware.regexp);
        var subRoutes = getSwaggerDataFromRouteStack(middleware.handle.stack, newPrefix);
        routes = routes.concat(subRoutes);
    });
    return routes;
};

function addPrefixToPath(pathPrefix, inputPath) {
    inputPath = path.join(pathPrefix, inputPath);
    inputPath = inputPath.replace(/\\/g, "/");
    return inputPath;
}

function getPathFromRegex(pathRegex) {
    pathRegex = pathRegex.toString();
    pathRegex = pathRegex.replace("?(?=\\/|$)/i", "");
    pathRegex = pathRegex.replace("/^\\", "");
    pathRegex = pathRegex.replace(/\\/, "");
    return pathRegex;
}
