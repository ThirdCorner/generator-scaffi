'use strict';

import {RouteConfig, Component, View, Inject} from 'app/ng-decorators'; // jshint unused: false
import _ from 'lodash';
import {ID_PROP} from 'app/globals';
/*
    !!! If you do something like this with the view, make it a directive instead.
     scope: false,
     transclude: true,
     bindToController: true,
     replace: true
*/

//start-non-standard
@Component({
    selector: 'database-select',
})
@View({
    template: template,
    // If you need certain variables passed in, uncomment scope here
    scope: {
        name: "@",
        parent: "=",
        options: "="
    }
})
//end-non-standard


class DatabaseSelect {
    constructor($scope){
        this.name = $scope.name;
        this.scopeOptions = $scope.options;
        this.options = [];

        var parentIDName = this.name + ID_PROP;
        this.idName = ID_PROP;

        if($scope.parent && $scope.parent[ parentIDName]) {
            this.model = $scope.parent[ parentIDName ];

        }

        var that = this;
        $scope.$watchCollection('vm.scopeOptions', function(newValues){
            that.options = _.filter(newValues, (item) => {
                return item.IsActive || item[ID_PROP] == $scope.parent[parentIDName];
            });
        });

        $scope.$watch('vm.model', function(newValue, oldValue) {
            if(newValue != oldValue) {

                var found = _.find(that.options, (item) => {
                    return item[ID_PROP] === newValue;
                });
                if(found) {
                    $scope.parent[parentIDName] = found[ID_PROP];
                    $scope.parent[that.name] = found.Name;
                } else {
                    $scope.parent[parentIDName] = null;
                    $scope.parent[that.name] = null;
                }
            }
        })
    }


}

export default DatabaseSelect;


/* .GULP-IMPORTS-START */ import template from './database-select.html!text'; /* .GULP-IMPORTS-END */
