angular.module('ThreeSixtyOneView').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/directives/add_dimension_button.tpl.html',
    "<div class=\" draggable-item dimension-add-button dropdown\">\n" +
    "\t<div class=\"add-label clickable dropdown-toggle\"><icon type=\"plus-square\"></icon>Add</div>\n" +
    "\t<div ng-include src=\"'views/includes/dimensions_pop_menu.tpl.html'\" class=\"dropdown-menu\"></div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/dimension_filter.tpl.html',
    "<div class=\"filter-category clickable\" ng-click=\"callAction(dimension)\">\n" +
    "\t<span title=\"{{getFormattedLabels(categorizedValues.label)}}\">\n" +
    "\t\t<div class=\"filter-label\">\n" +
    "\t\t\t{{dimension.label}}\n" +
    "\t\t\t<span class=\"filter-stats\">({{categorizedValues.selected}}/{{categorizedValues.total}})</span>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"filter-values text-holder\" ng-show=\"allValuesSelected(categorizedValues)\">\n" +
    "\t\t\t{{getFormattedLabels(categorizedValues.label)}}\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"filter-values text-holder\" ng-hide=\"allValuesSelected(categorizedValues)\">\n" +
    "\t\t\tAll\n" +
    "\t\t</div>\n" +
    "\t</span>\n" +
    "</div>\n"
  );


  $templateCache.put('views/directives/draggable_dimension.tpl.html',
    "<div class=\"draggable-item dropdown\" data-as-sortable-item ng-class=\"{locked: !!lockedDimensions[item.level.label]}\">\n" +
    "\t<div data-as-sortable-item-handle>\n" +
    "\t\t<span class=\"drag-handle\" title=\"Reorder\"><icon type=\"reorder\"></icon></span>\n" +
    "\t\t<span class=\"dropdown-toggle clickable dimension-label\" ng-click=\"clickedItem = item.level.label\">{{item.level.label}}</span>\n" +
    "\t\t<span ng-hide=\"!!lockedDimensions[item.level.label]\" class=\"action-icon clickable\" title=\"Remove\" ng-click=\"delete($index)\"><icon type=\"remove\"></icon></span>\n" +
    "\t\t<span ng-show=\"!!lockedDimensions[item.level.label]\" class=\"action-icon\" title=\"This dimension cannot be removed, because a filter has been applied.\"><icon type=\"info-circle\"></icon></span>\n" +
    "\t</div>\n" +
    "\t<div ng-if=\"!lockedDimensions[item.level.label]\" ng-include src=\"'views/includes/dimensions_pop_menu.tpl.html'\" class=\"dropdown-menu\"></div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/inline_description.tpl.html',
    "<form class=\"inlineDescription\" name=\"form\" data-ms-id=\"inlineDescription\">\n" +
    "\t<ng-transclude></ng-transclude>\n" +
    "\t<div>\n" +
    "\t\t<span class=\"controls\" ng-show=\"isActive\">\n" +
    "\t\t\t<button class=\"submit btn btn-default btn-xs\" ng-click=\"submit(item)\" ng-disabled=\"(form.$dirty && form.$invalid) || form.$pristine\"><icon type=\"check\"></icon></button>&nbsp;\n" +
    "\t\t\t<button class=\"cancel btn btn-default btn-xs\" ng-click=\"cancel()\"><icon type=\"times\"></icon></button>\n" +
    "\t\t</span>\n" +
    "\t\t<span class='action' ng-click=\"action()\" ng-hide=\"isActive\"><icon type=\"pencil\" cname=\"icon\"></icon></span>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div class=\"noEdit\" ng-hide=\"isActive\">\n" +
    "\t\t<div ng-class=\"{'description':item.description, 'noDescription': !item.description}\" ng-show=\"!isActive\">{{item.description}}</div>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div class=\"edit\" ng-show=\"isActive\">\n" +
    "\t\t<textarea ng-maxlength=\"256\" ng-pattern='/^[^\\\\\\/\\?\\:\\*\"><|]+$/' ng-model=\"item.description\" ng-class=\"{'active': isActive}\" class=\"description inputTarget\"></textarea>\n" +
    "\t</div>\n" +
    "</form>"
  );


  $templateCache.put('views/directives/inline_rename.tpl.html',
    "<form class=\"inlineRename\" name=\"form\" novalidate role=\"form\" data-ms-id='inlineRename'>\n" +
    "\t<span ng-transclude></span>\n" +
    "\n" +
    "\t<span class=\"noEdit\" ng-hide=\"isActive\" ng-click=\"action()\">\n" +
    "\t\t<span class=\"title\">{{item.title}}</span>&nbsp;\n" +
    "\t\t<span class=\"action\"><icon type=\"pencil\" cname=\"icon\"></icon></span>\n" +
    "\t</span>\n" +
    "\n" +
    "    <span class=\"edit\" ng-show=\"isActive\">\n" +
    "    \t<!-- validator -->\n" +
    "    \t<input ng-if=\"comparisonModel\" type=\"text\" class=\"title\" ng-model=\"item.title\" required ng-maxlength=\"256\" validator=\"comparisonModel\" error-type=\"foo\" ng-minlength=\"2\" ng-pattern='inputRestrictions.characterRestrictions' tabindex=\"1\"/>\n" +
    "\n" +
    "    \t<!-- no vaildator -->\n" +
    "    \t<input ng-if=\"!comparisonModel\" type=\"text\" class=\"title\" ng-model=\"item.title\" required ng-maxlength=\"256\" ng-minlength=\"2\" ng-pattern='inputRestrictions.characterRestrictions' tabindex=\"1\"/>\n" +
    "\n" +
    "    \t<button class=\"submit btn btn-default btn-sm\" ng-click=\"submit(item)\" ng-disabled=\"(form.$dirty && form.$invalid) || form.$pristine\"><icon type=\"check\"></icon></button>&nbsp;\n" +
    "    \t<button class=\"cancel btn btn-default btn-sm\" ng-click=\"cancel()\"><icon type=\"times\"></icon></button>\n" +
    "    </span>\n" +
    "</form>"
  );


  $templateCache.put('views/directives/member.tpl.html',
    "<div class=\"list-subcategory\" ng-class=\"{'list-item': !hasMembers()}\">\n" +
    "\t<span class=\"expand-handle clickable\" ng-if=\"hasMembers()\" ng-click=\"toggleCollapse()\">\n" +
    "\t\t<icon type=\"caret-right\" cname=\"{{setToggleStyle(member)}}\"></icon>\n" +
    "\t</span> \n" +
    "\t<label class=\"clickable\" ng-class=\"{'all-selected': isAllSelected(member)}\" ng-click=\"toggleMember(member)\">\n" +
    "\t\t<span ng-switch=\"determineStyle(member)\">\n" +
    "\t\t\t<span ng-switch-when=\"ALL_SELECTED\"> <!-- all selected -->\n" +
    "\t\t\t\t<icon type=\"check-square\"></icon>\n" +
    "\t\t\t</span>\n" +
    "\t\t\t<span ng-switch-when=\"NOT_SELECTED\"> <!-- not selected -->\n" +
    "\t\t\t\t<icon type=\"square-o\"></icon>\n" +
    "\t\t\t</span>\n" +
    "\t\t\t<span ng-switch-default> <!-- indeterminent -->\n" +
    "\t\t\t\t<icon type=\"minus-square\"></icon>\n" +
    "\t\t\t</span> \n" +
    "\t\t</span>\n" +
    "\t\t<span>{{member.label}}</span> \n" +
    "\t\t<span ng-if=\"hasMembers()\">({{outputSelectedOverTotal(member)}})</span>\n" +
    "\t</label>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/ms_dropdown.tpl.html',
    "<div class=\"ms-dropdown\" id=\"{{id}}\"> \n" +
    "\t<h6 class=\"ms-label\" ng-class=\"{active: DropdownService.isActive(id)}\" data-ms-id=\"{{id}}\">\n" +
    "\t\t<span ng-click=\"select(selectedItem)\" class=\"status select\">{{selectedItem.label}}</span>&nbsp;\n" +
    "\t\t<span class=\"toggle\" ng-click=\"toggle()\" data-ms-id=\"column_2SortOptions\"><icon type=\"caret-down\"></icon></span>\n" +
    "\t</h6> \n" +
    "\t<ul class=\"ms-select-list dropdownshadow hide\"> \n" +
    "\t\t<li class=\"list-label\">Sort Order</li>\n" +
    "\t\t<ul>\n" +
    "\t\t\t<li class=\"ms-item selectSort\" ng-class=\"{disabled:reverse}\" ng-click=\"select(selectedItem)\" data-ms-id=\"descending\"><icon type=\"check\" cname=\"ms-ok\"></icon>Descending</li>\n" +
    "\t\t\t<li class=\"ms-item selectSort\" ng-class=\"{disabled:!reverse}\" ng-click=\"select(selectedItem)\" data-ms-id=\"ascending\"><icon type=\"check\" cname=\"ms-ok\"></icon>Ascending</li>\n" +
    "\t\t</ul>\n" +
    "\t\t<li class=\"list-label\">Switch  Column</li>\n" +
    "\t\t<ul>\n" +
    "\t\t\t<li class=\"ms-item selectSort\" ng-repeat=\"item in items\" ng-class=\"{disabled:item.label === selectedItem.label}\" ng-click=\"selectSort(item)\" data-ms-id=\"{{item.label}}\"><icon type=\"check\" cname=\"ms-ok\"></icon>{{item.label}}</li>  \n" +
    "\t\t</ul>\n" +
    "\t</ul> \n" +
    "</div>"
  );


  $templateCache.put('views/directives/ms_filter_dropdown.tpl.html',
    "<div>\n" +
    "\t<h4 class=\"filter-holder\" ng-click=\"toggle()\" data-ms-id=\"filterBy\"><span class=\"title\">{{SortAndFilterService.getSelectedLabel()}}&nbsp;(<span data-ms-id='itemCount'>{{SortAndFilterService.getCount()}}</span>)<span  class=\"filterToggle\"><icon type=\"caret-down\"></icon></span></span>\n" +
    "\n" +
    "\t\t<ul ms-link-group selected-item=\"{{CONFIG.filterMenu.items[0].label}}\" radio=\"true\" class='filterDropdown dropdownshadow title hide menu'>\n" +
    "\t\t\t<li ng-repeat=\"item in CONFIG.filterMenu.items\" class=\"header\" ms-link=\"{{item.label}}\" ng-click=\"setFilter(item.filterType, item, true)\" data-ms-id=\"{{item.label}}\">\n" +
    "\t\t\t\t <a>{{item.label}}</a>\n" +
    "\t\t\t</li>\n" +
    "\t    </ul>\n" +
    "\t</h4>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/ms_filter_input.tpl.html',
    "<div class=\"input-holder\">\n" +
    "\t<icon type=\"filter\"></icon>\n" +
    "\t<input type=\"text\" class=\"search-input\" ng-model=\"SortAndFilterService.searchText\" ng-change=\"SortAndFilterService.filter()\" placeholder=\"Filter List\" ng-maxlength=\"1000\" />&nbsp;\n" +
    "</div>"
  );


  $templateCache.put('views/directives/sortable_columns.tpl.html',
    "<div ng-switch on=\"displayBy\" class=\"text-holder\"> \n" +
    "\t<span ng-switch-when=\"Last Modified\">\n" +
    "\t\t<span ng-if=\"!test\" bind-once>{{item.modifiedOn | timeago }}</span>\n" +
    "\t\t<span ng-if=\"test\">{{item.modifiedOn}}</span>\n" +
    "\t</span> \n" +
    "\t<span ng-switch-when=\"Modified By\" bind-once>{{item.modifiedBy}}</span> \n" +
    "\t<span ng-switch-when=\"Type\" bind-once>{{item.type}}</span> \n" +
    "\t<span ng-switch-when=\"Creator\" bind-once>{{item.createdBy}}</span> \n" +
    "\t<span ng-switch-when=\"Created Date\" bind-once>\n" +
    "\t\t<span ng-if=\"!test\" bind-once>{{item.createdOn | date: 'longDate' }}</span>\n" +
    "\t\t<span ng-if=\"test\">{{item.createdOn}}</span>\n" +
    "\t</span> \n" +
    "\t<span ng-switch-default>FAIL</span> \n" +
    "</div>"
  );


  $templateCache.put('views/directives/sorting_options.tpl.html',
    "<div data-ms-id=\"{{id}}\" class=\"{{label}} heading\" ng-class=\"{'active': SortAndFilterService.isActive(label)}\">\n" +
    "\t<a ng-click=\"sort($event, label)\" ng-bind=\"display\"></a>&nbsp;\n" +
    "</div> "
  );


  $templateCache.put('views/modal/all_views.tpl.html',
    "<div class=\"header\">\n" +
    "\t<h4 class=\"title\">{{selectedScenarioElement.cubeMeta.label}}</h4>\n" +
    "\t<h3 class=\"subtitle\">Select A View</h3>\n" +
    "</div>\n" +
    "<div class=\"body\">\n" +
    "\t<div class=\"content\">\n" +
    "\t\t<div class=\"main-content\">\n" +
    "\t\t\t<div class=\"toolbar\">\n" +
    "\t\t\t\t<div class=\"dropdown-box\">\n" +
    "\t\t\t\t\t<div class=\"dropdown ng-hide\">\n" +
    "\t\t\t\t\t\t<div class=\"dropdown-toggle clickable\">{{elementTypeItems[currentElementType]}}<icon type=\"caret-down\"></icon></div>\n" +
    "\t\t\t\t\t\t<ul class=\"dropdown-menu\" ms-link-group selected-item=\"{{selectedScenarioElement.id}}\" radio=\"true\">\n" +
    "\t\t\t\t            <li ng-repeat=\"item in elementTypeItems\" ng-click=\"changeElementType($index)\" class=\"menu-item\" ms-link=\"{{$index}}\">{{item}}</li>\n" +
    "\t\t\t\t        </ul>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"search-box\">\n" +
    "\t\t\t\t\t<icon type=\"search\"></icon>\n" +
    "\t\t\t\t\t<input type=\"text\" ng-model=\"searchTerm.name\" placeholder=\"Search\">\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"list-box\">\n" +
    "\t\t\t\t<div ng-repeat=\"view in viewsList | filter:searchTerm | orderBy:'auditInfo.lastUpdatedOn':true\" class=\"item clickable\" ng-class=\"{'selected': view.id === selectedView.id}\" ng-click=\"selectedView.id = view.id\">\n" +
    "\t\t\t\t\t<div class=\"item-name text-holder\"><icon type=\"circle-o\" cname=\"circle\"></icon><icon type=\"dot-circle-o\" cname=\"dot-circle\"></icon>{{view.name}}</div>\n" +
    "\t\t\t\t\t<div class=\"item-meta\">\n" +
    "\t\t\t\t\t\t<span ng-if=\"e2e\" class=\"item-date\">{{view.auditInfo.createdOn}}</span>\n" +
    "\t\t\t\t\t\t<span ng-if=\"!e2e\" class=\"item-date\">{{view.auditInfo.createdOn | timeago}}</span>\n" +
    "\t\t\t\t\t\t<span class=\"item-owner\">{{view.auditInfo.createdBy.name}}</span>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"action-buttons\">\n" +
    "\t\t<ms-button type=\"cancel\" action=\"cancelChangeView()\" label=\"Cancel\" data-dismiss=\"modal\"></ms-button>\n" +
    "\t\t<ms-button type=\"submit\" action=\"changeView()\" label=\"Replace\" data-dismiss=\"modal\"></ms-button>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modal/filter_selection.tpl.html',
    "<div class=\"header\">\n" +
    "\t<h4 class=\"title\">Filters</h4>\n" +
    "</div>\n" +
    "<div class=\"body\">\n" +
    "\t<div class=\"side-menu\">\n" +
    "\t\t<div class=\"menu-item clickable\" ng-repeat=\"dimension in getDimensions()\" ng-click=\"chooseFilter(dimension, $index, false)\" ng-class=\"{active: dimension.label == selectedFilter.dimension.label}\">\n" +
    "\t\t\t<div>{{dimension.label}}\n" +
    "\t\t\t\t<span>({{categorizedValue[$index].selected}}/{{categorizedValue[$index].total}})</span>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div ng-show=\"allFiltersSelected(categorizedValue[$index])\" class=\"values text-holder\" tooltip-placement=\"left\" tooltip=\"{{getValuesList(categorizedValue[$index])}}\">{{getValuesList(categorizedValue[$index])}}</div>\n" +
    "\t\t\t<div ng-hide=\"allFiltersSelected(categorizedValue[$index])\" class=\"values text-holder\" tooltip-placement=\"left\" tooltip=\"{{getValuesList(categorizedValue[$index])}}\">All</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"content\">\n" +
    "\t\t<div class=\"alert\" role=\"alert\" ng-class=\"{transparent: !noFilterSelected}\">\n" +
    "\t\t\t<div>\n" +
    "\t\t\t\t<icon type=\"warning\"></icon>Please select at least one item from the following filter<span ng-if=\"emptyFiltersList.length > 1\">s</span>\n" +
    "\t\t\t\t: <span ng-repeat=\"missing in getEmptyFiltersList()\">\n" +
    "\t\t\t\t\t<span class=\"underline clickable\" ng-click=\"chooseFilterByName(missing)\">{{missing}}</span>\n" +
    "\t\t\t\t\t<span ng-if=\"!$last\">, </span>\n" +
    "\t\t\t\t</span>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"main-content\">\n" +
    "\t\t\t<div class=\"toolbar\">\n" +
    "\t\t\t\t<div class=\"dropdown-box\">\n" +
    "\t\t\t\t\t<div class=\"clickable dropdown\">\n" +
    "\t\t\t\t\t\t<div class=\"dropdown-toggle\">\n" +
    "\t\t\t\t\t\t\t{{selectedFilter.level.label}}<icon type=\"caret-down\"></icon>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"dropdown-menu\" ms-link-group radio=\"true\" selected-item=\"{{selectedFilter.level.label}}\">\n" +
    "\t\t\t\t\t\t\t<div ng-repeat=\"item in selectedFilter.dimension.members\" class=\"menu-item\" ms-link=\"{{item.label}}\" ng-click=\"chooseFilter(selectedFilter.dimension, selectedDimensionIndex, $index)\">\n" +
    "\t\t\t\t\t\t\t\t{{item.label}}\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"search-box\" ng-show=\"selectedFilter.level\">\n" +
    "\t\t\t\t\t<icon type=\"filter\"></icon>\n" +
    "\t\t\t\t\t<input type=\"text\" placeholder=\"Filter List\" ng-model=\"filterSearch.label\" ng-keyup=\"searchFilters(selectedFilter.level, filterSearch)\">\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"selection-tools\">\n" +
    "\t\t\t\t<div class=\"dropdown\">\n" +
    "\t\t\t\t\t<div class=\"static-button clickable\" ng-hide=\"filterCount.total === 0\">\n" +
    "\t\t\t\t\t\t<div class=\"selection-toggle\" ng-show=\"filterCount.selected === 0\" ng-click=\"selectFilters(selectedFilter.dimension.label, true, true);\"><icon type=\"square-o\"></icon></div>\n" +
    "\t\t\t\t\t\t<div class=\"selection-toggle blue\" ng-show=\"filterCount.selected === filterCount.total\" ng-click=\"selectFilters(selectedFilter.dimension.label, true, false);\"><icon type=\"check-square\"></icon></div>\n" +
    "\t\t\t\t\t\t<div class=\"selection-toggle blue\" ng-show=\"filterCount.selected % filterCount.total > 0.01\" ng-click=\"selectFilters(selectedFilter.dimension.label, true, true);\"><icon type=\"minus-square\"></icon></div>\n" +
    "\t\t\t\t\t\t<div class=\"dropdown-toggle\"><icon type=\"caret-down\"></icon></div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"dropdown-menu\">\n" +
    "\t\t\t\t\t\t<div class=\"menu-item\" ng-click=\"selectFilters(selectedFilter.dimension.label, true, true);\">Select All Visible</div>\n" +
    "\t\t\t\t\t\t<div class=\"menu-item\" ng-click=\"selectFilters(selectedFilter.dimension.label, true, false);\">Deselect All Visible</div>\n" +
    "\t\t\t\t\t\t<div class=\"menu-item\" ng-click=\"selectFilters(selectedFilter.dimension.label, false, false);\">Deselect All Not Visible</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"stat\" ng-hide=\"filterCount.total === 0\">\n" +
    "\t\t\t\t\t({{filterCount.selected}}/{{filterCount.total}})\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"list-box\" ng-style=\"{height: getListHeight()}\">\n" +
    "\t\t\t\t<div class=\"list\" ng-if=\"searchResults.members\">\n" +
    "\t\t\t\t\t<member ng-repeat=\"member in searchResults.members | orderBy:'label'\" member=\"member\" filters=\"addedFilter\" category=\"{label: selectedFilter.dimension.label}\"  expanded=\"expanded\" expandall=\"filterSearch\" updater=\"categorizeValuesCount(index, addedFilters)\" dimensionindex=\"selectedDimensionIndex\"></member>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"action-buttons\">\n" +
    "\t\t\t<ms-button type=\"cancel\" action=\"cancel()\" label=\"Cancel\" data-dismiss=\"modal\"></ms-button>\n" +
    "\t\t\t<ms-button type=\"submit\" action=\"submit()\" label=\"Apply\" data-dismiss=\"modal\" ng-disabled=\"noFilterSelected\"></ms-button>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modal/scenario_analysis_element_copy.tpl.html',
    "<div data-ms-id=\"analysisElementCopy\">\n" +
    "\t<div class=\"header\">\n" +
    "\t\t<h4 class=\"title\">{{selectedScenarioElement.cubeMeta.label}}</h4>\n" +
    "\t\t<h3 class=\"subtitle\">Copy &amp; Replace</h3>\n" +
    "\t</div>\n" +
    "\t<div class=\"body\">\n" +
    "\t\t<div class=\"content\">\n" +
    "\t\t\t<form name=\"elementCopy\" class=\"main-content\" novalidate>\n" +
    "\t\t\t\t<div class=\"name\">\n" +
    "\t\t\t\t\t<label>Name:\n" +
    "\t\t\t\t\t\t<input type=\"text\" name=\"elementName\" placeholder=\"Enter Name\" ng-model=\"newElement.name\" required>\n" +
    "\t\t\t\t\t</label>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"description\">\n" +
    "\t\t\t\t\t<label>Description:\n" +
    "\t\t\t\t\t\t<input type=\"text\" name=\"elementDescription\" placeholder=\"Enter Description\" ng-model=\"newElement.description\" required>\n" +
    "\t\t\t\t\t</label>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</form>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"action-buttons\">\n" +
    "\t\t\t<ms-button type=\"cancel\" action=\"cancelCopyFile()\" label=\"Cancel\" data-dismiss=\"modal\"></ms-button>\n" +
    "\t\t\t<ms-button type=\"submit\" action=\"copyFile()\" label=\"Replace\" data-dismiss=\"modal\" ng-disabled=\"elementCopy.$invalid\"></ms-button>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modal/scenario_analysis_element_files.tpl.html',
    "<div data-ms-id=\"analysisElementReplace\">\n" +
    "\t<div class=\"header\">\n" +
    "\t\t<h4 class=\"title\">{{selectedScenarioElement.cubeMeta.label}}</h4>\n" +
    "\t\t<h3 class=\"subtitle\">Select A New File</h3>\n" +
    "\t</div>\n" +
    "\t<div class=\"body\">\n" +
    "\t\t<div class=\"content\">\n" +
    "\t\t\t<div class=\"main-content\">\n" +
    "\t\t\t\t<div class=\"toolbar\">\n" +
    "\t\t\t\t\t<div class=\"dropdown-box\">\n" +
    "\t\t\t\t\t\t<div class=\"dropdown ng-hide\">\n" +
    "\t\t\t\t\t\t\t<div class=\"dropdown-toggle clickable\">{{elementTypeItems[currentElementType]}}<icon type=\"caret-down\"></icon></div>\n" +
    "\t\t\t\t\t\t\t<ul class=\"dropdown-menu\" ms-link-group selected-item=\"{{selectedScenarioElement.id}}\" radio=\"true\">\n" +
    "\t\t\t\t\t            <li ng-repeat=\"item in elementTypeItems\" ng-click=\"changeElementType($index)\" class=\"menu-item\" ms-link=\"{{$index}}\">{{item}}</li>\n" +
    "\t\t\t\t\t        </ul>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"search-box\">\n" +
    "\t\t\t\t\t\t<icon type=\"search\"></icon>\n" +
    "\t\t\t\t\t\t<input type=\"text\" ng-model=\"searchTerm.name\" placeholder=\"Search\">\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"list-box\">\n" +
    "\t\t\t\t\t<div ng-repeat=\"file in fileList | filter:searchTerm | orderBy:'auditInfo.lastUpdatedOn':true\" class=\"item clickable\" ng-class=\"{'selected': file.id === currentFile.id}\" ng-click=\"currentFile.id = file.id\">\n" +
    "\t\t\t\t\t\t<div class=\"item-name text-holder\"><icon type=\"circle-o\" cname=\"circle\"></icon><icon type=\"dot-circle-o\" cname=\"dot-circle\"></icon>{{file.name}}</div>\n" +
    "\t\t\t\t\t\t<div class=\"item-meta\">\n" +
    "\t\t\t\t\t\t\t<span ng-if=\"e2e\" class=\"item-date\">{{file.auditInfo.lastUpdatedOn}}</span>\n" +
    "\t\t\t\t\t\t\t<span ng-if=\"!e2e\" class=\"item-date\">{{file.auditInfo.lastUpdatedOn | timeago}}</span>\n" +
    "\t\t\t\t\t\t\t<span class=\"item-owner\">{{file.auditInfo.lastUpdatedBy.name}}</span>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"item-description\">{{file.description}}</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"action-buttons\">\n" +
    "\t\t\t<ms-button type=\"cancel\" action=\"cancelChangeFile()\" label=\"Cancel\" data-dismiss=\"modal\"></ms-button>\n" +
    "\t\t\t<ms-button type=\"submit\" action=\"changeFile()\" label=\"Replace\" data-dismiss=\"modal\"></ms-button>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modal/scenario_create.tpl.html',
    "<div class=\"header\">\n" +
    "\t<h4 class=\"title\">Create a Scenario</h4>\n" +
    "</div>\n" +
    "<div class=\"body\">\n" +
    "\t<div class=\"content\">\n" +
    "\t\t<form class=\"main-content scenario-create\" name=\"ScenarioCreate\" id=\"ScenarioCreate\" novalidate>\n" +
    "\t\t\t<div class=\"inputGroup\" ng-show=\"showFields\">\n" +
    "\t\t\t\t<label>Enter Scenario Name\n" +
    "\t\t\t\t\t<input type=\"text\" focus placeholder=\"Enter Scenario Name\" required ng-maxlength=\"{{inputRestrictions.maximumCharacterLimit}}\" ng-minlength=\"{{inputRestrictions.minimumCharacterLimit}}\" ng-pattern='inputRestrictions.characterRestrictions' validator=\"isScenarioTitleUnique\" error-type=\"isUnique\" ng-model=\"scenario.title\" data-ms-id=\"ScenarioCreate.inputName\"/>\n" +
    "\t\t\t\t\t<div class=\"alert alert-danger\" ng-show=\"ScenarioCreate.$error.isUnique\" role=\"alert\">\n" +
    "\t\t\t\t\t\tThe scenario name &quot;{{scenario.title}}&quot; has been taken. Please choose another name.\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</label>\n" +
    "\t\t\t\t<label>Enter Description (Optional)\n" +
    "\t\t\t\t\t<input class=\"description\" type=\"text\" placeholder=\"Enter Scenario description (optional)\" ng-model=\"scenario.description\" ng-maxlength=\"1024\" data-ms-id=\"ScenarioCreate.inputDescription\">\n" +
    "\t\t\t\t</label>\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<div class=\"baseGroup\">\n" +
    "\t\t\t\t<label for=\"baseScenario\" ng-click=\"showBaseScenario()\" data-ms-id=\"ScenarioCreate.inputBaseScenario\">Base Scenario\n" +
    "\t\t\t\t\t<input type=\"text\" class=\"clickable\" id=\"baseScenario\" ng-model=\"scenario.referenceScenario.name\" readonly>\n" +
    "\t\t\t\t\t<icon type=\"folder-open-o\" cname=\"open\"></icon>\n" +
    "\t\t\t\t</label>\n" +
    "\n" +
    "\t\t\t\t<!-- Begin hidden group -->\n" +
    "\t\t\t\t<div class=\"radios\" ng-show=\"!showFields\">\n" +
    "\t\t\t\t\t<div class='search-box'>\n" +
    "\t\t\t\t\t\t<icon type=\"search\"></icon>\n" +
    "\t\t\t\t\t\t<input type=\"text\" id=\"search\" placeholder=\"Search by Name\" ng-model=\"searchText\"/>\n" +
    "\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t<accordion close-others=\"false\">\n" +
    "\t\t\t\t\t\t<accordion-group is-open=\"true\">\n" +
    "\t\t\t\t\t\t\t<accordion-heading>{{masterProject.title}}</accordion-heading>\n" +
    "\t\t\t\t\t\t\t<div class=\"row\" ng-click=\"setScenario(masterProjectReferenceScenario)\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"col-md-1\">\n" +
    "\t\t\t\t\t\t\t\t\t<span><icon type=\"check-circle\" cname=\"ok-sign\" ng-show=\"showRow(masterProjectReferenceScenario)\"></icon></span>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"col-md-11\">\n" +
    "\t\t\t\t\t\t\t\t\t<span>{{masterProjectReferenceScenario.title}}</span>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</accordion-group>\n" +
    "\t\t\t\t\t\t<accordion-group ng-repeat=\"scenarios in scenarioList | filterProjects : searchText\">\n" +
    "\t\t\t\t\t\t\t<accordion-heading>{{scenarios.title}} Project</accordion-heading>\n" +
    "\t\t\t\t\t\t\t<div ng-repeat=\"scenario in scenarios.data\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"row\" ng-click=\"setScenario(scenario)\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"col-md-1\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<span ng-show=\"showRow(scenario)\"><icon type=\"check-circle\" cname=\"ok-sign\"></icon></span>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"col-md-11\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<span class=\"clickable\" data-ms-id=\"scenario-title\">{{scenario.title}}</span>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</accordion-group>\n" +
    "\t\t\t\t\t</accordion>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<!-- End hidden group -->\n" +
    "\t\t\t</div>\n" +
    "\t\t</form>\n" +
    "\t</div>\n" +
    "\t<div class=\"action-buttons\" ng-show=\"showFields\">\n" +
    "\t\t<ms-button type=\"cancel\" action=\"close()\" label=\"Cancel\" data-ms-id=\"ScenarioCreate.cancel\"></ms-button>\n" +
    "\t\t<ms-button type=\"submit\" action=\"submit(scenario)\" label=\"Select\" ng-disabled=\"ScenarioCreate.$invalid || ScenarioCreate.$pristine || !scenarioList\" data-ms-id=\"ScenarioCreate.submit\"></ms-button>\n" +
    "\t\t<span ng-hide=\"scenarioList\" class=\"loaderHolder\">\n" +
    "\t\t\t<span class=\"loading\"></span>Loading scenarios\n" +
    "\t\t</span>\n" +
    "\t</div>\n" +
    "\t<div class=\"action-buttons\" ng-hide=\"showFields\">\n" +
    "\t\t<ms-button type=\"cancel\" action=\"cancel()\" label=\"Cancel\" data-ms-id=\"ScenarioCreate.cancelBaseScenario\"></ms-button>\n" +
    "\t\t<ms-button type=\"submit\" action=\"confirm()\" label=\"Continue\" data-ms-id=\"ScenarioCreate.confirmBaseScenario\"></ms-button>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/modal/simple_input.tpl.html',
    "<div data-ms-id=\"simpleModal\">\n" +
    "\t<div class=\"header\">\n" +
    "\t\t<h4 class=\"title\">{{modalProperties.title}}</h4>\n" +
    "\t</div>\n" +
    "\t<div class=\"body\" ui-keypress=\"{13: 'submit(item.title, $event)'}\">\n" +
    "\t\t<div class=\"content\">\n" +
    "\t\t\t<form class=\"main-content\" name=\"nameDialog\" novalidate role=\"form\">\n" +
    "\t\t\t\t<div class=\"form-group input-group-lg\" ng-class=\"{true: 'has-error'}[nameDialog.username.$dirty && nameDialog.username.$invalid]\">\n" +
    "\t\t\t\t\t<label class=\"control-label\" for=\"inputField\">{{modalProperties.field}}:\n" +
    "\t\t\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"inputField\" ng-model=\"item.title\" focus required ng-maxlength=\"{{inputRestrictions.maximumCharacterLimit}}\" ng-minlength=\"{{inputRestrictions.minimumCharacterLimit}}\" ng-pattern='inputRestrictions.characterRestrictions'/>\n" +
    "\t\t\t\t\t</label>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</form>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"action-buttons\">\n" +
    "\t\t\t<ms-button type=\"cancel\" action=\"close($event)\" label=\"Cancel\"></ms-button>\n" +
    "\t\t\t<ms-button type=\"submit\" action=\"submit(item.title)\" label=\"{{modalProperties.button}}\" ui-keypress=\"{13: 'submit(item.title, $event)'}\" data-ms-id=\"modalSubmit\" ng-disabled=\"nameDialog.$invalid\"></ms-button>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );

}]);
