'use strict';

import path from 'path';
import {LOCALHOST_PORT} from '../src/app/globals';

const root = path.dirname(__dirname);
const paths = {
    root: root,
    port: LOCALHOST_PORT,
    /**
     * The 'gulpfile' file is where our run tasks are hold.
     */
    gulpfile:   [`${root}/gulpfile.js`/*, `${root}/gulp/!**!/!*.js`*/],
    /**
     * This is a collection of file patterns that refer to our app code (the
     * stuff in `src/`). These file paths are used in the configuration of
     * build tasks.
     *
     * - 'styles'       contains all project css styles
     * - 'images'       contains all project images
     * - 'fonts'        contains all project fonts
     * - 'scripts'      contains all project javascript except config-env.js and unit test files
     * - 'html'         contains main html files
     * - 'templates'    contains all project html templates
     * - 'config'       contains Angular app config files
     */
    app: {
        app:            `${root}/src/app/`,
        basePath:       `${root}/src/`,
        fonts:          [`${root}/src/fonts/**/*.{eot,svg,ttf,woff,woff2}`, `${root}/jspm_packages/**/*.{eot,svg,ttf,woff,woff2}`],
        styles:         `${root}/src/**/*.scss`,
        images:         `${root}/src/images/**/*.{png,gif,jpg,jpeg}`,
        config: {
            basePath:   `${root}/src/app/core/config/`,
            conditions: `${root}/src/app/core/config/env.conditions`
        },
        scripts:        [`${root}/src/app/**/*.js`],
        html:           `${root}/src/index.html`,
        templates:      `${root}/src/app/**/*.html`,
        json:           `${root}/src/app/**/*.json`
    },
    /**
     * This is a collection of file patterns that refer to our app unit and e2e tests code.
     *
     * 'config'       contains karma and protractor config files
     * 'testReports'  contains unit and e2e test reports
     * 'unit'         contains all project unit test code
     * 'e2e'          contains all project e2e test code
     */
    test: {
        basePath:       `${root}/test/`,
        config: {
            karma:      `${root}/karma.conf.js`,
            protractor: `${root}/protractor.conf.js`
        },
        testReports: {
            basePath:   `${root}/test-reports/`,
            coverage:   `${root}/test-reports/coverage/`
        },
        platoReports:   `${root}/test/plato`,
        mock:           `${root}/src/app/**/*.mock.js`,
        unit:           `${root}/src/app/**/*.spec.js`,
        e2e:            `${root}/src/app/**/*.e2e.js`
    },
    /**
     * The 'tmp' folder is where our html templates are compiled to JavaScript during
     * the build process and then they are concatenating with all other js files and
     * copy to 'dist' folder.
     */
    tmp: {
        basePath:       `${root}/.tmp/`,
        styles:         `${root}/.tmp/styles/`,
        scripts:        `${root}/.tmp/scripts/`
    },
    /**
     * The 'build' folder is where our app resides once it's
     * completely built.
     *
     * - 'dist'         application distribution source code
     * - 'docs'         application documentation
     */
    build: {
        basePath:       `${root}/build/`,
        dist: {
            basePath:   `${root}/build/`,
            fonts:      `${root}/build/fonts/`,
            images:     `${root}/build/`,
            styles:     `${root}/build/`,
            scripts:    `${root}/build/`
        },
        docs:           `${root}/build/docs/`
    }
};

export default paths;
