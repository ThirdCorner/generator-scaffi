'use strict';

import listFormInstruction from './_instructions/testListToForm.instruction';

describe("E2E Test: starting-index", function() {

	new TestPage("starting/")
		.testCustom("List goes to edit page", listFormInstruction)
		.output();

});