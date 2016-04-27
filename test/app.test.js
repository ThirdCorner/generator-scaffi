'use strict';

var path = require('path');
var fs = require("fs-extra");
var exec = require('child_process').exec;

var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var helperFns = require('../generators/helpers/generatorFns');
var _ = require("lodash");
var mockery = require("mockery");

var addTestCases = {
	Both:
	{
		input: {
			mainOption: "add",
			addFeature: "both",
			projectName: "Bull County",
			authorName: "JJ",
			apiRoute: "api",
			uiLocalhostPort: "4444",
			serverLocalhostPort: "4555",
			customizeDataStructure: false
		},
		result: {
			projectName: "Bull County",
			authorName: "JJ",
			apiRoute: "/api/",
			uiLocalhostPort: "4444",
			serverLocalhostPort: "4555",
			
			//Defauls
			variedIdName: false,
			idName: "id",
			tableNameStandard: "pascalCase",
			columnNameStandard: "pascalCase",
			columnMultiWordStandard: "none",
			idCapitalizeStandard: "pascalCase",
			routeLowercaseStandard: true
		}
		
	},
	Server:
	{
		input: {
			mainOption: "add",
			addFeature: "server",
			projectName: "Mannerwell",
			authorName: "JJ",
			apiRoute: "apiserver",
			serverLocalhostPort: "4550",
			customizeDataStructure: true,
	
			variedIdName: false,
			idName: "Id",
			tableNameStandard: "camelCase",
			columnNameStandard: "pascalCase",
			columnMultiWordStandard: "underscore",
			idCapitalizeStandard: "upperCase",
			routeLowercaseStandard: false
		},
		result: {
			projectName: "Mannerwell",
			authorName: "JJ",
			apiRoute: "/apiserver/",
			serverLocalhostPort: "4550",
	
			variedIdName: false,
			idName: "Id",
			tableNameStandard: "camelCase",
			columnNameStandard: "pascalCase",
			columnMultiWordStandard: "underscore",
			idCapitalizeStandard: "upperCase",
			routeLowercaseStandard: false
		}
	
	}
};

function basePath(name) {
	var names = [__dirname, 'temp'];
	_.each(arguments, function(name){
		names.push(name);
	});
	return path.join.apply(path, names);
}

describe.only("Generator:App", function(){

	this.timeout(15000);

	// Cleanup old data
	before(function(done) {
		fs.remove('./temp', function(err) {
			if(err) throw err;
			done();
		});
	});

	_.each(addTestCases, (data, name)=>{

		describe(`Testing ${name}`, function(){

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
					helpers.run(path.join(__dirname, '../generators/app'))
						.inDir(path.join(__dirname, `./temp/${name}/`))
						.withOptions({
							'skip-install': true
						})
						.withPrompts(data.input)
						.on('error', function(error) {
							console.log(error)
						})
						.on('end', function(){
							done();
						});
				});

				// it('should equal 2', function(){
				// 	expect(2).to.equal(3);
				// });

				it("should have saved preferences to .yo-rc.json", function(){
					var testStructure = {
						'generator-scaffi': {
							'projectDetails': data.result
						}
					};
					assert.JSONFileContent(basePath(name, data.result.projectName, '.yo-rc.json'), testStructure);
				});

				/*
					Test server file generations
				 */

				if(["server", "both"].indexOf(name.toLowerCase()) !== -1) {
					it('created a folder named server', function () {
						assert.equal(path.join(path.basename(process.cwd()), "server"), path.join(data.result.projectName, "server"));
					});
					
					it('created project folders', function(){
						assert.file([
							'server/package.json',
							'server/scaffi-server.json'
						])
					});
					it('created filled in the package.json', function(){

						assert.JSONFileContent('server/package.json', {
							name: helperFns.parseNpmName(data.result.projectName),
							author: {
								name: data.result.authorName
							}
						})
					});
				}

				/*
				    Test ui file generations
				 */
				if(["ui", "both"].indexOf(name.toLowerCase()) !== -1) {
					it('created a folder named ui', function () {
						assert.equal( path.join(path.basename(process.cwd()), 'ui'), path.join(data.result.projectName, "ui"));
					});

					it('created project folders', function(){
						assert.file([
							'ui/src/index.html',
							'ui/src/app/app.js',
							'ui/scaffi-ui.json',
							'ui/gulp/paths.js',
							'ui/test/phantomjs/phantomjs.exe',
							'ui/.gitignore',
							'ui/gulpfile.js',
							'ui/jspm.conf.js',
							'ui/protractor.conf.js',
							'ui/src/app/components/components.js',
							'ui/src/app/components/components.scss',
							'ui/src/app/directives/directives.js',
							'ui/src/app/factories/factories.js',
							'ui/src/app/services/services.js',
						])
					});
					it('created filled in the package.json', function(){

						assert.JSONFileContent('ui/package.json', {
							name: helperFns.parseNpmName(data.result.projectName),
							author: {
								name: data.result.authorName
							}
						})
					});
					it('should create route files', function(){
						assert.file([
							'ui/src/app/routes/index/index.page.js',
							'ui/src/app/routes/index/index.html',
							'ui/src/app/routes/routes.js',
							'ui/src/app/routes/routes.scss'
						]);
					});
				}


			});
		});
	}, this);

});





