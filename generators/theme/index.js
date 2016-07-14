'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var helperFns = require('../helpers/generatorFns');
var path = require("path");



module.exports = yeoman.Base.extend({
	prompting: function () {
		var done = this.async();

		// Have Yeoman greet the user.
		this.log(yosay(
			chalk.green('Scaffi') + ' theme time!'
		));
		this.choices = [
			{
				name: "Angular Material",
				value: "material"
			}
		];


		var prompts = [{
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
			type: 'list',
			name: 'templateChoice',
			message: 'Which theme would you like to use?',
			choices: this.choices
		}

		];

		this.prompt(prompts, function (props) {
			this.props = props;

			this.templateChoice = props.templateChoice;


			done();
		}.bind(this));


	},

	writing: function () {

		this.fs.copy(this.templatePath(this.templateChoice), this.destinationPath(path.join("src", "ui", "app", "theme")));

	}
});
