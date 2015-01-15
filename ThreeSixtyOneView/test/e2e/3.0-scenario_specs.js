'use strict';

// globals
var scenarioUrl = '/#/scenario/:projectId/:scenarioId/edit',
	projectId = 'f5e1f16989cb316089e5399e2a85a17e',
	scenarioId = '5',

	// classes
	// scenario
	pivotBuilderTitleClass = 'pbTitle',
	pivotBuilderTitleSelectedClass = 'pbTitleSel',

	data = {
		// functions
		hasClass: function (element, cls) {
		    return element.getAttribute('class').then(function (classes) {
		        return classes.split(' ').indexOf(cls) !== -1;
		    });
		},
		getItems: function(){
			return element.all(by.repeater(items));
		},
		getItemCount: function(){
			return element(by.css(itemCount));
		},

		// settings
		testQuery: "?e2e=true",
		scenarioUrl: scenarioUrl.replace(/:projectId/, projectId).replace(/:scenarioId/, scenarioId),

		//classes
		pivotBuilderTitleSelectedClass: pivotBuilderTitleSelectedClass,
		
		// elements
		pbSlider: element(by.css('.' + pivotBuilderTitleClass))
	};

module.exports = data;