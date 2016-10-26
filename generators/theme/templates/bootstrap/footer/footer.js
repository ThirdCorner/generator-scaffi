'use strict';

import {View, Component} from 'scaffi-ui-core'; // jshint unused: false
import template from './footer.html';

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
