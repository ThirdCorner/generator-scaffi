'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var helperFns = require('../helpers/generatorFns');
var _ = require("lodash");
var path = require("path");

module.exports = yeoman.Base.extend({
	constructor: function(){
		yeoman.Base.apply(this, arguments);

		this.version = this.config.get("structureVersion") || 0;

		console.log(typeof this.version, this.version)

	},
	writing: function(){
		if(this.version >= this._getUpgrades().length) {
			this.log("No upgrade needed. You're on structure version #" + this.version);
		} else {
			this._processUpgrade();
		}
		this.config.save();
	},
	_processUpgrade: function(){
		var failure = false, currentVersion = this.version;
		for(var i = currentVersion; i < this._getUpgrades().length && failure === false; i++) {

			this.log("Upgrading to version # " + (currentVersion+1));
			var upgrade = this._getUpgrades()[currentVersion];
			failure = !upgrade();

			if(failure === false) {
				currentVersion = currentVersion + 1;
			}
		}

		this.config.set("structureVersion", currentVersion);

	},
	_getUpgrades: function(){
		var that = this;
		return [
			// UP to 0.0.3 / structureVersion # 1
			function(){

				var success = true;
				try {
					/*
						UI installs
					 Update jspm / system builder / scaffi-ui-core update
					 */
					that.spawnCommandSync('npm', ['install', 'jspm@0.16.35'], {cwd: that.destinationPath('src', 'ui')});
					that.spawnCommandSync('npm', ['install', 'systemjs-builder@0.15.15'], {cwd: that.destinationPath('src', 'ui')});
					helperFns.runJspmCommand(that, ['uninstall', "ThirdCorner/scaffi-ui-core"]);
					helperFns.runJspmCommand(that, ['install', 'npm:scaffi-ui-core']);

					/*
						Server installs
					 */
					that.spawnCommandSync('npm', ['install', 'nodemon@1.9.1'], {cwd: that.destinationPath('src', 'server')});
					that.spawnCommandSync('npm', ['install', 'scaffi-server-core@0.0.2'], {cwd: that.destinationPath('src', 'server')});
					/*
						 Remove postinstall
						 Add ui dependancies
						 Remove start trigger
						 Remove github reference for scaffi-ui-core
					 */
					helperFns.updateJson(that.destinationPath(path.join("src", "ui", "package.json")), function (json) {
						if (json.scripts.postmerge) {
							delete json.scripts.postmerge;
						}
						if(json.scripts.start){
							delete json.scripts.start;
						}
						json.devDependencies["jspm"] = "0.16.35";
						json.devDependencies["systemjs-builder"] = "0.15.15";
						

					});
					/*
						Add Server Dependancies
						Remove start trigger
					 */
					helperFns.updateJson(that.destinationPath(path.join("src", "server", "package.json")), function (json) {
						json.devDependencies["nodemon"] = "^1.9.1";
						if(json.scripts.start){
							delete json.scripts.start;
						}
						json.dependencies["scaffi-server-core"] = "~0.0.2";
					});
					/*
					 Add project-level package.json
					 */
					
					that.fs.copyTpl(that.templatePath(path.join("0", "package.json")), that.destinationPath("package.json"), {
						projectName: that.config.get("projectDetails").projectName,
						projectDescription: "",
						projectAuthor: that.config.get("projectDetails").authorName
					});

					/*
						Add ignores to project base level
					 */
					that.fs.copy(that.templatePath(path.join("0", "_gitignore")), that.destinationPath("_gitignore"));
					that.fs.move(that.destinationPath("_gitignore"), that.destinationPath(".gitignore"));

					/*
						Add device specific build dirs
					 */
					that.fs.copy(that.templatePath(path.join("0", "README.md")), that.destinationPath("build", "web", "README.md"));
					that.fs.copy(that.templatePath(path.join("0", "README.md")), that.destinationPath("build", "ios", "README.md"));
					that.fs.copy(that.templatePath(path.join("0", "README.md")), that.destinationPath("build", "android", "README.md"));
					



				}catch(e){
					success = false;
					throw e;
				}


				return success;
			}
		]
	}
});
