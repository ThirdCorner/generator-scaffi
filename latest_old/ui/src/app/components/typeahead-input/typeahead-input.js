'use strict';

import {RouteConfig, Component, View, Inject} from 'app/ng-decorators'; // jshint unused: false
import _ from 'lodash';

/*
    !!! If you do something like this with the view, make it a directive instead.
     scope: false,
     transclude: true,
     bindToController: true,
     replace: true
*/

//start-non-standard
@Component({
    selector: 'typeahead-input',
})
@View({
    template: template,
    scope: {
        name: "@",
        modelKey: "@",
        ngModel: "=",
        options: "=",
        displayKey: "@",
        valueKey: "@",
        showInactives: "="

    }
})
//end-non-standard


class TypeaheadInput {
    constructor($scope, $document, $timeout, $anchorScroll){
        this.parentModel = $scope.ngModel;
        this.valueKey = $scope.valueKey;
        this.options = $scope.options;
        this.displayOptions = [];
        this.displayKey = $scope.displayKey;
        this.name = $scope.name;
        this.modelKey = $scope.modelKey;
        this.currentItem = 0;
        this.$scope = $scope;
        this.showInactives = $scope.showInactives || false;
        this.$anchorScroll = $anchorScroll;
        this.$body = $document[0].body;
        this.$anchorScroll.yOffset = 50;


        if(this.parentModel && this.parentModel[this.modelKey]) {
            this.defaultValue = this.parentModel[this.modelKey];
        }
        if(!_.isObject(this.parentModel)) {
            throw new Error("typeahead-input ng-model must be an object!");
        }
        if(!this.name) {
            throw new Error("You must specify a name when using the typeahead-input component");
        }
        var that = this;
        var callHide = function($event){
            that.$scope.$digest();
            that.setDisplayValue();

        };

        this.$body = angular.element(document).find('body')[0];

        this.map = [];

        $document.on("click", callHide);
        $scope.$on('$destroy', function(){
            $document.off('click', callHide);
        });


        /*
            Set default value if any. Have to do a timeout because if you pass
            an array that has to be filled by a promise, the constructor won't pick it
            up.
         */
        $timeout(()=>{
            that.updateOptions();
            that.setDisplayValue(true);

        }, 500);


        /*
            Need to tweak because having to forloop filter in the index page
            so that the ref pointer isn't destroyed.
         */
        $scope.$watch(`ngModel['${this.modelKey}']`, (newValue, oldValue)=>{
            if(_.isUndefined(newValue)){
                that.setDisplayValue(true);
            }
            else if(newValue != oldValue && that.parentModel[that.modelKey] != newValue) {
                if(!newValue && !_.isNull(newValue)) {
                    newValue = null;
                }
                that.parentModel[that.modelKey] = newValue;
                that.setDisplayValue(true);
            } else {
                that.hideDropdown();
            }

            return newValue;
        });
        $scope.$watch("vm.model", function(newValue, oldValue){

            if(newValue != that.model) {
                that.updateOptions(newValue);
            }
           return newValue;
        });
        $scope.focus = ($event) => {
            that.map = [];
            that.showDropdown($event);
        };
        $scope.keydown = ($event)=>{
            that.map[$event.keyCode] = $event.type == 'keydown';
            that.triggerKeyPress($event);
        };
        $scope.keyup = ($event) => {
            that.map[$event.keyCode] = $event.type == 'keydown';

        };
        $scope.getDropdownVisible = ()=>{
            return that.dropdownVisible;

        };
    }
    hasKeyPressed(key){
        return _.has(this.map, key) && this.map[key];
    }
    triggerKeyPress($event){
        switch(true) {
            case this.hasKeyPressed(38): // up
                this.selectPreviousItem();
                this.showDropdown();
                break;
            case this.hasKeyPressed(27):  // Escape
                this.setDisplayValue();
                break;
            case this.hasKeyPressed(39): // right
                return true;
                break;
            case this.hasKeyPressed(40): // down
                this.selectNextItem();
                this.showDropdown();
                break;
            case this.hasKeyPressed(37): //left
                return true;
                break;
            case this.hasKeyPressed(9) && this.hasKeyPressed(16): //tab + shift want's to back out of box and go to previous
                this.hideDropdown();
                return true;
                break;
            case this.hasKeyPressed(9): // tab
            case this.hasKeyPressed(13): //enter
                if(!this.isShowingDropdown()) {
                    return true;
                }
                this.enterPressed($event);
                break;
            default:
                this.showDropdown();
                return true;

        }

        $event.preventDefault();
        return false;
    }

    setDisplayValue(bypassModel) {
        var modelText = this.model;
        if(bypassModel) {
            modelText = "(Filling...)";
        }
        if(modelText && this.parentModel && _.has(this.parentModel, this.modelKey)) {
            var item = _.find(this.displayOptions, (item) => {
                return item[this.valueKey] == this.parentModel[this.modelKey];
            });

            this.selectItem(null, item);
        } else {
            this.selectItem();
        }
    }
    enterPressed($event){
        var item = this.displayOptions[this.currentItem];
        this.selectItem($event, item);
        return false;
    }
    /*
        Need this because we only want to show dropdown when a focus happens
     */

    setCurrentItem(itemIndex) {
        this.currentItem = itemIndex;
    }
    selectItem($event, item){
        if(item && _.has(item, this.valueKey)) {
            this.parentModel[this.modelKey] = item[this.valueKey];
            this.model = item[this.displayKey];
        } else {
            this.model = null;
            this.parentModel[this.modelKey] = null;
        }
        this.hideDropdown();
    }
    selectPreviousItem() {
        this.currentItem = this.currentItem-1;
        if(this.currentItem < 0) {
            this.currentItem = this.displayOptions.length -1;
        }
        this.scrollItem();
    }
    selectNextItem(){

        this.currentItem = this.currentItem+1;
        if(this.currentItem >= this.displayOptions.length) {
            this.currentItem = 0;
        }
        this.scrollItem();
    }
    scrollItem() {
        angular.element(this.$body).addClass("lock-scroll");
        var name = this.name + "-" + this.currentItem;
        this.$anchorScroll(name);
        angular.element(this.$body).removeClass("lock-scroll");
    }
    isShowingDropdown(){
        return this.dropdownVisible;
    }
    hideDropdown(){
        this.dropdownVisible = false;
        return false;
    }
    showDropdown(){
        this.dropdownVisible = true;
        return false;
    }
    updateOptions(valueSearch){
        if(valueSearch) {
            if(_.isNumber(valueSearch)) {
                valueSearch = parseInt(valueSearch, 10);
            }
            valueSearch = valueSearch.toLowerCase();
        }
        if(_.isFunction(this.options)){
            this.options(valueSearch).then((options)=>{
                options = this.filterOptions(options);
                this.loadOptionMenu(options);
            });
        } else {
            var options = this.filterOptions(this.options);
            if(!valueSearch) {
                this.loadOptionMenu(options);
            } else {
                options = _.filter(options, (option) => {
                    var str = option[this.displayKey].toLowerCase();
                    return _.startsWith(str, valueSearch) === true;
                });

                this.loadOptionMenu(options);
            }
        }
    }
    filterOptions(options) {
        var that = this;
        var opts = _.filter(options, (option)=>{
            option._display = option[this.displayKey];
            if(_.has(option, "IsActive") && !option.IsActive) {
                option._display += " (Inactive)";
            }

            if(!_.has(option, "IsActive") || this.showInactives) {
               return true;
            }
            if(option.IsActive || option[that.valueKey] == this.defaultValue) {
                return true;
            }

            return false;
        });

        return opts;
    }
    loadOptionMenu(options){
        this.currentItem = 0;
        this.displayOptions = options;


    }
}

export default TypeaheadInput;


/* .GULP-IMPORTS-START */ import template from './typeahead-input.html!text'; /* .GULP-IMPORTS-END */
