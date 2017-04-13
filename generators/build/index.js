'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var helperFns = require('../helpers/generatorFns');
var _ = require("lodash");
var path = require("path");
var fs = require("fs-extra");
var fsNode = require("fs");
var buildHelpers = require("../helpers/builds");

var xml2js = require("xml2js");

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

			if(!this.options.name) {
				this.log("App name not passed");
				throw new Error("NAME not passed");
				return false;
			}
			if (!this.options.version) {
				this.log("VERSION NOT PASSED, USING ui/package.json VERSION.");
				var json = helperFns.openJson(this.destinationPath("package.json"));
				if (json) {
					this.options.version = json.version;
				}
			}
			if(this.platformType !== "web" && !this.options.namespace){
				this.log.error("You need to provide a namespace for your mobile build: ie com.*.*");
				throw new Error("You need to provide a namespace for your mobile build: ie com.*.*");
				return false;
			}
			
			if(this.platformType !== "web" && !this.options.name){
				this.log.error("You need to provide a name for your app");
				throw new Error("You need to provide a name for your app");
				return false;
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
		
		var done = this.async();
		
		try {

			if (this.platformType == "web") {
				this.log("Copying Server to Build Folder");
				fs.copySync(this.destinationPath('src', 'server'), this.destinationPath('builds', this.platformType, "server"));
				if (!fs.existsSync(this.destinationPath('builds', this.platformType, "server", "web.config"))) {
					fs.copySync(this.templatePath('iis', 'web.config'), this.destinationPath('builds', "web", "server", "web.config"));
				}
			} else {
				/*
					We don't want to call ionic here because the build machine might not be able to build it; ie ios
				 */
				this.log("Prepping and Building");
				//process.chdir(this.destinationPath("src", "ui", "build", this.platformType, "public"));
				
				fs.emptyDirSync(this.destinationPath('src', 'ui', "build", this.platformType, "public", "platforms", this.platformType));
				/*
					Change config properly
				 */
				this.log("Changing Config Params for build");
				var config = helperFns.openJson(this.destinationPath('src', 'ui', "build", this.platformType, "public", "ionic.config.json")) || {};
				config.name = this.options.name.replace(" ", "");
				config["app_id"] = this.options.namespace;
				helperFns.saveJson(this.destinationPath('src', 'ui', "build", this.platformType, "public", "ionic.config.json"), config);
				helperFns.saveJson(this.destinationPath('src', 'ui', "build", this.platformType, "public", "ionic.project"), config);
				
				/*
					Change config.xml
				 */
				
				var that = this;
				var xmlString =  fs.readFileSync(this.destinationPath('src', 'ui', "build", this.platformType, "public", "config.xml"));
				xml2js.parseString(xmlString, function(err, result){
					if(err) console.log(err);
					
					var json = result;
					
					
					json.widget["$"].id = that.options.namespace;
					json.widget["$"].version = that.options.version;
					
					json.widget["$"]["android-versionName"] = that.options.version + "8";
					json.widget["$"]["android-versionCode"] = that.options.version.replace(/\./g, "") + "8";
					
					json.widget.name = that.options.name;
				
					// create a new builder object and then convert
					// our json back to xml.
					var builder = new xml2js.Builder();
					var xml = builder.buildObject(json);
					
					fs.writeFile(that.destinationPath('src', 'ui', "build", that.platformType, "public", "config.xml"), xml, function(err, data){
						if (err) that.log(err);
						
						that.log("Transferring package.json from UI folder");
						
						var packageConfig = helperFns.openJson(that.destinationPath('src', 'ui', "package.json")) || {};
						packageConfig.devDependencies = {};
						packageConfig.dependencies = {};
						packageConfig.platforms = [that.platformType];
						helperFns.saveJson(that.destinationPath('src', 'ui', "build", that.platformType, "public", "package.json"), packageConfig);
						
						
						that.log("Running ionic platform commands (remove / add / resources)");
						var platformAddPackage = that.platformType;
						/*
							We're getting an error as is for some reason, so we're locking it in
						 */
						if(that.platformType == "ios") {
							platformAddPackage = that.platformType + "@4.3.1";
						}
						that.spawnCommandSync('ionic', ['platform', "remove", that.platformType], {cwd: that.destinationPath('src', 'ui', "build", that.platformType, "public")});
						
						 that.log("Adding cordova package: " + platformAddPackage);
						
						that.spawnCommandSync('ionic', ['platform', "add", platformAddPackage], {cwd: that.destinationPath('src', 'ui', "build", that.platformType, "public")});
						that.spawnCommandSync('ionic', ["resources"], {cwd: that.destinationPath('src', 'ui', "build", that.platformType, "public")});
						// if(that.platformType == "ios") {
						// 	that.log("Running cordova platform update for ios");
						// 	//that.spawnCommandSync('cordova', ['platform', "update", "ios"], {cwd: that.destinationPath('src', 'ui', "build", that.platformType, "public")});
						// }
						that.log("Running ionic build")
						that.spawnCommandSync('ionic', ['build', that.platformType], {cwd: that.destinationPath('src', 'ui', "build", that.platformType, "public")});
						
						done();
					})
					
				});

				

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
			} else if(this.platformType == "android") {
				
				var outputFilename = this.options.name + "-" + this.mode + "-" + this.options.version + ".apk";
				this.log("Copying outputted apk to builds/" + this.platformType + "/" + outputFilename);
				this.fs.copy(this.destinationPath("src", "ui", "build", this.platformType, "public", "platforms", this.platformType, "build", "outputs", "apk", "android-debug.apk"), this.destinationPath('builds', this.platformType, outputFilename));
			} else {
				// src/ui/build/ios/public/platforms/ios/build/device/{{this.options.name}}
				//Name is
			}
		} catch(e){
			this.log(e);
			throw e;
		}
	}
});
