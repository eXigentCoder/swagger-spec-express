'use strict';
require('../init');
var _validateAgainstSchema = require('../../lib/common')._validateAgainstSchema;
describe('Common', function () {
    describe('_validateAgainstSchema', function () {
        it('Should pass if validOptions are supplied', function () {
            expect(validate(validOptions())).to.not.throw();
        });
        it('Should pass if transformFunction is null', function () {
            var options = validOptions();
            delete options.transformFunction;
            expect(validate(options)).to.not.throw();
        });
        it('Should pass if deleteNameWhenDone is null', function () {
            var options = validOptions();
            delete options.deleteNameWhenDone;
            expect(validate(options)).to.not.throw();
        });
        it('Should pass if name is null but object is not', function () {
            var options = validOptions();
            delete options.name;
            expect(validate(options)).to.not.throw();
        });
        it('Should pass if object is null but name is not', function () {
            var options = validOptions();
            delete options.object;
            expect(validate(options)).to.not.throw();
        });
        it('Should fail if name and object are null', function () {
            var options = validOptions();
            delete options.name;
            delete options.object;
            expect(validate(options)).to.throw();
        });
        it('Should fail if itemType is null', function () {
            var options = validOptions();
            delete options.itemType;
            expect(validate(options)).to.throw();
        });
        it('Should fail if targetObject is null', function () {
            var options = validOptions();
            delete options.targetObject;
            expect(validate(options)).to.throw();
        });
        it('Should fail if extra properties are added', function () {
            var options = validOptions();
            options.potato = true;
            expect(validate(options)).to.throw();
        });
        it('Should fail if name is an empty string', function () {
            var options = validOptions();
            options.name = "";
            expect(validate(options)).to.throw();
        });
        it('Should pass if object is a string and name is an object', function () {
            var options = validOptions();
            options.object = "test";
            options.name = {};
            expect(validate(options)).to.not.throw();
        });
        it('Should fail if object is an empty string and name', function () {
            var options = validOptions();
            options.name = "";
            expect(validate(options)).to.throw();
        });
    });
});

function validate(options) {
    return _validateAgainstSchema.bind(_validateAgainstSchema, options);
    //return async.apply(_validateAgainstSchema, options);
}

function validOptions() {
    return {
        name: "test",
        object: {},
        targetObject: {},
        itemType: "Test Item Type",
        transformFunction: function () {
            console.log('hello world');
        },
        deleteNameWhenDone: false
    };
}