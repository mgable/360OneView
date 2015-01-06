var breadcrumb = "ol.breadcrumb li",
	filterBy = "h4[data-ms-id='filterBy']",
	filterByFavorites = "li[data-ms-id='Favorites']",
	filterByItem = ".filterDropdown li:first-child",
	filterDropdown = ".filterDropdown",
	// countHolder = '//span[@data-ms-id="dataCount"]',
	// masterProject = '.master a.favorite',
	

	// happy with these names
	column_2SortOptions = "span[data-ms-id='column_2SortOptions']",
	column_1Sort = "div[data-ms-id='column_1'] a",
	column_1Label = "div[data-ms-id='column_1']",
	column_2Sort = "h6[data-ms-id='column_2'] span.select",
	column_2Label = "h6[data-ms-id='column_2']",
	createdBy = "li[data-ms-id='Created Date']",
	modifiedOn = "li[data-ms-id='Last Modified']",
	ascending = "li[data-ms-id='ascending']",
	descending = "li[data-ms-id='descending']",
	searchInput = "SortAndFilterService.searchText",

	items = "item in getData()",
	itemCount = "span[data-ms-id='itemCount']"
	masterProjectClass = ".master",
	selectedItemTitle = "form[data-ms-id='inlineRename'] span.title",

	data = { 
		hasClass: function (element, cls) {
		    return element.getAttribute('class').then(function (classes) {
		        return classes.split(' ').indexOf(cls) !== -1;
		    });
		},
		getItems: function(){
			return element.all(by.repeater(items));
		},
		getMasterProjectItem: function(){
			return element(by.css(masterProjectClass));
		},
		getItemCount: function(){
			return element(by.css(itemCount));
		},
		getFirstItemTitle: function(){
			return element.all(by.repeater(items).column('title')).first();
		},
		getDashboardUrl: function(id){
			return this.dashboardUrl.replace(/:id/, id);
		},
		getSelectedItemTitle: function(){
			return element(by.css(selectedItemTitle));
		},
		getAllItemTitles: function(){
			return element.all(by.repeater(items).column('title'));
		},
		getAllItemModifiedOn: function(){
			return element.all(by.repeater(items).column('modifiedOn'));
		},
		getAllItemCreatedOn: function(){
			return element.all(by.repeater(items).column('createdOn'));
		},
		getFavorites: function(){
			return element.all(by.css(this.favoriteClassHolder));
		},

		testQuery: "?e2e=true",
		projectUrl: "/#/projects",
		dashboardUrl: '/#/dashboard/:id',
		activeSelectionClass: "active",
		favoriteClassHolder: ".favorites a",
		favoriteClass: "favorite",
		itemUUID: "data-ms-id",
		masterProject: "master project",

		column_2SortOptionsButton: element(by.css(column_2SortOptions)),
		column_1SortButton: element(by.css(column_1Sort)),
		column_1LabelField: element(by.css(column_1Label)),
		column_2SortButton: element(by.css(column_2Sort)),
		column_2LabelField: element(by.css(column_2Label)),
		createdByButton: element(by.css(createdBy)),
		modifiedOnButton: element(by.css(modifiedOn)),
		ascendingButton: element(by.css(ascending)),
		descendingButton: element(by.css(descending)),
		filterByButton: element(by.css(filterBy)),
		filterByfavoritesButton: element(by.css(filterByFavorites)),
		filterByItemButton: element(by.css(filterByItem)),
		searchInputField: element(by.model(searchInput)),
		filterDropdown: element(by.css(filterDropdown))
		//breadcrumbField: element(by.css(breadcrumb))
	};

module.exports = data;