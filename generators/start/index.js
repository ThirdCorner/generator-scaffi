/**
 * Created by Joseph on 9/7/2016.
 */
'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var helperFns = require('../helpers/generatorFns');
var buildHelpers = require('../helpers/builds');
var _ = require("lodash");
var path = require("path");
var fs = require("fs");
var watch = require("node-watch");
var nodemon = require("nodemon");
var modRewrite  = require('connect-modrewrite');

var bs = require("browser-sync").create();

module.exports = yeoman.Base.extend({
	constructor: function(){
		yeoman.Base.apply(this, arguments);

		// This makes `appname` a required argument.
		this.argument('mode', { type: String, required: false });
	},
	prompting: function () {
		var done = this.async();


			// Have Yeoman greet the user.
			this.log(yosay(
				chalk.green('Scaffi') + ' startup time!'
			));

		if(this.mode && ["web", "ios", "android"].indexOf(this.mode.toLowerCase()) !== -1) {
			this.modeType = this.mode;
			done();

		} else {
			var prompts = [
				{
					type: 'confirm',
					name: 'nonesense',
					message: 'You ready for it? \n(This is here till the list bug with inquirer is fixed)',
					default: 1,
					choices: ['Yes', 'Definitely'],
					filter: function () {
						return true;
					}
				},
				{
					type: "list",
					message: "What mode would you like the app to run in?",
					name: "modeType",
					choices: [
						{
							name: "Web",
							value: "web"
						},
						{
							name: "ios",
							value: "ios"
						},
						{
							name: "android",
							value: "android"
						}
					]
				}];

			this.prompt(prompts, function (props) {
				this.props = props;

				this.modeType = props.modeType;

				done();
			}.bind(this));

		}
	},

	configuring: function() {
		var done = this.async();
		
		try {
			/*
				We want these steps:
				 check for out of sync packages with package.json
				    hash that check
				 check if platform build hash matches
				    rebuild vendor resources for platform if not
				 bundle app resources
				 write index.html
			 */
			
			buildHelpers.buildUi(this, this.modeType)
				.then(function(){
					done();
				});

		} catch(e){
			console.log(e);
			throw e;
		}
	},

	end: function(){
		var that = this;

		watch(this.destinationPath("src", "ui", "app"), {recursive: true}, function(filename){
			switch(true){
				case _.endsWith(filename, ".js") || _.endsWith(filename, ".html"):
					buildHelpers.bundleAppJS(that, that.modeType).then(function(){
						buildHelpers.bundleIndex(that, that.modeType)
					});
					break;
				case _.endsWith(filename, ".scss"):
					buildHelpers.bundleAppSass(that, that.modeType);
					break;
			}
		});
		/*
			Neoed to add ability to watch package.json and build-resources so it will auto bundle vendors
		 */

		// watch(this.destinationPath("src", "ui"), {recursive: false}, function(filename){
		// 	switch(true){
		// 		case _.endsWith(filename, "build-resources.json") || _.endsWith(filename, "package.json"):
		// 			buildHelpers.buildUi(that, that.modeType);
		// 			break;
		// 	}
		// });

		/*
			This needs to be switched to the server, that way the paths seem to work then without starting
			a bunch of watchers.
		 */
		process.chdir(this.destinationPath("src", "server"));

		nodemon({
			ignore: ["public"],
			script: "index.js"
		});


		if(this.modeType == "web") {
			bs.init({
				port: 4000,
				reloadDelay: 1000, // So that index has time to regen before reloading
				files: [
					"index.html",
					"public/**/*.css",
					"public/**/*.js"
				],
				open: true,
				server: {
					baseDir: buildHelpers.getPlatformOutputDir(this, this.modeType),
					middleware: [
						modRewrite(['^([^.]+)$ /index.html [L]'])
					]
				},
				browser: "chrome"
			});

		} else {
			bs.init({
				reloadDelay: 1000, // So that index has time to regen before reloading
				files: [
					buildHelpers.getPlatformOutputDir(this, this.modeType) + "/index.html",
					buildHelpers.getPlatformOutputDir(this, this.modeType) + "/**/*"
				],
				open: true,
				server: {
					baseDir: buildHelpers.getPlatformOutputDir(this, this.modeType),
					middleware: [
						modRewrite(['^([^.]+)$ /index.html [L]'])
					]
				},
				browser: "chrome"
			});
		}

	}
});
