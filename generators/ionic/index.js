'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var builds = require('../helpers/builds');
var _ = require("lodash");
var path = require("path");
var buildHelpers = require("../helpers/builds");

module.exports = yeoman.Base.extend({
	/*
	 Pass in --localhost if you want to run ui in a env mode, but have all server requests
	 redirect to a localhost server instance.
	 */

	constructor: function(){
		yeoman.Base.apply(this, arguments);
		this.arguments = arguments[0];
		this.options = arguments[1];
		// This makes `appname` a required argument.
	},
	configuring: function () {

		try {

			var mainCommand = this.arguments[0];

			this.command = this.arguments[0];
			this.platformType = this.arguments[1];
			this.buildFiles = false;
			this.processSrc = null;
			switch (mainCommand) {
				case "build":
					throw new Error("Use 'yo scaffi:build ios mode' || 'yo scaffi:build android mode'");
				case "run":
				case "emulate":
					this.buildFiles = true;
					if (["ios", "android"].indexOf(this.arguments[1]) === -1) {
						throw new Error("Unknown platform type: ", this.platformType);
					}
					this.processSrc = this.destinationPath("src", "ui", "build", this.platformType, "public");
					break;
				case "plugin":
				case "platform":
				case "browser":
				case "info":
				case "resources":
					this.processSrc = this.destinationPath("src", "ui", "mobile");
					break;

				case "serve":
					throw new Error("Run 'yo scaffi:start ios' or 'yo scaffi:start android' instead");
					break;
				default:
					throw new Error("Unrecognized ionic command: " + mainCommand + ". Hasn't been implemented.");
			}



		} catch(e){
			console.log(e);
			throw e;
		}

	},
	writing: function(){
		var done = this.async();

		if(this.buildFiles) {
			var platformType = this.platformType;
			var that = this;

			try {
				buildHelpers.changeUiDomain(this, platformType, this.options.localhost)
					.then(function(){
						return buildHelpers.buildUi(that, platformType)
							.then(function(){

								// We're adding a timeout so that we can ensure index.html is compiled
								setTimeout(function(){
									done();
								}, 1000);
							});
					});


			} catch(e){
				console.log(e);
				throw e;
			}
		} else {
			done();
		}
	},

	end: function(){
		process.chdir(this.processSrc);
		
		var opts = {};
		
		if(["emulate", "run"].indexOf(this.command) !== -1) {
			//buildHelpers.addFileWatchers(this, this.platformType);
			// this.arguments.push("-l");
			this.arguments.push("-p");
			this.arguments.push("4001");
		}
		
		
		this.spawnCommandSync('ionic', this.arguments, opts);
		
		if(this.command == "build") {
			this.fs.copy(this.destinationPath("src", "ui", "build", this.platformType, "platforms", this.platformType, "build", "outputs", "apk"))
		}
	}
});
