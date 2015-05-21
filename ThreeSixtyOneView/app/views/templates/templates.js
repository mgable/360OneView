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


  $templateCache.put('views/directives/dimension_filter.tpl.html',
    "<div class=\"filter-category clickable\" ng-click=\"callAction(dimension)\">\r" +
    "\n" +
    "\t<span title=\"{{getFormattedLabels(categorizedValues.label)}}\">\r" +
    "\n" +
    "\t\t<div class=\"filter-label\">\r" +
    "\n" +
    "\t\t\t{{dimension.label}}\r" +
    "\n" +
    "\t\t\t<span class=\"filter-stats\">({{categorizedValues.selected}}/{{categorizedValues.total}})</span>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t<div class=\"filter-values text-holder\" ng-show=\"allValuesSelected(categorizedValues)\">\r" +
    "\n" +
    "\t\t\t{{getFormattedLabels(categorizedValues.label)}}\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t<div class=\"filter-values text-holder\" ng-hide=\"allValuesSelected(categorizedValues)\">\r" +
    "\n" +
    "\t\t\tAll\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</span>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('views/directives/draggable_dimension.tpl.html',
    "<div class=\"draggable-item dropdown\" data-as-sortable-item ng-class=\"{locked: !!lockedDimensions[item.level.label]}\">\r" +
    "\n" +
    "\t<div data-as-sortable-item-handle>\r" +
    "\n" +
    "\t\t<span class=\"drag-handle\" title=\"Reorder\"><icon type=\"reorder\"></icon></span>\r" +
    "\n" +
    "\t\t<span class=\"dropdown-toggle clickable dimension-label\" ng-click=\"clickedItem = item.level.label\">{{item.level.label}}</span>\r" +
    "\n" +
    "\t\t<span ng-hide=\"!!lockedDimensions[item.level.label]\" class=\"action-icon clickable\" title=\"Remove\" ng-click=\"delete($index)\"><icon type=\"remove\"></icon></span>\r" +
    "\n" +
    "\t\t<span ng-show=\"!!lockedDimensions[item.level.label]\" class=\"action-icon\" title=\"This dimension cannot be removed, because a filter has been applied.\"><icon type=\"lock\"></icon></span>\r" +
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
    "\t\t<textarea ng-maxlength=\"256\" ng-model=\"item.description\" ng-class=\"{'active': isActive}\" class=\"description inputTarget\"></textarea>\r" +
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
    "\t\t<span class=\"title\">{{item.name}}</span>&nbsp;\r" +
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
    "    \t<input ng-if=\"comparisonModel\" type=\"text\" class=\"title\" ng-model=\"item.name\" required ng-maxlength=\"256\" validator=\"comparisonModel\" error-type=\"foo\" ng-minlength=\"2\" ng-pattern='inputRestrictions.characterRestrictions' tabindex=\"1\"/>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    \t<!-- no vaildator -->\r" +
    "\n" +
    "    \t<input ng-if=\"!comparisonModel\" type=\"text\" class=\"title\" ng-model=\"item.name\" required ng-maxlength=\"256\" ng-minlength=\"2\" ng-pattern='inputRestrictions.characterRestrictions' tabindex=\"1\"/>\r" +
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
    "\t<span class=\"expand-handle clickable\" ng-if=\"hasMembers()\" ng-click=\"toggleCollapse()\">\r" +
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


  $templateCache.put('views/directives/ms_kpi_dimension_card.tpl.html',
    "<div class=\"dimensionCard kpiDimensionCard\">\r" +
    "\n" +
    "    <div class=\"dimensionCheckbox\">\r" +
    "\n" +
    "        <div class=\"parent-checkbox ms-checkbox no-select\">\r" +
    "\n" +
    "            <label>\r" +
    "\n" +
    "                <input type=\"checkbox\" ms-tristates-checkbox child-list=\"allDimensionsData\" property=\"isSelected\" ng-model=\"allDimensionsData.isSelected\"><i></i><span>KPIs</span>\r" +
    "\n" +
    "            </label>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"row no-margin\">\r" +
    "\n" +
    "            <div ng-repeat=\"item in allDimensionsData | orderBy:id\">\r" +
    "\n" +
    "                <div class=\"clearfix\" ng-if=\"$index % 3 == 0\"></div>\r" +
    "\n" +
    "                <div class=\"col-md-4 children-checkbox ms-checkbox no-select\" ng-class=\"{'disabled': item.required}\">\r" +
    "\n" +
    "                    <icon type=\"lock\" class=\"pull-left ms-checkbox-lock\" ng-if=\"item.required\"></icon>\r" +
    "\n" +
    "                    <label>\r" +
    "\n" +
    "                        <input type=\"checkbox\" ng-model=\"item.isSelected\" ng-disabled=\"item.required\"><i></i><span class=\"capitalized\">{{item.label}}</span>\r" +
    "\n" +
    "                    </label>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/directives/ms_standard_dimension_card.tpl.html',
    "<div class=\"dimensionCard standardDimensionCard\" ng-class=\"{fixedHeight: templateType !== 'Action'}\">\r" +
    "\n" +
    "    <div class=\"dimensionCheckbox\">\r" +
    "\n" +
    "        <div class=\"parent-checkbox ms-checkbox no-select\" ng-class=\"{'disabled': isMeasure(dimensionSchema)}\">\r" +
    "\n" +
    "            <icon type=\"lock\" class=\"pull-left ms-checkbox-lock\" ng-if=\"isMeasure(dimensionSchema)\"></icon>\r" +
    "\n" +
    "            <label>\r" +
    "\n" +
    "                <input type=\"checkbox\" ms-tristates-checkbox child-list=\"dimensionSchema.members\" property=\"isSelected\" ng-model=\"dimensionSchema.isSelected\" ng-disabled=\"isMeasure(dimensionSchema)\"><i></i><span class=\"capitalized\">{{dimensionSchema.label}}</span>\r" +
    "\n" +
    "            </label>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"children-checkbox ms-checkbox no-select\" ng-repeat=\"item in dimensionSchema.members\" ng-if=\"templateType !== 'Action'\" ng-class=\"{'disabled': isMeasure(dimensionSchema)}\">\r" +
    "\n" +
    "            <icon type=\"lock\" class=\"pull-left ms-checkbox-lock\" ng-if=\"isMeasure(dimensionSchema)\"></icon>\r" +
    "\n" +
    "            <label>\r" +
    "\n" +
    "                <input type=\"checkbox\" ng-model=\"item.isSelected\" ng-disabled=\"isMeasure(dimensionSchema)\"><i></i><span class=\"capitalized\">{{item.label}}</span>\r" +
    "\n" +
    "            </label>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"dimensionFilter hide-overflow\" ng-if=\"dimensionSchema.isSelected\">\r" +
    "\n" +
    "        <span title=\"{{getFormattedLabel(categorizedData)}}\" ng-click=\"filtersModal(dimensionData)\">\r" +
    "\n" +
    "            <icon type=\"filter\"></icon>\r" +
    "\n" +
    "            <span>{{getFormattedLabel(categorizedData)}}</span>\r" +
    "\n" +
    "        </span>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/directives/scenario_templates_navigation.tpl.html',
    "<div class=\"scenarioTemplatesNavigation\">\r" +
    "\n" +
    "\t<div class=\"col-md-3 left-column\">\r" +
    "\n" +
    "\t\t<div class=\"product-banner {{templateType.label}}\">\r" +
    "\n" +
    "\t\t\t<div class=\"ms-logo\"></div>\r" +
    "\n" +
    "\t\t\t&nbsp;{{templateType.label}}\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t<div class=\"template-steps-header\">\r" +
    "\n" +
    "\t\t\tCreate a Scenario Template\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t<div class=\"template-steps\">\r" +
    "\n" +
    "\t\t\t<ul>\r" +
    "\n" +
    "\t\t\t\t<li ng-repeat=\"view in views\">\r" +
    "\n" +
    "\t\t\t\t\t<span class=\"currentView\" ng-if=\"isCurrentView($index)\">\r" +
    "\n" +
    "\t\t\t\t\t\t<span class=\"icon-stack\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<icon type=\"circle\"></icon>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<icon type=\"circle-o\"></icon>\r" +
    "\n" +
    "\t\t\t\t\t\t</span>\r" +
    "\n" +
    "\t\t\t\t\t\t&nbsp;{{view.label}}\r" +
    "\n" +
    "\t\t\t\t\t</span>\r" +
    "\n" +
    "\t\t\t\t\t<span ng-if=\"!isCurrentView($index)\">\r" +
    "\n" +
    "\t\t\t\t\t\t<icon ng-if=\"$index > currentViewIndex\" type=\"circle-o\"></icon>\r" +
    "\n" +
    "\t\t\t\t\t\t<icon ng-if=\"$index < currentViewIndex\" type=\"circle\"></icon>\r" +
    "\n" +
    "\t\t\t\t\t\t&nbsp;{{view.label}}\r" +
    "\n" +
    "\t\t\t\t\t</span>\r" +
    "\n" +
    "\t\t\t\t\t<div ng-if=\"!view.buttonLabel\" class=\"pipe-line\">|</div>\r" +
    "\n" +
    "\t\t\t\t</li>\r" +
    "\n" +
    "\t\t\t</ul>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\t<div class=\"col-md-9 right-column\">\r" +
    "\n" +
    "\t\t<div class=\"content-container\" ng-transclude></div>\r" +
    "\n" +
    "\t\t<div class=\"button-container\">\r" +
    "\n" +
    "\t\t\t<ms-button type=\"cancel\" label=\"Cancel\" action=\"dismiss()\"></ms-button>\r" +
    "\n" +
    "\t\t\t<span class=\"right\">\r" +
    "\n" +
    "\t\t\t\t<ms-button type=\"cancel\" label=\"Back\" action=\"backward()\" ng-disabled=\"isDisabled()\"></ms-button>\r" +
    "\n" +
    "\t\t\t\t&nbsp;\r" +
    "\n" +
    "\t\t\t\t<ms-button type=\"submit\" label=\"{{label}}\" action=\"forward()\" ng-disabled=\"isDisabled(DIRECTION)\"></ms-button>\r" +
    "\n" +
    "\t\t\t\t<span ng-show=\"!dimensionsIsLoaded\" class=\"loaderHolder\">\r" +
    "\n" +
    "\t\t\t\t\t<span class=\"loading\"></span>Loading Dimensions\r" +
    "\n" +
    "\t\t\t\t</span>\r" +
    "\n" +
    "\t\t\t</span>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/directives/sortable_columns.tpl.html',
    "<div ng-switch on=\"displayBy\" class=\"text-holder\"> \r" +
    "\n" +
    "\t<span ng-switch-when=\"Last Modified\">\r" +
    "\n" +
    "\t\t<span ng-if=\"!test\" bind-once>{{item.auditInfo.lastUpdatedOn | timeago }}</span>\r" +
    "\n" +
    "\t\t<span ng-if=\"test\">{{item.auditInfo.lastUpdatedOn}}</span>\r" +
    "\n" +
    "\t</span> \r" +
    "\n" +
    "\t<span ng-switch-when=\"Modified By\" bind-once>{{item.auditInfo.lastUpdatedBy.name}}</span> \r" +
    "\n" +
    "\t<span ng-switch-when=\"Type\" bind-once>{{item.template.type}}</span> \r" +
    "\n" +
    "\t<span ng-switch-when=\"Creator\" bind-once>{{item.auditInfo.createdBy.name}}</span> \r" +
    "\n" +
    "\t<span ng-switch-when=\"Created Date\" bind-once>\r" +
    "\n" +
    "\t\t<span ng-if=\"!test\" bind-once>{{item.auditInfo.createdOn | date: 'longDate' }}</span>\r" +
    "\n" +
    "\t\t<span ng-if=\"test\">{{item.auditInfo.createdOn}}</span>\r" +
    "\n" +
    "\t</span> \r" +
    "\n" +
    "\t<span ng-switch-default>FAIL</span> \r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/directives/sorting_options.tpl.html',
    "<div data-ms-id=\"{{id}}\" class=\"{{label | normalize}} heading\" ng-class=\"{'active': SortAndFilterService.isActive(value)}\">\r" +
    "\n" +
    "\t<a ng-click=\"sort($event, value)\" ng-bind=\"label\"></a>&nbsp;\r" +
    "\n" +
    "</div> "
  );


  $templateCache.put('views/modal/filter_selection.tpl.html',
    "<div data-ms-id=\"filterModal\">\r" +
    "\n" +
    "\t<div class=\"header\">\r" +
    "\n" +
    "\t\t<h4 class=\"title\">Filters</h4>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\t<div class=\"body\">\r" +
    "\n" +
    "\t\t<div class=\"side-menu\">\r" +
    "\n" +
    "\t\t\t<div class=\"menu-item clickable\" ng-repeat=\"dimension in getDimensions()\" ng-click=\"chooseFilter(dimension, $index, false)\" ng-class=\"{active: dimension.label == selectedFilter.dimension.label}\">\r" +
    "\n" +
    "\t\t\t\t<div>{{dimension.label}}\r" +
    "\n" +
    "\t\t\t\t\t<span>({{categorizedValue[$index].selected}}/{{categorizedValue[$index].total}})</span>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div ng-show=\"allFiltersSelected(categorizedValue[$index])\" class=\"values text-holder\" tooltip-placement=\"bottom\" tooltip=\"{{getValuesList(categorizedValue[$index])}}\">{{getValuesList(categorizedValue[$index])}}</div>\r" +
    "\n" +
    "\t\t\t\t<div ng-hide=\"allFiltersSelected(categorizedValue[$index])\" class=\"values text-holder\" tooltip-placement=\"bottom\" tooltip=\"{{getValuesList(categorizedValue[$index])}}\">All</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t<div class=\"content\">\r" +
    "\n" +
    "\t\t\t<div class=\"alert\" role=\"alert\" ng-class=\"{transparent: !noFilterSelected}\">\r" +
    "\n" +
    "\t\t\t\t<div>\r" +
    "\n" +
    "\t\t\t\t\t<icon type=\"warning\"></icon>Please select at least one item from the following filter<span ng-if=\"emptyFiltersList.length > 1\">s</span>\r" +
    "\n" +
    "\t\t\t\t\t: <span ng-repeat=\"missing in getEmptyFiltersList()\">\r" +
    "\n" +
    "\t\t\t\t\t\t<span class=\"underline clickable\" ng-click=\"chooseFilterByName(missing)\">{{missing}}</span>\r" +
    "\n" +
    "\t\t\t\t\t\t<span ng-if=\"!$last\">, </span>\r" +
    "\n" +
    "\t\t\t\t\t</span>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t<div class=\"main-content\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"toolbar\">\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"dropdown-box\">\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"dropdown\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"dropdown-toggle\" ng-class=\"{disabled: isDimensionSignleMembered(selectedFilter.dimension), clickable: !isDimensionSignleMembered(selectedFilter.dimension)}\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t{{selectedFilter.level.label}}<icon ng-if=\"selectedFilter.dimension.members.length > 1\" type=\"caret-down\"></icon>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"dropdown-menu clickable\" ms-link-group radio=\"true\" selected-item=\"{{selectedFilter.level.label}}\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div ng-repeat=\"item in selectedFilter.dimension.members\" class=\"menu-item\" ms-link=\"{{item.label}}\" ng-click=\"chooseFilter(selectedFilter.dimension, selectedDimensionIndex, $index)\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t{{item.label}}\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"search-box\" ng-show=\"selectedFilter.level\">\r" +
    "\n" +
    "\t\t\t\t\t\t<icon type=\"filter\"></icon>\r" +
    "\n" +
    "\t\t\t\t\t\t<input type=\"text\" placeholder=\"Filter List\" ng-model=\"filterSearch.label\" ng-keyup=\"searchFilters(selectedFilter.level, filterSearch)\">\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"selection-tools\">\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"dropdown\">\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"static-button clickable\" ng-hide=\"filterCount.total === 0\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"selection-toggle\" ng-show=\"filterCount.selected === 0\" ng-click=\"selectFilters(selectedFilter.dimension.label, true, true);\"><icon type=\"square-o\"></icon></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"selection-toggle blue\" ng-show=\"filterCount.selected === filterCount.total\" ng-click=\"selectFilters(selectedFilter.dimension.label, true, false);\"><icon type=\"check-square\"></icon></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"selection-toggle blue\" ng-show=\"filterCount.selected % filterCount.total > 0.01\" ng-click=\"selectFilters(selectedFilter.dimension.label, true, true);\"><icon type=\"minus-square\"></icon></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"dropdown-toggle\"><icon type=\"caret-down\"></icon></div>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"dropdown-menu\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"menu-item\" ng-click=\"selectFilters(selectedFilter.dimension.label, true, true);\">Select All Visible</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"menu-item\" ng-click=\"selectFilters(selectedFilter.dimension.label, true, false);\">Deselect All Visible</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"menu-item\" ng-click=\"selectFilters(selectedFilter.dimension.label, false, false);\">Deselect All Not Visible</div>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"stat\" ng-hide=\"filterCount.total === 0\">\r" +
    "\n" +
    "\t\t\t\t\t\t({{filterCount.selected}}/{{filterCount.total}})\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"list-box\" style=\"position: relative;\">\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"list\" ng-if=\"searchResults.members && multiLevelList()\">\r" +
    "\n" +
    "\t\t\t\t\t\t<member ng-repeat=\"member in searchResults.members | orderBy:'label'\" member=\"member\" filters=\"addedFilter\" category=\"{label: selectedFilter.dimension.label}\"  expanded=\"expanded\" expandall=\"filterSearch\" updater=\"categorizeValuesCount(index, addedFilters)\" dimensionindex=\"selectedDimensionIndex\"></member>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"list\" ng-if=\"searchResults.members && !multiLevelList()\" virtual-repeat=\"searchResults.members\" multi-level=\"multiLevelList\">\r" +
    "\n" +
    "\t\t\t\t\t\t<member ng-repeat=\"member in virtualRepeat\" member=\"member\" filters=\"addedFilter\" category=\"{label: selectedFilter.dimension.label}\"  expanded=\"expanded\" expandall=\"filterSearch\" updater=\"categorizeValuesCount(index, addedFilters)\" dimensionindex=\"selectedDimensionIndex\"></member>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t<div class=\"action-buttons\">\r" +
    "\n" +
    "\t\t\t\t<ms-button type=\"cancel\" action=\"cancel()\" label=\"Cancel\" data-dismiss=\"modal\"></ms-button>\r" +
    "\n" +
    "\t\t\t\t<ms-button type=\"submit\" action=\"submit()\" label=\"Apply\" data-dismiss=\"modal\" ng-disabled=\"noFilterSelected\"></ms-button>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/modal/ms_list_lightbox.tpl.html',
    "<div data-ms-id=\"{{testHandleName}}\">\r" +
    "\n" +
    "\t<div class=\"header\">\r" +
    "\n" +
    "\t\t<h4 class=\"title\">{{title}}</h4>\r" +
    "\n" +
    "\t\t<h3 class=\"subtitle\">{{subtitle}}</h3>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\t<div class=\"body\">\r" +
    "\n" +
    "\t\t<div class=\"content\">\r" +
    "\n" +
    "\t\t\t<div class=\"main-content\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"toolbar\">\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"dropdown-box\" ng-hide=\"isDropdownHidden\">\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"dropdown ng-hide\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"dropdown-toggle clickable\">{{elementTypeItems[currentElementType]}}<icon type=\"caret-down\"></icon></div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<ul class=\"dropdown-menu\" ms-link-group selected-item=\"{{selectedScenarioElement.id}}\" radio=\"true\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<li ng-repeat=\"item in elementTypeItems\" ng-click=\"changeElementType($index)\" class=\"menu-item\" ms-link=\"{{$index}}\">{{item}}</li>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</ul>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"search-box\" ng-hide=\"isSearchHidden\">\r" +
    "\n" +
    "\t\t\t\t\t\t<icon type=\"search\"></icon>\r" +
    "\n" +
    "\t\t\t\t\t\t<input type=\"text\" ng-model=\"searchTerm.name\" placeholder=\"Search\">\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"list-box\">\r" +
    "\n" +
    "\t\t\t\t\t<div ng-repeat=\"item in getList() | filter:searchTerm | orderBy:'auditInfo[lastUpdatedOn]':true\" class=\"item clickable\" ng-class=\"{'selected': item.id === currentItem.id}\" ng-click=\"currentItem.id = item.id\">\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"item-name text-holder\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<icon type=\"circle-o\" cname=\"circle\"></icon><icon type=\"dot-circle-o\" cname=\"dot-circle\"></icon>{{item.name}}\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"item-meta\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<span ng-if=\"e2e\" class=\"item-date\">{{item.auditInfo[dateProperty]}}</span>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<span ng-if=\"!e2e\" class=\"item-date\">{{item.auditInfo[dateProperty] | timeago}}</span>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<span class=\"item-owner\">{{item.auditInfo[ownerProperty].name}}</span>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"item-description\">{{item.description}}</div>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t<div ng-hide=\"isListLoaded\" class=\"status-message\"><icon type=\"refresh\" class=\"fa-spin\"></icon>Loading data ...</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t<div class=\"action-buttons\">\r" +
    "\n" +
    "\t\t\t<ms-button type=\"cancel\" action=\"cancel()\" label=\"{{cancelButtonLabel}}\" data-dismiss=\"modal\"></ms-button>\r" +
    "\n" +
    "\t\t\t<ms-button type=\"submit\" action=\"submit()\" label=\"{{submitButtonLabel}}\" data-dismiss=\"modal\"></ms-button>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/modal/scenario_analysis_element_copy.tpl.html',
    "<div data-ms-id=\"analysisElementCopy\">\r" +
    "\n" +
    "\t<div class=\"header\">\r" +
    "\n" +
    "\t\t<h4 class=\"title\">{{selectedScenarioElement.cubeMeta.label}}</h4>\r" +
    "\n" +
    "\t\t<h3 class=\"subtitle\">Copy &amp; Replace</h3>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\t<div class=\"body\">\r" +
    "\n" +
    "\t\t<div class=\"content\">\r" +
    "\n" +
    "\t\t\t<form name=\"elementCopy\" class=\"main-content\" novalidate>\r" +
    "\n" +
    "\t\t\t\t<div class=\"name\">\r" +
    "\n" +
    "\t\t\t\t\t<label>Name:\r" +
    "\n" +
    "\t\t\t\t\t\t<input type=\"text\" name=\"elementName\" placeholder=\"Enter Name\" ng-model=\"newElement.name\" required>\r" +
    "\n" +
    "\t\t\t\t\t</label>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"description\">\r" +
    "\n" +
    "\t\t\t\t\t<label>Description:\r" +
    "\n" +
    "\t\t\t\t\t\t<input type=\"text\" name=\"elementDescription\" placeholder=\"Enter Description\" ng-model=\"newElement.description\" required>\r" +
    "\n" +
    "\t\t\t\t\t</label>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</form>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t<div class=\"action-buttons\">\r" +
    "\n" +
    "\t\t\t<ms-button type=\"cancel\" action=\"cancel()\" label=\"Cancel\" data-dismiss=\"modal\"></ms-button>\r" +
    "\n" +
    "\t\t\t<ms-button type=\"submit\" action=\"submit()\" label=\"Replace\" data-dismiss=\"modal\" ng-disabled=\"elementCopy.$invalid\"></ms-button>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/modal/scenario_create.tpl.html',
    "<div data-ms-id=\"scenarioCreateModal\">\r" +
    "\n" +
    "\t<div class=\"header\">\r" +
    "\n" +
    "\t\t<h4 class=\"title\">Create a Scenario</h4>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\t<div class=\"body\">\r" +
    "\n" +
    "\t\t<div class=\"content\">\r" +
    "\n" +
    "\t\t\t<form class=\"main-content scenario-create\" name=\"ScenarioCreate\" id=\"ScenarioCreate\" novalidate>\r" +
    "\n" +
    "\t\t\t\t<div class=\"inputGroup\" ng-show=\"showFields\">\r" +
    "\n" +
    "\t\t\t\t\t<label>Enter Scenario Name\r" +
    "\n" +
    "\t\t\t\t\t\t<input type=\"text\" focus placeholder=\"Enter Scenario Name\" required ng-maxlength=\"256\" ng-minlength=\"2\" ng-pattern='inputRestrictions.characterRestrictions' validator=\"isScenarioTitleUnique\" error-type=\"'isNotUnique'\" ng-model=\"scenario.name\" data-ms-id=\"ScenarioCreate.inputName\"/>\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"alert alert-danger\" role=\"alert\" ng-if=\"ScenarioCreate.$invalid && ScenarioCreate.$dirty\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t{{getError(ScenarioCreate.$error)}}\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t</label>\r" +
    "\n" +
    "\t\t\t\t\t<label>Enter Description (Optional)\r" +
    "\n" +
    "\t\t\t\t\t\t<input class=\"description\" type=\"text\" placeholder=\"Enter Scenario description (optional)\" ng-model=\"scenario.description\" ng-maxlength=\"1024\" data-ms-id=\"ScenarioCreate.inputDescription\">\r" +
    "\n" +
    "\t\t\t\t\t</label>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t<div class=\"baseGroup\">\r" +
    "\n" +
    "\t\t\t\t\t<label for=\"baseScenario\" ng-click=\"showBaseScenario()\" data-ms-id=\"ScenarioCreate.inputBaseScenario\">Base Scenario\r" +
    "\n" +
    "\t\t\t\t\t\t<input type=\"text\" class=\"clickable\" id=\"baseScenario\" ng-model=\"scenario.referenceScenario.name\" readonly>\r" +
    "\n" +
    "\t\t\t\t\t\t<icon type=\"folder-open-o\" cname=\"open\"></icon>\r" +
    "\n" +
    "\t\t\t\t\t</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t\t<!-- Begin hidden group -->\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"radios\" ng-show=\"!showFields\">\r" +
    "\n" +
    "\t\t\t\t\t\t<div class='search-box'>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<icon type=\"search\"></icon>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<input type=\"text\" id=\"search\" placeholder=\"Search by Name\" ng-model=\"searchText\"/>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t\t\t<accordion close-others=\"false\">\r" +
    "\n" +
    "\t\t\t\t\t\t\r" +
    "\n" +
    "\t\t\t\t\t\t\t<accordion-group ng-repeat=\"project in scenarioList | filterProjects: searchText\" is-open=\"project.open\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<accordion-heading>{{project.name}}</accordion-heading>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"row\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-1\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t\t&nbsp;\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-6\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<span><strong>Name</strong></span>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-5\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<span><strong>Type</strong></span>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t<div ng-repeat=\"scenario in getScenarios(project, searchText)\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"row\" ng-click=\"setScenario(scenario)\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-1\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<span ng-show=\"showRow(scenario)\"><icon type=\"check-circle\" cname=\"ok-sign\"></icon></span>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-6\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<span class=\"clickable\" data-ms-id=\"scenario-title\">{{scenario.name}}</span>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-5\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<span class=\"clickable\" data-ms-id=\"scenario-type\">{{scenario.type}}</span>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t\t</accordion-group>\r" +
    "\n" +
    "\t\t\t\t\t\t</accordion>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t<!-- End hidden group -->\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</form>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t<div class=\"action-buttons\" ng-show=\"showFields\">\r" +
    "\n" +
    "\t\t\t<ms-button type=\"cancel\" action=\"close()\" label=\"Cancel\" data-ms-id=\"ScenarioCreate.cancel\"></ms-button>\r" +
    "\n" +
    "\t\t\t<ms-button type=\"submit\" action=\"submit(scenario)\" label=\"Continue\" ng-disabled=\"ScenarioCreate.$invalid || ScenarioCreate.$pristine || !scenarioList\" data-ms-id=\"ScenarioCreate.submit\"></ms-button>\r" +
    "\n" +
    "\t\t\t<span ng-show=\"loadingScenarios\" class=\"loaderHolder\">\r" +
    "\n" +
    "\t\t\t\t<span class=\"loading\"></span>Loading scenarios\r" +
    "\n" +
    "\t\t\t</span>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t<div class=\"action-buttons\" ng-hide=\"showFields\">\r" +
    "\n" +
    "\t\t\t<ms-button type=\"cancel\" action=\"cancel()\" label=\"Cancel\" data-ms-id=\"ScenarioCreate.cancelBaseScenario\"></ms-button>\r" +
    "\n" +
    "\t\t\t<ms-button type=\"submit\" action=\"confirm()\" label=\"Select\" data-ms-id=\"ScenarioCreate.confirmBaseScenario\"></ms-button>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/modal/scenario_templates.tpl.html',
    "<div class=\"scenarioTemplates row\">\r" +
    "\n" +
    "\t<flipbook workflow={{CONFIG.view.ScenarioTemplates.workflow}} type=\"{{templateType.label}}\" template-url=\"views/directives/scenario_templates_navigation.tpl.html\" basePath=\"views/includes/scenario_templates\" submit-callback=\"submit\" cancel-callback=\"cancel\" enable-next=\"{{enableNext}}\">\r" +
    "\n" +
    "\t\t\t<ng-include src=\"url\"></ng-include>\r" +
    "\n" +
    "\t</flipbook>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('views/modal/select_module.tpl.html',
    "<div class=\"scenarioTemplates light-box\" data-ms-id=\"simpleModal\">\r" +
    "\n" +
    "\t<div class=\"header\">\r" +
    "\n" +
    "\t\tHello!\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\t<div class=\"body\">\r" +
    "\n" +
    "\t\t<div class=\"content\">\r" +
    "\n" +
    "\t\t\tWhat type of Scenario Template would you like to create?\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t<form>\r" +
    "\n" +
    "\t\t\t<ul class=\"type-buttons\">\r" +
    "\n" +
    "\t\t\t\t<li class=\"ms-{{module.name}}\" ng-repeat=\"module in modules\" ng-click=\"select(module)\">\r" +
    "\n" +
    "\t\t\t\t\t<input type=\"radio\" id=\"radio{{$index}}\" name=\"selectModule\" />\r" +
    "\n" +
    "\t\t\t\t\t<label class=\"animated fadeIn\" for=\"radio{{$index}}\">\r" +
    "\n" +
    "\t\t\t\t\t\t{{module.label}}\r" +
    "\n" +
    "\t\t\t\t\t</label>\r" +
    "\n" +
    "\t\t\t\t</li>\r" +
    "\n" +
    "\t\t\t</ul>\r" +
    "\n" +
    "\t\t</form>\r" +
    "\n" +
    "\t\t<div class=\"form-buttons\">\r" +
    "\n" +
    "\t\t\t<ms-button type=\"cancel\" action=\"close($event)\" label=\"Cancel\"></ms-button>\r" +
    "\n" +
    "\t\t\t<ms-button type=\"submit\" action=\"submit()\" label=\"START\" data-ms-id=\"modalSubmit\" ng-disabled=\"!isModuleSelected()\"></ms-button>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/modal/simple_input.tpl.html',
    "<div data-ms-id=\"simpleModal\">\r" +
    "\n" +
    "\t<div class=\"header\">\r" +
    "\n" +
    "\t\t<h4 class=\"title\">{{modalProperties.title}}</h4>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\t<div class=\"body\" ui-keypress=\"{13: 'submit(item.name, $event)'}\">\r" +
    "\n" +
    "\t\t<div class=\"content\">\r" +
    "\n" +
    "\t\t\t<form class=\"main-content\" name=\"nameDialog\" novalidate role=\"form\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"form-group input-group-lg\" ng-class=\"{'has-error': nameDialog.$invalid}\">\r" +
    "\n" +
    "\t\t\t\t\t<label class=\"control-label\" for=\"inputField\">{{modalProperties.field}}:\r" +
    "\n" +
    "\t\t\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"inputField\" ng-model=\"item.name\" focus required ng-maxlength=\"256\" ng-minlength=\"2\" ng-pattern='inputRestrictions.characterRestrictions' validator=\"validator\" error-type=\"errorType\"/>\r" +
    "\n" +
    "\t\t\t\t\t</label>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"alert alert-danger\" role=\"alert\" ng-if=\"nameDialog.$invalid && nameDialog.$dirty\">\r" +
    "\n" +
    "\t\t\t\t\t{{getError(nameDialog.$error)}}\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</form>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t<div class=\"action-buttons\">\r" +
    "\n" +
    "\t\t\t<ms-button type=\"cancel\" action=\"close($event)\" label=\"Cancel\"></ms-button>\r" +
    "\n" +
    "\t\t\t<ms-button type=\"submit\" action=\"submit(item.name)\" label=\"{{modalProperties.button}}\" ui-keypress=\"{13: 'submit(item.name, $event)'}\" data-ms-id=\"modalSubmit\" ng-disabled=\"nameDialog.$invalid\"></ms-button>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>"
  );

}]);
