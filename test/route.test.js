'use strict';

var path = require('path');
var fs = require("fs-extra");
var exec = require('child_process').exec;

var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

var mockery = require("mockery");
var vars = {
	route: "dashboard"
};
/*
	Doesn't work because temp app is getting deleted after the app.test runs.
 */
describe.skip("Generator:Route", function(){

	this.timeout(15000);

	before(function () {
		mockery.enable({
			warnOnReplace: false,
			warnOnUnregistered: false
		});
	});

	after(function () {
		mockery.disable();
	});
	describe('>> Wrting', function () {
		before(function(done){
			helpers.run(path.join(__dirname, '../generators/route'))
				.inDir(path.join(__dirname, './temp/ui'))
				.withPrompts(vars)
				.on('error', function(error) {
					console.log(error)
				})
				.on('end', function(){
					done();
				});
		});

		it('should create route files', function(){
			assert.file([
				'src/app/routes/dashboard/dashboard.js',
				'src/app/routes/dashboard/index/dashboard-index.html',
				'src/app/routes/dashboard/index/dashboard-index.js',
				'src/app/routes/routes.js'
			]);
		});


	});

});





