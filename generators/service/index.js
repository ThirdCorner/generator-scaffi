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
			chalk.green('Scaffi') + ' service time!'
		));


		var prompts = [{
				type: 'input',
				name: 'serviceName',
				message: 'What\'s the name of your service? (user-profile)',
				validate: function (input) {
					return helperFns.validateService(input);
				}
			},
			{
				type: 'input',
				name: 'restRoute',
				message: 'What\'s the name of your REST route? (users)',
				validate: function (input) {
					return helperFns.validateService(input);
				}
			}

		];

		this.prompt(prompts, function (props) {
			this.props = props;

			this.serviceName = props.serviceName;
			this.restRoute = props.restRoute;
			this.fullClassName = helperFns.makeDisplayName(this.serviceName) + "Service";

			done();
		}.bind(this));

	},

	writing: function () {

		var className = helperFns.makeDisplayName(this.serviceName);
		this.className = className + "Service";
		var folderName = this.serviceName + "/";

		// Generate Fixtures
		this.fs.copyTpl(
			this.templatePath('service.fixtures.js'),
			this.destinationPath("ui/src/app/services/" + folderName + this.serviceName + ".fixtures.js"),
			{});

		// Generate Service

		var serviceParams = {
			className: className, // UserProfile
			restRoute: this.restRoute, // user-profiles
			serviceName: this.serviceName // user-profile
		};

		this.fs.copyTpl(
			this.templatePath('service.service.js'),
			this.destinationPath("ui/src/app/services/" + folderName + this.serviceName + ".service.js"),
			serviceParams);

		this.fs.copyTpl(
			this.templatePath('service.model.js'),
			this.destinationPath("ui/src/app/services/" + folderName + this.serviceName + ".model.js"),
			serviceParams);

		// Generate Mock Service
		var mockParams = {
			className: className, // UserProfile
			serviceFileName: this.serviceName // user-profile
		};

		this.fs.copyTpl(
			this.templatePath('service.mock.js'),
			this.destinationPath("ui/src/app/services/" + folderName + this.serviceName + ".mock.js"),
			mockParams);


	},
	install: function(){
		// This needs to be here because copyTpl is async and includes won't find new files if run
		// in the writing phase
		var done = this.async();
		var done2 = this.async();
		var destPath = this.destinationPath('ui/src/app/services/');
		helperFns.generateGenericJsIncludes(destPath, done, 'services.js', 'service.js');
		helperFns.generateGenericJsIncludes(destPath, done2, 'mock-services.js', 'mock.js');
	},
	done: function(){
		this.log(yosay(
			'Your service has been created. To use in your controller, add "' + this.fullClassName + '" as an inject.'
		));
	}
});
