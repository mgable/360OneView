'use strict';

/**
 * @ngdoc service
 * @name ThreeSixtyOneView.PivotMetaService
 * @description
 * # PivotMetaService
 * Service in the ThreeSixtyOneView.
 */
angular.module('ThreeSixtyOneView.services')
.service('PivotViewService', [function PivotViewService() {
	this.deleteItem = function(viewData, added, index, element, callbacks) {
		added[viewData[element][index].level.label] = false;
		viewData[element].splice(index, 1);

		_.each(callbacks, function(callback) {
			callback.call(null, added);
		});
	};

	this.addItem = function(viewData, added, item, element, callbacks) {
		var newItem = {dimension:{id:item.dimensionId},hierarchy:{id:-1},level:{id:item.levelId, label:item.label}};
		viewData[element].push(newItem);
		added[item.label] = true;

		_.each(callbacks, function(callback) {
			callback.call(null, added);
		});
	};

	this.replaceItem = function(viewData, added, selected, priorLabel, element, callbacks) {
		var match, newItem, index;
		added[priorLabel] = false;
		added[selected.label] = true;

		match = _.find(viewData[element], function(item) { return item.level.label === priorLabel; });
		if (match) {
			newItem = {dimension:{id:selected.dimensionId},hierarchy:{id:-1},level:{id:selected.levelId, label:selected.label}};
			index = _.indexOf(viewData[element], match);
			viewData[element].splice(index, 1, newItem);
		}

		_.each(callbacks, function(callback) {
			callback.call(null, added);
		});
	};
}]);
