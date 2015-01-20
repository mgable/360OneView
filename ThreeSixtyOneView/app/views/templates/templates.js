angular.module('ThreeSixtyOneView').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/directives/add_dimension_button.tpl.html',
    "<div class=\"dimensionAddBox dropdown\">\n" +
    "\t<div class=\"dimensionItemAdd clickable dropdown-toggle\"><icon type=\"plus-square\"></icon>Add</div>\n" +
    "\t<div ng-include src=\"'views/includes/dimensions_pop_menu.tpl.html'\" class=\"dropdown-menu\"></div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/display_actions.tpl.html',
    "<div class=\"display-actions\">\n" +
    "\n" +
    "\t<h4 class=\"filter-holder\" ng-click=\"toggle()\" data-ms-id=\"filterBy\"><span class=\"title\">{{SortAndFilterService.getSelectedLabel()}}&nbsp;(<span data-ms-id='itemCount'>{{SortAndFilterService.getCount()}}</span>)<span  class=\"filterToggle\"><icon type=\"caret-down\"></icon></span></span>\n" +
    "\n" +
    "\t\t<ul ms-link-group selected-item=\"{{CONFIG.filterMenu.items[0].label}}\" radio=\"true\" class='filterDropdown dropdownshadow title hide menu'>\n" +
    "\t\t\t<li ng-repeat=\"item in CONFIG.filterMenu.items\" class=\"header\" ms-link=\"{{item.label}}\" ng-click=\"setFilter(item.filterType, item, true)\" data-ms-id=\"{{item.label}}\">\n" +
    "\t\t\t\t <a>{{item.label}}</a>\n" +
    "\t\t\t</li>\n" +
    "\t    </ul>\n" +
    "\t</h4>\n" +
    "\n" +
    "\t<div class=\"input-holder\">\n" +
    "\t\t<icon type=\"filter\"></icon>\n" +
    "\t\t<input type=\"text\" class=\"search-input\" ng-model=\"SortAndFilterService.searchText\" ng-change=\"SortAndFilterService.filter()\" placeholder=\"Filter List\" ng-maxlength=\"1000\" />&nbsp;\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div class=\"button-holder\">\n" +
    "\t\t<button class=\"btn btn-default\" ng-click=\"create(CONFIG.displayActionsCreate)\" data-ms-id='createButton'><icon type=\"plus\"></icon>CREATE</button>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/directives/draggable_dimension.tpl.html',
    "<div class=\"dimensionItem dropdown\" data-as-sortable-item>\n" +
    "\t<div data-as-sortable-item-handle>\n" +
    "\t\t<span title=\"Reorder\"><icon type=\"reorder\"></icon></span>\n" +
    "\t\t<span class=\"dimensionItemInfo dropdown-toggle\">\n" +
    "\t\t\t<span class=\"dimensionItemName clickable\">{{item.level.label.toLowerCase()}}</span>\n" +
    "\t\t</span>\n" +
    "\t\t<span class=\"clickable\" title=\"Remove\" ng-click=\"delete($index)\"><icon type=\"remove\"></icon></span>\n" +
    "\t</div>\n" +
    "\t<div ng-include src=\"'views/includes/dimensions_pop_menu.tpl.html'\" class=\"dropdown-menu\"></div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/inline_description.tpl.html',
    "<form class=\"inlineDescription\" name=\"form\" data-ms-id=\"inlineDescription\">\n" +
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
    "<div class=\"pbFilterListCategory\" ng-class=\"{pbFilterListValue: !hasMembers()}\">\n" +
    "\t<span class=\"pbExpandHandle clickable\" ng-if=\"hasMembers()\" ng-click=\"expanded[member.label] = !expanded[member.label]\">\n" +
    "\t\t<icon type=\"caret-right\" cname=\"{{setToggleStyle(member)}}\"></icon>\n" +
    "\t</span> \n" +
    "\t<label class=\"clickable\" ng-class=\"{allSelected: isAllSelected(member)}\" ng-click=\"toggleMember(member)\">\n" +
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


  $templateCache.put('views/modal/filter_selection.tpl.html',
    "<div class=\"filter-modal-header\">\n" +
    "\t<h4 class=\"filter-modal-title\" id=\"myModalLabel\">Filters</h4>\n" +
    "</div>\n" +
    "<div class=\"filter-modal-body\">\n" +
    "\t<div class=\"pbFilterModalLinks\">\n" +
    "\t\t<div class=\"pbFilterModalLink clickable\" ng-repeat=\"cat in dimensions\" ng-click=\"chooseFilter(cat, false, false)\" ng-class=\"{active: cat.label == selectedFilter.cat.label}\">\n" +
    "\t\t\t<div>{{cat.label}}\n" +
    "\t\t\t\t<span class=\"pbFilterSize\">({{categorizeValuesCount($index, addedFilter[cat.label]).selected}}/{{categorizedValue[$index].total}})</span>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div ng-show=\"categorizedValue[$index].selected < categorizedValue[$index].total\" class=\"pbFilterModalValues\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"{{categorizedValue[$index].label.join(', ')}}\">{{categorizedValue[$index].label.join(', ')}}</div>\n" +
    "\t\t\t<div ng-hide=\"categorizedValue[$index].selected < categorizedValue[$index].total\" class=\"pbFilterModalValues\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"{{categorizedValue[$index].label.join(', ')}}\">All</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"pbFilterModalMain\">\n" +
    "\t\t<div class=\"pbFilterModalAlert\" role=\"alert\" ng-class=\"{pbHideAlert: !noFilterSelected}\">\n" +
    "\t\t\t<div><icon type=\"warning\"></icon>Plaese select at least one item from the following filter<span ng-if=\"emptyFiltersList.length > 1\">s</span>: <span ng-repeat=\"missing in emptyFiltersList\"><span class=\"underline clickable\" ng-click=\"chooseFilterByName(missing)\">{{missing}}</span><span ng-if=\"!$last\">, </span></span></div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"pbFilterModalContent\">\n" +
    "\t\t\t<div class=\"pbFilterModalHeader\">\n" +
    "\t\t\t\t<div class=\"pbFilterTitleArea\">\n" +
    "\t\t\t\t\t<div class=\"pbFilterDropDownContainer\">\n" +
    "\t\t\t\t\t\t<div class=\"pbFilterViewTitle clickable dropdown\">\n" +
    "\t\t\t\t\t\t\t<div class=\"dropdown-toggle\">\n" +
    "\t\t\t\t\t\t\t\t{{selectedFilter.selFil.label.toLowerCase()}}<icon type=\"caret-down\"></icon>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"pbFilterViewDrop dropdown-menu\" ms-link-group radio=\"true\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"pbFilterViewDropVisible\">\n" +
    "\t\t\t\t\t\t\t\t\t<div ng-repeat=\"item in selectedFilter.cat.members\" class=\"clickable\" ng-click=\"chooseFilter(selectedFilter.cat, false, $index)\">{{item.label.toLowerCase()}}</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"pbFilterSearch\" ng-show=\"selectedFilter.selFil\">\n" +
    "\t\t\t\t\t<icon type=\"filter\"></icon>\n" +
    "\t\t\t\t\t<input class=\"pbFilterSearchInput\" type=\"text\" placeholder=\"Filter List\" ng-model=\"filterSearch.label\"  ng-keyup=\"searchFilters(selectedFilter.selFil, filterSearch)\">\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"pbFilterCustomSelection dropdown\" ng-hide=\"filterCount.total === 0\">\n" +
    "\t\t\t\t<div class=\"pbFilterSelectionButton\" ng-class=\"{active: filterPopup}\">\n" +
    "\t\t\t\t\t<div class=\"pbFilterSelectAll clickable\" ng-show=\"filterCount.selected === 0\" ng-click=\"selectFilters(selectedFilter.cat.label, true, true);\"><icon type=\"circle-o\"></icon></div>\n" +
    "\t\t\t\t\t<div class=\"pbFilterSelectAll clickable blue\" ng-show=\"filterCount.selected === filterCount.total\" ng-click=\"selectFilters(selectedFilter.cat.label, true, false);\"><icon type=\"check-circle\"></icon></div>\n" +
    "\t\t\t\t\t<div class=\"pbFilterSelectAll clickable\" ng-show=\"filterCount.selected % filterCount.total > 0.01\" ng-click=\"selectFilters(selectedFilter.cat.label, true, true);\"><icon type=\"minus-circle\"></icon></div>\n" +
    "\t\t\t\t\t<div class=\"pbFilterSelectDrop clickable dropdown-toggle\" ng-click=\"filterPopup = !filterPopup\"><icon type=\"caret-down\"></icon></div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"pFilterDrop dropdown-menu\" ms-link-group radio=\"true\">\n" +
    "\t\t\t\t\t<div class=\"pbFilterDropVisible\">\n" +
    "\t\t\t\t\t\t<div class=\"clickable\" ng-click=\"selectFilters(selectedFilter.cat.label, true, true);\">Select All Visible</div>\n" +
    "\t\t\t\t\t\t<div class=\"clickable\" ng-click=\"selectFilters(selectedFilter.cat.label, true, false);\">Deselect All Visible</div>\n" +
    "\t\t\t\t\t\t<div class=\"clickable\" ng-click=\"selectFilters(selectedFilter.cat.label, false, false);\">Deselect All Not Visible</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"pbFilterNumberSelected\">\n" +
    "\t\t\t\t({{countFilters(searchResults, addedFilter).selected}}/{{countFilters(searchResults, addedFilter).total}})\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"pbModalHeight\" ng-style=\"{height: (windowHeight - 270) + 'px'}\">\n" +
    "\t\t\t\t<div class=\"pbFilterList\" ng-if=\"searchResults.members\">\n" +
    "\t\t\t\t\t<member ng-repeat=\"member in searchResults.members | orderBy:'label'\" member=\"member\" filters=\"addedFilter\" category=\"{label: selectedFilter.cat.label}\"  expanded=\"expanded\" expandall=\"filterSearch\"></member>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"pbFilterModalButtons\">\n" +
    "\t\t\t<button type=\"button\" class=\"btn filterCancelButton\" data-dismiss=\"modal\" ng-click=\"cancelChangeFilter();\">CANCEL</button>\n" +
    "\t\t\t<button type=\"button\" class=\"btn filterApplyButton\" data-dismiss=\"modal\" ng-click=\"changeFilter()\" ng-disabled=\"noFilterSelected\">APPLY</button>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modal/pivot_builder_all_views.tpl.html',
    "<div class=\"all-views-modal-header\">\n" +
    "\t<h4 class=\"element-file-modal-title\" id=\"myModalLabel\">{{selectedScenarioElement.cubeMeta.label}}</h4>\n" +
    "\t<h3>Select A View</h3>\n" +
    "</div>\n" +
    "<div class=\"all-views-modal-body\">\n" +
    "\t<div class=\"all-views-box\">\n" +
    "\t\t<div class=\"all-views-toolbar\">\n" +
    "\t\t\t<div class=\"views-type-dropdown\">\n" +
    "\t\t\t\t<div class=\"dropdown\">\n" +
    "\t\t\t\t\t<div class=\"dropdown-toggle\">{{elementTypeItems[currentElementType]}}<icon type=\"caret-down\"></icon></div>\n" +
    "\t\t\t\t\t<ul class=\"dropdown-menu\" ms-link-group selected-item=\"{{selectedScenarioElement.id}}\" radio=\"true\">\n" +
    "\t\t\t            <li ng-repeat=\"item in elementTypeItems\" ms-link=\"{{$index}}\"><a href=\"\" ng-click=\"changeElementType($index)\">{{item}}</a></li>\n" +
    "\t\t\t        </ul>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"view-name-search\">\n" +
    "\t\t\t\t<div class=\"search-box\">\n" +
    "\t\t\t\t\t<icon type=\"search\"></icon>\n" +
    "\t\t\t\t\t<input type=\"text\" ng-model=\"searchTerm.name\" placeholder=\"Search\">\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"all-views-list\">\n" +
    "\t\t\t<div ng-repeat=\"view in viewsList | filter:searchTerm | orderBy:'auditInfo.lastUpdatedOn':true\" class=\"all-views-item\" ng-class=\"{'current-view': view.id === selectedView.id}\" ng-click=\"selectedView.id = view.id\">\n" +
    "\t\t\t\t<div class=\"all-views-name\"><icon type=\"circle-o\"></icon><icon type=\"dot-circle-o\"></icon>{{view.name}}</div>\n" +
    "\t\t\t\t<div class=\"all-views-info\">\n" +
    "\t\t\t\t\t<span ng-if=\"e2e\" class=\"all-views-date\">{{view.auditInfo.createdOn}}</span>\n" +
    "\t\t\t\t\t<span ng-if=\"!e2e\" class=\"all-views-date\">{{view.auditInfo.createdOn | timeago}}</span>\n" +
    "\t\t\t\t\t<span class=\"all-views-owner\">{{view.auditInfo.createdBy.name}}</span>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"all-views-buttons\">\n" +
    "\t\t<button type=\"button\" class=\"btn cancel-button\" data-dismiss=\"modal\" ng-click=\"cancelChangeView();\">CANCEL</button>\n" +
    "\t\t<button type=\"button\" class=\"btn apply-button\" data-dismiss=\"modal\" ng-click=\"changeView()\">REPLACE</button>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modal/scenario_analysis_element_copy.tpl.html',
    "<div class=\"element-copy-modal-header\">\n" +
    "\t<h4 class=\"element-copy-modal-title\" id=\"myModalLabel\">{{selectedScenarioElement.cubeMeta.label}}</h4>\n" +
    "\t<h3>Copy &amp; Replace</h3>\n" +
    "</div>\n" +
    "<div class=\"element-copy-modal-body\">\n" +
    "\t<form name=\"elementCopy\" class=\"element-copy-form\" novalidate>\n" +
    "\t\t<div class=\"element-copy-name\">\n" +
    "\t\t\t<label>\n" +
    "\t\t\t\t<span class=\"element-copy-label\">Name:</span>\n" +
    "\t\t\t\t<input type=\"text\" name=\"elementName\" placeholder=\"Enter Name\" ng-model=\"newElement.name\" required>\n" +
    "\t\t\t</label>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"element-copy-description\">\n" +
    "\t\t\t<label>\n" +
    "\t\t\t\t<span class=\"element-copy-label\">Description:</span>\n" +
    "\t\t\t\t<input type=\"text\" name=\"elementDescription\" placeholder=\"Enter Description\" ng-model=\"newElement.description\" required>\n" +
    "\t\t\t</label>\n" +
    "\t\t</div>\n" +
    "\t</form>\n" +
    "\t<div class=\"element-copy-buttons\">\n" +
    "\t\t<button type=\"button\" class=\"btn cancel-button\" data-dismiss=\"modal\" ng-click=\"cancelCopyFile();\">CANCEL</button>\n" +
    "\t\t<button type=\"button\" class=\"btn apply-button\" data-dismiss=\"modal\" ng-click=\"copyFile()\" ng-disabled=\"elementCopy.$invalid\">REPLACE</button>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modal/scenario_analysis_element_files.tpl.html',
    "<div class=\"element-file-modal-header\">\n" +
    "\t<h4 class=\"element-file-modal-title\" id=\"myModalLabel\">{{selectedScenarioElement.cubeMeta.label}}</h4>\n" +
    "\t<h3>Select A New File</h3>\n" +
    "</div>\n" +
    "<div class=\"element-file-modal-body\">\n" +
    "\t<div class=\"element-file-box\">\n" +
    "\t\t<div class=\"element-file-toolbar\">\n" +
    "\t\t\t<div class=\"file-type-dropdown\">\n" +
    "\t\t\t\t<div class=\"dropdown\">\n" +
    "\t\t\t\t\t<div class=\"dropdown-toggle\">{{elementTypeItems[currentElementType]}}<icon type=\"caret-down\"></icon></div>\n" +
    "\t\t\t\t\t<ul class=\"dropdown-menu\" ms-link-group selected-item=\"{{selectedScenarioElement.id}}\" radio=\"true\">\n" +
    "\t\t\t            <li ng-repeat=\"item in elementTypeItems\" ms-link=\"{{$index}}\"><a href=\"\" ng-click=\"changeElementType($index)\">{{item}}</a></li>\n" +
    "\t\t\t        </ul>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"file-name-search\">\n" +
    "\t\t\t\t<div class=\"search-box\">\n" +
    "\t\t\t\t\t<icon type=\"search\"></icon>\n" +
    "\t\t\t\t\t<input type=\"text\" ng-model=\"searchTerm.name\" placeholder=\"Search\">\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"element-file-list\">\n" +
    "\t\t\t<div ng-repeat=\"file in fileList | filter:searchTerm | orderBy:'auditInfo.lastUpdatedOn':true\" class=\"element-file-item\" ng-class=\"{'current-file': file.id === currentFile.id}\" ng-click=\"currentFile.id = file.id\">\n" +
    "\t\t\t\t<div class=\"element-file-name\"><icon type=\"circle-o\"></icon><icon type=\"dot-circle-o\"></icon>{{file.name}}</div>\n" +
    "\t\t\t\t<div class=\"element-file-info\">\n" +
    "\t\t\t\t\t<span ng-if=\"e2e\" class=\"element-file-date\">{{file.auditInfo.lastUpdatedOn}}</span>\n" +
    "\t\t\t\t\t<span ng-if=\"!e2e\" class=\"element-file-date\">{{file.auditInfo.lastUpdatedOn | timeago}}</span>\n" +
    "\t\t\t\t\t<span class=\"element-file-owner\">{{file.auditInfo.lastUpdatedBy.name}}</span>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"element-file-description\">{{file.description}}</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"element-file-buttons\">\n" +
    "\t\t<button type=\"button\" class=\"btn cancel-button\" data-dismiss=\"modal\" ng-click=\"cancelChangeFile();\">CANCEL</button>\n" +
    "\t\t<button type=\"button\" class=\"btn apply-button\" data-dismiss=\"modal\" ng-click=\"changeFile()\">REPLACE</button>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modal/scenario_create.tpl.html',
    "<form name=\"ScenarioCreate\" id=\"ScenarioCreate\">\n" +
    "\t<div class=\"scenario-create\">\n" +
    "\t\t<div class=\"details scenario-form\">\n" +
    "\t\t\t<h3>Create a Scenario</h3>\n" +
    "\t\t\t<div class=\"inputGroup\" ng-show=\"showFields\">\n" +
    "\t\t\t\t<label>Enter Scenario Name\n" +
    "\t\t\t\t<input type=\"text\" focus placeholder=\"Enter Scenario Name\" required ng-maxlength=\"{{inputRestrictions.maximumCharacterLimit}}\" ng-minlength=\"{{inputRestrictions.minimumCharacterLimit}}\" ng-pattern='inputRestrictions.characterRestrictions' validator=\"isScenarioTitleUnique\" error-type=\"isUnique\" ng-model=\"scenario.title\" data-ms-id=\"ScenarioCreate.inputName\"/>\n" +
    "\t\t\t\t<div class=\"alert alert-danger\" ng-show=\"ScenarioCreate.$error.isUnique\" role=\"alert\">The scenario name &quot;{{scenario.title}}&quot; has been taken. Please choose another name.</div></label>\n" +
    "\t\t\t\t<label>Enter Description (Optional)\n" +
    "\t\t\t\t<input class=\"description\" type=\"text\" placeholder=\"Enter Scenario description (optional)\" ng-model=\"scenario.description\" ng-maxlength=\"1024\" data-ms-id=\"ScenarioCreate.inputDescription\"></label>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"baseGroup\">\n" +
    "\t\t\t\t<label for=\"baseScenario\" ng-click=\"showBaseScenario()\" data-ms-id=\"ScenarioCreate.inputBaseScenario\">Base Scenario\n" +
    "\t\t\t\t\t<input type=\"text\" id=\"baseScenario\" ng-model=\"scenario.referenceScenario.name\" readonly><icon type=\"folder-open-o\" cname=\"open\"></icon>\n" +
    "\t\t\t\t</label>\n" +
    "\t\t\t\t<div class=\"buttons\" ng-show=\"showFields\">\n" +
    "\t\t\t\t\t<button class=\"button cancel\" ng-click=\"close()\" data-ms-id=\"ScenarioCreate.cancel\">Cancel</button>\n" +
    "\t\t\t\t\t<button class=\"button submit\" ng-click=\"submit(scenario)\" ng-disabled=\"ScenarioCreate.$invalid || ScenarioCreate.$pristine || !scenarioList\" data-ms-id=\"ScenarioCreate.submit\">Continue</button><span ng-hide=\"scenarioList\" class=\"loaderHolder\"><span class=\"loading\"></span>Loading scenarios</span>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<!-- Begin hidden group -->\n" +
    "\t\t\t\t<div class=\"radios\" ng-show=\"!showFields\">\n" +
    "\t\t\t\t\t<div class='searchBack'>\n" +
    "\t\t\t\t\t\t<icon type=\"search\"></icon>\n" +
    "\t\t\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"search\" placeholder=\"Search by Name\" ng-model=\"searchText\"/>\n" +
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
    "\t\t\t\t\t\t\t\t\t\t<span class=\"scenario-title\">{{scenario.title}}</span>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</accordion-group>\n" +
    "\t\t\t\t\t</accordion>\n" +
    "\n" +
    "\t\t\t\t\t<div class=\"base-scenario\" >\n" +
    "\t\t\t\t\t\t<button class=\"confirmRadio\" ng-click=\"confirm()\" data-ms-id=\"ScenarioCreate.confirmBaseScenario\">Confirm Base Scenario</button>\n" +
    "\t\t\t\t\t\t<button ng-click=\"cancel()\" data-ms-id=\"ScenarioCreate.cancelBaseScenario\">Cancel</button>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t<!-- End hidden group -->\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</form>"
  );


  $templateCache.put('views/modal/simple_input.tpl.html',
    "<div data-ms-id=\"simpleModal\">\n" +
    "\t<div class=\"modal-header\">\n" +
    "\t\t<h4 class=\"modal-title\">{{modalProperties.title}}&nbsp;</h4>\n" +
    "\t</div>\n" +
    "\t<div class=\"modal-body\">\n" +
    "\t\t<form name=\"nameDialog\" novalidate role=\"form\">\n" +
    "\t\t\t<div class=\"form-group input-group-lg\" ng-class=\"{true: 'has-error'}[nameDialog.username.$dirty && nameDialog.username.$invalid]\">\n" +
    "\t\t\t\t<label class=\"control-label\" for=\"inputField\">{{modalProperties.field}}:&nbsp;</label>\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"inputField\" ng-model=\"item.title\" focus required ng-maxlength=\"{{inputRestrictions.maximumCharacterLimit}}\" ng-minlength=\"{{inputRestrictions.minimumCharacterLimit}}\" ng-pattern='inputRestrictions.characterRestrictions'/>\n" +
    "\t\t\t</div>\n" +
    "\t\t</form>\n" +
    "\t</div>\n" +
    "\t<div class=\"modal-footer\">\n" +
    "\t\t<button type=\"button\" ng-disabled=\"nameDialog.$invalid\" class=\"btn btn-primary submit\" ng-click=\"submit(item.title)\" ui-keypress=\"{13: 'submit(item.title, $event)'}\" data-ms-id=\"modalSubmit\">{{modalProperties.button}}</button>\n" +
    "\t\t<button type=\"button\" class=\"btn btn-default cancel\" ng-click=\"close($event)\">Cancel</button>\n" +
    "\t</div>\n" +
    "</div>"
  );

}]);
