'use strict';

import {View, Component} from 'app/ng-decorators'; // jshint unused: false

//start-non-standard
@Component({
    selector: 'alert-danger'
})
@View({
    template: `
        <div ng-if="vm.hasError" class="row">
            <div class="col-md-12 col-sm-12">
                <div class="alert alert-danger animated fadeIn">
                    <strong>Error!</strong>
                    <span>{{vm.errorMessage}}</span>
                    <span class="close" data-dismiss="alert" ng-click="vm.hasError=false">×</span>
                </div>
            </div>
        </div>
    `,
    bindToController: {
        hasError: '=',
        errorMessage: '='
    }
})
//end-non-standard
class AlertDanger {}
