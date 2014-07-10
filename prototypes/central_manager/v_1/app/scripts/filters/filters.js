/*jshint  quotmark: false, unused: false */
'use strict';

angular.module('centralManagerApp')
    .filter('camelCase', function() {
        return function(input) {
            if (input) {
                return input.toLowerCase().replace(/ (.)/g, function(match, group1) {
                    return group1.toUpperCase();
                });
            }
        }
    })
    .filter('dateRange', function() {
        var dayInMillisec = 86400000;
        return function(input, db, prop) {
            var results = [],
                prop = prop || "lastModified",
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
    })
    .filter('capitalize', function() {
        return function(input) {
            return input.substring(0, 1).toUpperCase() + input.substring(1);
        };
    })
    .filter('unCamelCase', function() {
        return function(input) {
            return input.replace(/([a-z\d])([A-Z\d])/g, '$1 $2');
        };
    })
    .filter('normalize', function() {
        return function(input) {
            return input.replace(/\s/g, '').toLowerCase();
        };
    })
    .filter('timeago', function() {
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
    });