angular.module('ThreeSixtyOneView').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/directives/add_dimension_button.tpl.html',
    "<div class=\" draggable-item dimension-add-button dropdown\">\r" +
    "\n" +
    "\t<div class=\"add-label clickable dropdown-toggle\"><icon type=\"plus-square\"></icon>Add</div>\r" +
    "\n" +
    "\t<div ng-include src=\"'views/includes/dimensions_pop_menu.tpl.html'\" class=\"dropdown-menu\"></div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/directives/draggable_dimension.tpl.html',
    "<div class=\"draggable-item dropdown\" data-as-sortable-item>\r" +
    "\n" +
    "\t<div data-as-sortable-item-handle>\r" +
    "\n" +
    "\t\t<span class=\"drag-handle\" title=\"Reorder\"><icon type=\"reorder\"></icon></span>\r" +
    "\n" +
    "\t\t<span class=\"dropdown-toggle clickable dimension-label\">{{item.level.label}}</span>\r" +
    "\n" +
    "\t\t<span ng-hide=\"!!lockedDimensions[item.level.label]\" class=\"action-icon clickable\" title=\"Remove\" ng-click=\"delete($index)\"><icon type=\"remove\"></icon></span>\r" +
    "\n" +
    "\t\t<span ng-show=\"!!lockedDimensions[item.level.label]\" class=\"action-icon\" title=\"This dimension cannot be removed, because a filter has been applied.\"><icon type=\"info-circle\"></icon></span>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\t<div ng-if=\"!lockedDimensions[item.level.label]\" ng-include src=\"'views/includes/dimensions_pop_menu.tpl.html'\" class=\"dropdown-menu\"></div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/directives/inline_description.tpl.html',
    "<form class=\"inlineDescription\" name=\"form\" data-ms-id=\"inlineDescription\">\r" +
    "\n" +
    "\t<ng-transclude></ng-transclude>\r" +
    "\n" +
    "\t<div>\r" +
    "\n" +
    "\t\t<span class=\"controls\" ng-show=\"isActive\">\r" +
    "\n" +
    "\t\t\t<button class=\"submit btn btn-default btn-xs\" ng-click=\"submit(item)\" ng-disabled=\"(form.$dirty && form.$invalid) || form.$pristine\"><icon type=\"check\"></icon></button>&nbsp;\r" +
    "\n" +
    "\t\t\t<button class=\"cancel btn btn-default btn-xs\" ng-click=\"cancel()\"><icon type=\"times\"></icon></button>\r" +
    "\n" +
    "\t\t</span>\r" +
    "\n" +
    "\t\t<span class='action' ng-click=\"action()\" ng-hide=\"isActive\"><icon type=\"pencil\" cname=\"icon\"></icon></span>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t<div class=\"noEdit\" ng-hide=\"isActive\">\r" +
    "\n" +
    "\t\t<div ng-class=\"{'description':item.description, 'noDescription': !item.description}\" ng-show=\"!isActive\">{{item.description}}</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t<div class=\"edit\" ng-show=\"isActive\">\r" +
    "\n" +
    "\t\t<textarea ng-maxlength=\"256\" ng-pattern='/^[^\\\\\\/\\?\\:\\*\"><|]+$/' ng-model=\"item.description\" ng-class=\"{'active': isActive}\" class=\"description inputTarget\"></textarea>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</form>"
  );


  $templateCache.put('views/directives/inline_rename.tpl.html',
    "<form class=\"inlineRename\" name=\"form\" novalidate role=\"form\" data-ms-id='inlineRename'>\r" +
    "\n" +
    "\t<span ng-transclude></span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t<span class=\"noEdit\" ng-hide=\"isActive\" ng-click=\"action()\">\r" +
    "\n" +
    "\t\t<span class=\"title\">{{item.title}}</span>&nbsp;\r" +
    "\n" +
    "\t\t<span class=\"action\"><icon type=\"pencil\" cname=\"icon\"></icon></span>\r" +
    "\n" +
    "\t</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <span class=\"edit\" ng-show=\"isActive\">\r" +
    "\n" +
    "    \t<!-- validator -->\r" +
    "\n" +
    "    \t<input ng-if=\"comparisonModel\" type=\"text\" class=\"title\" ng-model=\"item.title\" required ng-maxlength=\"256\" validator=\"comparisonModel\" error-type=\"foo\" ng-minlength=\"2\" ng-pattern='inputRestrictions.characterRestrictions' tabindex=\"1\"/>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    \t<!-- no vaildator -->\r" +
    "\n" +
    "    \t<input ng-if=\"!comparisonModel\" type=\"text\" class=\"title\" ng-model=\"item.title\" required ng-maxlength=\"256\" ng-minlength=\"2\" ng-pattern='inputRestrictions.characterRestrictions' tabindex=\"1\"/>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    \t<button class=\"submit btn btn-default btn-sm\" ng-click=\"submit(item)\" ng-disabled=\"(form.$dirty && form.$invalid) || form.$pristine\"><icon type=\"check\"></icon></button>&nbsp;\r" +
    "\n" +
    "    \t<button class=\"cancel btn btn-default btn-sm\" ng-click=\"cancel()\"><icon type=\"times\"></icon></button>\r" +
    "\n" +
    "    </span>\r" +
    "\n" +
    "</form>"
  );


  $templateCache.put('views/directives/member.tpl.html',
    "<div class=\"list-subcategory\" ng-class=\"{'list-item': !hasMembers()}\">\r" +
    "\n" +
    "\t<span class=\"expand-handle clickable\" ng-if=\"hasMembers()\" ng-click=\"expanded[member.label] = !expanded[member.label]\">\r" +
    "\n" +
    "\t\t<icon type=\"caret-right\" cname=\"{{setToggleStyle(member)}}\"></icon>\r" +
    "\n" +
    "\t</span> \r" +
    "\n" +
    "\t<label class=\"clickable\" ng-class=\"{'all-selected': isAllSelected(member)}\" ng-click=\"toggleMember(member)\">\r" +
    "\n" +
    "\t\t<span ng-switch=\"determineStyle(member)\">\r" +
    "\n" +
    "\t\t\t<span ng-switch-when=\"ALL_SELECTED\"> <!-- all selected -->\r" +
    "\n" +
    "\t\t\t\t<icon type=\"check-square\"></icon>\r" +
    "\n" +
    "\t\t\t</span>\r" +
    "\n" +
    "\t\t\t<span ng-switch-when=\"NOT_SELECTED\"> <!-- not selected -->\r" +
    "\n" +
    "\t\t\t\t<icon type=\"square-o\"></icon>\r" +
    "\n" +
    "\t\t\t</span>\r" +
    "\n" +
    "\t\t\t<span ng-switch-default> <!-- indeterminent -->\r" +
    "\n" +
    "\t\t\t\t<icon type=\"minus-square\"></icon>\r" +
    "\n" +
    "\t\t\t</span> \r" +
    "\n" +
    "\t\t</span>\r" +
    "\n" +
    "\t\t<span>{{member.label}}</span> \r" +
    "\n" +
    "\t\t<span ng-if=\"hasMembers()\">({{outputSelectedOverTotal(member)}})</span>\r" +
    "\n" +
    "\t</label>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/directives/ms_dropdown.tpl.html',
    "<div class=\"ms-dropdown\" id=\"{{id}}\"> \r" +
    "\n" +
    "\t<h6 class=\"ms-label\" ng-class=\"{active: DropdownService.isActive(id)}\" data-ms-id=\"{{id}}\">\r" +
    "\n" +
    "\t\t<span ng-click=\"select(selectedItem)\" class=\"status select\">{{selectedItem.label}}</span>&nbsp;\r" +
    "\n" +
    "\t\t<span class=\"toggle\" ng-click=\"toggle()\" data-ms-id=\"column_2SortOptions\"><icon type=\"caret-down\"></icon></span>\r" +
    "\n" +
    "\t</h6> \r" +
    "\n" +
    "\t<ul class=\"ms-select-list dropdownshadow hide\"> \r" +
    "\n" +
    "\t\t<li class=\"list-label\">Sort Order</li>\r" +
    "\n" +
    "\t\t<ul>\r" +
    "\n" +
    "\t\t\t<li class=\"ms-item selectSort\" ng-class=\"{disabled:reverse}\" ng-click=\"select(selectedItem)\" data-ms-id=\"descending\"><icon type=\"check\" cname=\"ms-ok\"></icon>Descending</li>\r" +
    "\n" +
    "\t\t\t<li class=\"ms-item selectSort\" ng-class=\"{disabled:!reverse}\" ng-click=\"select(selectedItem)\" data-ms-id=\"ascending\"><icon type=\"check\" cname=\"ms-ok\"></icon>Ascending</li>\r" +
    "\n" +
    "\t\t</ul>\r" +
    "\n" +
    "\t\t<li class=\"list-label\">Switch  Column</li>\r" +
    "\n" +
    "\t\t<ul>\r" +
    "\n" +
    "\t\t\t<li class=\"ms-item selectSort\" ng-repeat=\"item in items\" ng-class=\"{disabled:item.label === selectedItem.label}\" ng-click=\"selectSort(item)\" data-ms-id=\"{{item.label}}\"><icon type=\"check\" cname=\"ms-ok\"></icon>{{item.label}}</li>  \r" +
    "\n" +
    "\t\t</ul>\r" +
    "\n" +
    "\t</ul> \r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/directives/ms_filter_dropdown.tpl.html',
    "<div>\r" +
    "\n" +
    "\t<h4 class=\"filter-holder\" ng-click=\"toggle()\" data-ms-id=\"filterBy\"><span class=\"title\">{{SortAndFilterService.getSelectedLabel()}}&nbsp;(<span data-ms-id='itemCount'>{{SortAndFilterService.getCount()}}</span>)<span  class=\"filterToggle\"><icon type=\"caret-down\"></icon></span></span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t<ul ms-link-group selected-item=\"{{CONFIG.filterMenu.items[0].label}}\" radio=\"true\" class='filterDropdown dropdownshadow title hide menu'>\r" +
    "\n" +
    "\t\t\t<li ng-repeat=\"item in CONFIG.filterMenu.items\" class=\"header\" ms-link=\"{{item.label}}\" ng-click=\"setFilter(item.filterType, item, true)\" data-ms-id=\"{{item.label}}\">\r" +
    "\n" +
    "\t\t\t\t <a>{{item.label}}</a>\r" +
    "\n" +
    "\t\t\t</li>\r" +
    "\n" +
    "\t    </ul>\r" +
    "\n" +
    "\t</h4>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/directives/ms_filter_input.tpl.html',
    "<div class=\"input-holder\">\r" +
    "\n" +
    "\t<icon type=\"filter\"></icon>\r" +
    "\n" +
    "\t<input type=\"text\" class=\"search-input\" ng-model=\"SortAndFilterService.searchText\" ng-change=\"SortAndFilterService.filter()\" placeholder=\"Filter List\" ng-maxlength=\"1000\" />&nbsp;\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/directives/sortable_columns.tpl.html',
    "<div ng-switch on=\"displayBy\" class=\"text-holder\"> \r" +
    "\n" +
    "\t<span ng-switch-when=\"Last Modified\">\r" +
    "\n" +
    "\t\t<span ng-if=\"!test\" bind-once>{{item.modifiedOn | timeago }}</span>\r" +
    "\n" +
    "\t\t<span ng-if=\"test\">{{item.modifiedOn}}</span>\r" +
    "\n" +
    "\t</span> \r" +
    "\n" +
    "\t<span ng-switch-when=\"Modified By\" bind-once>{{item.modifiedBy}}</span> \r" +
    "\n" +
    "\t<span ng-switch-when=\"Type\" bind-once>{{item.type}}</span> \r" +
    "\n" +
    "\t<span ng-switch-when=\"Creator\" bind-once>{{item.createdBy}}</span> \r" +
    "\n" +
    "\t<span ng-switch-when=\"Created Date\" bind-once>\r" +
    "\n" +
    "\t\t<span ng-if=\"!test\" bind-once>{{item.createdOn | date: 'longDate' }}</span>\r" +
    "\n" +
    "\t\t<span ng-if=\"test\">{{item.createdOn}}</span>\r" +
    "\n" +
    "\t</span> \r" +
    "\n" +
    "\t<span ng-switch-default>FAIL</span> \r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/directives/sorting_options.tpl.html',
    "<div data-ms-id=\"{{id}}\" class=\"{{label}} heading\" ng-class=\"{'active': SortAndFilterService.isActive(label)}\">\r" +
    "\n" +
    "\t<a ng-click=\"sort($event, label)\" ng-bind=\"display\"></a>&nbsp;\r" +
    "\n" +
    "</div> "
  );


  $templateCache.put('views/modal/all_views.tpl.html',
    "<div class=\"header\">\r" +
    "\n" +
    "\t<h4 class=\"title\">{{selectedScenarioElement.cubeMeta.label}}</h4>\r" +
    "\n" +
    "\t<h3 class=\"subtitle\">Select A View</h3>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"body\">\r" +
    "\n" +
    "\t<div class=\"content\">\r" +
    "\n" +
    "\t\t<div class=\"main-content\">\r" +
    "\n" +
    "\t\t\t<div class=\"toolbar\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"dropdown-box\">\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"dropdown ng-hide\">\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"dropdown-toggle clickable\">{{elementTypeItems[currentElementType]}}<icon type=\"caret-down\"></icon></div>\r" +
    "\n" +
    "\t\t\t\t\t\t<ul class=\"dropdown-menu\" ms-link-group selected-item=\"{{selectedScenarioElement.id}}\" radio=\"true\">\r" +
    "\n" +
    "\t\t\t\t            <li ng-repeat=\"item in elementTypeItems\" ng-click=\"changeElementType($index)\" class=\"menu-item\" ms-link=\"{{$index}}\">{{item}}</li>\r" +
    "\n" +
    "\t\t\t\t        </ul>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"search-box\">\r" +
    "\n" +
    "\t\t\t\t\t<icon type=\"search\"></icon>\r" +
    "\n" +
    "\t\t\t\t\t<input type=\"text\" ng-model=\"searchTerm.name\" placeholder=\"Search\">\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t<div class=\"list-box\">\r" +
    "\n" +
    "\t\t\t\t<div ng-repeat=\"view in viewsList | filter:searchTerm | orderBy:'auditInfo.lastUpdatedOn':true\" class=\"item clickable\" ng-class=\"{'selected': view.id === selectedView.id}\" ng-click=\"selectedView.id = view.id\">\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"item-name text-holder\"><icon type=\"circle-o\" cname=\"circle\"></icon><icon type=\"dot-circle-o\" cname=\"dot-circle\"></icon>{{view.name}}</div>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"item-meta\">\r" +
    "\n" +
    "\t\t\t\t\t\t<span ng-if=\"e2e\" class=\"item-date\">{{view.auditInfo.createdOn}}</span>\r" +
    "\n" +
    "\t\t\t\t\t\t<span ng-if=\"!e2e\" class=\"item-date\">{{view.auditInfo.createdOn | timeago}}</span>\r" +
    "\n" +
    "\t\t\t\t\t\t<span class=\"item-owner\">{{view.auditInfo.createdBy.name}}</span>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\t<div class=\"action-buttons\">\r" +
    "\n" +
    "\t\t<ms-button type=\"cancel\" action=\"cancelChangeView()\" label=\"Cancel\" data-dismiss=\"modal\"></ms-button>\r" +
    "\n" +
    "\t\t<ms-button type=\"submit\" action=\"changeView()\" label=\"Replace\" data-dismiss=\"modal\"></ms-button>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/modal/filter_selection.tpl.html',
    "<div class=\"header\">\r" +
    "\n" +
    "\t<h4 class=\"title\">Filters</h4>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"body\">\r" +
    "\n" +
    "\t<div class=\"side-menu\">\r" +
    "\n" +
    "\t\t<div class=\"menu-item clickable\" ng-repeat=\"cat in dimensions\" ng-click=\"chooseFilter(cat, false, false)\" ng-class=\"{active: cat.label == selectedFilter.cat.label}\">\r" +
    "\n" +
    "\t\t\t<div>{{cat.label}}\r" +
    "\n" +
    "\t\t\t\t<span>({{categorizeValuesCount($index, addedFilter[cat.label]).selected}}/{{categorizedValue[$index].total}})</span>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t<div ng-show=\"categorizedValue[$index].selected < categorizedValue[$index].total\" class=\"values text-holder\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"{{categorizedValue[$index].label.join(', ')}}\">{{categorizedValue[$index].label.join(', ')}}</div>\r" +
    "\n" +
    "\t\t\t<div ng-hide=\"categorizedValue[$index].selected < categorizedValue[$index].total\" class=\"values text-holder\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"{{categorizedValue[$index].label.join(', ')}}\">All</div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\t<div class=\"content\">\r" +
    "\n" +
    "\t\t<div class=\"alert\" role=\"alert\" ng-class=\"{transparent: !noFilterSelected}\">\r" +
    "\n" +
    "\t\t\t<div>\r" +
    "\n" +
    "\t\t\t\t<icon type=\"warning\"></icon>Please select at least one item from the following filter<span ng-if=\"emptyFiltersList.length > 1\">s</span>\r" +
    "\n" +
    "\t\t\t\t: <span ng-repeat=\"missing in emptyFiltersList\">\r" +
    "\n" +
    "\t\t\t\t\t<span class=\"underline clickable\" ng-click=\"chooseFilterByName(missing)\">{{missing}}</span>\r" +
    "\n" +
    "\t\t\t\t\t<span ng-if=\"!$last\">, </span>\r" +
    "\n" +
    "\t\t\t\t</span>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t<div class=\"main-content\">\r" +
    "\n" +
    "\t\t\t<div class=\"toolbar\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"dropdown-box\">\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"clickable dropdown\">\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"dropdown-toggle\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t{{selectedFilter.selFil.label.toLowerCase()}}<icon type=\"caret-down\"></icon>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"dropdown-menu\" ms-link-group radio=\"true\" selected-item=\"{{selectedFilter.selFil.label}}\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div ng-repeat=\"item in selectedFilter.cat.members\" class=\"menu-item clickable\" ms-link=\"{{item.label}}\" ng-click=\"chooseFilter(selectedFilter.cat, false, $index)\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t{{item.label.toLowerCase()}}\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"search-box\" ng-show=\"selectedFilter.selFil\">\r" +
    "\n" +
    "\t\t\t\t\t<icon type=\"filter\"></icon>\r" +
    "\n" +
    "\t\t\t\t\t<input type=\"text\" placeholder=\"Filter List\" ng-model=\"filterSearch.label\" ng-keyup=\"searchFilters(selectedFilter.selFil, filterSearch)\">\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t<div class=\"selection-tools\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"dropdown\">\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"static-button\" ng-hide=\"filterCount.total === 0\">\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"selection-toggle clickable\" ng-show=\"filterCount.selected === 0\" ng-click=\"selectFilters(selectedFilter.cat.label, true, true);\"><icon type=\"square-o\"></icon></div>\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"selection-toggle clickable blue\" ng-show=\"filterCount.selected === filterCount.total\" ng-click=\"selectFilters(selectedFilter.cat.label, true, false);\"><icon type=\"check-square\"></icon></div>\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"selection-toggle clickable blue\" ng-show=\"filterCount.selected % filterCount.total > 0.01\" ng-click=\"selectFilters(selectedFilter.cat.label, true, true);\"><icon type=\"minus-square\"></icon></div>\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"clickable dropdown-toggle\"><icon type=\"caret-down\"></icon></div>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"dropdown-menu\">\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"menu-item\" ng-click=\"selectFilters(selectedFilter.cat.label, true, true);\">Select All Visible</div>\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"menu-item\" ng-click=\"selectFilters(selectedFilter.cat.label, true, false);\">Deselect All Visible</div>\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"menu-item\" ng-click=\"selectFilters(selectedFilter.cat.label, false, false);\">Deselect All Not Visible</div>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"stat\" ng-hide=\"filterCount.total === 0\">\r" +
    "\n" +
    "\t\t\t\t\t({{countFilters(searchResults, addedFilter).selected}}/{{countFilters(searchResults, addedFilter).total}})\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t<div class=\"list-box\" ng-style=\"{height: (windowHeight - 270) + 'px'}\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"list\" ng-if=\"searchResults.members\">\r" +
    "\n" +
    "\t\t\t\t\t<member ng-repeat=\"member in searchResults.members | orderBy:'label'\" member=\"member\" filters=\"addedFilter\" category=\"{label: selectedFilter.cat.label}\"  expanded=\"expanded\" expandall=\"filterSearch\"></member>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t<div class=\"action-buttons\">\r" +
    "\n" +
    "\t\t\t<ms-button type=\"cancel\" action=\"cancelChangeFilter()\" label=\"Cancel\" data-dismiss=\"modal\"></ms-button>\r" +
    "\n" +
    "\t\t\t<ms-button type=\"submit\" action=\"changeFilter()\" label=\"Apply\" data-dismiss=\"modal\" ng-disabled=\"noFilterSelected\"></ms-button>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/modal/scenario_analysis_element_copy.tpl.html',
    "<div class=\"header\">\r" +
    "\n" +
    "\t<h4 class=\"title\">{{selectedScenarioElement.cubeMeta.label}}</h4>\r" +
    "\n" +
    "\t<h3 class=\"subtitle\">Copy &amp; Replace</h3>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"body\">\r" +
    "\n" +
    "\t<div class=\"content\">\r" +
    "\n" +
    "\t\t<form name=\"elementCopy\" class=\"main-content\" novalidate>\r" +
    "\n" +
    "\t\t\t<div class=\"name\">\r" +
    "\n" +
    "\t\t\t\t<label>Name:\r" +
    "\n" +
    "\t\t\t\t\t<input type=\"text\" name=\"elementName\" placeholder=\"Enter Name\" ng-model=\"newElement.name\" required>\r" +
    "\n" +
    "\t\t\t\t</label>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t<div class=\"description\">\r" +
    "\n" +
    "\t\t\t\t<label>Description:\r" +
    "\n" +
    "\t\t\t\t\t<input type=\"text\" name=\"elementDescription\" placeholder=\"Enter Description\" ng-model=\"newElement.description\" required>\r" +
    "\n" +
    "\t\t\t\t</label>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</form>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\t<div class=\"action-buttons\">\r" +
    "\n" +
    "\t\t<ms-button type=\"cancel\" action=\"cancelCopyFile()\" label=\"Cancel\" data-dismiss=\"modal\"></ms-button>\r" +
    "\n" +
    "\t\t<ms-button type=\"submit\" action=\"copyFile()\" label=\"Replace\" data-dismiss=\"modal\" ng-disabled=\"elementCopy.$invalid\"></ms-button>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/modal/scenario_analysis_element_files.tpl.html',
    "<div class=\"header\">\r" +
    "\n" +
    "\t<h4 class=\"title\">{{selectedScenarioElement.cubeMeta.label}}</h4>\r" +
    "\n" +
    "\t<h3 class=\"subtitle\">Select A New File</h3>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"body\">\r" +
    "\n" +
    "\t<div class=\"content\">\r" +
    "\n" +
    "\t\t<div class=\"main-content\">\r" +
    "\n" +
    "\t\t\t<div class=\"toolbar\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"dropdown-box\">\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"dropdown ng-hide\">\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"dropdown-toggle clickable\">{{elementTypeItems[currentElementType]}}<icon type=\"caret-down\"></icon></div>\r" +
    "\n" +
    "\t\t\t\t\t\t<ul class=\"dropdown-menu\" ms-link-group selected-item=\"{{selectedScenarioElement.id}}\" radio=\"true\">\r" +
    "\n" +
    "\t\t\t\t            <li ng-repeat=\"item in elementTypeItems\" ng-click=\"changeElementType($index)\" class=\"menu-item\" ms-link=\"{{$index}}\">{{item}}</li>\r" +
    "\n" +
    "\t\t\t\t        </ul>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"search-box\">\r" +
    "\n" +
    "\t\t\t\t\t<icon type=\"search\"></icon>\r" +
    "\n" +
    "\t\t\t\t\t<input type=\"text\" ng-model=\"searchTerm.name\" placeholder=\"Search\">\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t<div class=\"list-box\">\r" +
    "\n" +
    "\t\t\t\t<div ng-repeat=\"file in fileList | filter:searchTerm | orderBy:'auditInfo.lastUpdatedOn':true\" class=\"item clickable\" ng-class=\"{'selected': file.id === currentFile.id}\" ng-click=\"currentFile.id = file.id\">\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"item-name text-holder\"><icon type=\"circle-o\" cname=\"circle\"></icon><icon type=\"dot-circle-o\" cname=\"dot-circle\"></icon>{{file.name}}</div>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"item-meta\">\r" +
    "\n" +
    "\t\t\t\t\t\t<span ng-if=\"e2e\" class=\"item-date\">{{file.auditInfo.lastUpdatedOn}}</span>\r" +
    "\n" +
    "\t\t\t\t\t\t<span ng-if=\"!e2e\" class=\"item-date\">{{file.auditInfo.lastUpdatedOn | timeago}}</span>\r" +
    "\n" +
    "\t\t\t\t\t\t<span class=\"item-owner\">{{file.auditInfo.lastUpdatedBy.name}}</span>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"item-description\">{{file.description}}</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\t<div class=\"action-buttons\">\r" +
    "\n" +
    "\t\t<ms-button type=\"cancel\" action=\"cancelChangeFile()\" label=\"Cancel\" data-dismiss=\"modal\"></ms-button>\r" +
    "\n" +
    "\t\t<ms-button type=\"submit\" action=\"changeFile()\" label=\"Replace\" data-dismiss=\"modal\"></ms-button>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/modal/scenario_create.tpl.html',
    "<div class=\"header\">\r" +
    "\n" +
    "\t<h4 class=\"title\">Create a Scenario</h4>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"body\">\r" +
    "\n" +
    "\t<div class=\"content\">\r" +
    "\n" +
    "\t\t<form class=\"main-content scenario-create\" name=\"ScenarioCreate\" id=\"ScenarioCreate\" novalidate>\r" +
    "\n" +
    "\t\t\t<div class=\"inputGroup\" ng-show=\"showFields\">\r" +
    "\n" +
    "\t\t\t\t<label>Enter Scenario Name\r" +
    "\n" +
    "\t\t\t\t\t<input type=\"text\" focus placeholder=\"Enter Scenario Name\" required ng-maxlength=\"{{inputRestrictions.maximumCharacterLimit}}\" ng-minlength=\"{{inputRestrictions.minimumCharacterLimit}}\" ng-pattern='inputRestrictions.characterRestrictions' validator=\"isScenarioTitleUnique\" error-type=\"isUnique\" ng-model=\"scenario.title\" data-ms-id=\"ScenarioCreate.inputName\"/>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"alert alert-danger\" ng-show=\"ScenarioCreate.$error.isUnique\" role=\"alert\">\r" +
    "\n" +
    "\t\t\t\t\t\tThe scenario name &quot;{{scenario.title}}&quot; has been taken. Please choose another name.\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</label>\r" +
    "\n" +
    "\t\t\t\t<label>Enter Description (Optional)\r" +
    "\n" +
    "\t\t\t\t\t<input class=\"description\" type=\"text\" placeholder=\"Enter Scenario description (optional)\" ng-model=\"scenario.description\" ng-maxlength=\"1024\" data-ms-id=\"ScenarioCreate.inputDescription\">\r" +
    "\n" +
    "\t\t\t\t</label>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t<div class=\"baseGroup\">\r" +
    "\n" +
    "\t\t\t\t<label for=\"baseScenario\" ng-click=\"showBaseScenario()\" data-ms-id=\"ScenarioCreate.inputBaseScenario\">Base Scenario\r" +
    "\n" +
    "\t\t\t\t\t<input type=\"text\" class=\"clickable\" id=\"baseScenario\" ng-model=\"scenario.referenceScenario.name\" readonly>\r" +
    "\n" +
    "\t\t\t\t\t<icon type=\"folder-open-o\" cname=\"open\"></icon>\r" +
    "\n" +
    "\t\t\t\t</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t<!-- Begin hidden group -->\r" +
    "\n" +
    "\t\t\t\t<div class=\"radios\" ng-show=\"!showFields\">\r" +
    "\n" +
    "\t\t\t\t\t<div class='search-box'>\r" +
    "\n" +
    "\t\t\t\t\t\t<icon type=\"search\"></icon>\r" +
    "\n" +
    "\t\t\t\t\t\t<input type=\"text\" id=\"search\" placeholder=\"Search by Name\" ng-model=\"searchText\"/>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t\t<accordion close-others=\"false\">\r" +
    "\n" +
    "\t\t\t\t\t\t<accordion-group is-open=\"true\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<accordion-heading>{{masterProject.title}}</accordion-heading>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"row\" ng-click=\"setScenario(masterProjectReferenceScenario)\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"col-md-1\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<span><icon type=\"check-circle\" cname=\"ok-sign\" ng-show=\"showRow(masterProjectReferenceScenario)\"></icon></span>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"col-md-11\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<span>{{masterProjectReferenceScenario.title}}</span>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t</accordion-group>\r" +
    "\n" +
    "\t\t\t\t\t\t<accordion-group ng-repeat=\"scenarios in scenarioList | filterProjects : searchText\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<accordion-heading>{{scenarios.title}} Project</accordion-heading>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div ng-repeat=\"scenario in scenarios.data\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"row\" ng-click=\"setScenario(scenario)\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"col-md-1\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t<span ng-show=\"showRow(scenario)\"><icon type=\"check-circle\" cname=\"ok-sign\"></icon></span>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"col-md-11\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t<span class=\"clickable\">{{scenario.title}}</span>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t</accordion-group>\r" +
    "\n" +
    "\t\t\t\t\t</accordion>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<!-- End hidden group -->\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</form>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\t<div class=\"action-buttons\" ng-show=\"showFields\">\r" +
    "\n" +
    "\t\t<ms-button type=\"cancel\" action=\"close()\" label=\"Cancel\" data-ms-id=\"ScenarioCreate.cancel\"></ms-button>\r" +
    "\n" +
    "\t\t<ms-button type=\"submit\" action=\"submit(scenario)\" label=\"Continue\" ng-disabled=\"ScenarioCreate.$invalid || ScenarioCreate.$pristine || !scenarioList\" data-ms-id=\"ScenarioCreate.submit\"></ms-button>\r" +
    "\n" +
    "\t\t<span ng-hide=\"scenarioList\" class=\"loaderHolder\">\r" +
    "\n" +
    "\t\t\t<span class=\"loading\"></span>Loading scenarios\r" +
    "\n" +
    "\t\t</span>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\t<div class=\"action-buttons\" ng-hide=\"showFields\">\r" +
    "\n" +
    "\t\t<ms-button type=\"cancel\" action=\"cancel()\" label=\"Cancel\" data-ms-id=\"ScenarioCreate.cancelBaseScenario\"></ms-button>\r" +
    "\n" +
    "\t\t<ms-button type=\"submit\" action=\"confirm()\" label=\"Continue\" data-ms-id=\"ScenarioCreate.confirmBaseScenario\"></ms-button>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('views/modal/simple_input.tpl.html',
    "<div class=\"header\">\r" +
    "\n" +
    "\t<h4 class=\"title\">{{modalProperties.title}}</h4>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"body\" ui-keypress=\"{13: 'submit(item.title, $event)'}\">\r" +
    "\n" +
    "\t<div class=\"content\">\r" +
    "\n" +
    "\t\t<form class=\"main-content\" name=\"nameDialog\" novalidate role=\"form\">\r" +
    "\n" +
    "\t\t\t<div class=\"form-group input-group-lg\" ng-class=\"{true: 'has-error'}[nameDialog.username.$dirty && nameDialog.username.$invalid]\">\r" +
    "\n" +
    "\t\t\t\t<label class=\"control-label\" for=\"inputField\">{{modalProperties.field}}:\r" +
    "\n" +
    "\t\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"inputField\" ng-model=\"item.title\" focus required ng-maxlength=\"{{inputRestrictions.maximumCharacterLimit}}\" ng-minlength=\"{{inputRestrictions.minimumCharacterLimit}}\" ng-pattern='inputRestrictions.characterRestrictions'/>\r" +
    "\n" +
    "\t\t\t\t</label>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</form>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\t<div class=\"action-buttons\">\r" +
    "\n" +
    "\t\t<ms-button type=\"cancel\" action=\"close($event)\" label=\"Cancel\"></ms-button>\r" +
    "\n" +
    "\t\t<ms-button type=\"submit\" action=\"submit(item.title)\" label=\"{{modalProperties.button}}\" ui-keypress=\"{13: 'submit(item.title, $event)'}\" data-ms-id=\"modalSubmit\" ng-disabled=\"nameDialog.$invalid\"></ms-button>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>"
  );

}]);
