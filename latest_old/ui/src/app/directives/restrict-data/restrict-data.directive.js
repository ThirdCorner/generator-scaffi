'use strict';

import {Directive} from '../../ng-decorators'; // jshint unused: false;

//start-non-standard
@Directive({
    selector: 'restrict-data'
})
//end-non-standard
class RestrictData {
    constructor(){
        this.restrict = 'A';
        this.scope = {
            restrictData: "="
        }
    }

    link(scope, element, attrs, ngModel){
        if(element[0].tagName !== 'INPUT' && element[0].tagName !== 'TEXTAREA'){
            throw new Error("You can only apply a RestrictData directive to inputs and textareas.");
            return false;
        }
        var dataType = attrs.restrictData;
        var dataTypes = {
            "money": (attrs) => {

            },
            "decimal": (attrs) => {
                            if(attrs.min && parseInt(attrs.min, 10) >= 0) {
                                return /[0-9\.]/;
                            } else {
                                return /[0-9\.-]/;
                            }
                        },
            "integar": (attrs) => {
                        if(attrs.min && parseInt(attrs.min, 10) >= 0) {
                            return /[0-9]/;
                        } else {
                            return /[0-9-]/;
                        }
                    }
        };


        if(!dataTypes[dataType]) {
            throw new Error("RestrictData type is not allowed:" + dataType);
            return false;
        }

        var that = this;

        element.bind('keypress', function(event){
            var regSeq = dataTypes[dataType](attrs);
            var regex = new RegExp(regSeq);
            var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
            if (!regex.test(key)) {
                event.preventDefault();
                return false;
            }
        });
    }

    static directiveFactory(){
        RestrictData.instance = new RestrictData();
        return RestrictData.instance;
    }
}

export default RestrictData;

