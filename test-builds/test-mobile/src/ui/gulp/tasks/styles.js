'use strict';

import _ from 'lodash';
import gulp from 'gulp';
import util from 'gulp-util';
import sass from 'gulp-sass';
import size from 'gulp-size';
import debug from 'gulp-debug';
import flatten from 'gulp-flatten';
import concat from 'gulp-concat';
import filter from 'gulp-filter';
import changed from 'gulp-changed';
import sourcemaps from 'gulp-sourcemaps';
import browserSync from 'browser-sync';
import autoprefixer from 'gulp-autoprefixer';
import path from '../paths';

import resources from '../../build-resources.json';

const argv = util.env;
const LOG = util.log;
const ENV = !!argv.env ? argv.env : 'DEV';
const COLORS = util.colors;

if(!ENV.match(new RegExp(/prod|dev|prototype|test|TEST|DEV|prototype|PROD/))) {
    LOG(COLORS.red(`Error: The argument 'env' has incorrect value ${ENV}! Usage: --env=(DEV|TEST|PROTOTYPE|PROD)`));
    process.exit(1);
}

/**
 * Compile SASS files into the main.css.
 *
 * @return {Stream}
 */
gulp.task('vendor-css', ()=>{
    var vendorResources = [];


    var NPM_RESOURCE_PACKAGES = resources && resources.styles ? resources.styles : [];
    if(_.isArray(NPM_RESOURCE_PACKAGES)) {
        _.each(NPM_RESOURCE_PACKAGES, function(projectName){
            /*
             Either it'll just be a project folder
             or it'll be individual file names
             */
            console.log(projectName)
            switch(true) {
                case projectName.indexOf("/") !== -1:
                    projectName = projectName.replace("/", "*/");
                    vendorResources.push(path.root + '/jspm_packages/**/'+ projectName);
                    break;

                case projectName.indexOf(".") !== -1:
                    vendorResources.push(path.root + '/jspm_packages/**/'+ projectName);
                    break;

                default:
                    vendorResources.push(path.root + '/jspm_packages/**/'+projectName+'*/**/*.min.css');
            }
        }, this);
    }

    console.log("VENDOR RESOURCE", vendorResources);
    return gulp.src(vendorResources)
        .pipe(debug({title: "css"}))
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(path.tmp.styles))
        .pipe(browserSync.stream());
});
gulp.task('sass', () => {
    // if it's set to `true` the gulp.watch will keep gulp from stopping
    // every time we mess up sass files
    const errLogToConsole = ENV === 'dev' || ENV === 'DEV'|| ENV === 'test' || ENV === 'TEST' || ENV === 'prototype'|| ENV === 'PROTOTYPE';

    return gulp.src(path.app.styles)
        .pipe(changed(path.tmp.styles, {extension: '.scss'}))
        .pipe(sourcemaps.init())
        .pipe(sass({style: 'compressed',
            errLogToConsole: errLogToConsole
        }))
        .pipe(autoprefixer('last 2 version'))
        .pipe(concat('main.css'))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest(path.tmp.styles))
        .pipe(filter('**/*.css')) // Filtering stream to only css files
        .pipe(browserSync.stream());
});

gulp.task('css', ()=>{
    return gulp.src(path.tmp.css)
        .pipe(debug({title: "css"}))
        .pipe(flatten())
        .pipe(debug({title: "css flatten"}))
        .pipe(gulp.dest(path.build.dist.styles))
        .pipe(size({title: 'css size'}))
});
