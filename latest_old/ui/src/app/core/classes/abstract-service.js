'use strict';

import moment from 'moment';
import _ from 'lodash';
import ParserHelper from '../helpers/parser-helper';
import {Inject} from 'app/ng-decorators'; // jshint unused: false

import {ID_PROP, API_BASE} from 'app/globals';

class AbstractService {
    constructor(http, route, $state, $rootScope) {
        this.http = http;
        this.route = route;
        this.$state = $state;
        this.$rootScope = $rootScope;

    }

    /*
        For making a LIST request without going in a table
     */
    fetchList(url) {
        var that = this;
        return this.http.get(API_BASE + `${url}`).then( (response)=> {
            that.sendToTestUIHarnessResponse(response);
            if(that.isSuccess(response)) {
                return response.data;
            }
            return that.$rootScope.showResourceError(response);
        }).catch((response) => {
            that.sendToTestUIHarnessResponse(response);
            return that.$rootScope.showResourceError(response);
        });
    }

    /*
        This is a GET but won't fail the whole page if it gets a 404
     */
    resource(id) {
        var that = this;
        var url =  API_BASE + `${this.route}`;
        if(id) {
            url += `/${id}`;
        }
        return this.http.get(url).then( (response)=> {
            that.sendToTestUIHarnessResponse(response);
            if(that.isSuccess(response)) {
                that.convertToApp(response.data);

                return response.data;
            }
            return that.$rootScope.showResourceError(response);
        }).catch((response) => {
            that.sendToTestUIHarnessResponse(response);
            return that.$rootScope.showResourceError(response);
        });
    }
    get(id) {
        var that = this;
        var url =  API_BASE + `${this.route}`;
        if(id) {
            url += `/${id}`;
        }
        return this.http.get(url).then( (response)=> {
            that.sendToTestUIHarnessResponse(response);
            if(that.isSuccess(response)) {
                that.convertToApp(response.data);

                return response.data;
            }
            if(response && response.status == 404) {
                this.$state.go("404")
            }
            return that.$rootScope.showServerError(response);
        }).catch((response) => {
            that.sendToTestUIHarnessResponse(response);
            return that.$rootScope.showServerError(response);
        });
    }

    getList(params) {
        var that = this;
        if(params && params.parameters) {
            var p = angular.copy(params);
            /*
                count: max display
                sorting: {param: asc/desc
                page: #
                filter
             */
            p = p.parameters();
            if(p.sorting) {

                _.each(p.sorting, (direction, name)=>{
                    p["sortProperty"] = name;
                    p["sortDirection"] = direction;
                });

            }
            if(p.filter) {
                _.each(p.filter, (value, name)=>{
                   p[name] = value;
                }, this);
            }
            ParserHelper.convertToDateStrings(p);
        }
        return this.http.get(API_BASE + `${this.route}`, {params: p}).then( (response)=> {
            that.sendToTestUIHarnessResponse(response);
            if(that.isSuccess(response)) {
                that.convertToApp(response.data);
                response.params = p;
                return response.data;

            }
            that.$rootScope.showResourceError(response);

            data = {
                inlineCount: 0,
                results: []

            };
            return data;

        }).catch((response)=>{
            that.sendToTestUIHarnessResponse(response);
            return that.$rootScope.showResourceError(response);
        });
    }

    // This will POST or PUT depending if there's an Id
    submit(resource) {
        if(_.has(resource, ID_PROP)) {
            return this.update(resource);
        } else {
            return this.create(resource);
        }

    }
    create(newResource) {

        var that = this;
        newResource = angular.copy(newResource);
        this.convertToDB(newResource);
        newResource.CreatedOn = moment().format();
        newResource.ModifiedOn = moment().format();

        return this.http.post(API_BASE + `${this.route}`, newResource).then( (response)=> {
            that.sendToTestUIHarnessResponse(response);
            if(that.isSuccess(response)) {

	            that.$rootScope.showSuccessToast(this._getCreatedToastMessage(response));
                return response.data;
            }
            return that.$rootScope.showServerError(response);
        }).catch( (response)=>{
            that.sendToTestUIHarnessResponse(response);
            return that.$rootScope.showServerError(response);
        });
    }

	_getCreatedToastMessage(response) {
		var msg = "Record successfully created!";
		if(_.isObject(response) && _.has(response, ID_PROP)) {
			msg = `Record ${response[ID_PROP]} successfully created!`;
		} else if(_.isNumber(response)) {
			msg = `Record ${response} successfully created!`;
		}

		return msg;
	}
    update(updatedResource) {
        var that = this;
        updatedResource = angular.copy(updatedResource);
        this.convertToDB(updatedResource);
        updatedResource.ModifiedOn = moment().format();

        return this.http.put(API_BASE+`${this.route}/${updatedResource[ID_PROP]}`, updatedResource).then( (response)=> {
            that.sendToTestUIHarnessResponse(response);
            if(that.isSuccess(response)) {
	            that.$rootScope.showSuccessToast(`Record #${updatedResource[ID_PROP]} successfully updated!`);
                return response.data;
            }
            return that.$rootScope.showServerError(response);
        }).catch( (response)=>{
            that.sendToTestUIHarnessResponse(response);
            return that.$rootScope.showServerError(response);
        });
    }

    delete(id) {
        var that = this;
        return this.http.delete( API_BASE+ `${this.route}/${id}`).then( (response)=> {
            that.sendToTestUIHarnessResponse(response);
            if(that.isSuccess(response)) {
	            that.$rootScope.showSuccessToast(`Record #${id} successfully deleted!`);
                return response.data;
            }
            return that.$rootScope.showServerError(response);
        }).catch( (response)=>{
            that.sendToTestUIHarnessResponse(response);
            return that.$rootScope.showServerError(response);
        });
    }
    getRoute(){
        return this.route;
    }
    sendToTestUIHarnessResponse(response){
        if(_.has(this.$rootScope, "addTestUIHarnessResponse") && _.isFunction(this.$rootScope["addTestUIHarnessResponse"])) {
            this.$rootScope["addTestUIHarnessResponse"](response);
        }
    }
    convertToDB(structure){

        if(!ParserHelper.isContainer(structure)) {
            return structure;
        }
        _.each(structure, function(value, key){
            switch(true) {
                case ParserHelper.isContainer(value):
                    this.convertToDB(value);
                    break;
                case ParserHelper.isDate(value):
                    structure[key] = moment(value).format('YYYY-MM-DD');
                    break;
                case !_.isObject(value):
                    break;
                default:
                    console.log("Couldn't convert " + Object.prototype.toString.call(value), value);
                    throw new Error("Couldn't convert " + Object.prototype.toString.call(value) + " in your api send!");

            }
        }, this);

        return structure;
    }
    convertToApp(structure){

        if(!ParserHelper.isContainer(structure)) {
            return structure;
        }
        _.each(structure, function(value, key){

            if(ParserHelper.isContainer(value)) {
               this.convertToApp(value);
            } else {

                // Try as a date
                if(ParserHelper.isDateString(value)) {
                    structure[key] = moment(value).toDate();
                }

            }
        }, this);
        return structure;
    }
    isSuccess(response) {
        return response && response.status > 199 && response.status < 300;
    }

}

export default AbstractService;
