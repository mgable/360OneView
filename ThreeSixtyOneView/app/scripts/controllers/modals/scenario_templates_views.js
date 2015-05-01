'use strict';

angular.module('ThreeSixtyOneView')
.controller('ScenarioTemplatesViewsCtrl', ['$scope', '$rootScope', '$controller', '$modalInstance', 'CONFIG', 'EVENTS', 'data', 'ManageTemplatesService', 'DimensionService', 'ManageScenariosService', 'PivotMetaService', 'MetaDataService', 'ScenarioService',
	function($scope, $rootScope, $controller, $modalInstance, CONFIG, EVENTS, data, ManageTemplatesService, DimensionService, ManageScenariosService, PivotMetaService, MetaDataService, ScenarioService) {
	angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $controller: $controller, $modalInstance: $modalInstance, CONFIG: CONFIG}));

	var init = function() {
		$scope.CONFIG = CONFIG;
		// this sets the following
		// $scope.templateType, $scope.scenarioTemplates, $scope.masterProject
		angular.extend($scope, data);
		$scope.dimensions = [];
		$scope.dimensionsSchema = [];
		$scope.spendCube = [];
		$scope.spendCubeLoading = false;
		$scope.modelingPeriod = [];

		ManageScenariosService.getBase($scope.templateType.label).then(function(baseScenario) {
			$scope.baseScenario = baseScenario;
			ManageTemplatesService.get(baseScenario.template.id, false).then(function(baseTemplate) {
				$scope.baseTemplate = baseTemplate;
				$scope.template.source.id = baseTemplate.id;
				$scope.dimensionsList = baseTemplate.dimensions;
				$scope.kpisList = baseTemplate.kpis;
				DimensionService.getDimensions(baseScenario.template.id);
			});
		});

		initializeTemplate($scope.templateType);
	},
	initializeTemplate = function(type) {
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
		$scope.standardDimensionsLabels = '';
		$scope.kpiDimensionsLabels = '';

		$scope.performancePeriod = {
			from: null,
			to: null
		};

		$scope.addedDimensionMembers = false;
		$scope.defaultView = {};
	},
	timeDimension = false,
	addTimeDimension = function(addedMembers) {
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
	},
	makePlanOfRecord = function(template, baseScenario) {
		var planOfRecord = angular.copy(CONFIG.application.models.ScenarioModel.newScenario);
		planOfRecord.name = 'Plan of Record';
		planOfRecord.type = template.type;
		planOfRecord.isPlanOfRecord = true;
		planOfRecord.prediction = baseScenario.prediction;
		planOfRecord.template = template;
		planOfRecord.referenceScenario = {
			id: baseScenario.id,
			name: baseScenario.name,
			type: baseScenario.type
		};
		if(template.type === 'Action') {
			planOfRecord.modellingStartTime = $scope.performancePeriod.from.id;
			planOfRecord.modellingEndTime = $scope.performancePeriod.to.id;
		}
		return planOfRecord;
	};

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
				if(!levelFound) {
					$scope.filteredTimeDimension.members.push(level);
				}
				levelFound = levelFound || level.label === time;
			});
		}
	};

	$scope.getAddedDimensionMembers = function() {
		return $scope.addedDimensionMembers;
	};

	$scope.setAddedDimensionMembers = function(addedMembers) {
		$scope.addedDimensionMembers = addedMembers;
	};

	$scope.getSpendCube = function() {
		return $scope.spendCube;
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

	$scope.setDimensionsLabel = function(dimensions, categorizedValue, type) {
		$scope[type + 'DimensionsLabel'] = DimensionService.getSelectedDimensionsLabels(dimensions, categorizedValue, type);
	}

	$scope.setStandardDimensions = function(dimensions, dimensionsSchema, addedMembers) {
		$scope.spendCubeLoading = true;
		// empty the default view if previously created, to avoid conflicts if used dimensions are modified
		$scope.defaultView = {};
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
		ManageTemplatesService.update($scope.template, false).then(function(template) {
			ManageTemplatesService.getTemplateCubesByType(template.id, 'Spend').then(function(cubeId) {
				MetaDataService.buildDimensionsTree(cubeId[0]).then(function(spendCube) {
					$scope.spendCube = spendCube;
					$scope.$broadcast(EVENTS.spendCubeIdLoaded, spendCube);
					$scope.spendCubeLoading = false;
				});
			});
		});
	};

	$scope.setKpiDimension = function(kpis) {
		$scope.template.kpis = [];
		_.each(kpis, function(kpi) {
			if(!kpi.isSelected) return;
			$scope.template.kpis.push({id: kpi.id});
		});
	};

	$scope.getTimeGranularityInfo = function() {
		return $scope.filteredTimeDimension.members[$scope.filteredTimeDimension.members.length - 1];
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
			console.log(templateResponse);
			var planOfRecord = makePlanOfRecord(templateResponse, $scope.baseScenario);
			console.log(planOfRecord);
			ManageTemplatesService.createView($scope.template.id, $scope.defaultView).then(function(viewResponse) {
				console.log(viewResponse);
			});
			ScenarioService.create($scope.masterProject.uuid, planOfRecord).then(function(scenario) {
				console.log(scenario);
				$rootScope.$broadcast(EVENTS.planOfRecordCreated, scenario);
			});
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