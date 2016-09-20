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
var fs = require('fs-extra');
var glob = require("glob");

const root = path.dirname(__dirname);

var spawn = require('child_process').spawn;

module.exports = yeoman.Base.extend({
	constructor: function(){
		yeoman.Base.apply(this, arguments);

		// This makes `appname` a required argument.
		// this.argument('mode', { type: String, required: false });
	},
	prompting: function () {
		var outerPath = this.destinationPath("node_modules", "protractor");
		var innerPath = path.join(root, "..", 'node_modules/protractor/');

		var runningCI = false;
		this.protractorPath = null;
		try {
			if (fs.statSync(innerPath).isDirectory()) {
				this.protractorPath = innerPath;
			}
		} catch(e){}

		try {

			if (!this.protractorPath && fs.statSync(outerPath).isDirectory()) {
				this.protractorPath = outerPath;
				runningCI = true;
			}

		} catch(e) {}


		if(!this.protractorPath) {

			this.log.error("Can't find protractor in either: " + outerPath + " nor " + innerPath);
			throw new Error("Can't find protractor in either: " + outerPath + " nor " + innerPath);
			return false;

		}





		if(runningCI) {
			var done = this.async();
			setTimeout(done, 10000);
			this.spawnCommand("node", [path.join(this.protractorPath, "bin", "webdriver-manager"), "update"]);
			this.spawnCommand("node", [path.join(this.protractorPath, "bin", "webdriver-manager"), "start"]);
		}


		// Have Yeoman greet the user.
		// this.log(yosay(
		// 	chalk.green('Scaffi') + ' test time!'
		// ));

		// this.files = [];
		// var that = this;
		// try {
		// 	var path = this.destinationPath("src", "ui", "app", "**", "*.spec.js")
		// 	glob(path, {}, function (er, files) {
		// 		that.files = files;
		// 		done();
		// 	});
		//
		// }catch(e){
		// 	console.log(e)
		// 	throw e;
		// }




		// glob(path, options, function (er, files) {
		// 	if(er) {
		// 		console.log(er.message)
		// 		throw er;
		// 	}
		// 	console.log(files);
		// 	console.log("files")
		// 	// files is an array of filenames.
		// 	// If the `nonull` option is set, and nothing
		// 	// was found, then files is ["**/*.js"]
		// 	// er is an error object or null.
		// 	done();
		// });



		// if(this.mode && ["ui", "server"].indexOf(this.mode.toLowerCase()) !== -1) {
		// 	this.modeType = this.mode;
		// 	done();
		//
		// } else {
		// 	var prompts = [
		// 		{
		// 			type: 'confirm',
		// 			name: 'nonesense',
		// 			message: 'You ready for it? \n(This is here till the list bug with inquirer is fixed)',
		// 			default: 1,
		// 			choices: ['Yes', 'Definitely'],
		// 			filter: function () {
		// 				return true;
		// 			}
		// 		},
		// 		{
		// 			type: "list",
		// 			message: "What mode would you like the app to run in?",
		// 			name: "modeType",
		// 			choices: [
		// 				{
		// 					name: "UI",
		// 					value: "ui"
		// 				},
		// 				{
		// 					name: "Server",
		// 					value: "server"
		// 				}
		// 			]
		// 		}];
		//
		// 	this.prompt(prompts, function (props) {
		// 		this.props = props;
		//
		// 		this.modeType = props.modeType;
		//
		// 		done();
		// 	}.bind(this));
		//
		// }
		
	},

	install: function(){
		//var done = this.async();
		// console.log(path.join(root, "..", 'node_modules/protractor/bin/webdriver-manager'));


		this.spawnCommandSync("node", [path.join(this.protractorPath, "bin", "protractor") , this.destinationPath('src', 'ui', "protractor.conf.js"), '--browser=phantomjs']);


		// var returnSpawn = spawn('node',  [path.join(root, "..", 'node_modules/protractor/bin/protractor'), this.destinationPath('src', 'ui', "protractor.conf.js"), '--browser=phantomjs']);
		//
		// returnSpawn.stdout.on('data', (data) => {
		// 	console.log(`stdout: ${data}`);
		// });
		//
		// returnSpawn.stderr.on('data', (data) => {
		// 	console.log(`stderr: ${data}`);
		// });
		//
		// returnSpawn.on('close', (code) => {
		// 	console.log(`child process exited with code ${code}`);
		// 	done();
		// });


		
	},
	end: function(){


	}


});
