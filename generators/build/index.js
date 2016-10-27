'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var helperFns = require('../helpers/generatorFns');
var _ = require("lodash");
var path = require("path");
var fs = require("fs-extra");
var buildHelpers = require("../helpers/builds");

module.exports = yeoman.Base.extend({
	initializing: function(){
		/*
			Delete any current private ones so we don't end up in a bad, cross-platform situation of test accidentally
			getting used for prod. Cause that'd be bad, m'kay.
		 */
	
		this.argument('platformType', { type: String, required: true }); // web ios android
		this.argument('mode', { type: String, required: true }); // development qa 
	},
	prompting: function () {

		try {
			/*
			 This is here as of 0.0.5 to make sure project has configs that it can use for build.
			 Might need to take this out later.
			 */
			if (helperFns.needsUpgrade(this)) {
				this.log.error("You need to run yo scaffi:upgrade before you can build");
				throw new Error("You need to run 'yo scaffi:upgrade' on the project before you can build.");
				return false;
			}

			if (!this.options.version) {
				this.log("VERSION NOT PASSED, USING ui/package.json VERSION.");
				var json = helperFns.openJson(this.destinationPath("package.json"));
				if (json) {
					this.options.version = json.version;
				}
			}

			this.log("BUILDING VERSION: " + this.options.version);
		} catch (e) {
			this.log(e);
			throw e;
		}

	},
	configuring: function(){

		var done = this.async();

		try {

			var that = this;

			buildHelpers.changeMode(this, this.mode).then(function(){
				
				helperFns.updateConfig(that.destinationPath("src", "ui"), "scaffi-ui", {version: that.options.version});
				helperFns.updateConfig(that.destinationPath("src", "server"), "scaffi-server", {version: that.options.version});
				
				buildHelpers.changeUiDomain(that, that.platformType)
					.then(function () {
						done();
					});				
			});

		} catch (e) {
			this.log(e)
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

			buildHelpers.buildUi(this, this.platformType)
				.then(function(){
					done();
				});

		} catch(e){
			this.log(e);
			throw e;
		}

	},
	install: function(){

		try {

			if (this.platformType == "web") {
				this.log("Copying Server to Build Folder");
				fs.copySync(this.destinationPath('src', 'server'), this.destinationPath('builds', this.platformType, "server"));
				if (!fs.existsSync(this.destinationPath('build', this.platformType, "server", "web.config"))) {
					fs.copySync(this.templatePath('iis', 'web.config'), this.destinationPath('builds', "web", "server", "web.config"));
				}
			} else {
				this.log("Running ionic build " + this.platformType);
				process.chdir(this.destinationPath("src", "ui", "build", this.platformType, "public"));
				this.spawnCommandSync('ionic', ['build', this.platformType], this.options);
				// fs.copySync(this.destinationPath('src', 'ui', "build", this.platformType, "public"), this.destinationPath('builds', this.platformType));

			}
		} catch (e) {
			this.log(e);
			throw e;
		}
	},

	end: function(){
		try {
			if (this.platformType == "web") {
				this.log("Deleting config directory in Server");
				fs.removeSync(this.destinationPath('builds', "web", "server", "config"));
			} else {
				this.log("Copying outputted apk to build/" + this.platformType + "/apk folder");
				this.fs.copy(this.destinationPath("src", "ui", "build", this.platformType, "public", "platforms", this.platformType, "build", "outputs", "apk"), this.destinationPath('builds', this.platformType));
			}
		} catch(e){
			this.log(e);
			throw e;
		}
	}
});
