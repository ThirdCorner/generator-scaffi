'use strict';

var path = require('path');
const root = path.dirname(__dirname);
var ScreenShotReporter = require('protractor-html-screenshot-reporter');

exports.config = {
    seleniumArgs: ['-browserTimeout=120'],
    seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
    allScriptsTimeout: 30000,
    capabilities: {
	    'phantomjs.binary.path': root + "/ui/test/phantomjs/phantomjs.exe",
        'phantomjs.cli.args': ['--ignore-ssl-errors=true',  '--web-security=false'],
        'version' : '',
        'platform': 'ANY'
    },
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
    plugins: [{
        path: './node_modules/protractor/plugins/console/index.js',
        failOnWarning: true,
        failOnError: true
    }],

    /**
     * A callback function called once protractor is ready and available,
     * and before the specs are executed.
     *
     * You can specify a file containing code to run by setting onPrepare to
     * the filename string.
     */
    onPrepare: function() {
        browser.driver.manage().window().setSize(1024,768);

        // Adds ES6 features to testing
	    require('babel-register')({
		    presets: [ 'es2015' ]
	    });

	    protractor.globals = require('./src/app/globals');
	    global.TestPage = require('./src/app/core/tests/route/test-page');
	    global.chai = require('chai');
	    var promised = require('chai-as-promised');
	    global.chai.use(promised);
	    global.expect = chai.expect;
	    global.Page = require("./src/app/core/tests/common/page");
	    global.Instruction = require("./src/app/core/tests/common/instruction-block");

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
