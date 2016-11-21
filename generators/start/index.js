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

var nodemon = require("nodemon");
var modRewrite  = require('connect-modrewrite');

var bs = require("browser-sync").create();

module.exports = yeoman.Base.extend({
	/*
		Pass in --localhost if you want to run ui in a env mode, but have all server requests
		redirect to a localhost server instance.
	 */
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

		if(!fs.existsSync(this.destinationPath("src", "ui", "scaffi-ui.private.json")) || !fs.existsSync(this.destinationPath("src", "server", "scaffi-server.private.json"))){
			this.log("You need to run 'yo scaffi:mode' before you can start anything.")
			throw new Error("You need to run 'yo scaffi:mode' before you can start anything.");
		}

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

			buildHelpers.changeUiDomain(this, this.modeType, this.options.localhost)
				.then(function(){
					done();
				});

		} catch(e){
			console.log(e);
			throw e;
		}
	},

	writing: function(){
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

		buildHelpers.addFileWatchers(this, this.modeType);

		/*
			This needs to be switched to the server, that way the paths seem to work then without starting
			a bunch of watchers.
		 */
		process.chdir(this.destinationPath("src", "server"));

		if(this.modeType == "web") {
			nodemon({
				ignore: ["public"],
				script: "index.js"
			});


			bs.init({
				port: 4000,
				uiPort: 4010,
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
			this.log("!!! Remember that you need to start a server if you're outside prototype mode, since you're running a mobile build !!!");
			bs.init({
				port: 4001,
				uiPort: 4011,
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
