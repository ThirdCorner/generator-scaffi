/*
    This is for declaring helpers for the Testing Suite Page class, so that
    when it runs into a specific component, it knows how to find the form
    and how to set data and whatnot
 */

/*
  'component-name': (protractorElem) =>{
      //return the protractor elem that equats to the form elem
  }
 */
var ComponentFormElement = {};


/*
  Declare if your custom element needs to do special things to set its value
 */
/*
  'component-name': (protractorElem, value) => {
    iF YOU need to handle setting a form element special like
  }
 */
var ComponentFormElementSet = {};


export {ComponentFormElement, ComponentFormElementSet};
