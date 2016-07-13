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
				filter: function(){
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
					name: "Dev",
					value: "development"
				},
				{
					name: "QA",
					value: "qa"
				},
				{
					name: "Prod",
					value: "production"
				}
			]
		}];

		this.prompt(prompts, function (props) {
			this.props = props;

			this.modeType = props.modeType;
			
			done();
		}.bind(this));

	},
	
	writing: function () {

		helperFns.updatePrivateConfig(this.destinationPath(path.join("src", "server")), "scaffi-server.private", {environment: this.modeType});
		helperFns.updatePrivateConfig(this.destinationPath(path.join("src", "ui")), "scaffi-ui.private", {environment: this.modeType});
	},
	done: function(){

			this.log(yosay(
				'Your app has been set to run in ' + chalk.green(this.modeType) + ' mode. Go forth and do awesome things.'
			));

	}
});
