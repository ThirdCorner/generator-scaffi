'use strict';

import path from 'path';

const root = path.dirname(__dirname);

const paths = {
    root: root,
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
        app:            `${root}/app/`,
        basePath:       `${root}/`,
        fonts:          [`${root}/app/fonts/**/*.{eot,svg,ttf,woff,woff2}`, `${root}/jspm_packages/**/*.{eot,svg,ttf,woff,woff2}`],
        styles:         `${root}/app/**/*.scss`,
        images:          [`${root}/app/images/**/*.{png,gif,jpg,jpeg}`, `${root}/app/images/*.{png,gif,jpg,jpeg}`],
        scripts:        [`${root}/app/**/*.js`],
        html:           `${root}/app/index.html`,
        templates:      `${root}/app/**/*.html`,
        json:           `${root}/app/**/*.json`
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
        mock:           `${root}/app/**/*.mock.js`,
        unit:           `${root}/app/**/*.spec.js`,
        e2e:            `${root}/app/**/*.e2e.js`
    },
    /**
     * The 'tmp' folder is where our html templates are compiled to JavaScript during
     * the build process and then they are concatenating with all other js files and
     * copy to 'dist' folder.
     */
    tmp: {
        basePath:       `${root}/build/.tmp/`,
        styles:         `${root}/build/.tmp/styles/`,
        scripts:        `${root}/build/.tmp/scripts/`,
        css:            `${root}/build/.tmp/styles/*.css`,
        fonts:          `${root}/build/.tmp/fonts/`
    },
    /**
     * The 'build' folder is where our app resides once it's
     * completely built.
     *
     * - 'dist'         application distribution source code
     * - 'docs'         application documentation
     */
    build: {
        basePath:       `${root}/../server/public/`,
        dist: {
            basePath:   `${root}/../server/public/`,
            fonts:      `${root}/../server/public/fonts/`,
            images:     `${root}/../server/public/images/`,
            styles:     `${root}/../server/public/styles/`,
            scripts:    `${root}/../server/public/scripts/`
        },
        docs:           `${root}/../server/public/docs/`
    }
};

export default paths;
