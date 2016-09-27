'use strict';

var path = require('path');
const root = path.dirname(__dirname);
// var ScreenShotReporter = require('protractor-html-screenshot-reporter');

exports.config = {
    seleniumArgs: ['-browserTimeout=120'],

	sauceUser: process.env.sauceUser,
	sauceKey: process.env.sauceKey,

	//seleniumAddress: 'http://127.0.0.1:4723/wd/hub',
	baseUrl: 'http://10.0.2.2:8000',

	//seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
    allScriptsTimeout: 30000,
	multiCapabilities: [
		// {
		// browserName: "phantomjs",
	 //    'phantomjs.binary.path': root + "/ui/test/phantomjs/phantomjs.exe",
    //     'phantomjs.cli.args': ['--ignore-ssl-errors=true',  '--web-security=false'],
    //     'version' : '',
    //     'platform': 'ANY'
    // }
		// ,
	// {
	// 	browserName: "chrome"
	// }
		{
		platformName: 'android',
		platformVersion: '6.0',
		deviceName: 'Generic Phone',
		browserName: "",
		autoWebview: true,
		app: root + '/ui/test/apk/android-debug.apk'
		}
	],
    keepAlive: true,
    framework: 'mocha',
    mochaOpts:{
        reporter:'spec',
        slow:5000,
        timeout: 30000,
        enableTimeouts: false,
        fullTrace: false,
        colors: true
    },
	specs: ["app/**/*.e2e.js"],
    /**
     * A callback function called once protractor is ready and available,
     * and before the specs are executed.
     *
     * You can specify a file containing code to run by setting onPrepare to
     * the filename string.
     */
    onPrepare: function() {
        // browser.driver.manage().window().setSize(1024,768);

        // Adds ES6 features to testing
	    require('babel-register')({
		    presets: [ 'es2015' ]
	    });
	
	    global.chai = require('chai');
	    var promised = require('chai-as-promised');
	    global.chai.use(promised);
	    global.expect = chai.expect;


	    var wd = require('wd'),
		    protractor = require('protractor'),
		    wdBridge = require('wd-bridge')(protractor, wd);
	    wdBridge.initFromProtractor(exports.config);

	    /**
         * At this point, global 'protractor' object will be set up, and
         * jasmine will be available.
         *
         * The require statement must be down here, since jasmine-reporters
         * needs jasmine to be in the global and protractor does not guarantee
         * this until inside the onPrepare function.
         */
        //var jasmineReporters = require('jasmine-reporters');
        //jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
        //    consolidateAll: true,
        //    filePrefix: 'xmloutput',
        //    savePath: './test-reports/e2e-test-report'
        //}));
        //
        //// Add a screenshot reporter and store screenshots to `/test/test-reports/screenshots`:
        //jasmine.getEnv().addReporter(new ScreenShotReporter({
        //    baseDirectory: './test-reports/screenshots',
        //    pathBuilder: function pathBuilder(spec, descriptions, results, capabilities) {
        //        // Return '<browser>/<specname>' as path for screenshots:
        //        // Example: 'firefox/list-should work'.
        //        return path.join(capabilities.caps_.browserName, descriptions.join('-'));
        //    },
        //    takeScreenShotsOnlyForFailedSpecs: true
        //}));
    }
    // ----- Options to be passed to minijasminenode -----
    //jasmineNodeOpts: {
    //    // If true, display spec names.
    //    isVerbose: true
    //}
};
