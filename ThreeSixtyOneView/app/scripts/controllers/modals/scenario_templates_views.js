'use strict';

angular.module('ThreeSixtyOneView')
.controller('ScenarioTemplatesViewsCtrl', ["$scope", "$controller", "$modalInstance", "CONFIG", "EVENTS", "data", 'ManageTemplatesService', 'DimensionService', 'ManageScenariosService', 'PivotMetaService',
	function($scope, $controller, $modalInstance, CONFIG, EVENTS, data, ManageTemplatesService, DimensionService, ManageScenariosService, PivotMetaService) {
	angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $controller: $controller, $modalInstance: $modalInstance, CONFIG: CONFIG}));

	var init = function() {
		$scope.CONFIG = CONFIG;
		// this sets the following
		// $scope.templateType, $scope.scenarioTemplates
		angular.extend($scope, data);
		$scope.dimensions = [];
		$scope.dimensionsSchema = [];

		ManageScenariosService.getBase($scope.templateType.label).then(function(baseScenario) {
			$scope.baseScenario = baseScenario;
			ManageTemplatesService.get(baseScenario.template.id, false).then(function(baseTemplate) {
				$scope.baseTemplate = baseTemplate;
				$scope.template.source.id = baseTemplate.id;
				$scope.dimensionsList = baseTemplate.dimensions;
				$scope.kpisList = baseTemplate.kpis;
				DimensionService.getDimensions(baseScenario.template.id);
				// ManageTemplatesService.buildDimensionsTree(baseScenario.template.id).then(function(dimensions) {
				// 	$scope.dimensions = dimensions;
				// 	console.log('scope dimensions:', $scope.dimensions);
				// 	// $scope.viewData = PivotMetaService.formEmptyView(dimensions, {label: 'Touchpoint'});
				// });
			});
		});

		initializeTemplate($scope.templateType);
	}, initializeTemplate = function(type) {
		$scope.template = {
			name: '',
			description: '',
			type: $scope.templateType.label,
			source: {},
			dimensions: [],
			kpis: []
		};

		$scope.dimensionsIsLoaded = false;
		$scope.timeGranularity = false;
		$scope.spendDimensionsLabels = '';
		$scope.kpiDimensionsLabels = '';

		$scope.performancePeriod = {
			from: null,
			to: null
		};

		$scope.addedDimensionMembers = false;
		$scope.defaultView = {};
	}, timeDimension = false;

	$scope.createDraftTemplate = function() {
		if(typeof $scope.template.id === 'undefined') {
			ManageTemplatesService.create($scope.template).then(function(response) {
				$scope.template.id = response.id;
			});
		}
	};

	$scope.getTimeGranularity = function() {
		return $scope.timeGranularity;
	};

	$scope.setTimeGranularity = function(time) {
		var i, levelFound = false;
		$scope.timeGranularity = time;

		if(!!time) {
			if(!timeDimension) {
				timeDimension = _.find($scope.dimensions, function(dimension) { return dimension.type === 'TimeDimension' });
				$scope.filteredTimeDimension = {
					id: timeDimension.id,
					label: timeDimension.label,
					type: timeDimension.type,
					members: []
				};
			}
			$scope.filteredTimeDimension.members = [];
			_.each(timeDimension.members, function(level) {
				levelFound = levelFound || level.label === time;
				if(levelFound) {
					$scope.filteredTimeDimension.members.push(level);
				}
			});
		}
	};

	$scope.getAddedDimensionMembers = function() {
		return $scope.addedDimensionMembers;
	};

	$scope.setAddedDimensionMembers = function(addedMembers) {
		$scope.addedDimensionMembers = addedMembers;
	};

	$scope.getDefaultView = function() {
		return $scope.defaultView;
	}

	$scope.setDefaultView = function(view) {
		$scope.defaultView = view;
	};

	$scope.setPerformancePeriod = function(fromDate, toDate) {
		$scope.performancePeriod.from = fromDate;
		$scope.performancePeriod.to = toDate;
	};

	$scope.setDimensionsLabel = function(dimensions, type) {
		$scope[type + 'DimensionsLabel'] = DimensionService.getDimensionsLabel(dimensions);
	}

	$scope.setStandardDimensions = function(dimensions, dimensionsSchema, addedMembers) {
		$scope.template.dimensions = [];
		_.each(dimensionsSchema, function(_dimension, _dimensionIndex) {
			if(!_dimension.isSelected) return;
			var dimension = {
					id: _dimension.id,
					type: _dimension.type,
					attributes: []
				};
			_.each(_dimension.members,function(_attribute, _attributeIndex) {
				if(!_attribute.isSelected) return;
				var attribute = {
					id: _attribute.id,
					specification: {}
				}, members = [],
				i;

				members = PivotMetaService.getCategorizeValues(dimensions[_dimensionIndex], addedMembers[_dimension.label], _attributeIndex);
				if(members.selected === members.total) {
					attribute.specification.type = 'All';
				} else {
					attribute.specification.type = 'Include';
					attribute.specification.members = [];
					_.each(members.id, function(_id) {
						attribute.specification.members.push({id: _id});
					})
				}
				dimension.attributes.push(attribute);
			});
			$scope.template.dimensions.push(dimension);
		});
		addTimeDimension(addedMembers);
		ManageTemplatesService.update($scope.template, false);
	};

	var addTimeDimension = function(addedMembers) {
		var dimension = {
			id: $scope.filteredTimeDimension.id,
			type: $scope.filteredTimeDimension.type,
			attributes: []
		};
		_.each($scope.filteredTimeDimension.members, function(_attribute, _attributeIndex) {
			var attribute = {
					id: _attribute.id,
					specification: {}
				},
				members = PivotMetaService.getCategorizeValues($scope.filteredTimeDimension, addedMembers[$scope.filteredTimeDimension.label], _attributeIndex);
			if(members.selected === members.total) {
				attribute.specification.type = 'All';
			} else {
				attribute.specification.type = 'Include';
				attribute.specification.members = [];
				_.each(members.id, function(_id) {
					attribute.specification.members.push({id: _id});
				})
			}
			dimension.attributes.push(attribute);
		});
		$scope.template.dimensions.push(dimension);
	};

	$scope.setKpiDimension = function(kpis) {
		$scope.template.kpis = [];
		_.each(kpis, function(kpi) {
			if(!kpi.isSelected) return;
			$scope.template.kpis.push({id: kpi.id});
		});
	};

	$scope.cancel = function() {
		if(!!$scope.template.id) {
			ManageTemplatesService.delete($scope.template.id);
		}
		$modalInstance.dismiss();
	};

	// pass back the selected file and dismiss the modal
	$scope.submit = function() {
		ManageTemplatesService.update($scope.template, true).then(function(templateResponse) {
			// ManageTemplatesService.createView($scope.template.id, $scope.viewData).then(function(viewResponse) {
			// 	console.log(templateResponse);
			// 	console.log(viewResponse);
			// });
			$modalInstance.close(templateResponse);
		});
	};

    $scope.$on(EVENTS.selectTime, function(evt, data) {
        $scope.timeGranularity = data;
    });

    $scope.$on(EVENTS.dimensionsIsLoaded, function(evt, data) {
        $scope.dimensionsIsLoaded = true;
        $scope.dimensions = data;
        _.each($scope.dimensions, function(_dimension) {
        	var dimension = {
        		id: _dimension.id,
        		label: _dimension.label,
        		type: _dimension.type,
        		members: []
        	};
        	_.each(_dimension.members, function(_attribute) {
        		dimension.members.push({
        			id: _attribute.id,
        			label: _attribute.label
        		});
        	});
        	$scope.dimensionsSchema.push(dimension);
        });
    });

	$scope.$on(EVENTS.flipbookAllowAdvance, function(evt, data){
		$scope.enableNext = data;
	});

	init();
}]);