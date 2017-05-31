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
			chalk.green('Scaffi') + ' model time!'
		));
		
		var prompts = [];
		/*
		 Hack to get list with arrow keys working in cmd
		 */
		prompts.push({
			type: 'input',
			name: 'name',
			message: 'Name of server model?',
			validate: function (input) {
				return helperFns.validateTagName(input);
			}
		});
		
		
		this.prompt(prompts, function (props) {
			this.props = props;
			this.component = props.name;
			
			done();
		}.bind(this));
		
		
		
	},
	
	writing: function () {
		
		var params = {
			className: helperFns.makeDisplayName(this.component) // DisplayTime
		};
		
		var routeFilePath = path.join(this.component, this.component);
		
		this.fs.copyTpl(
			this.templatePath(path.join("server", 'model.js')),
			this.destinationPath(path.join("src", "server", "models", routeFilePath + ".model.js")),
			params);
	},
	
	install: function(){
		
		var done = this.async();
		// This needs to be here because copyTpl is async and includes won't find new files if run
		// in the writing phase
		var destPath = this.destinationPath(path.join("src", "server", "models"));
		helperFns.generateGenericJsIncludes(destPath, done, "index.js", "model.js");

	}
});
