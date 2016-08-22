'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var path = require('path');

var helperFns = require('../helpers/generatorFns');

module.exports = yeoman.Base.extend({
	
	prompting: function () {
		var done = this.async();
		
		// Have Yeoman greet the user.
		this.log(yosay(
			chalk.green('Scaffi') + ' factory time!'
		));
		
		
		var prompts = [];
		
		prompts = [{
			type: 'input',
			name: 'factoryName',
			message: 'What\'s the factory name going to be? (form-addon)',
			validate: function(input) {
				
				// need to check that this exists already
				return helperFns.validateTagName(input);
			}
		}];
		this.prompt(prompts, function (props) {
			this.props = props;
			
			this.factoryName = props.factoryName;
			
			done();
		}.bind(this));
		
		
	},
	
	writing: function () {
		
		var params = {
			factoryName: this.factoryName,
			className: helperFns.makeDisplayName(this.factoryName)
		};
		
		var folderName = path.join(this.factoryName, this.factoryName);
		
		this.fs.copyTpl(
			this.templatePath('factory.js'),
			this.destinationPath(path.join("src", "ui", "app", "factories", folderName + ".factory.js")),
			params);
		
		
	},
	install: function(){
		// This needs to be here because copyTpl is async and includes won't find new files if run
		// in the writing phase
		var done = this.async();
		var destPath = this.destinationPath(path.join("src", "ui", "app", "factories"));
		
		helperFns.generateGenericJsIncludes(destPath, done, "factories.js", 'factory.js');
	},
});
