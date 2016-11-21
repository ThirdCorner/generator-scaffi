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
			chalk.green('Scaffi') + ' component time!'
		));

		var prompts = [];
		/*
		 Hack to get list with arrow keys working in cmd
		 */
		prompts.push({
			type: 'input',
			name: 'name',
			message: 'Name of component?',
			validate: function (input) {
				return helperFns.validateTagName(input);
			}
		});

		prompts.push({
			type: "list",
			message: "What kind of component is this?",
			name: "componentType",
			choices: [
				{
					name: "UI",
					value: "ui"
				},
				{
					name: "Server",
					value: "server"
				}
			]
		});
		
		prompts.push({
			type: 'confirm',
			name: 'splitControllers',
			message: 'Do you need separate controllers for web and mobile?',
			default: 0,
			choices: ['No', 'Yes'],
			when: function(answers){
				return answers.componentType == "ui";
			}
		});

		this.prompt(prompts, function (props) {
			this.props = props;
			this.component = props.name;
			this.componentType = props.componentType;
			this.splitControllers = props.splitControllers;

			done();
		}.bind(this));



	},

	writing: function () {

		if(this.componentType == "ui"){
			this._writeUiComponent();
		} else {
			this._writeServerComponent();
		}
	
		console.log(this.splitControllers);
	},
	_writeServerComponent: function(){
		var params = {
			className: helperFns.makeDisplayName(this.component) // DisplayTime
		};

		var routeFilePath = path.join(this.component, this.component);

		this.fs.copyTpl(
			this.templatePath(path.join("server", 'component.js')),
			this.destinationPath(path.join("src", "server", "components", routeFilePath + ".js")),
			params);
		this.fs.copyTpl(
			this.templatePath(path.join("server", 'component.json')),
			this.destinationPath(path.join("src", "server", "components", routeFilePath + ".json")),
			params);
	},
	_writeUiComponent: function(){
		var jsParams = {
			tagName: this.component, // display-time
			className: helperFns.makeDisplayName(this.component) // DisplayTime
		};

		var routeFilePath = path.join(this.component, this.component);
		
		if(this.splitControllers) {
			
			this.fs.copyTpl(
				this.templatePath(path.join("ui", 'component.abstract.js')),
				this.destinationPath(path.join("src", "ui", "app", "components", routeFilePath + ".js")),
				jsParams);
			
			this.fs.copyTpl(
				this.templatePath(path.join("ui", 'component.web.js')),
				this.destinationPath(path.join("src", "ui", "app", "components", routeFilePath + ".web.component.js")),
				jsParams);
			this.fs.copyTpl(
				this.templatePath(path.join("ui", 'component.mobile.js')),
				this.destinationPath(path.join("src", "ui", "app", "components", routeFilePath + ".mobile.component.js")),
				jsParams);
			
		} else {
			
			this.fs.copyTpl(
				this.templatePath(path.join("ui", 'component.js')),
				this.destinationPath(path.join("src", "ui", "app", "components", routeFilePath + ".component.js")),
				jsParams);
			
		}
		
		this.fs.copyTpl(
			this.templatePath(path.join("ui", 'component.html')),
			this.destinationPath(path.join("src", "ui", "app", "components", routeFilePath + ".html")),
			jsParams);
	},
	install: function(){

		if(this.componentType == "ui") {
			var done = this.async();
			// This needs to be here because copyTpl is async and includes won't find new files if run
			// in the writing phase
			var destPath = this.destinationPath(path.join("src", "ui", "app", "components"));
			helperFns.generateGenericScssInclude(destPath, "components");
			helperFns.generateGenericJsIncludes(destPath, done, "components.js", "component.js");
		}
	}
});
