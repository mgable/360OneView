angular.module('ThreeSixtyOneView').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/directives/add_dimension_button.tpl.html',
    "<div class=\"pbAddBox\">\n" +
    "\t<div class=\"pbItemAdd clickable\" ng-click=\"toggleMenu()\"><icon type=\"plus-square\"></icon> Add</div>\n" +
    "\t<div ng-include src=\"'views/includes/pop_menu.tpl.html'\"></div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/display_actions.tpl.html',
    "<div class=\"display-actions\">\n" +
    "\n" +
    "\t<h4 class=\"filter-holder\" ng-click=\"toggle()\" ><span class=\"title\">{{SortAndFilterService.getSelectedLabel()}}&nbsp;(<span data-ms-id='dataCount'>{{SortAndFilterService.getCount()}}</span>)<span  class=\"filterToggle\"><icon type=\"caret-down\"></icon></span></span>\n" +
    "\n" +
    "\t\t<ul ms-link-group selected-item=\"{{CONFIG.filterMenu.items[0].label}}\" radio=\"true\" class='filterDropdown dropdownshadow title hide menu'>\n" +
    "\t\t\t<li ng-repeat=\"item in CONFIG.filterMenu.items\" class=\"header\" ms-link=\"{{item.label}}\">\n" +
    "\t\t\t\t <a  ng-click=\"setFilter(item.filterType, item, true)\">{{item.label}}</a>\n" +
    "\t\t\t</li>\n" +
    "\t    </ul>\n" +
    "\t</h4>\n" +
    "\n" +
    "\t<div class=\"input-holder\">\n" +
    "\t\t<icon type=\"filter\"></icon>\n" +
    "\t\t<input type=\"text\" class=\"search-input\" ng-model=\"SortAndFilterService.searchText\" ng-change=\"SortAndFilterService.filter()\" placeholder=\"Filter List\"/>&nbsp;\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div class=\"button-holder\">\n" +
    "\t\t<button class=\"btn btn-default\" ng-click=\"create(CONFIG.displayActionsCreate)\" data-ms-id='createButton'><icon type=\"plus\"></icon>CREATE</button>\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/directives/draggable_dimension.tpl.html',
    "<div class=\"pbItem\" data-as-sortable-item>\n" +
    "\t<div data-as-sortable-item-handle>\n" +
    "\t\t<span title=\"Reorder\"><icon type=\"reorder\"></icon></span>\n" +
    "\t\t<span class=\"pbItemInfo\">\n" +
    "\t\t\t<span class=\"pbItemName clickable\" ng-click=\"toggleMenu()\">{{name}}</span>\n" +
    "\t\t</span>\n" +
    "\t\t<span class=\"clickable\" title=\"Remove\"><icon type=\"remove\"></icon></span>\n" +
    "\t</div>\n" +
    "\t<div ng-include src=\"'views/includes/pop_menu.tpl.html'\"></div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/inline_description.tpl.html',
    "<form class=\"inlineDescription\" name=\"inlineDescription\">\n" +
    "\t<span class='field-label'>Description</span>\n" +
    "\t<a ng-hide=\"isActive\" class='edit' ng-click=\"action()\" data-ms-id=\"inlineEdit\"><icon  type=\"pencil\"></icon></a>\n" +
    "\n" +
    "\t<span ng-show=\"isActive\" class=\"controls\"><button ng-click=\"submit(item)\" data-ms-id=\"inlineEditSubmit\" ng-disabled=\"(inlineDescription.$dirty && inlineDescription.$invalid) || inlineDescription.$pristine\"><icon type=\"check\"></icon></button>&nbsp;<button ng-click=\"cancel()\" data-ms-id=\"inlineEditCancel\"><icon type=\"times\"></icon></button></span>\n" +
    "\n" +
    "\t<div ng-class=\"{'description':item.description, 'noDescription': !item.description}\" ng-show=\"!isActive\" data-ms-id=\"inlineEditField\">{{item.description}}</div>\n" +
    "\n" +
    "\t<textarea ng-show=\"isActive\" ng-maxlength=\"256\" ng-pattern='/^[^\\\\\\/\\?\\:\\*\"><|]+$/' ng-model=\"item.description\" ng-class=\"{'active': isActive}\" class=\"description inputTarget\"></textarea>\n" +
    "</form>"
  );


  $templateCache.put('views/directives/inline_rename.tpl.html',
    "<form class=\"inlineRename\" name=\"rename\" novalidate role=\"form\">\n" +
    "\t<span ng-transclude></span>\n" +
    "\n" +
    "\t<h4 class=\"title\" ng-if=\"!test\" data-ms-id='inlineRenameField' ng-hide=\"isActive\">{{item.title | limitTo: 29}}{{item.title.length > 29 ? ' ...':''}}</h4>\n" +
    "\n" +
    "\t<h4 class=\"title\" ng-if=\"test\" data-ms-id='inlineRenameField' ng-hide=\"isActive\">{{item.title}}</h4>\n" +
    "\n" +
    "\t&nbsp;\n" +
    "\t<a class=\"edit\" ng-click=\"action()\" data-ms-id='inlineRename'><icon ng-hide=\"isActive\" type=\"pencil\" cname=\"pencil clearfix\"></icon></a>\n" +
    "    <h4 ng-show=\"isActive\" class=\"title\">\n" +
    "    \t<input type=\"text\" class=\"inputTarget\" ng-model=\"item.title\" required ng-maxlength=\"256\" ng-minlength=\"2\" ng-pattern='inputRestrictions.characterRestrictions' tabindex=\"1\" />&nbsp;\n" +
    "    \t<button ng-click=\"submit(item)\" data-ms-id=\"inlineSubmit\" ng-disabled=\"(rename.$dirty && rename.$invalid) || rename.$pristine\"><icon type=\"check\"></icon></button>&nbsp;\n" +
    "    \t<button ng-click=\"cancel()\" data-ms-id=\"inlineCancel\"><icon type=\"times\"></icon></button>\n" +
    "    </h4>\n" +
    "</form>"
  );


  $templateCache.put('views/directives/member.tpl.html',
    "<div class=\"pbFilterListCategory\" ng-class=\"{pbFilterListValue: !hasMembers()}\">\n" +
    "\t<span class=\"pbExpandHandle clickable\" ng-if=\"hasMembers()\" ng-click=\"expanded[member.label] = !expanded[member.label]\">\n" +
    "\t\t<icon type=\"caret-right\" cname=\"{{setToggleStyle(member)}}\"></icon>\n" +
    "\t</span> \n" +
    "\t<label class=\"clickable\" ng-class=\"{allSelected: isAllSelected(member)}\" ng-click=\"toggleMember(member)\">\n" +
    "\t\t<span ng-switch=\"determineStyle(member)\">\n" +
    "\t\t\t<span ng-switch-when=\"1\"> <!-- all selected -->\n" +
    "\t\t\t\t<icon type=\"check-circle\"></icon>\n" +
    "\t\t\t</span>\n" +
    "\t\t\t<span ng-switch-when=\"0\"> <!-- not selected -->\n" +
    "\t\t\t\t<icon type=\"circle-o\"></icon>\n" +
    "\t\t\t</span>\n" +
    "\t\t\t<span ng-switch-default> <!-- indeterminent -->\n" +
    "\t\t\t\t<icon type=\"minus-circle\"></icon>\n" +
    "\t\t\t</span> \n" +
    "\t\t</span>\n" +
    "\t\t<span>{{member.label}}</span> \n" +
    "\t\t<span ng-if=\"hasMembers()\">({{outputSelectedOverTotal(member)}})</span>\n" +
    "\t</label>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/ms_dropdown.tpl.html',
    "<div class=\"ms-dropdown\" id=\"{{id}}\"> \n" +
    "\t<h6 class=\"ms-label\" ng-class=\"{active: DropdownService.isActive(id)}\" data-ms-id=\"label_{{id}}\">\n" +
    "\t\t<span ng-click=\"select(selectedItem)\" data-ms-id=\"select_{{id}}\" class=\"status select\">{{selectedItem.label}}</span>&nbsp;<span class=\"toggle\" ng-click=\"toggle()\" data-ms-id=\"toggle_{{id}}\"><icon type=\"caret-down\"></icon></span></h6> \n" +
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
    "<div data-ms-id=\"name-label\" class=\"{{label}} heading\" ng-class=\"{'active': SortAndFilterService.isActive(label)}\">\n" +
    "\t<a ng-click=\"sort($event, label)\" ng-bind=\"display\" data-ms-id=\"{{id}}\"></a>&nbsp;\n" +
    "</div> "
  );


  $templateCache.put('views/modal/filter_selection.tpl.html',
    "<div class=\"filter-modal-header\" resize>\n" +
    "\t<h4 class=\"filter-modal-title\" id=\"myModalLabel\">Filters</h4>\n" +
    "</div>\n" +
    "<div class=\"filter-modal-body\">\n" +
    "\t<div class=\"pbFilterModalLinks\">\n" +
    "\t\t<div class=\"pbFilterModalLink clickable\" ng-repeat=\"cat in dimensions\" ng-click=\"chooseFilter(cat, false, false)\" ng-class=\"{active: cat.label == selectedFilter.cat.label}\">\n" +
    "\t\t\t<div>{{cat.label}}\n" +
    "\t\t\t\t<span class=\"pbFilterSize\">({{categorizeValues($index, addedFilter[cat.label]).selected}}/{{categorizeValues($index, addedFilter[cat.label]).total}})</span>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div ng-show=\"categorizeValues($index, addedFilter[cat.label]).selected<categorizeValues($index, addedFilter[cat.label]).total\" class=\"pbFilterModalValues\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"{{categorizeValues($index, addedFilter[cat.label]).label.join(', ')}}\">{{categorizeValues($index, addedFilter[cat.label]).label.join(', ')}}</div>\n" +
    "\t\t\t<div ng-hide=\"categorizeValues($index, addedFilter[cat.label]).selected<categorizeValues($index, addedFilter[cat.label]).total\" class=\"pbFilterModalValues\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"{{categorizeValues($index, addedFilter[cat.label]).label.join(', ')}}\">All</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"pbFilterModalMain\">\n" +
    "\t\t<div class=\"pbFilterModalAlert\" role=\"alert\" ng-class=\"{pbHideAlert: !noFilterSelected}\">\n" +
    "\t\t\t<div><icon type=\"warning\"></icon> Plaese select at least one item from the following filter<span ng-if=\"emptyFiltersList.length > 1\">s</span>: <span ng-repeat=\"missing in emptyFiltersList\"><span class=\"underline clickable\" ng-click=\"chooseFilterByName(missing)\">{{missing}}</span><span ng-if=\"!$last\">, </span></span></div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"pbFilterModalContent\">\n" +
    "\t\t\t<div class=\"pbFilterModalHeader\">\n" +
    "\t\t\t\t<div class=\"pbFilterTitleArea\">\n" +
    "\t\t\t\t\t<div class=\"pbFilterTitle\" ng-mouseleave=\"filterViewDrop = false;\">\n" +
    "\t\t\t\t\t\t<div class=\"pbFilterDropDownContainer\">\n" +
    "\t\t\t\t\t\t\t<div class=\"pbFilterViewTitle clickable\" ng-click=\"filterViewDrop = !filterViewDrop\">\n" +
    "\t\t\t\t\t\t\t\t{{selectedFilter.selFil.label}} \n" +
    "\t\t\t\t\t\t\t\t<icon type=\"caret-down\"></icon>\n" +
    "\t\t\t\t\t\t\t\t<div class=\"pbFilterViewDrop\" ng-show=\"filterViewDrop\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"pbFilterViewDropVisible\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div ng-repeat=\"item in selectedFilter.cat.members\" class=\"clickable\" ng-click=\"filterViewDrop = false; chooseFilter(selectedFilter.cat, false, $index)\">{{item.label}}</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
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
    "\t\t\t<div class=\"pbFilterCustomSelection\" ng-mouseleave=\"filterPopup = false\" ng-hide=\"filterCount.total === 0\">\n" +
    "\t\t\t\t<div class=\"pbFilterSelectionButton\" ng-class=\"{active: filterPopup}\">\n" +
    "\t\t\t\t\t<div class=\"pbFilterSelectAll clickable\" ng-show=\"filterCount.selected === 0\" ng-click=\"selectFilters(selectedFilter.cat.label, true, true);\"><icon type=\"circle-o\"></icon></div>\n" +
    "\t\t\t\t\t<div class=\"pbFilterSelectAll clickable blue\" ng-show=\"filterCount.selected === filterCount.total\" ng-click=\"selectFilters(selectedFilter.cat.label, true, false);\"><icon type=\"check-circle\"></icon></div>\n" +
    "\t\t\t\t\t<div class=\"pbFilterSelectAll clickable\" ng-show=\"filterCount.selected % filterCount.total > 0.01\" ng-click=\"selectFilters(selectedFilter.cat.label, true, true);\"><icon type=\"minus-circle\"></icon></div>\n" +
    "\t\t\t\t\t<div class=\"pbFilterSelectDrop clickable\" ng-click=\"filterPopup = !filterPopup\"><icon type=\"caret-down\"></icon></div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"pFilterDrop\" ng-show=\"filterPopup\">\n" +
    "\t\t\t\t\t<div class=\"pbFilterDropVisible\">\n" +
    "\t\t\t\t\t\t<div class=\"clickable\" ng-click=\"filterPopup = false; selectFilters(selectedFilter.cat.label, true, true);\">Select All Visible</div>\n" +
    "\t\t\t\t\t\t<div class=\"clickable\" ng-click=\"filterPopup = false; selectFilters(selectedFilter.cat.label, true, false);\">Deselect All Visible</div>\n" +
    "\t\t\t\t\t\t<div class=\"clickable\" ng-click=\"filterPopup = false; selectFilters(selectedFilter.cat.label, false, false);\">Deselect All Not Visible</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"pbFilterNumberSelected\">\n" +
    "\t\t\t\t({{countFilters(searchResults, addedFilter).selected}}/{{countFilters(searchResults, addedFilter).total}})\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"pbModalHeight\" ng-style=\"{height: (windowHeight - 250) + 'px'}\">\n" +
    "\t\t\t\t<div class=\"pbFilterList\" ng-if=\"searchResults.members\">\n" +
    "\t\t\t\t\t<member ng-repeat=\"member in searchResults.members | orderBy:'label'\" member=\"member\" filters=\"addedFilter\" category=\"{label: selectedFilter.cat.label}\"  expanded=\"expanded\" expandall=\"filterSearch\"></member>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"pbFilterModalButtons\">\n" +
    "\t\t\t<button type=\"button\" class=\"btn filterCancelButton\" data-dismiss=\"modal\" ng-click=\"cancelChangeFilter();\">Cancel</button>\n" +
    "\t\t\t<button type=\"button\" class=\"btn filterApplyButton\" data-dismiss=\"modal\" ng-click=\"changeFilter()\" ng-disabled=\"noFilterSelected\">APPLY</button>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modal/scenario_create.tpl.html',
    "<form name=\"ScenarioCreate\" id=\"ScenarioCreate\">\n" +
    "\t<div class=\"scenario-create\">\n" +
    "\t\t<div class=\"details scenario-form\">\n" +
    "\t\t\t\t<h3>Create a Scenario</h3>\n" +
    "\t\t\t\t<div class=\"inputGroup\" ng-show=\"showFields\">\n" +
    "\t\t\t\t\t<label>Enter Scenario Name\n" +
    "\t\t\t\t\t<input type=\"text\" focus placeholder=\"Enter Scenario Name\" required ng-maxlength=\"{{inputRestrictions.maximumCharacterLimit}}\" ng-minlength=\"{{inputRestrictions.minimumCharacterLimit}}\" ng-pattern='inputRestrictions.characterRestrictions' is-unique=\"isScenarioTitleUnique\" ng-model=\"scenario.title\" data-ms-id=\"ScenarioCreate.inputName\"/>\n" +
    "\t\t\t\t\t<div class=\"alert alert-danger\" ng-show=\"ScenarioCreate.$error.isUnique\" role=\"alert\">The scenario name &quot;{{scenario.title}}&quot; has been taken. Please choose another name.</div></label>\n" +
    "\t\t\t\t\t<label>Enter Description (Optional)\n" +
    "\t\t\t\t\t<input class=\"description\" type=\"text\" placeholder=\"Enter Scenario description (optional)\" ng-model=\"scenario.description\" ng-maxlength=\"1024\" data-ms-id=\"ScenarioCreate.inputDescription\"></label>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"baseGroup\">\n" +
    "\t\t\t\t\t<label for=\"baseScenario\" ng-click=\"showBaseScenario()\" data-ms-id=\"ScenarioCreate.inputBaseScenario\">Base Scenario\n" +
    "\t\t\t\t\t\t<input type=\"text\" id=\"baseScenario\" ng-model=\"scenario.referenceScenario.name\"><icon type=\"folder-open-o\" cname=\"open\"></icon>\n" +
    "\t\t\t\t\t</label>\n" +
    "\t\t\t\t\t<div class=\"buttons\" ng-show=\"showFields\">\n" +
    "\t\t\t\t\t\t<input type=\"submit\" value=\"CONTINUE\" class=\"button\" ng-click=\"submit(scenario)\" ng-disabled=\"ScenarioCreate.$invalid || ScenarioCreate.$pristine\" data-ms-id=\"ScenarioCreate.submit\">\n" +
    "\t\t\t\t\t\t<button id=\"cancel\" class=\"button\" ng-click=\"close()\" data-ms-id=\"ScenarioCreate.cancel\">Cancel</button>\n" +
    "\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t<!-- Begin hidden group -->\n" +
    "\t\t\t\t\t<div class=\"radios\" ng-show=\"!showFields\">\n" +
    "\t\t\t\t\t\t<div class='searchBack'>\n" +
    "\t\t\t\t\t\t\t<icon type=\"search\"></icon>\n" +
    "\t\t\t\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"search\" placeholder=\"Search by Name\" ng-model=\"searchText\"/>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t<table class=\"table table-hover table-bordered no-margin\" >\n" +
    "\t\t\t\t\t\t\t<thead>\n" +
    "\t\t\t\t\t\t\t\t<th class=\"col-lg-6\">{{masterProject.title}}</th>\n" +
    "\t\t\t\t\t\t\t</thead>\n" +
    "\t\t\t\t\t\t\t<tbody>\n" +
    "\t\t\t\t\t\t\t\t<tr>\n" +
    "\t\t\t\t\t\t\t\t\t<td>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"row\" >\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-1\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<span><icon type=\"check-circle\" cname=\"ok-sign\" ng-show=\"showRow(masterProject)\"></icon></span>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-11\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<span>{{masterProject.data[0].title}}</span>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t</td>\n" +
    "\t\t\t\t\t\t\t\t</tr>\n" +
    "\t\t\t\t\t\t\t</tbody>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<thead ng-repeat-start=\"scenarios in scenarioList | filterBaseScenarios : searchText\">\n" +
    "\t\t\t\t\t\t\t\t<th class=\"col-lg-6\" data-align=\"left\">{{scenarios.title}} Project</th>\n" +
    "\t\t\t\t\t\t\t</thead>\n" +
    "\t\t\t\t\t\t\t<tbody ng-repeat-end>\n" +
    "\t\t\t\t\t\t\t\t<tr ng-repeat=\"scenario in scenarios.data\">\n" +
    "\t\t\t\t\t\t\t\t\t<td ng-click=\"setScenario(scenario)\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"row\" >\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-1\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<span ng-show=\"showRow(scenario)\"><icon type=\"check-circle\" cname=\"ok-sign\"></icon></span>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-11\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t\t<span class=\"{{scenario.type}}\">{{scenario.title}}</span>\n" +
    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t</td>\n" +
    "\t\t\t\t\t\t\t\t</tr>\n" +
    "\t\t\t\t\t\t\t</tbody>\n" +
    "\t\t\t\t\t\t</table>\n" +
    "\t\t\t\t\t\t<div class=\"base-scenario\" >\n" +
    "\t\t\t\t\t\t\t<button class=\"confirmRadio\" ng-click=\"confirm()\" data-ms-id=\"ScenarioCreate.confirmBaseScenario\">Confirm Base Scenario</button>\n" +
    "\t\t\t\t\t\t\t<button class=\"button\" ng-click=\"cancel()\" data-ms-id=\"ScenarioCreate.cancelBaseScenario\">Cancel</button>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t<!-- End hidden group -->\n" +
    "\t\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</form>"
  );


  $templateCache.put('views/modal/simple_input.tpl.html',
    "<div class=\"modal-header\" ui-keypress=\"{'esc': 'close($event)'}\">\n" +
    "\t<h4 class=\"modal-title\"><icon type=\"{{modalProperties.icon}}\"></icon>&nbsp;{{modalProperties.title}}&nbsp;</h4>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "\t<form name=\"nameDialog\" novalidate role=\"form\">\n" +
    "\t\t<div class=\"form-group input-group-lg\" ng-class=\"{true: 'has-error'}[nameDialog.username.$dirty && nameDialog.username.$invalid]\">\n" +
    "\t\t\t<label class=\"control-label\" for=\"inputField\">{{modalProperties.field}}:&nbsp;</label>\n" +
    "\t\t\t<input type=\"text\" class=\"form-control\" id=\"inputField\" ng-model=\"item.title\" focus required ng-maxlength=\"{{inputRestrictions.maximumCharacterLimit}}\" ng-minlength=\"{{inputRestrictions.minimumCharacterLimit}}\" ng-pattern='inputRestrictions.characterRestrictions' data-ms-id=\"modalInput\" />\n" +
    "\t\t</div>\n" +
    "\t</form>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "\t<button type=\"button\" ng-disabled=\"nameDialog.$invalid\" class=\"btn btn-primary\" ng-click=\"submit(item.title)\" ui-keypress=\"{13: 'submit(item.title, $event)'}\" data-ms-id=\"submit\">{{modalProperties.button}}</button>\n" +
    "\t<button type=\"button\" class=\"btn btn-default\" ng-click=\"close($event)\" data-ms-id=\"cancel\">Cancel</button>\n" +
    "</div>"
  );

}]);
