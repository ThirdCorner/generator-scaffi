'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var helperFns = require('../helpers/generatorFns');
var _ = require("lodash");
var path = require("path");
var gulp = require('gulp');


module.exports = yeoman.Base.extend({
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


	},

	writing: function(){

		this.log("Switching Mode to: " + this.options.mode);
		this.composeWith("scaffi:mode", {options: {mode: this.options.mode}}, {local: require.resolve('../mode')});

		this.log("Installing Server Node");
		this.spawnCommandSync('npm', ['install'], {cwd: this.destinationPath('src', 'server')});
		this.log("Installing UI Node")
		this.spawnCommandSync('npm', ['install'], {cwd: this.destinationPath('src', 'ui')});

		this.log("Setting JSPM properly");
		this.spawnCommandSync('node', ['./node_modules/jspm/jspm.js', 'config', 'registries.github.timeouts.lookup', '600'], {cwd: this.destinationPath('src', 'ui')});
		if(this.options.githubToken) {
			this.spawnCommandSync('node', ['./node_modules/jspm/jspm.js', 'config', 'registries.github.auth', this.options.githubToken], {cwd: this.destinationPath('src', 'ui')});
		}

		this.log("Installing UI JSPM");
		this.spawnCommandSync('node', ['./node_modules/jspm/jspm.js', 'install'], {cwd: this.destinationPath('src', 'ui')});

		this.log("Building UI");
		this.spawnCommandSync('gulp', ['build'], {cwd: this.destinationPath('src', 'ui')});

		this.log("Copying Server to Build Folder");
		this.fs.copy(this.destinationPath('src', 'server', "**"), this.destinationPath('build', "web", "server"));
		if(!this.fs.exists(this.destinationPath('build', "web", "server", "web.config"))) {
			this.fs.copy(this.templatePath('iis', 'web.config'), this.destinationPath('build', "web", "server", "web.config"));
		}

	}
});
