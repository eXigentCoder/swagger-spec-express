'use strict';
// @flow
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
        var newPrefix = getPathFromMiddleware(middleware);
        var subRoutes = getSwaggerDataFromRouteStack(middleware.handle.stack, pathPrefix + newPrefix);
        routes = routes.concat(subRoutes);
    });
    return routes;
};

function addPrefixToPath(pathPrefix, inputPath) {
    var result = path.join(pathPrefix, inputPath);
    result = result.replace(/\\/g, '/');
    result = result.replace(new RegExp('//', 'g'), '/');
    if (result[result.length - 1] === '/' && result.length > 1) {
        result = result.substr(0, result.length - 1);
    }
    return result;
}

var regexStringsToRemove = ["/^", "?(?=\\/|$)/i"];
var keyReplacementString = "(?:([^\\/]+?))";
function getPathFromMiddleware(middleware) {
    var result = middleware.regexp.toString();
    regexStringsToRemove.forEach(function (replacement) {
        var regEx = new RegExp(_.escapeRegExp(replacement), 'g');
        result = result.replace(regEx, '');
    });
    middleware.keys.forEach(function (key) {
        var index = result.indexOf(keyReplacementString);
        if (index >= 0) {
            result = result.replace(keyReplacementString, ':' + key.name);
        }
    });
    var regEx = new RegExp(_.escapeRegExp("\\/"), 'g');
    result = result.replace(regEx, '/');
    return result;
}
