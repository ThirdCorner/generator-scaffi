'use strict';

import template from './footer.html!text';
import {View, Component} from 'app/ng-decorators'; // jshint unused: false

//start-non-standard
@Component({
    selector: 'footer'
})
@View({
    template: template
})
//end-non-standard
class Footer {
    constructor() {
        this.copyrightDate = new Date();
    }
}
