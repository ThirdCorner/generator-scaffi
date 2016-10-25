'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var builds = require('../helpers/builds');
var _ = require("lodash");
var path = require("path");
var buildHelpers = require("../helpers/builds");

module.exports = yeoman.Base.extend({
	constructor: function(){
		yeoman.Base.apply(this, arguments);
		this.arguments = arguments[0];
		this.options = arguments[1];
		// This makes `appname` a required argument.
	},
	configuring: function () {

		var mainCommand = this.arguments[0];

		this.buildFiles = false;
		this.processSrc = null;
		switch (mainCommand) {
			//case "build":
			case "run":
			case "emulate":
				this.buildFiles = true;
				if (["ios", "android"].indexOf(this.arguments[1]) === -1) {
					throw new Error("Unknown platform type: ", this.arguments[1]);
				}
				this.processSrc = this.destinationPath("src", "ui", "build", this.arguments[1], "public");
				break;
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



	},
	writing: function(){
		var done = this.async();

		if(this.buildFiles) {
			var platformType = this.arguments[1];
			var that = this;

			try {
				buildHelpers.buildUi(that, platformType)
					.then(function(){
						buildHelpers.addFileWatchers(that, platformType);

						// We're adding a timeout so that we can ensure index.html is compiled
						setTimeout(function(){
							done();
						}, 1000);
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
		this.spawnCommandSync('ionic', this.arguments, this.options);
	}
});
