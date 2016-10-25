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
		helperFns.deletePrivateConfigs(this);
		this.argument('platformType', { type: String, required: true });
		this.argument('mode', { type: String, required: true });
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
		this.log("Switching Mode to: " + this.mode);
		this.composeWith("scaffi:mode", {options: {mode: this.mode}}, {local: require.resolve('../mode')});

		helperFns.updateConfig(this.destinationPath("src", "ui"), "scaffi-ui", {version: this.options.version});
		helperFns.updateConfig(this.destinationPath("src", "server"), "scaffi-server", {version: this.options.version});
	},
	// writing: function(){
	//
	// 	/*
	// 		 ComposeWith needs to be separated from the rest because it's not async
	// 	 */
	//
	//
	// 	var done = this.async();
	//
	// 	/*
	// 	 Calling this will end up installing everything, including server
	// 	 */
	// 	buildHelpers.buildUi(this, this.platformType).then(function(){
	// 		done();
	// 	});
	//
	// },
	// install: function(){
	//
	// 	this.log("Copying Server to Build Folder");
	//
	// 	this.fs.copy(this.destinationPath('src', 'server', "**"), this.destinationPath('build', this.platformType, "server"));
	// 	if(this.platformType == "web" && !this.fs.exists(this.destinationPath(path.join('build', this.platformType, "server", "web.config")))) {
	// 		this.fs.copy(this.templatePath(path.join('iis', 'web.config')), this.destinationPath(path.join('build', "web", "server", "web.config")));
	// 	}
	//
	//
	//
	//
	// },
	// end: function(){
	// 	this.log("Deleting config directory in Server");
	// 	fs.removeSync(this.destinationPath(path.join('build', "web", "server", "config")));
	// }
});
