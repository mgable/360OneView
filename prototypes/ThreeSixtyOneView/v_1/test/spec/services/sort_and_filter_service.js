'use strict';

describe('Services:', function() {

    beforeEach(module('ThreeSixtyOneView.services'));
    beforeEach(module('ThreeSixtyOneView.filters'));

    var SortAndFilterService, $rootScope, $filter, filterFilter, FavoritesService,
        config = {
            data: {
                data: [{
                    title: "m",
                    type: "A",
                    id: 1
                }, {
                    title: "a",
                    type: "A",
                    id: 2
                }, {
                    title: "z",
                    type: "B",
                    id: 3
                }]
            },
            orderBy: "",
            reverse: false,
            filter: {
                filter: "",
                label: "foo"
            }
        }

    beforeEach(inject(function($rootScope, $filter, filterFilter, _SortAndFilterService_, _FavoritesService_) {
        SortAndFilterService = _SortAndFilterService_;
        $rootScope = $rootScope;
        $filter = $filter
        filterFilter = filterFilter;
        FavoritesService = _FavoritesService_;
    }));

    describe("Sort and Filter Service:", function() {

        beforeEach(function() {
            SortAndFilterService.init(config)
        })

        it("should be defined", function() {
            expect(SortAndFilterService).toBeDefined();
        });

        it("should initalized correctly", function() {
            expect(SortAndFilterService.getData()).toEqual(config.data.data);
            expect(SortAndFilterService.getOrderBy()).toEqual(config.orderBy);
            expect(SortAndFilterService.getActiveFilters()).toEqual(config.filter.filter);
            expect(SortAndFilterService.getReverse()).toBe(config.reverse);
        });

        it("should sort correctly", function() {
            SortAndFilterService.setFilter("orderBy", "title", true);
            var sorted = _.sortBy(config.data.data, "title");
            expect(SortAndFilterService.getData()).toEqual(sorted);
            SortAndFilterService.setFilter("reverse", true, true);
            expect(SortAndFilterService.getData()).toEqual(sorted.reverse());
        });

        it("should filterBy correctly", function() {
            SortAndFilterService.setFilter("filterBy", {
                "type": "B"
            }, true);
            var filtered = _.filter(config.data.data, function(item) {
                return item.type === "B"
            })
            expect(SortAndFilterService.getData()).toEqual(filtered);
            SortAndFilterService.setFilter("filterBy", {
                "type": "A"
            }, true);
            filtered = _.filter(config.data.data, function(item) {
                return item.type === "A"
            })
            expect(SortAndFilterService.getData()).toEqual(filtered);
        });

        it("should set activeFilters correctly", function() {
            SortAndFilterService.setFilter("activeFilter", {
                filter: {
                    "type": "B"
                }
            }, true);
            var filtered = _.filter(config.data.data, function(item) {
                return item.type === "B"
            })
            expect(SortAndFilterService.getData()).toEqual(filtered);
            SortAndFilterService.setFilter("activeFilter", {
                filter: {
                    "type": "A"
                }
            }, true);
            filtered = _.filter(config.data.data, function(item) {
                return item.type === "A"
            })
            expect(SortAndFilterService.getData()).toEqual(filtered);
        });

        it("should be able to filter favorites", function() {
            FavoritesService.addFavorite(2);
            SortAndFilterService.setFilter("filterPipeline", {
                filter: "isFavorite"
            }, true);
            var filtered = _.filter(config.data.data, function(item) {
                return item.id === 2;
            })
            expect(SortAndFilterService.getData()).toEqual(filtered);
        });

        it("should return the count of items", function() {
            expect(SortAndFilterService.getCount()).toEqual(config.data.data.length);
        });

        it("should get and set sorter ID's", function() {
            SortAndFilterService.setSorter(1, config);
            expect(SortAndFilterService.getSorter(1)).toEqual(config)
        });

        it("should get and set orderBy", function() {
            SortAndFilterService.setOrderBy(config);
            expect(SortAndFilterService.getOrderBy()).toEqual(config);
        });

        it("should get and set reverse", function() {
            SortAndFilterService.setReverse(config);
            expect(SortAndFilterService.getReverse()).toEqual(config);
        });

        it("should get and set filterBy", function() {
            SortAndFilterService.setFilterBy(config);
            expect(SortAndFilterService.getFilterBy()).toEqual(config);
        });

        xit("should reset filterBy", function() {
            SortAndFilterService.setFilterBy(config);
            SortAndFilterService.resetFilterBy()
            expect(SortAndFilterService.getFilterBy()).toEqual({});
        });

        xit("should get and set active filter", function() {
            SortAndFilterService.setActiveFilters(config);
            expect(SortAndFilterService.getActiveFilters()).toEqual(config);
        });

        xit("should reset active filter", function() {
            SortAndFilterService.setActiveFilters(config);
            SortAndFilterService.resetActiveFilters();
            expect(SortAndFilterService.getActiveFilters()).toEqual({});
        });

        it("should get and set search text", function() {
            SortAndFilterService.setSearchText("test");
            expect(SortAndFilterService.getSearchText()).toEqual("test");
        });

        it("should reset search text", function() {
            SortAndFilterService.setSearchText("test");
            SortAndFilterService.resetSearchText();
            expect(SortAndFilterService.getSearchText()).toEqual("");
        });

        xit("should get and set selected", function() {
            var config = {
                label: "test"
            };
            SortAndFilterService.setSelected(config);
            SortAndFilterService.resetSearchText();
            expect(SortAndFilterService.getSelected()).toBe(config);
        });

        it("should get selected label", function() {
            //SortAndFilterService.setSelected(config);
            expect(SortAndFilterService.getSelectedLabel()).toBe(config.filter.label);
        });

        it("should get the filtered data", function() {
            expect(SortAndFilterService.getData()).toEqual(config.data.data);
        });
    });
});