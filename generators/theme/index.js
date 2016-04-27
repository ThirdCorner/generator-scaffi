'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var helperFns = require('../helpers/generatorFns');



module.exports = yeoman.Base.extend({
	prompting: function () {
		var done = this.async();

		// Have Yeoman greet the user.
		this.log(yosay(
			chalk.green('Scaffi') + ' theme time!'
		));
		this.choices = [
			"Default",
			"Merit"
		];


		var prompts = [{
			type: 'input',
			name: 'templateChoice',
			message: 'Which theme would you like to use? (Default or Merit)',
			validate: function(input) {
				input = input.toLowerCase();
				if(input != 'default' && input != 'merit') {
					return 'Your choice must be either Default or Merit';
				}
				return true;
			}
		}

		];

		this.prompt(prompts, function (props) {
			this.props = props;

			this.templateChoice = props.templateChoice;
			if(this.templateChoice.toLowerCase() == "default") {
				this.templateChoice = "Default";
			} else {
				this.templateChoice = "Merit";
			}

			done();
		}.bind(this));


	},

	writing: function () {

		this.fs.copy(this.templatePath(this.templateChoice), this.destinationPath("ui/src/app/theme"));

	}
});
