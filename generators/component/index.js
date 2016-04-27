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
			chalk.green('Scaffi') + ' component time!'
		));

		var prompts = [];
		/*
		 Hack to get list with arrow keys working in cmd
		 */
		prompts.push({
			type: 'confirm',
			name: 'nonesense',
			message: 'You ready for it? \n(This is here till the list bug with inquirer is fixed)',
			default: 1,
			choices: ['Yes', 'Definitely'],
			filter: function(){
				return true;
			}
		});

		prompts.push({
			type: 'list',
			name: 'addOption',
			message: "What type of component"
		})


		var prompts = [{
			type: 'input',
			name: 'name',
			message: 'Name of component?',
			validate: function (input) {
				return helperFns.validateTagName(input);
			}
		}

		];

		this.prompt(prompts, function (props) {
			this.props = props;
			this.component = props.name;

			done();
		}.bind(this));



	},

	writing: function () {


		var jsParams = {
			tagName: this.component, // display-time
			className: helperFns.makeDisplayName(this.component), // DisplayTime
		};
		var htmlParams = {
			tagName: this.component // display-time
		}

		var routeFilePath = this.component + "/";

		this.fs.copyTpl(
			this.templatePath('component.js'),
			this.destinationPath("ui/src/app/components/" + routeFilePath + this.component + ".js"),
			jsParams);
		this.fs.copyTpl(
			this.templatePath('component.html'),
			this.destinationPath("ui/src/app/components/" + routeFilePath + this.component + ".html"),
			jsParams);

	},
	install: function(){
		// This needs to be here because copyTpl is async and includes won't find new files if run
		// in the writing phase
		var done = this.async();
		var destPath = this.destinationPath('ui/src/app/components/');
		helperFns.generateGenericScssInclude(destPath, "components");
		helperFns.generateGenericJsIncludes(destPath, done, "components.js");
	}
});
