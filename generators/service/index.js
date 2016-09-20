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
			chalk.green('Scaffi') + ' service time!'
		));


		var prompts = [{
			type: 'input',
			name: 'serviceName',
			message: 'What\'s the name of your service? (user-profile)',
			validate: function (input) {
				return helperFns.validateService(input);
			}
		},{
			type: "list",
			message: "What kind of service is this?",
			name: "serviceType",
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
		}];
		this._constructUiOptions(prompts);

		this.prompt(prompts, function (props) {
			this.props = props;

			this.serviceName = props.serviceName;
			this.serviceType = props.serviceType;
			this.restRoute = props.restRoute;
			if(!_.endsWith(this.serviceName, "-service")) {
				this.serviceName = this.serviceName + "-service";
			}
			this.fullClassName = helperFns.makeDisplayName(this.serviceName);

			done();
		}.bind(this));

	},
	_constructUiOptions(prompts){

		prompts.push({
			type: 'input',
				name: 'restRoute',
			message: 'What\'s the name of your REST route? (users)',
			validate: function (input) {
				return helperFns.validateService(input);
			},
			when: function(answers){
				return answers.serviceType == "ui";
			}
		});
		
		
	},

	writing: function () {

		var className = helperFns.makeDisplayName(this.serviceName);
		this.className = className;
		var folderName = this.serviceName;

		
		if(this.serviceType == "ui") {
			// Generate Fixtures
			this.fs.copyTpl(
				this.templatePath(path.join("ui", "service.fixtures.js")),
				this.destinationPath(path.join("src", "ui", "app", "services", folderName, this.serviceName + ".fixtures.js")),
				{});
			
			// Generate Service
			
			var serviceParams = {
				className: className, // UserProfile
				restRoute: this.restRoute, // user-profiles
				serviceName: this.serviceName // user-profile
			};

			var serviceFilename = this.serviceName.substr(0, this.serviceName.indexOf("-service"))
			this.fs.copyTpl(
				this.templatePath(path.join("ui", "service.service.js")),
				this.destinationPath(path.join("src", "ui", "app", "services", folderName, serviceFilename + ".service.js")),
				serviceParams);
			
			// Generate Mock Service
			var mockParams = {
				className: className, // UserProfile
				serviceFileName: this.serviceName // user-profile
			};
			
			this.fs.copyTpl(
				this.templatePath(path.join("ui", "service.mock.js")),
				this.destinationPath(path.join("src", "ui", "app", "services", folderName, this.serviceName + ".mock.js")),
				mockParams);
			
		} else {
			var serviceParams = {
				className: className, // UserProfile
				serviceName: this.serviceName // user-profile
			};

			this.fs.copyTpl(
				this.templatePath(path.join("server", "service.service.js")),
				this.destinationPath(path.join("src", "server", "services", folderName, this.serviceName + ".js")),
				serviceParams);

			this.fs.copyTpl(
				this.templatePath(path.join("server", "service.json")),
				this.destinationPath(path.join("src", "server", "services", folderName, this.serviceName + ".json")),
				serviceParams);

		}
	},
	install: function(){
		// This needs to be here because copyTpl is async and includes won't find new files if run
		// in the writing phase
		if(this.serviceType == "ui") {
			var done = this.async();
			var done2 = this.async();
			var destPath = this.destinationPath(path.join("src", "ui", "app", "services"));
			helperFns.generateGenericJsIncludes(destPath, done, 'services.js', 'service.js');
			helperFns.generateGenericJsIncludes(destPath, done2, 'mock-services.js', 'mock.js');
		}
	},
	end: function(){
		if(this.serviceType == "ui") {
			this.log(yosay(
				'Your service has been created. To use in your controller, add "' + this.fullClassName + '" as an inject.'
			));
		} else {
			this.log(yosay(
				'Your service has been created. To use, add an import with "' + this.fullClassName + '" as an inject.'
			));
		}
	}
});
