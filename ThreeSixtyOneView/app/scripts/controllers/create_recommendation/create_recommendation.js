'use strict';

/**
 * @ngdoc function
 * @name threeSixtOneViewApp.controller:CreaterecommendationCtrl
 * @description
 * # CreaterecommendationCtrl
 * Controller of the threeSixtOneViewApp
 */
angular.module('ThreeSixtyOneView')
.controller('CreateRecommendationCtrl', ['$scope', '$stateParams', '$q', 'EVENTS', 'ScenarioService', 'ProjectsService', 'ManageTemplatesService', 'MetaDataService', 'ManageAnalysisViewsService', 'GotoService',
function ($scope, $stateParams, $q, EVENTS, ScenarioService, ProjectsService, ManageTemplatesService, MetaDataService, ManageAnalysisViewsService, GotoService) {
	var baseScenario,
		masterProject,
		spendCubeId,
		spendDimensions,
		spendView,
		outcomeCubeId,
		outcomeDimensions,
		outcomeSpecificDimensions,
		isSpendCubeLoaded = false,
		isOutcomeCubeLoaded = false,

		init = function init() {
			$scope.newRecommendation = {
					name: '',
					description: '',
					goal: {}
				};
			$scope.timeDimension = {};
			$scope.spendDimensions = [];
			$scope.kpis = [];

			// get all scenario for the base scenario functionality
			if(ProjectsService.getProjects().length === 0) {
				ProjectsService.get().then(function() {
					getAllScenarios();
				});
			} else {
				getAllScenarios();
			}
		},
		getAllScenarios = function getAllScenarios() {
			ScenarioService.getAll().then(function(projects) {
				masterProject = getMasterProject(projects);
				baseScenario = masterProject.data[masterProject.data.length  - 1];
				getSpendCube(baseScenario.template.id);
				getOutcomeCube(baseScenario.template.id);
			});
		},
		getMasterProject = function getMasterProject(projects) {
			return _.findWhere(projects, {'isMaster': true});
		},
		getSpendCube = function getSpendCube(templateId) {
			isSpendCubeLoaded = false;

			ManageTemplatesService.getTemplateCubesByType(templateId, 'Spend').then(function(_spendCubeId) {
				spendCubeId = _spendCubeId[0];
				MetaDataService.buildDimensionsTree(_spendCubeId[0]).then(function(_spendDimensions) {
					spendDimensions = _spendDimensions;
					formSpendDimensions(_spendDimensions);

					// kpis list should be formed after both spend and kpi cubes are loaded
					isSpendCubeLoaded = true;
					if(isOutcomeCubeLoaded) {
						formKpiDimensions(outcomeDimensions);
					}
				});
			});
		},
		getOutcomeCube = function getOutcomeCube(templateId) {
			var promises = [];

			isOutcomeCubeLoaded = false;

			// get list of KPIs and their required property
			promises.push(ManageTemplatesService.getAllKpis(templateId));

			ManageTemplatesService.getTemplateCubesByType(templateId, 'Outcome').then(function(_outcomeCubeId) {
				outcomeCubeId = _outcomeCubeId[0];
				promises.push(MetaDataService.buildDimensionsTree(_outcomeCubeId[0]));

				$q.all(promises).then(function(responses) {
					$scope.kpis = responses[0];

					outcomeDimensions = responses[1];

					// kpis list should be formed after both spend and kpi cubes are loaded
					isOutcomeCubeLoaded = true;
					if(isSpendCubeLoaded) {
						formKpiDimensions(outcomeDimensions);
					}
				});

			});
		},
		formSpendDimensions = function formSpendDimensions(_spendDimensions) {
			_spendDimensions.forEach(function(dimension) {
				if(dimension.type === 'TimeDimension') {
					$scope.timeDimension = dimension;
				} else {
					$scope.spendDimensions.push(dimension);
				}
			});

			$scope.$broadcast(EVENTS.dimensionsReady, _spendDimensions);
		},
		formKpiDimensions = function formKpiDimensions(_outcomeDimensions) {
			var spendDimensionIds = _.pluck(spendDimensions, 'id'),
				requiredKpis;

			outcomeSpecificDimensions = [];
			// filter out time, measure, and common standard dimensions with spend cube
			outcomeDimensions.forEach(function(dimension) {
				if(dimension.type === 'StandardDimension' && spendDimensionIds.indexOf(dimension.id) < 0) {
					outcomeSpecificDimensions.push(dimension);
				}
			});

			requiredKpis = $scope.kpis.filter(function(kpi) {
				return kpi.required;
			});

			if(requiredKpis.length > 0) {
				// select one of the required kpis by default
				$scope.newRecommendation.goal.id = requiredKpis[0].id;
				$scope.newRecommendation.goal.name = requiredKpis[0].name;
				$scope.newRecommendation.goal.label = requiredKpis[0].label;
			} else {
				// select the first kpi by default
				$scope.newRecommendation.goal.id = $scope.kpis[0].id;
				$scope.newRecommendation.goal.name = $scope.kpis[0].name;
				$scope.newRecommendation.goal.label = $scope.kpis[0].label;
			}

			$scope.$broadcast(EVENTS.outcomeDimensionsReady, outcomeCubeId, outcomeDimensions, outcomeSpecificDimensions);
		};

	$scope.getBaseScenario = function() {
		return baseScenario;
	};

	$scope.getSpendCubeId = function() {
		return spendCubeId;
	};

	$scope.getOutcomeCubeId = function() {
		return outcomeCubeId;
	};

	$scope.setSpendView = function(view) {
		spendView = view;
	};

	var drawerContent;
	$scope.animation = {slideIn:false}

	$scope.openDrawer = function(which){
		// open drawer
		if (!drawerContent || drawerContent === which || !$scope.animation.slideIn){
			$scope.animation.slideIn = !$scope.animation.slideIn;
		}

		drawerContent = which;

		switch(which){
			case "base": $scope.openCreateRecommendationChooseBaseScenario();break;
			case "assumptions": $scope.openCreateRecommendationAssumptions();break;
			default: $scope.animation.slideIn = !$scope.animation.slideIn
		}
	}

	$scope.openCreateRecommendationChooseBaseScenario = function(){
		GotoService.createRecommendationChooseBaseScenario();
	};

	$scope.openCreateRecommendationAssumptions = function(){
		GotoService.createRecommendationAssumptions();
	};

	$scope.cancel = function() {
		// delete the temporary spend view created
		if(spendView) {
			ManageAnalysisViewsService.deleteView(spendView.id, spendCubeId);
		}

		GotoService.dashboard($stateParams.projectId);
	};

	init();
}]);
