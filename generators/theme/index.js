'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var helperFns = require('../helpers/generatorFns');
var path = require("path");
var fs = require('fs-extra');
var _ = require("lodash");

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
			},
			{
				name: "Angular Bootstrap",
				value: "bootstrap"
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
	},
	_getMaterialDependencies: function() {
		var buildDependencies = {
			"styles": [
				"bower-material/*.min.css",
				"angular-loading*/build/loading-bar.min.css",
				"font-awesome",
				"md-data-table"
			]
		};

		var uiFolder = this.destinationPath(path.join("src", "ui"));


		fs.outputJsonSync(path.join(uiFolder, "build-resources.json"), buildDependencies);



		return [
			"angular-material@1.1.0-rc4",
			"angular-material-data-table@0.10.9",
			"angular-breadcrumb@0.4.1",
			"angular-loading-bar@0.9.0",
			"font-awesome@4.4.0"
		];

	},
	_getBootstrapDependencies: function() {
		var buildDependencies = {
			"styles": [
				"bootstrap*/css/*.min.css",
				"angular-loading*/build/loading-bar.min.css",
				"font-awesome",
				"ng-table"
			]
		};


		/*
			Add bootstrap
		 */

		var uiFolder = this.destinationPath(path.join("src", "ui"));

		fs.outputJsonSync(path.join(uiFolder, "build-resources.json"), buildDependencies);

		return [
			"angular-breadcrumb@0.4.1",
			"angular-loading-bar@0.9.0",
			"font-awesome@4.4.0",
			"bootstrap@3.3.6",
			"angular-bootstrap@2.0.0"
		];

	},
	install: function(){
		var packageDependencies = [];
		switch(this.templateChoice){
			case "material":
				packageDependencies = this._getMaterialDependencies();
				break;
			case "bootstrap":
				packageDependencies = this._getBootstrapDependencies();
				break;

		}


		for(var i in packageDependencies) {
			this.spawnCommandSync('jspm', ['install', packageDependencies[i]], {cwd: this.destinationPath('src', 'ui')});
		}

	}
});
