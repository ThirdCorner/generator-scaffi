'use strict';

module.exports = function(action) {
	action("click goes to edit", ()=>{
		Page.actions.click(by.className("package-list-item"));
		Page.expects.pageAt("starting/:StartingServiceID/edit");
	});


};