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


module.exports = yeoman.Base.extend({
	/*
		Pass in --localhost if you want to run ui in a env mode, but have all server requests
		redirect to a localhost server instance.
	 */
	constructor: function(){
		yeoman.Base.apply(this, arguments);

		// This makes `appname` a required argument.
		this.argument('mode1', { type: String, required: false });
		this.argument('mode2', { type: String, required: false });
		this.argument('mode3', { type: String, required: false });
		
		this.option("skip-server");
		
	},
	initializing: function(){
		
		this.runServer = this.options["skip-server"] ? false : true;
		
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
		var platforms = ["web", "ios", "android"];

		if(this.mode1 && platforms.indexOf(this.mode1.toLowerCase()) !== -1) {
			var modes = [];
			modes.push(this.mode1.toLowerCase());

			if(this.mode2 && platforms.indexOf(this.mode2.toLowerCase()) !== -1) {
				modes.push(this.mode2.toLowerCase());
			}
			if(this.mode3 && platforms.indexOf(this.mode3.toLowerCase()) !== -1) {
				modes.push(this.mode3.toLowerCase());
			}

			modes = _.uniq(modes);


			this.modeType = modes;
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

				this.modeType = [props.modeType];

				done();
			}.bind(this));

		}
	},

	writing: function(){
		var done = this.async();

		var that = this;
		try {
			var promise = Promise.resolve();
			_.each(this.modeType, function(mode){
				promise = promise.then(function(){
					return new Promise(function(res, rej){
						that.log("========= Bundle " + mode + " ============");
						buildHelpers.changeUiDomain(that, mode, that.options.localhost).then(function(){

							/*
							 We want these steps:
							 check for out of sync packages with package.json
							 hash that check
							 check if platform build hash matches
							 rebuild vendor resources for platform if not
							 bundle app resources
							 write index.html
							 */

							buildHelpers.buildUi(that, mode)
							.then(function(){
								res();
							});
						});
					});
				});
			});

			promise.then(function(){
				done();
			})
		} catch(e){
			console.log(e);
			throw e;
		}
	},
	end: function(){

		this._launchSyncs();

	},
	_launchSyncs: function(){

		var watcher = buildHelpers.addFileWatchers(this, this.modeType);

		var that = this;
		var bsInstances = [];

		try {

			/*
			 This needs to be switched to the server, that way the paths seem to work then without starting
			 a bunch of watchers.
			 */
			process.chdir(this.destinationPath("src", "server"));

			if(this.runServer) {
				nodemon({
					ignore: ["public"],
					script: "index.js"
				});
			}

			_.each(this.modeType, function(mode){
				var bs = require("browser-sync").create(mode);
				bsInstances.push(bs);

				if (mode == "web") {


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
							baseDir: buildHelpers.getPlatformOutputDir(that, "web"),
							middleware: [
								modRewrite(['^([^.]+)$ /index.html [L]'])
							]
						},
						browser: "chrome"
					});

				}

				else {
					bs.init({
						port: 4001,
						uiPort: 4011,
						reloadDelay: 1000, // So that index has time to regen before reloading
						files: [
							buildHelpers.getPlatformOutputDir(that, mode) + "/index.html",
							buildHelpers.getPlatformOutputDir(that, mode) + "/**/*"
						],
						open: true,
						server: {
							baseDir: buildHelpers.getPlatformOutputDir(that, mode),
							middleware: [
								modRewrite(['^([^.]+)$ /index.html [L]'])
							]
						},
						browser: "chrome"
					});
				}
			});
		} catch(e){
			that.log(e);
			this._cleanupSyncs(watcher);
		}
		//
		watcher.on("error", function(err){
			console.log("WATCHER ERROR")
			console.log(err);
			that._cleanupSyncs(watcher, bsInstances);
		});
	},
	_cleanupSyncs: function(watcher, bsInstances){
		if(watcher) {
			watcher.close();
		}
		for(var i in bsInstances){
			bsInstances[i].exit();
		}

		this.log("Syncers have crashed.... Relaunching....");
		//this._launchSyncs();
	}
});
