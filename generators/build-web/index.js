'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var helperFns = require('../helpers/generatorFns');
var _ = require("lodash");
var path = require("path");
var fs = require("fs-extra");

module.exports = yeoman.Base.extend({
	initializing: function(){
		/*
			Delete any current private ones so we don't end up in a bad, cross-platform situation of test accidentally
			getting used for prod. Cause that'd be bad, m'kay.
		 */
		helperFns.deletePrivateConfigs(this);
	},
	prompting: function () {

		if(!this.options.mode) {
			this.log.error("Must pass argument --mode");
			throw new Error("Must pass argument --mode");
			return false;
		}

		if(this.options.mode != "localhost" && this.options.mode != "prototype" && !this.options.githubToken ){
			this.log.error("Non localhost/prototype builds must pass a --githubToken as an argument");
			throw new Error("Non localhost/prototype builds must pass a --githubToken as an argument");
			return false;
		}

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
			this.log("VERSION NOT PASSED, USING package.json version.");
			var json = helperFns.openJson(this.destinationPath("package.json"));
			if(json) {
				this.options.version = json.version;
			}
		}

		console.log("VERSION: " + this.options.version);

	},
	writing: function(){
		
		/*
			 ComposeWith needs to be separated from the rest because it's not async
		 */
		this.log("Switching Mode to: " + this.options.mode);
		this.composeWith("scaffi:mode", {options: {mode: this.options.mode}}, {local: require.resolve('../mode')});


	},
	install: function(){

		helperFns.installServerPackages(this);
		helperFns.installUiPackages(this);

		
		this.log("Building UI");
		this.spawnCommandSync('node', ['./node_modules/gulp/bin/gulp.js', 'build'], {cwd: this.destinationPath('src', 'ui')});


		this.log("Copying Server to Build Folder");

		this.fs.copy(this.destinationPath('src', 'server', "**"), this.destinationPath('build', "web", "server"));
		if(!this.fs.exists(this.destinationPath(path.join('build', "web", "server", "web.config")))) {
			this.fs.copy(this.templatePath(path.join('iis', 'web.config')), this.destinationPath(path.join('build', "web", "server", "web.config")));
		}


		
	
	},
	end: function(){
		this.log("Deleting config directory in Server");
		fs.removeSync(this.destinationPath(path.join('build', "web", "server", "config")));
	}
});
