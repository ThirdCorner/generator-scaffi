'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var helperFns = require('../helpers/generatorFns');
var _ = require("lodash");
var path = require("path");
var buildHelper = require("../helpers/builds");

module.exports = yeoman.Base.extend({
	constructor: function(){
		yeoman.Base.apply(this, arguments);
		
		// This makes `appname` a required argument.
		this.argument('mode', { type: String, required: false });
	},
	prompting: function () {

		var done = this.async();
		try {
			if (this.mode) {
				var mode = this.mode.toLowerCase();
				if (["production", "qa", "development", "localhost", "prototype", "ci"].indexOf(mode) === -1) {
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
		} catch(e) {
			this.log(e);
			throw e;
		}

	},
	
	configuring: function () {
		
		var done = this.async();
		try {
			buildHelper.changeMode(this, this.modeType).then(done);

		} catch(e){
			console.log(e);
			throw e;
		}

	},
	end: function(){

		if(!this.options.mode) {
			this.log(yosay(
				'Your app has been set to run in ' + chalk.green(this.modeType) + ' mode. Go forth and do awesome things.'
			));
		}

	}
});
