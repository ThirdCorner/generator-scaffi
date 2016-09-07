/**
 * Created by Joseph on 9/7/2016.
 */
'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var helperFns = require('../helpers/generatorFns');
var _ = require("lodash");
var path = require("path");

module.exports = yeoman.Base.extend({
	constructor: function(){
		yeoman.Base.apply(this, arguments);

		// This makes `appname` a required argument.
		this.argument('mode', { type: String, required: false });
	},
	prompting: function () {
		var done = this.async();


			// Have Yeoman greet the user.
			this.log(yosay(
				chalk.green('Scaffi') + ' startup time!'
			));

		if(this.mode && ["ui", "server"].indexOf(this.mode.toLowerCase()) !== -1) {
			this.modeType = this.mode;
			done();

		} else {
			var prompts = [
				{
					type: 'confirm',
					name: 'nonesense',
					message: 'You ready for it? \n(This is here till the list bug with inquirer is fixed)',
					default: 1,
					choices: ['Yes', 'Definitely'],
					filter: function () {
						return true;
					}
				},
				{
					type: "list",
					message: "What mode would you like the app to run in?",
					name: "modeType",
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

			this.prompt(prompts, function (props) {
				this.props = props;

				this.modeType = props.modeType;

				done();
			}.bind(this));

		}
	},

	writing: function () {

		if(this.modeType == "ui") {
			this.spawnCommandSync('gulp', ['serve'], {cwd: this.destinationPath('src', 'ui')});

		} else {
			this.spawnCommandSync('node', ['./node_modules/nodemon/bin/nodemon.js', 'index.js'], {cwd: this.destinationPath('src', 'server')});
		}

	}

});
