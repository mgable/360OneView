angular.module('ThreeSixtyOneView').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/directives/add_dimension_button.tpl.html',
    "<div class=\"pbAddBox dropdown\">\r" +
    "\n" +
    "\t<div class=\"pbItemAdd clickable dropdown-toggle\" ng-click=\"toggleMenu()\"><icon type=\"plus-square\"></icon>Add</div>\r" +
    "\n" +
    "\t<div ng-include src=\"'views/includes/pop_menu.tpl.html'\" class=\"dropdown-menu\" ms-link-group radio=\"true\"></div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/directives/display_actions.tpl.html',
    "<div class=\"display-actions\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t<h4 class=\"filter-holder\" ng-click=\"toggle()\" ><span class=\"title\">{{SortAndFilterService.getSelectedLabel()}}&nbsp;(<span data-ms-id='dataCount'>{{SortAndFilterService.getCount()}}</span>)<span  class=\"filterToggle\"><icon type=\"caret-down\"></icon></span></span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t<ul ms-link-group selected-item=\"{{CONFIG.filterMenu.items[0].label}}\" radio=\"true\" class='filterDropdown dropdownshadow title hide menu'>\r" +
    "\n" +
    "\t\t\t<li ng-repeat=\"item in CONFIG.filterMenu.items\" class=\"header\" ms-link=\"{{item.label}}\">\r" +
    "\n" +
    "\t\t\t\t <a  ng-click=\"setFilter(item.filterType, item, true)\">{{item.label}}</a>\r" +
    "\n" +
    "\t\t\t</li>\r" +
    "\n" +
    "\t    </ul>\r" +
    "\n" +
    "\t</h4>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t<div class=\"input-holder\">\r" +
    "\n" +
    "\t\t<icon type=\"filter\"></icon>\r" +
    "\n" +
    "\t\t<input type=\"text\" class=\"search-input\" ng-model=\"SortAndFilterService.searchText\" ng-change=\"SortAndFilterService.filter()\" placeholder=\"Filter List\"/>&nbsp;\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t<div class=\"button-holder\">\r" +
    "\n" +
    "\t\t<button class=\"btn btn-default\" ng-click=\"create(CONFIG.displayActionsCreate)\" data-ms-id='createButton'><icon type=\"plus\"></icon>CREATE</button>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('views/directives/draggable_dimension.tpl.html',
    "<div class=\"pbItem dropdown\" data-as-sortable-item>\r" +
    "\n" +
    "\t<div data-as-sortable-item-handle class=\"\">\r" +
    "\n" +
    "\t\t<span title=\"Reorder\"><icon type=\"reorder\"></icon></span>\r" +
    "\n" +
    "\t\t<span class=\"pbItemInfo dropdown-toggle\">\r" +
    "\n" +
    "\t\t\t<span class=\"pbItemName clickable\" ng-click=\"toggleMenu()\">{{item.level.label.toLowerCase()}}</span>\r" +
    "\n" +
    "\t\t</span>\r" +
    "\n" +
    "\t\t<span class=\"clickable\" title=\"Remove\" ng-click=\"delete($index)\"><icon type=\"remove\"></icon></span>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\t<div ng-include src=\"'views/includes/pop_menu.tpl.html'\" class=\"dropdown-menu\" ms-link-group radio=\"true\"></div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/directives/inline_description.tpl.html',
    "<form class=\"inlineDescription\" name=\"inlineDescription\">\r" +
    "\n" +
    "\t<span class='field-label'>Description</span>\r" +
    "\n" +
    "\t<a ng-hide=\"isActive\" class='edit' ng-click=\"action()\" data-ms-id=\"inlineEdit\"><icon  type=\"pencil\"></icon></a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t<span ng-show=\"isActive\" class=\"controls\"><button ng-click=\"submit(item)\" data-ms-id=\"inlineEditSubmit\" ng-disabled=\"(inlineDescription.$dirty && inlineDescription.$invalid) || inlineDescription.$pristine\"><icon type=\"check\"></icon></button>&nbsp;<button ng-click=\"cancel()\" data-ms-id=\"inlineEditCancel\"><icon type=\"times\"></icon></button></span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t<div ng-class=\"{'description':item.description, 'noDescription': !item.description}\" ng-show=\"!isActive\" data-ms-id=\"inlineEditField\">{{item.description}}</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t<textarea ng-show=\"isActive\" ng-maxlength=\"256\" ng-pattern='/^[^\\\\\\/\\?\\:\\*\"><|]+$/' ng-model=\"item.description\" ng-class=\"{'active': isActive}\" class=\"description inputTarget\"></textarea>\r" +
    "\n" +
    "</form>"
  );


  $templateCache.put('views/directives/inline_rename.tpl.html',
    "<form class=\"inlineRename\" name=\"rename\" novalidate role=\"form\">\r" +
    "\n" +
    "\t<span ng-transclude></span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t<h4 class=\"title\" ng-if=\"!test\" data-ms-id='inlineRenameField' ng-hide=\"isActive\">{{item.title | limitTo: 29}}{{item.title.length > 29 ? ' ...':''}}</h4>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t<h4 class=\"title\" ng-if=\"test\" data-ms-id='inlineRenameField' ng-hide=\"isActive\">{{item.title}}</h4>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t&nbsp;\r" +
    "\n" +
    "\t<a class=\"edit\" ng-click=\"action()\" data-ms-id='inlineRename'><icon ng-hide=\"isActive\" type=\"pencil\" cname=\"pencil clearfix\"></icon></a>\r" +
    "\n" +
    "    <h4 ng-show=\"isActive\" class=\"title\">\r" +
    "\n" +
    "    \t<input type=\"text\" class=\"inputTarget\" ng-model=\"item.title\" required ng-maxlength=\"256\" ng-minlength=\"2\" ng-pattern='inputRestrictions.characterRestrictions' tabindex=\"1\" />&nbsp;\r" +
    "\n" +
    "    \t<button ng-click=\"submit(item)\" data-ms-id=\"inlineSubmit\" ng-disabled=\"(rename.$dirty && rename.$invalid) || rename.$pristine\"><icon type=\"check\"></icon></button>&nbsp;\r" +
    "\n" +
    "    \t<button ng-click=\"cancel()\" data-ms-id=\"inlineCancel\"><icon type=\"times\"></icon></button>\r" +
    "\n" +
    "    </h4>\r" +
    "\n" +
    "</form>"
  );


  $templateCache.put('views/directives/member.tpl.html',
    "<div class=\"pbFilterListCategory\" ng-class=\"{pbFilterListValue: !hasMembers()}\">\r" +
    "\n" +
    "\t<span class=\"pbExpandHandle clickable\" ng-if=\"hasMembers()\" ng-click=\"expanded[member.label] = !expanded[member.label]\">\r" +
    "\n" +
    "\t\t<icon type=\"caret-right\" cname=\"{{setToggleStyle(member)}}\"></icon>\r" +
    "\n" +
    "\t</span> \r" +
    "\n" +
    "\t<label class=\"clickable\" ng-class=\"{allSelected: isAllSelected(member)}\" ng-click=\"toggleMember(member)\">\r" +
    "\n" +
    "\t\t<span ng-switch=\"determineStyle(member)\">\r" +
    "\n" +
    "\t\t\t<span ng-switch-when=\"ALL_SELECTED\"> <!-- all selected -->\r" +
    "\n" +
    "\t\t\t\t<icon type=\"check-circle\"></icon>\r" +
    "\n" +
    "\t\t\t</span>\r" +
    "\n" +
    "\t\t\t<span ng-switch-when=\"NOT_SELECTED\"> <!-- not selected -->\r" +
    "\n" +
    "\t\t\t\t<icon type=\"circle-o\"></icon>\r" +
    "\n" +
    "\t\t\t</span>\r" +
    "\n" +
    "\t\t\t<span ng-switch-default> <!-- indeterminent -->\r" +
    "\n" +
    "\t\t\t\t<icon type=\"minus-circle\"></icon>\r" +
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
    "\t<h6 class=\"ms-label\" ng-class=\"{active: DropdownService.isActive(id)}\" data-ms-id=\"label_{{id}}\">\r" +
    "\n" +
    "\t\t<span ng-click=\"select(selectedItem)\" data-ms-id=\"select_{{id}}\" class=\"status select\">{{selectedItem.label}}</span>&nbsp;<span class=\"toggle\" ng-click=\"toggle()\" data-ms-id=\"toggle_{{id}}\"><icon type=\"caret-down\"></icon></span></h6> \r" +
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
    "<div data-ms-id=\"name-label\" class=\"{{label}} heading\" ng-class=\"{'active': SortAndFilterService.isActive(label)}\">\r" +
    "\n" +
    "\t<a ng-click=\"sort($event, label)\" ng-bind=\"display\" data-ms-id=\"{{id}}\"></a>&nbsp;\r" +
    "\n" +
    "</div> "
  );


  $templateCache.put('views/modal/filter_selection.tpl.html',
    "<div class=\"filter-modal-header\">\r" +
    "\n" +
    "\t<h4 class=\"filter-modal-title\" id=\"myModalLabel\">Filters</h4>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"filter-modal-body\">\r" +
    "\n" +
    "\t<div class=\"pbFilterModalLinks\">\r" +
    "\n" +
    "\t\t<div class=\"pbFilterModalLink clickable\" ng-repeat=\"cat in dimensions\" ng-click=\"chooseFilter(cat, false, false)\" ng-class=\"{active: cat.label == selectedFilter.cat.label}\">\r" +
    "\n" +
    "\t\t\t<div>{{cat.label}}\r" +
    "\n" +
    "\t\t\t\t<span class=\"pbFilterSize\">({{categorizeValuesCount($index, addedFilter[cat.label]).selected}}/{{categorizedValue[$index].total}})</span>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t<div ng-show=\"categorizedValue[$index].selected<categorizedValue[$index].total\" class=\"pbFilterModalValues\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"{{categorizedValue[$index].label.join(', ')}}\">{{categorizedValue[$index].label.join(', ')}}</div>\r" +
    "\n" +
    "\t\t\t<div ng-hide=\"categorizedValue[$index].selected<categorizedValue[$index].total\" class=\"pbFilterModalValues\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"{{categorizedValue[$index].label.join(', ')}}\">All</div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\t<div class=\"pbFilterModalMain\">\r" +
    "\n" +
    "\t\t<div class=\"pbFilterModalAlert\" role=\"alert\" ng-class=\"{pbHideAlert: !noFilterSelected}\">\r" +
    "\n" +
    "\t\t\t<div><icon type=\"warning\"></icon>Plaese select at least one item from the following filter<span ng-if=\"emptyFiltersList.length > 1\">s</span>: <span ng-repeat=\"missing in emptyFiltersList\"><span class=\"underline clickable\" ng-click=\"chooseFilterByName(missing)\">{{missing}}</span><span ng-if=\"!$last\">, </span></span></div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t<div class=\"pbFilterModalContent\">\r" +
    "\n" +
    "\t\t\t<div class=\"pbFilterModalHeader\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"pbFilterTitleArea\">\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"pbFilterDropDownContainer\">\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"pbFilterViewTitle clickable dropdown\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"dropdown-toggle\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t{{selectedFilter.selFil.label.toLowerCase()}}<icon type=\"caret-down\"></icon>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"pbFilterViewDrop dropdown-menu\" ms-link-group radio=\"true\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div class=\"pbFilterViewDropVisible\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<div ng-repeat=\"item in selectedFilter.cat.members\" class=\"clickable\" ng-click=\"chooseFilter(selectedFilter.cat, false, $index)\">{{item.label.toLowerCase()}}</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"pbFilterSearch\" ng-show=\"selectedFilter.selFil\">\r" +
    "\n" +
    "\t\t\t\t\t<icon type=\"filter\"></icon>\r" +
    "\n" +
    "\t\t\t\t\t<input class=\"pbFilterSearchInput\" type=\"text\" placeholder=\"Filter List\" ng-model=\"filterSearch.label\"  ng-keyup=\"searchFilters(selectedFilter.selFil, filterSearch)\">\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t<div class=\"pbFilterCustomSelection dropdown\" ng-hide=\"filterCount.total === 0\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"pbFilterSelectionButton\" ng-class=\"{active: filterPopup}\">\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"pbFilterSelectAll clickable\" ng-show=\"filterCount.selected === 0\" ng-click=\"selectFilters(selectedFilter.cat.label, true, true);\"><icon type=\"circle-o\"></icon></div>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"pbFilterSelectAll clickable blue\" ng-show=\"filterCount.selected === filterCount.total\" ng-click=\"selectFilters(selectedFilter.cat.label, true, false);\"><icon type=\"check-circle\"></icon></div>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"pbFilterSelectAll clickable\" ng-show=\"filterCount.selected % filterCount.total > 0.01\" ng-click=\"selectFilters(selectedFilter.cat.label, true, true);\"><icon type=\"minus-circle\"></icon></div>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"pbFilterSelectDrop clickable dropdown-toggle\" ng-click=\"filterPopup = !filterPopup\"><icon type=\"caret-down\"></icon></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"pFilterDrop dropdown-menu\" ms-link-group radio=\"true\">\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"pbFilterDropVisible\">\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"clickable\" ng-click=\"selectFilters(selectedFilter.cat.label, true, true);\">Select All Visible</div>\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"clickable\" ng-click=\"selectFilters(selectedFilter.cat.label, true, false);\">Deselect All Visible</div>\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"clickable\" ng-click=\"selectFilters(selectedFilter.cat.label, false, false);\">Deselect All Not Visible</div>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t<div class=\"pbFilterNumberSelected\">\r" +
    "\n" +
    "\t\t\t\t({{countFilters(searchResults, addedFilter).selected}}/{{countFilters(searchResults, addedFilter).total}})\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t<div class=\"pbModalHeight\" ng-style=\"{height: (windowHeight - 270) + 'px'}\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"pbFilterList\" ng-if=\"searchResults.members\">\r" +
    "\n" +
    "\t\t\t\t\t<member ng-repeat=\"member in searchResults.members | orderBy:'label'\" member=\"member\" filters=\"addedFilter\" category=\"{label: selectedFilter.cat.label}\"  expanded=\"expanded\" expandall=\"filterSearch\"></member>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t<div class=\"pbFilterModalButtons\">\r" +
    "\n" +
    "\t\t\t<button type=\"button\" class=\"btn filterCancelButton\" data-dismiss=\"modal\" ng-click=\"cancelChangeFilter();\">CANCEL</button>\r" +
    "\n" +
    "\t\t\t<button type=\"button\" class=\"btn filterApplyButton\" data-dismiss=\"modal\" ng-click=\"changeFilter()\" ng-disabled=\"noFilterSelected\">APPLY</button>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/modal/scenario_create.tpl.html',
    "<form name=\"ScenarioCreate\" id=\"ScenarioCreate\">\r" +
    "\n" +
    "\t<div class=\"scenario-create\">\r" +
    "\n" +
    "\t\t<div class=\"details scenario-form\">\r" +
    "\n" +
    "\t\t\t\t<h3>Create a Scenario</h3>\r" +
    "\n" +
    "\t\t\t\t<div class=\"inputGroup\" ng-show=\"showFields\">\r" +
    "\n" +
    "\t\t\t\t\t<label>Enter Scenario Name\r" +
    "\n" +
    "\t\t\t\t\t<input type=\"text\" focus placeholder=\"Enter Scenario Name\" required ng-maxlength=\"{{inputRestrictions.maximumCharacterLimit}}\" ng-minlength=\"{{inputRestrictions.minimumCharacterLimit}}\" ng-pattern='inputRestrictions.characterRestrictions' is-unique=\"isScenarioTitleUnique\" ng-model=\"scenario.title\" data-ms-id=\"ScenarioCreate.inputName\"/>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"alert alert-danger\" ng-show=\"ScenarioCreate.$error.isUnique\" role=\"alert\">The scenario name &quot;{{scenario.title}}&quot; has been taken. Please choose another name.</div></label>\r" +
    "\n" +
    "\t\t\t\t\t<label>Enter Description (Optional)\r" +
    "\n" +
    "\t\t\t\t\t<input class=\"description\" type=\"text\" placeholder=\"Enter Scenario description (optional)\" ng-model=\"scenario.description\" ng-maxlength=\"1024\" data-ms-id=\"ScenarioCreate.inputDescription\"></label>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"baseGroup\">\r" +
    "\n" +
    "\t\t\t\t\t<label for=\"baseScenario\" ng-click=\"showBaseScenario()\" data-ms-id=\"ScenarioCreate.inputBaseScenario\">Base Scenario\r" +
    "\n" +
    "\t\t\t\t\t\t<input type=\"text\" id=\"baseScenario\" ng-model=\"scenario.referenceScenario.name\" readonly><icon type=\"folder-open-o\" cname=\"open\"></icon>\r" +
    "\n" +
    "\t\t\t\t\t</label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"buttons\" ng-show=\"showFields\">\r" +
    "\n" +
    "\t\t\t\t\t\t<input type=\"submit\" value=\"CONTINUE\" class=\"button\" ng-click=\"submit(scenario)\" ng-disabled=\"ScenarioCreate.$invalid || ScenarioCreate.$pristine\" data-ms-id=\"ScenarioCreate.submit\">\r" +
    "\n" +
    "\t\t\t\t\t\t<button id=\"cancel\" class=\"button\" ng-click=\"close()\" data-ms-id=\"ScenarioCreate.cancel\">Cancel</button>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t\t<!-- Begin hidden group -->\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"radios\" ng-show=\"!showFields\">\r" +
    "\n" +
    "\t\t\t\t\t\t<div class='searchBack'>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<icon type=\"search\"></icon>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"search\" placeholder=\"Search by Name\" ng-model=\"searchText\"/>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t\t\t<table class=\"table table-hover table-bordered no-margin\" >\r" +
    "\n" +
    "\t\t\t\t\t\t\t<thead>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<th class=\"col-lg-6\">{{masterProject.title}}</th>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</thead>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<tbody>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<tr>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<td ng-click=\"setScenario(masterProjectReferenceScenario)\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"row\" >\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-1\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<span><icon type=\"check-circle\" cname=\"ok-sign\" ng-show=\"showRow(masterProjectReferenceScenario)\"></icon></span>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-11\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<span>{{masterProjectReferenceScenario.title}}</span>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t</td>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t</tr>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</tbody>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t\t\t\t<thead ng-repeat-start=\"scenarios in scenarioList | filterBaseScenarios : searchText\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<th class=\"col-lg-6\" data-align=\"left\">{{scenarios.title}} Project</th>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</thead>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<tbody ng-repeat-end>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<tr ng-repeat=\"scenario in scenarios.data\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<td ng-click=\"setScenario(scenario)\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"row\" >\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-1\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<span ng-show=\"showRow(scenario)\"><icon type=\"check-circle\" cname=\"ok-sign\"></icon></span>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-11\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<span class=\"{{scenario.type}}\">{{scenario.title}}</span>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t</td>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t</tr>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</tbody>\r" +
    "\n" +
    "\t\t\t\t\t\t</table>\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"base-scenario\" >\r" +
    "\n" +
    "\t\t\t\t\t\t\t<button class=\"confirmRadio\" ng-click=\"confirm()\" data-ms-id=\"ScenarioCreate.confirmBaseScenario\">Confirm Base Scenario</button>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<button class=\"button\" ng-click=\"cancel()\" data-ms-id=\"ScenarioCreate.cancelBaseScenario\">Cancel</button>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<!-- End hidden group -->\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</form>"
  );


  $templateCache.put('views/modal/simple_input.tpl.html',
    "<div class=\"modal-header\" ui-keypress=\"{'esc': 'close($event)'}\">\r" +
    "\n" +
    "\t<h4 class=\"modal-title\"><icon type=\"{{modalProperties.icon}}\"></icon>&nbsp;{{modalProperties.title}}&nbsp;</h4>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"modal-body\">\r" +
    "\n" +
    "\t<form name=\"nameDialog\" novalidate role=\"form\">\r" +
    "\n" +
    "\t\t<div class=\"form-group input-group-lg\" ng-class=\"{true: 'has-error'}[nameDialog.username.$dirty && nameDialog.username.$invalid]\">\r" +
    "\n" +
    "\t\t\t<label class=\"control-label\" for=\"inputField\">{{modalProperties.field}}:&nbsp;</label>\r" +
    "\n" +
    "\t\t\t<input type=\"text\" class=\"form-control\" id=\"inputField\" ng-model=\"item.title\" focus required ng-maxlength=\"{{inputRestrictions.maximumCharacterLimit}}\" ng-minlength=\"{{inputRestrictions.minimumCharacterLimit}}\" ng-pattern='inputRestrictions.characterRestrictions' data-ms-id=\"modalInput\" />\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</form>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"modal-footer\">\r" +
    "\n" +
    "\t<button type=\"button\" ng-disabled=\"nameDialog.$invalid\" class=\"btn btn-primary\" ng-click=\"submit(item.title)\" ui-keypress=\"{13: 'submit(item.title, $event)'}\" data-ms-id=\"submit\">{{modalProperties.button}}</button>\r" +
    "\n" +
    "\t<button type=\"button\" class=\"btn btn-default\" ng-click=\"close($event)\" data-ms-id=\"cancel\">Cancel</button>\r" +
    "\n" +
    "</div>"
  );

}]);
