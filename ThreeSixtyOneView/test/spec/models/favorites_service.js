'use strict';

describe('Services: Favorites Service: ', function() {

    beforeEach(module('ThreeSixtyOneView.services'));
    beforeEach(module('ThreeSixtyOneView.filters'));
    beforeEach(module('ThreeSixtyOneView.config'));

    var  FavoritesService;

    beforeEach(inject(function(_FavoritesService_){
        FavoritesService = _FavoritesService_;
    }));

    it('should be defined', function(){
        expect(FavoritesService).toBeDefined();
    });

    it('should get favorites', function(){
        FavoritesService.data = ["foo"];
        expect(FavoritesService.getFavorites()).toEqual(["foo"]);
    });

    it ("should add favorites", function(){
        FavoritesService.addFavorite("bar");
        expect(FavoritesService.getFavorites()).toEqual(["bar"]);
        FavoritesService.addFavorite("barboo");
        expect(FavoritesService.getFavorites()).toEqual(["bar", "barboo"]);
    });

    it ("should determine if an item is a favorite", function(){
        FavoritesService.addFavorite("bar");
        expect(FavoritesService.isFavorite("bar")).toBe(true);
        expect(FavoritesService.isFavorite("barXXXX")).toBe(false);
    });

    it("should toggle a projects favorite status", function(){
        var item = {"id": "111"};
        FavoritesService.addFavorite(item.id);
        FavoritesService.toggleFavorite(item.id, "project", {"type": "Action"});
        expect(FavoritesService.isFavorite("111")).toBe(false);
        FavoritesService.toggleFavorite(item.id, "project", {"type": "Action"});
        expect(FavoritesService.isFavorite("111")).toBe(true);
    });
});
