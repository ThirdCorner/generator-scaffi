/**
 * !!! DO NOT MAKE ANY CHANGES TO THIS FILE!!!
 * The env conditions are injected automatically each time you run `npm start`. (see gulp/tasks/server.js file)
 */
'use strict';

/* inject:env */
export var mock = true;
export var optimize = false;
export var environment = 'prototype';
/* endinject */

console.log('mock: ' + mock);
console.log('optimize: ' + optimize);
console.log('environment: ' + environment);
