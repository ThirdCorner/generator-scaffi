'use strict';

import util from 'gulp-util';
import moment from 'moment';
import pkg from '../package.json';

//=============================================
//   !!!FEEL FREE TO EDIT THESE CONSTANTS!!!
//=============================================

export const E2E_STAGING_URL     = 'http://your-staging-url.com';
export const E2E_DEVELOPMENT_URL = 'http://127.0.0.1:4444';
export const API_URL = 'http://127.0.0.1:3000';
export const COVERAGE = {
    statements : 70,
    branches : 60,
    lines : 70,
    functions : 70
};

/**
 * The banner is the comment that is placed at the top of our compiled
 * source files. It is first processed as a Gulp template, where the `<%=`
 * pairs are evaluated based on this very configuration object.
 */
export const BANNER = util.template(
    '/**\n' +
    ' * <%= pkg.description %>\n' +
    ' * @version v<%= pkg.version %> - <%= today %>\n' +
    ' * @author <%= pkg.author.name %>\n' +
    ' * @copyright <%= year %>(c) <%= pkg.author.name %>\n' +
    ' * @license <%= pkg.license %>\n' +
    ' */\n', {file: '', pkg: pkg, today: moment(new Date()).format('D/MM/YYYY'), year: new Date().toISOString().substr(0, 4)});
