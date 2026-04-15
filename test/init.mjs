'use strict';
import * as chai from 'chai';
import dirtyChai from 'dirty-chai';
import validator from '../lib/validator.js';
import addSchemas from '../lib/add-schemas.js';

addSchemas(validator);
chai.use(dirtyChai);

globalThis.chai = chai;
globalThis.expect = chai.expect;
globalThis.assert = chai.assert;
globalThis.should = chai.should();
