/*jshint  quotmark: false, unused: false */
/* global _ */
'use strict';

angular.module('ThreeSixtyOneView.filters')
	.filter("filterProjects", ['$filter', function($filter) {
		return function(input, term) {
			console.info(term);
			var results = [],
				regExp;

			if(term) {
				regExp = new RegExp(term.toLowerCase(), "g");
			} else {
				return input;
			}

			_.each(input, function(project) {
				if (project.name && regExp) {
					if (regExp.test(project.name.toLowerCase())) {
						results.push(project);
					} else {
						var matchedScenarios = _.filter(project.data, function(scenario) {
							return regExp.test(scenario.name.toLowerCase());
						});
						if(matchedScenarios.length > 0) {
						    results.push(project);
						}
					}
				}
			});
			return results;
		};
	}])
	.filter('isFavorite', ["FavoritesService", function(FavoritesService) {
		return function(input) {
			var results = [];
			if (FavoritesService.getFavorites().length > 0) {
				_.each(input, function(e, i, a) {
					console.info(e);
					if (FavoritesService.isFavorite(e.uuid || e.id)) {
						results.push(e);
					}
				});
			}
			return results;
		};
	}])
	.filter('camelCase', [function() {
		return function(input) {
			if (typeof input === "string") {
				return input.toLowerCase().replace(/ (.)/g, function(match, group1) {
					return group1.toUpperCase();
				});
			}
			return input;
		};
	}])
	.filter('dateRange', [function() {
		var dayInMillisec = 86400000;
		return function(input, db, p) {
			var results = [],
				prop = p || "lastModified",
				daysBack = parseInt(db, 10),
				now = Date.now(),
				threshold = new Date(now - (dayInMillisec * daysBack));

			if (daysBack === 0) {
				return input;
			}

			for (var i = 0, limit = input.length; i < limit; i++) {

				if (new Date(input[i][prop]) > threshold) {
					results.push(input[i]);
				}
			}

			return results;
		};
	}])
	.filter('capitalize', [function() {
		return function(input) {
			if (typeof input === "string") {
				return input.substring(0, 1).toUpperCase() + input.substring(1);
			}
			return input;
		};
	}])
	.filter('unCamelCase', [function() {
		return function(input) {
			if (typeof input === "string") {
				return input.replace(/([a-z\d])([A-Z\d])/g, '$1 $2');
			}
			return input;
		};
	}])
	.filter('normalize', [function() {
		return function(input) {
			if (typeof input === "string") {
				return input.replace(/[\s\W]/g, '').toLowerCase();
			}
			return input;
		};
	}])
	.filter('timeago', [function() {
		//time: the time
		//local: compared to what time? default: now
		//raw: wheter you want in a format of '5 minutes ago', or '5 minutes'
		return function(time, local, raw) {
			if (!time) {
				return 'never';
			}

			if (!local) {
				(local = Date.now());
			}

			if (angular.isDate(time)) {
				time = time.getTime();
			} else if (typeof time === 'string') {
				time = new Date(time).getTime();
			}

			if (angular.isDate(local)) {
				local = local.getTime();
			} else if (typeof local === 'string') {
				local = new Date(local).getTime();
			}

			if (typeof time !== 'number' || typeof local !== 'number') {
				return;
			}

			var
				offset = Math.abs((local - time) / 1000),
				span = [],
				MINUTE = 60,
				HOUR = 3600,
				DAY = 86400,
				WEEK = 604800,
				MONTH = 2629744,
				YEAR = 31556926,
				DECADE = 315569260;

			if (offset <= MINUTE) {
				span = ['', raw ? 'now' : 'less than a minute'];
			} else if (offset < (MINUTE * 60)) {
				span = [Math.round(Math.abs(offset / MINUTE)), 'min'];
			} else if (offset < (HOUR * 24)) {
				span = [Math.round(Math.abs(offset / HOUR)), 'hr'];
			} else if (offset < (DAY * 7)) {
				span = [Math.round(Math.abs(offset / DAY)), 'day'];
			} else if (offset < (WEEK * 52)) {
				span = [Math.round(Math.abs(offset / WEEK)), 'week'];
			} else if (offset < (YEAR * 10)) {
				span = [Math.round(Math.abs(offset / YEAR)), 'year'];
			} else if (offset < (DECADE * 100)) {
				span = [Math.round(Math.abs(offset / DECADE)), 'decade'];
			} else {
				span = ['', 'a long time'];
			}

			span[1] += (span[0] === 0 || span[0] > 1) ? 's' : '';
			span = span.join(' ');

			if (raw === true) {
				return span;
			}
			return (time <= local) ? span + ' ago' : 'in ' + span;
		};
	}]).filter('nrFormat', [function() {
		return function(number) {
			var abs;
			if (number !== undefined) {
				abs = Math.abs(number);
				if (abs >= Math.pow(10, 12)) {
					number = (number / Math.pow(10, 12)).toFixed(1) + "T";
				} else if (abs < Math.pow(10, 12) && abs >= Math.pow(10, 9)) {
					number = (number / Math.pow(10, 9)).toFixed(1) + "B";
				} else if (abs < Math.pow(10, 9) && abs >= Math.pow(10, 6)) {
					number = (number / Math.pow(10, 6)).toFixed(1) + "M";
				} else if (abs < Math.pow(10, 6) && abs >= Math.pow(10, 3)) {
					number = (number / Math.pow(10, 3)).toFixed(1) + "K";
				} else if (abs < Math.pow(10, 3) && abs > 0) {
					number = number.toFixed(1);
				} else {
					number = number;
				}
				return number;
			}
		};
	}]).filter('percentage', ['$window', function ($window) {
		return function (input, decimals, suffix) {
			decimals = angular.isNumber(decimals) ? decimals : 2;
			suffix = suffix || '%';
			if ($window.isNaN(input) || input === '') {
				return '';
			}
			return Math.round(input * Math.pow(10, decimals + 2))/Math.pow(10, decimals) + suffix;
		};
	}]);