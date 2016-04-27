
let LOCALHOST_API = 'http://localhost:9999/<%= backendAPISubpath %>';
var API = LOCALHOST_API;
try {
    API = window.location.hostname == 'localhost' ? LOCALHOST_API : (window.location.origin + "<%= backendAPISubpath %>" );
}catch(e){}

//API = LOCALHOST_API;


const HOMEPAGE = '/<%= homeRoute %>';
const LOCALHOST_PORT = '<%= localhostPort %>';
const ID_PROP = "ID"; // This tells the system what the name of the prop is to find the record id
const LOCALHOST = `http://localhost:${LOCALHOST_PORT}/`;
const API_BASE = API;

export {HOMEPAGE, ID_PROP, LOCALHOST, API_BASE, LOCALHOST_PORT};
