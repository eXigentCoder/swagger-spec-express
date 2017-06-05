'use strict';
var chai = require('chai');
var dirtyChai = require('dirty-chai');
var validator = require('../lib/validator');
var addSchemas = require('../lib/add-schemas');
addSchemas(validator);

chai.use(dirtyChai);

global.chai = chai;
global.expect = chai.expect;
global.assert = chai.assert;
global.should = chai.should();