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
    selector: 'date-picker',
})
@View({
    template: template,
    scope: {
        validator: "@",
        name: "@",
        ngModel: "=",
        dateOptions: "=",
        invalidMessage: "@",
        defaulted: "@",
        maxDate: "="
    },
    //link(scope, element, attrs, modelCtrl){
    //    console.log(modelCtrl);
    //    if(!modelCtrl.$parsers) {
    //        modelCtrl.$parsers = [];
    //    }
    //    modelCtrl.$parsers.push((viewValue) => {
    //        console.log(viewValue);
    //        return viewValue;
    //    });
    //}
})
//end-non-standard


class DatePicker {
    constructor($scope){

        if(!$scope.ngModel && $scope.defaulted) {
            $scope.ngModel = new Date();
        }
        this.name = $scope.name;
        this.validator = $scope.validator;

        this.opened = false;
        this.scope = $scope;

        this.invalidMessage = $scope.invalidMessage;

        $scope.format = 'MM/dd/yyyy';


    }

    //datepickerValidator(){
    //    if(typeof this.validator !== 'undefined') {
    //        console.log(this.validator);
    //        debugger
    //        return false;
    //    }
    //
    //    return true;
    //
    //
    //}
    showInvalidMessage() {
        return this.invalidMessage;
    }



}

export default DatePicker;


/* .GULP-IMPORTS-START */ import template from './date-picker.html!text'; /* .GULP-IMPORTS-END */
