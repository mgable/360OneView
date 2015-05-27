'use strict';

/**
 * @ngdoc function
 * @name threeSixtOneViewApp.controller:CreaterecommendationCtrl
 * @description
 * # CreaterecommendationCtrl
 * Controller of the threeSixtOneViewApp
 */
angular.module('ThreeSixtyOneView')
.controller('CreateRecommendationCtrl', ['$scope', 'ScenarioService', 'ProjectsService', 'ManageTemplatesService', 'MetaDataService',
function ($scope, ScenarioService, ProjectsService, ManageTemplatesService, MetaDataService) {
	var baseScenario,
		masterProject,
		spendDimensions,
		outcomeDimensions,
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
				baseScenario = masterProject.data[masterProject.data.length - 1 - 1];
				getSpendCube(baseScenario.template.id);
				getOutcomeCube(baseScenario.template.id);
			});
		},
		getMasterProject = function getMasterProject(projects) {
			return _.findWhere(projects, {'isMaster': true});
		},
		getSpendCube = function getSpendCube(templateId) {
			isSpendCubeLoaded = false;

			ManageTemplatesService.getTemplateCubesByType(templateId, 'Spend').then(function(spendCubeId) {
				MetaDataService.buildDimensionsTree(spendCubeId[0]).then(function(_spendDimensions) {
					spendDimensions = _spendDimensions;
					formSpendDimensions(_spendDimensions);

					// kpis list should be formed after both spend and kpi cubes are loaded
					isSpendCubeLoaded = true;
					if(isOutcomeCubeLoaded) {
						formKpisList(outcomeDimensions);
					}
				});
			});
		},
		getOutcomeCube = function getOutcomeCube(templateId) {
			isOutcomeCubeLoaded = false;

			ManageTemplatesService.getTemplateCubesByType(templateId, 'Outcome').then(function(outcomeCubeId) {
				MetaDataService.buildDimensionsTree(outcomeCubeId[0]).then(function(_outcomeDimensions) {
					outcomeDimensions = _outcomeDimensions;

					// kpis list should be formed after both spend and kpi cubes are loaded
					isOutcomeCubeLoaded = true;
					if(isSpendCubeLoaded) {
						formKpisList(outcomeDimensions);
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
		},
		formKpisList = function formKpisList(_outcomeDimensions) {
			_outcomeDimensions.forEach(function(dimension) {
				if(dimension.type === 'MeasureDimension') {
					$scope.kpis = dimension.members[0].members;
				}
			});

			// select the first kpi by default
			$scope.newRecommendation.goal.id = $scope.kpis[0].id;
			$scope.newRecommendation.goal.name = $scope.kpis[0].name;
			$scope.newRecommendation.goal.label = $scope.kpis[0].label;
		};

	init();
}]);
