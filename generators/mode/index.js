'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var helperFns = require('../helpers/generatorFns');
var _ = require("lodash");
var path = require("path");

module.exports = yeoman.Base.extend({
	prompting: function () {
		var done = this.async();

		if(this.options.mode) {
			var mode = this.options.mode.toLowerCase();
			if(["production", "qa", "development", "localhost", "prototype", "ci"].indexOf(mode) === -1){
				this.log.error("Mode provided is not valid: " + mode + ". Looking for " + '["production", "qa", "development", "localhost", "prototype", "ci"]');
				return false;
			}

			this.modeType = mode;
			done();
		} else {

			// Have Yeoman greet the user.
			this.log(yosay(
				chalk.green('Scaffi') + ' mode time!'
			));

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
							name: "Prototype",
							value: "prototype"
						},
						{
							name: "Localhost",
							value: "localhost"
						},
						{
							name: "Development",
							value: "development"
						},
						{
							name: "QA",
							value: "qa"
						},
						{
							name: "Production",
							value: "production"
						}
					]
				}];

			this.prompt(prompts, function (props) {
				this.props = props;

				this.modeType = props.modeType;

				done();
			}.bind(this));
		}

	},
	
	writing: function () {

		/*
			Making sure localhost configs exist, otherwise we can assume this is a fresh checkout
		 */
		helperFns.installLocalhostConfig(this);
		/*
			Delete the private configs so we can replace
		 */
		helperFns.deletePrivateConfigs(this);
		
		var serverJsonName = "scaffi-server." + this.modeType + ".private.json";
		var uiJsonName = "scaffi-ui." + this.modeType + ".private.json";

		this.fs.copy(this.destinationPath(path.join("src", "server", "config", serverJsonName)),this.destinationPath(path.join("src", "server", "scaffi-server.private.json")));
		this.fs.copy(this.destinationPath(path.join("src", "ui", "config", uiJsonName)),this.destinationPath(path.join("src", "ui", "scaffi-ui.private.json")));

	},
	done: function(){

		if(!this.options.mode) {
			this.log(yosay(
				'Your app has been set to run in ' + chalk.green(this.modeType) + ' mode. Go forth and do awesome things.'
			));
		}

	}
});
