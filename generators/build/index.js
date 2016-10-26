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

		throw new Error("Need config.domain to be able to build things");
		
		/*
			This is here as of 0.0.5 to make sure project has configs that it can use for build.
			Might need to take this out later. 
		 */
		if(helperFns.needsUpgrade(this)) {
			this.log.error("You need to run yo scaffi:upgrade before you can build");
			throw new Error("You need to run 'yo scaffi:upgrade' on the project before you can build.");
			return false;
		}

		if(!this.options.version) {
			this.log("VERSION NOT PASSED, USING ui/package.json VERSION.");
			var json = helperFns.openJson(this.destinationPath("package.json"));
			if(json) {
				this.options.version = json.version;
			}
		}

		console.log("BUILDING VERSION: " + this.options.version);

	},
	configuring: function(){

		var done = this.async();

		this.log("Switching Mode to: " + this.mode);
		this.composeWith("scaffi:mode", {options: {mode: this.mode}}, {local: require.resolve('../mode')});

		helperFns.updateConfig(this.destinationPath("src", "ui"), "scaffi-ui", {version: this.options.version});
		helperFns.updateConfig(this.destinationPath("src", "server"), "scaffi-server", {version: this.options.version});

		buildHelpers.changeUiDomain(this, this.platformType)
			.then(function(){
				done();
			});
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
			console.log(e);
			throw e;
		}

	},
	install: function(){

		this.log("Copying Server to Build Folder");

		if(this.platformType == "web") {
			fs.copy(this.destinationPath('src', 'server', "**"), this.destinationPath('builds', this.platformType, "server"));
			if (!fs.existsSync(this.destinationPath('build', this.platformType, "server", "web.config"))) {
				fs.copy(this.templatePath('iis', 'web.config'), this.destinationPath('builds', "web", "server", "web.config"));
			}
		} else {
			fs.copy(this.destinationPath('src', 'ui', "build", this.platformType, "public", "**"), this.destinationPath('builds', this.platformType));

		}
	},

	end: function(){
		if(this.platformType == "web") {
			this.log("Deleting config directory in Server");
			fs.removeSync(this.destinationPath('builds', "web", "server", "config"));
		}
	}
});
