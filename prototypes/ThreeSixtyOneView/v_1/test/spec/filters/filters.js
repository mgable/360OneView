/* jshint quotmark: false */

'use strict';

xdescribe('Filters:', function() {
    // load the directive's module
    beforeEach(module('centralManagerApp'));

    var filter;

    beforeEach(inject(function($filter) {
        filter = $filter;
    }));

    describe('String filters', function() {
        it('should capitalize', function() {
            expect(filter('capitalize')('cat in the hat')).toBe('Cat in the hat');
        });
        it('should unCamelCase', function() {
            expect(filter('unCamelCase')('catInTheHat')).toBe('cat In The Hat');
        });

        it('should normalize', function() {
            expect(filter('normalize')('cat In The Hat')).toBe('catinthehat');
        });
    });

    describe('Date Range Filter', function() {
        var day = 86400000,
            twoDays = day * 2,
            week = day * 7,
            month = day * 31,
            year = day * 365,
            now = Date.now(),
            nowAgo = {
                id: 1,
                lastModified: now
            },
            oneDayAgo = {
                id: 2,
                lastModified: now - day
            },
            twoDaysAgo = {
                id: 3,
                lastModified: now - twoDays
            },
            input = [nowAgo, oneDayAgo, twoDaysAgo];

        it('should return input if days back equal 0', function() {
            expect(filter('dateRange')(input, 0, 'lastModified')).toEqual(input);
        });

        it('should return input if the property is ommitted', function() {
            expect(filter('dateRange')(input, 0)).toEqual(input);
        });

        it('should return everything within one day', function() {
            expect(filter('dateRange')(input, 1)).toEqual([nowAgo]);
        });

        it('should return everything within two days', function() {
            expect(filter('dateRange')(input, 2)).toEqual([nowAgo, oneDayAgo]);
        });

        it('should return everything within three days', function() {
            expect(filter('dateRange')(input, 3)).toEqual([nowAgo, oneDayAgo, twoDaysAgo]);
        });
    });

    describe('TimeAgo Filter', function() {
        it('should return \"never\" if no time is supplied', function() {
            expect(filter('timeago')()).toBe('never');
        });

        it('should return \"less than a minute ago\" if time ago is under a minute', function() {
            expect(filter('timeago')(Date.now())).toBe(' less than a minute ago');
        });

        it('should return \"1 min\" if time ago is a minute', function() {
            expect(filter('timeago')(Date.now() + 60001)).toBe('in 1 min');
        });

        it('should return \"10 min\" if time ago is 10 minutes', function() {
            expect(filter('timeago')(Date.now() + 600001)).toBe('in 10 mins');
        });

        it('should return \"in 2 hours\" if time ago is 2 hours', function() {
            expect(filter('timeago')(Date.now() + 6000001)).toBe('in 2 hrs');
        });

        it('should return \"in 7 days\" if time ago is 7 days', function() {
            expect(filter('timeago')(Date.now() + 600000001)).toBe('in 7 days');
        });

        it('should return \"in 10 weeks\" if time ago is 10 weeks', function() {
            expect(filter('timeago')(Date.now() + 6000000001)).toBe('in 10 weeks');
        });

        it('should return \"in 2 years\" if time ago is 2 years', function() {
            expect(filter('timeago')(Date.now() + 60000000001)).toBe('in 2 years');
        });
    });

});