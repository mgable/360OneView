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
    "\t\t\t<span class=\"filter-stats\">({{categorizedValues.selected}}/{{categorizedValues.total}}):</span>\n" +
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


  $templateCache.put('views/directives/dimension_filter_list.tpl.html',
    "<div class=\"filter-category-list clickable\" ng-click=\"callAction(dimension)\">\n" +
    "\t<span title=\"{{getFormattedLabels(categorizedValues.label)}}\">\n" +
    "\t\t<div class=\"filter-label\">\n" +
    "\t\t\t{{dimension.label}}\n" +
    "\t\t\t<span class=\"filter-stats\">({{categorizedValues.selected}}/{{categorizedValues.total}}):</span>\n" +
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
    "\t\t<span ng-show=\"!!lockedDimensions[item.level.label]\" class=\"action-icon\" title=\"This dimension cannot be removed, because a filter has been applied.\"><icon type=\"lock\"></icon></span>\n" +
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
    "\t\t<textarea ng-maxlength=\"256\" ng-model=\"item.description\" ng-class=\"{'active': isActive}\" class=\"description inputTarget\"></textarea>\n" +
    "\t</div>\n" +
    "</form>"
  );


  $templateCache.put('views/directives/inline_rename.tpl.html',
    "<form class=\"inlineRename\" name=\"form\" novalidate role=\"form\" data-ms-id='inlineRename'>\n" +
    "\t<span ng-transclude></span>\n" +
    "\n" +
    "\t<span class=\"noEdit\" ng-hide=\"isActive\" ng-click=\"action()\">\n" +
    "\t\t<span class=\"title\">{{item.name}}</span>&nbsp;\n" +
    "\t\t<span class=\"action\"><icon type=\"pencil\" cname=\"icon\"></icon></span>\n" +
    "\t</span>\n" +
    "\n" +
    "    <span class=\"edit\" ng-show=\"isActive\">\n" +
    "    \t<!-- validator -->\n" +
    "    \t<input ng-if=\"comparisonModel\" type=\"text\" class=\"title\" ng-model=\"item.name\" required ng-maxlength=\"256\" validator=\"comparisonModel\" error-type=\"foo\" ng-minlength=\"2\" ng-pattern='inputRestrictions.characterRestrictions' tabindex=\"1\"/>\n" +
    "\n" +
    "    \t<!-- no vaildator -->\n" +
    "    \t<input ng-if=\"!comparisonModel\" type=\"text\" class=\"title\" ng-model=\"item.name\" required ng-maxlength=\"256\" ng-minlength=\"2\" ng-pattern='inputRestrictions.characterRestrictions' tabindex=\"1\"/>\n" +
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
    "<div class=\"ms-dropdown\" id=\"{{id}}\">\n" +
    "\t<h6 class=\"ms-label\" ng-class=\"{active: DropdownService.isActive(id)}\" data-ms-id=\"{{id}}\">\n" +
    "\t\t<span ng-click=\"select(selectedItem)\" class=\"status select\">{{selectedItem.label}}</span>&nbsp;\n" +
    "\t\t<span class=\"toggle\" ng-click=\"toggle()\" data-ms-id=\"column_2SortOptions\"><icon type=\"caret-down\"></icon></span>\n" +
    "\t</h6>\n" +
    "\t<ul class=\"ms-select-list dropdownshadow hide\">\n" +
    "\t\t<li class=\"list-label\">Sort Order</li>\n" +
    "\t\t<ul>\n" +
    "\t\t\t<li class=\"ms-item selectSort\" ng-class=\"{disabled:reverse}\" ng-click=\"select(selectedItem)\" data-ms-id=\"descending\"><icon type=\"check\" cname=\"ms-ok\"></icon>Descending</li>\n" +
    "\t\t\t<li class=\"ms-item selectSort\" ng-class=\"{disabled:!reverse}\" ng-click=\"select(selectedItem)\" data-ms-id=\"ascending\"><icon type=\"check\" cname=\"ms-ok\"></icon>Ascending</li>\n" +
    "\t\t</ul>\n" +
    "\t\t<li class=\"list-label\">Switch  Column</li>\n" +
    "\t\t<ul>\n" +
    "\t\t\t<li class=\"ms-item selectSort\" ng-repeat=\"item in items\" ng-class=\"{disabled:item.label === selectedItem.label}\" ng-click=\"selectSort(item)\" data-ms-id=\"{{item.label}}\"><icon type=\"check\" cname=\"ms-ok\"></icon>{{item.label}}</li>\n" +
    "\t\t</ul>\n" +
    "\t</ul>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/ms_filter_input.tpl.html',
    "<div class=\"input-holder\">\n" +
    "\t<icon type=\"filter\"></icon>\n" +
    "\t<input type=\"text\" class=\"search-input\" ng-model=\"SortAndFilterService.searchText\" ng-change=\"SortAndFilterService.filter()\" placeholder=\"Filter List\" ng-maxlength=\"1000\" />&nbsp;\n" +
    "</div>"
  );


  $templateCache.put('views/directives/ms_kpi_dimension_card.tpl.html',
    "<div class=\"dimensionCard kpiDimensionCard\">\n" +
    "    <div class=\"dimensionCheckbox\">\n" +
    "        <div class=\"parent-checkbox ms-checkbox no-select\">\n" +
    "            <label>\n" +
    "                <input type=\"checkbox\" ms-tristates-checkbox child-list=\"allDimensionsData\" property=\"isSelected\" ng-model=\"allDimensionsData.isSelected\"><i></i><span>KPIs</span>\n" +
    "            </label>\n" +
    "        </div>\n" +
    "        <div class=\"row no-margin\">\n" +
    "            <div ng-repeat=\"item in allDimensionsData | orderBy:id\">\n" +
    "                <div class=\"clearfix\" ng-if=\"$index % 3 == 0\"></div>\n" +
    "                <div class=\"col-md-4 children-checkbox ms-checkbox no-select\" ng-class=\"{'disabled': item.required}\">\n" +
    "                    <icon type=\"lock\" class=\"pull-left ms-checkbox-lock\" ng-if=\"item.required\"></icon>\n" +
    "                    <label>\n" +
    "                        <input type=\"checkbox\" ng-model=\"item.isSelected\" ng-disabled=\"item.required\"><i></i><span class=\"capitalized\">{{item.label}}</span>\n" +
    "                    </label>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/ms_standard_dimension_card.tpl.html',
    "<div class=\"dimensionCard standardDimensionCard\" ng-class=\"{fixedHeight: templateType !== 'Action'}\">\n" +
    "    <div class=\"dimensionCheckbox\">\n" +
    "        <div class=\"parent-checkbox ms-checkbox no-select\" ng-class=\"{'disabled': isMeasure(dimensionSchema)}\">\n" +
    "            <icon type=\"lock\" class=\"pull-left ms-checkbox-lock\" ng-if=\"isMeasure(dimensionSchema)\"></icon>\n" +
    "            <label>\n" +
    "                <input type=\"checkbox\" ms-tristates-checkbox child-list=\"dimensionSchema.members\" property=\"isSelected\" ng-model=\"dimensionSchema.isSelected\" ng-disabled=\"isMeasure(dimensionSchema)\"><i></i><span class=\"capitalized\">{{dimensionSchema.label}}</span>\n" +
    "            </label>\n" +
    "        </div>\n" +
    "        <div class=\"children-checkbox ms-checkbox no-select\" ng-repeat=\"item in dimensionSchema.members\" ng-if=\"templateType !== 'Action'\" ng-class=\"{'disabled': isEmpty(item, dimensionSchema)}\">\n" +
    "            <icon type=\"lock\" class=\"pull-left ms-checkbox-lock\" ng-if=\"isEmpty(item, dimensionSchema)\"></icon>\n" +
    "            <label>\n" +
    "                <input type=\"checkbox\" ng-model=\"item.isSelected\" ng-disabled=\"isEmpty(item, dimensionSchema)\"><i></i><span class=\"capitalized\">{{item.label}}</span>\n" +
    "            </label>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"dimensionFilter hide-overflow\" ng-if=\"dimensionSchema.isSelected\">\n" +
    "        <span title=\"{{getFormattedLabel(categorizedData)}}\" ng-click=\"filtersModal(dimensionData)\">\n" +
    "            <icon type=\"filter\"></icon>\n" +
    "            <span>{{getFormattedLabel(categorizedData)}}</span>\n" +
    "        </span>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/ng-performance.tpl.html',
    "<div>\n" +
    "  <style>\n" +
    "    #perfStats {\n" +
    "      position: fixed;\n" +
    "      right: 0;\n" +
    "      bottom: 15px;\n" +
    "      z-index: 100000;\n" +
    "      background-color: rgba(250, 249, 244, 0.97);\n" +
    "      border: 3px solid #843376;\n" +
    "      border-right: none;\n" +
    "      border-radius: 5px 0 0 5px;\n" +
    "      box-shadow: 0 1px 4px black;\n" +
    "      padding: 0 15px 15px;\n" +
    "      font-size: 0.65em;\n" +
    "    }\n" +
    "    #perfStats h3 {\n" +
    "      margin-bottom: 0;\n" +
    "    }\n" +
    "    #perfStats td:last-child {\n" +
    "      text-align: right;\n" +
    "    }\n" +
    "  </style>\n" +
    "  <div id=\"perfStats\">\n" +
    "    <div id=\"perfStatsPanel\">\n" +
    "      <h3>ANGULAR STATS</h3>\n" +
    "      <table class=\"table table-condensed\">\n" +
    "        <tbody>\n" +
    "        <tr>\n" +
    "          <td>Total Scopes:</td>\n" +
    "          <td><span id=\"scopes\">-</span></td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "          <td>Total Watchers:</td>\n" +
    "          <td><span id=\"watchers\">-</span></td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "          <td>Dirty Checks:</td>\n" +
    "          <td><span id=\"dirty-checks\">-</span></td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "          <td>Digest Cycles:</td>\n" +
    "          <td><span id=\"digest-cycles\">-</span></td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "          <td>Digest Cycle (last):</td>\n" +
    "          <td>\n" +
    "            <span id=\"digest-ms\">-</span> ms<br>\n" +
    "            <span id=\"digest-fps\">-</span> FPS\n" +
    "          </td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "          <td>Digest Cycle (avg):</td>\n" +
    "          <td>\n" +
    "            <span id=\"avg-digest-ms\">-</span> ms<br>\n" +
    "            <span id=\"avg-digest-fps\">-</span> FPS\n" +
    "          </td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "          <td>Digest Cycle (max):</td>\n" +
    "          <td>\n" +
    "            <span id=\"max-digest-ms\">-</span> ms<br>\n" +
    "            <span id=\"max-digest-fps\">-</span> FPS\n" +
    "          </td>\n" +
    "        </tr>\n" +
    "        </tbody>\n" +
    "      </table>\n" +
    "\n" +
    "      <h3>PAGELOAD STATS</h3>\n" +
    "      <table class=\"table table-condensed\">\n" +
    "        <tbody>\n" +
    "        <tr>\n" +
    "          <td>Head Load:</td>\n" +
    "          <td><span id=\"head-load\">-</span> ms</td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "          <td>Body Load:</td>\n" +
    "          <td><span id=\"body-load\">-</span> ms</td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "          <td>Footer Load:</td>\n" +
    "          <td><span id=\"footer-load\">-</span> ms</td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "          <td>Vendor Script Load:</td>\n" +
    "          <td><span id=\"vendor-load\">-</span> ms</td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "          <td>App Load:</td>\n" +
    "          <td><span id=\"app-load\">-</span> ms</td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "          <td>Metrics Load:</td>\n" +
    "          <td><span id=\"metrics-load\">-</span> ms</td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "          <td>Time To End-of-Page:</td>\n" +
    "          <td><span id=\"time-to-eop\">-</span> ms</td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "          <td>Time To Angular:</td>\n" +
    "          <td><span id=\"time-to-ng\">-</span> ms</td>\n" +
    "        </tr>\n" +
    "        </tbody>\n" +
    "      </table>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "\n"
  );


  $templateCache.put('views/directives/scenario_templates_navigation.tpl.html',
    "<div class=\"scenarioTemplatesNavigation\">\n" +
    "\t<div class=\"col-md-3 left-column\">\n" +
    "\t\t<div class=\"product-banner {{templateType.label}}\">\n" +
    "\t\t\t<div class=\"ms-logo\"></div>\n" +
    "\t\t\t&nbsp;{{templateType.label}}\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"template-steps-header\">\n" +
    "\t\t\tCreate a Scenario Template\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"template-steps\">\n" +
    "\t\t\t<ul>\n" +
    "\t\t\t\t<li ng-repeat=\"view in views\">\n" +
    "\t\t\t\t\t<span class=\"currentView\" ng-if=\"isCurrentView($index)\">\n" +
    "\t\t\t\t\t\t<span class=\"icon-stack\">\n" +
    "\t\t\t\t\t\t\t<icon type=\"circle\"></icon>\n" +
    "\t\t\t\t\t\t\t<icon type=\"circle-o\"></icon>\n" +
    "\t\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t\t&nbsp;{{view.label}}\n" +
    "\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t<span ng-if=\"!isCurrentView($index)\">\n" +
    "\t\t\t\t\t\t<icon ng-if=\"$index > currentViewIndex\" type=\"circle-o\"></icon>\n" +
    "\t\t\t\t\t\t<icon ng-if=\"$index < currentViewIndex\" type=\"circle\"></icon>\n" +
    "\t\t\t\t\t\t&nbsp;{{view.label}}\n" +
    "\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t<div ng-if=\"!view.buttonLabel\" class=\"pipe-line\">|</div>\n" +
    "\t\t\t\t</li>\n" +
    "\t\t\t</ul>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"col-md-9 right-column\">\n" +
    "\t\t<div class=\"content-container\" ng-transclude></div>\n" +
    "\t\t<div class=\"button-container\">\n" +
    "\t\t\t<ms-button type=\"cancel\" label=\"Cancel\" action=\"dismiss()\"></ms-button>\n" +
    "\t\t\t<span class=\"right\">\n" +
    "\t\t\t\t<ms-button type=\"cancel\" label=\"Back\" action=\"backward()\" ng-disabled=\"isDisabled()\"></ms-button>\n" +
    "\t\t\t\t&nbsp;\n" +
    "\t\t\t\t<ms-button type=\"submit\" label=\"{{label}}\" action=\"forward()\" ng-disabled=\"isDisabled(DIRECTION)\"></ms-button>\n" +
    "\t\t\t\t<span ng-show=\"!dimensionsIsLoaded\" class=\"loaderHolder\">\n" +
    "\t\t\t\t\t<span class=\"loading\"></span>Loading Dimensions\n" +
    "\t\t\t\t</span>\n" +
    "\t\t\t</span>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/sortable_columns.tpl.html',
    "<div ng-switch on=\"displayBy\" class=\"text-holder\"> \n" +
    "\t<span ng-switch-when=\"Last Modified\">\n" +
    "\t\t<span ng-if=\"!test\">{{::item.auditInfo.lastUpdatedOn | timeago}}</span>\n" +
    "\t\t<span ng-if=\"test\">{{::item.auditInfo.lastUpdatedOn}}</span>\n" +
    "\t</span> \n" +
    "\t<span ng-switch-when=\"Modified By\">{{::item.auditInfo.lastUpdatedBy.name}}</span> \n" +
    "\t<span ng-switch-when=\"Type\">{{::item.template.type}}</span> \n" +
    "\t<span ng-switch-when=\"Creator\">{{::item.auditInfo.createdBy.name}}</span> \n" +
    "\t<span ng-switch-when=\"Created Date\">\n" +
    "\t\t<span ng-if=\"!test\">{{::item.auditInfo.createdOn | date: 'longDate'}}</span>\n" +
    "\t\t<span ng-if=\"test\">{{::item.auditInfo.createdOn}}</span>\n" +
    "\t</span> \n" +
    "\t<span ng-switch-default>FAIL</span> \n" +
    "</div>"
  );


  $templateCache.put('views/directives/sorting_options.tpl.html',
    "<div data-ms-id=\"{{id}}\" class=\"{{label | normalize}} heading\" ng-class=\"{'active': SortAndFilterService.isActive(value)}\">\n" +
    "\t<a ng-click=\"sort($event, value)\" ng-bind=\"label\"></a>&nbsp;\n" +
    "</div> "
  );


  $templateCache.put('views/modal/filter_selection.tpl.html',
    "<div data-ms-id=\"filterModal\">\n" +
    "\t<div class=\"header\">\n" +
    "\t\t<h4 class=\"title\">Filters</h4>\n" +
    "\t</div>\n" +
    "\t<div class=\"body\">\n" +
    "\t\t<div class=\"side-menu\">\n" +
    "\t\t\t<div class=\"menu-item clickable\" ng-repeat=\"dimension in getDimensions()\" ng-click=\"chooseFilter(dimension, $index, false)\" ng-class=\"{active: dimension.label == selectedFilter.dimension.label}\">\n" +
    "\t\t\t\t<div>{{dimension.label}}\n" +
    "\t\t\t\t\t<span>({{categorizedValue[$index].selected}}/{{categorizedValue[$index].total}})</span>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div ng-show=\"allFiltersSelected(categorizedValue[$index])\" class=\"values text-holder\" tooltip-placement=\"bottom\" tooltip=\"{{getValuesList(categorizedValue[$index])}}\">{{getValuesList(categorizedValue[$index])}}</div>\n" +
    "\t\t\t\t<div ng-hide=\"allFiltersSelected(categorizedValue[$index])\" class=\"values text-holder\" tooltip-placement=\"bottom\" tooltip=\"{{getValuesList(categorizedValue[$index])}}\">All</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"content\">\n" +
    "\t\t\t<div class=\"alert\" role=\"alert\" ng-class=\"{transparent: !noFilterSelected}\">\n" +
    "\t\t\t\t<div>\n" +
    "\t\t\t\t\t<icon type=\"warning\"></icon>Please select at least one item from the following filter<span ng-if=\"emptyFiltersList.length > 1\">s</span>\n" +
    "\t\t\t\t\t: <span ng-repeat=\"missing in getEmptyFiltersList()\">\n" +
    "\t\t\t\t\t\t<span class=\"underline clickable\" ng-click=\"chooseFilterByName(missing)\">{{missing}}</span>\n" +
    "\t\t\t\t\t\t<span ng-if=\"!$last\">, </span>\n" +
    "\t\t\t\t\t</span>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"main-content\">\n" +
    "\t\t\t\t<div class=\"toolbar\">\n" +
    "\t\t\t\t\t<div class=\"dropdown-box\">\n" +
    "\t\t\t\t\t\t<div class=\"dropdown\">\n" +
    "\t\t\t\t\t\t\t<div class=\"dropdown-toggle\" ng-class=\"{disabled: isDimensionSignleMembered(selectedFilter.dimension), clickable: !isDimensionSignleMembered(selectedFilter.dimension)}\">\n" +
    "\t\t\t\t\t\t\t\t{{selectedFilter.level.label}}<icon ng-if=\"selectedFilter.dimension.members.length > 1\" type=\"caret-down\"></icon>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"dropdown-menu clickable\" ms-link-group radio=\"true\" selected-item=\"{{selectedFilter.level.label}}\">\n" +
    "\t\t\t\t\t\t\t\t<div ng-repeat=\"item in selectedFilter.dimension.members\" class=\"menu-item\" ms-link=\"{{item.label}}\" ng-click=\"chooseFilter(selectedFilter.dimension, selectedDimensionIndex, $index)\">\n" +
    "\t\t\t\t\t\t\t\t\t{{item.label}}\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"search-box\" ng-show=\"selectedFilter.level\">\n" +
    "\t\t\t\t\t\t<icon type=\"filter\"></icon>\n" +
    "\t\t\t\t\t\t<input type=\"text\" placeholder=\"Filter List\" ng-model=\"filterSearch.label\" ng-keyup=\"searchFilters(selectedFilter.level, filterSearch)\">\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"selection-tools\">\n" +
    "\t\t\t\t\t<div class=\"dropdown\">\n" +
    "\t\t\t\t\t\t<div class=\"static-button clickable\" ng-hide=\"filterCount.total === 0\">\n" +
    "\t\t\t\t\t\t\t<div class=\"selection-toggle\" ng-show=\"filterCount.selected === 0\" ng-click=\"selectFilters(selectedFilter.dimension.label, true, true);\"><icon type=\"square-o\"></icon></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"selection-toggle blue\" ng-show=\"filterCount.selected === filterCount.total\" ng-click=\"selectFilters(selectedFilter.dimension.label, true, false);\"><icon type=\"check-square\"></icon></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"selection-toggle blue\" ng-show=\"filterCount.selected % filterCount.total > 0.01\" ng-click=\"selectFilters(selectedFilter.dimension.label, true, true);\"><icon type=\"minus-square\"></icon></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"dropdown-toggle\"><icon type=\"caret-down\"></icon></div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"dropdown-menu\">\n" +
    "\t\t\t\t\t\t\t<div class=\"menu-item\" ng-click=\"selectFilters(selectedFilter.dimension.label, true, true);\">Select All Visible</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"menu-item\" ng-click=\"selectFilters(selectedFilter.dimension.label, true, false);\">Deselect All Visible</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"menu-item\" ng-click=\"selectFilters(selectedFilter.dimension.label, false, false);\">Deselect All Not Visible</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"stat\" ng-hide=\"filterCount.total === 0\">\n" +
    "\t\t\t\t\t\t({{filterCount.selected}}/{{filterCount.total}})\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"list-box\" style=\"position: relative;\">\n" +
    "\t\t\t\t\t<div class=\"list\" ng-if=\"searchResults.members && multiLevelList()\">\n" +
    "\t\t\t\t\t\t<member ng-repeat=\"member in searchResults.members | orderBy:'label'\" member=\"member\" filters=\"addedFilter\" category=\"{label: selectedFilter.dimension.label}\"  expanded=\"expanded\" expandall=\"filterSearch\" updater=\"categorizeValuesCount(index, addedFilters)\" dimensionindex=\"selectedDimensionIndex\"></member>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"list\" ng-if=\"searchResults.members && !multiLevelList()\" virtual-repeat=\"searchResults.members\" multi-level=\"multiLevelList\">\n" +
    "\t\t\t\t\t\t<member ng-repeat=\"member in virtualRepeat\" member=\"member\" filters=\"addedFilter\" category=\"{label: selectedFilter.dimension.label}\"  expanded=\"expanded\" expandall=\"filterSearch\" updater=\"categorizeValuesCount(index, addedFilters)\" dimensionindex=\"selectedDimensionIndex\"></member>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"action-buttons\">\n" +
    "\t\t\t\t<ms-button type=\"cancel\" action=\"cancel()\" label=\"Cancel\" data-dismiss=\"modal\"></ms-button>\n" +
    "\t\t\t\t<ms-button type=\"submit\" action=\"submit()\" label=\"Apply\" data-dismiss=\"modal\" ng-disabled=\"noFilterSelected\"></ms-button>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modal/ms_list_lightbox.tpl.html',
    "<div data-ms-id=\"{{testHandleName}}\">\n" +
    "\t<div class=\"header\">\n" +
    "\t\t<h4 class=\"title\">{{title}}</h4>\n" +
    "\t\t<h3 class=\"subtitle\">{{subtitle}}</h3>\n" +
    "\t</div>\n" +
    "\t<div class=\"body\">\n" +
    "\t\t<div class=\"content\">\n" +
    "\t\t\t<div class=\"main-content\">\n" +
    "\t\t\t\t<div class=\"toolbar\">\n" +
    "\t\t\t\t\t<div class=\"dropdown-box\" ng-hide=\"isDropdownHidden\">\n" +
    "\t\t\t\t\t\t<div class=\"dropdown ng-hide\">\n" +
    "\t\t\t\t\t\t\t<div class=\"dropdown-toggle clickable\">{{elementTypeItems[currentElementType]}}<icon type=\"caret-down\"></icon></div>\n" +
    "\t\t\t\t\t\t\t<ul class=\"dropdown-menu\" ms-link-group selected-item=\"{{selectedScenarioElement.id}}\" radio=\"true\">\n" +
    "\t\t\t\t\t\t\t\t<li ng-repeat=\"item in elementTypeItems\" ng-click=\"changeElementType($index)\" class=\"menu-item\" ms-link=\"{{$index}}\">{{item}}</li>\n" +
    "\t\t\t\t\t\t\t</ul>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"search-box\" ng-hide=\"isSearchHidden\">\n" +
    "\t\t\t\t\t\t<icon type=\"search\"></icon>\n" +
    "\t\t\t\t\t\t<input type=\"text\" ng-model=\"searchTerm.name\" placeholder=\"Search\">\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"list-box\">\n" +
    "\t\t\t\t\t<div ng-repeat=\"item in getList() | filter:searchTerm | orderBy:'auditInfo[lastUpdatedOn]':true\" class=\"item clickable\" ng-class=\"{'selected': item.id === currentItem.id}\" ng-click=\"currentItem.id = item.id\">\n" +
    "\t\t\t\t\t\t<div class=\"item-name text-holder\">\n" +
    "\t\t\t\t\t\t\t<icon type=\"circle-o\" cname=\"circle\"></icon><icon type=\"dot-circle-o\" cname=\"dot-circle\"></icon>{{item.name}}\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"item-meta\">\n" +
    "\t\t\t\t\t\t\t<span ng-if=\"e2e\" class=\"item-date\">{{item.auditInfo[dateProperty]}}</span>\n" +
    "\t\t\t\t\t\t\t<span ng-if=\"!e2e\" class=\"item-date\">{{item.auditInfo[dateProperty] | timeago}}</span>\n" +
    "\t\t\t\t\t\t\t<span class=\"item-owner\">{{item.auditInfo[ownerProperty].name}}</span>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"item-description\">{{item.description}}</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div ng-hide=\"isListLoaded\" class=\"status-message\"><icon type=\"refresh\" class=\"fa-spin\"></icon>Loading data ...</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"action-buttons\">\n" +
    "\t\t\t<ms-button type=\"cancel\" action=\"cancel()\" label=\"{{cancelButtonLabel}}\" data-dismiss=\"modal\"></ms-button>\n" +
    "\t\t\t<ms-button type=\"submit\" action=\"submit()\" label=\"{{submitButtonLabel}}\" data-dismiss=\"modal\"></ms-button>\n" +
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
    "\t\t\t<ms-button type=\"cancel\" action=\"cancel()\" label=\"Cancel\" data-dismiss=\"modal\"></ms-button>\n" +
    "\t\t\t<ms-button type=\"submit\" action=\"submit()\" label=\"Replace\" data-dismiss=\"modal\" ng-disabled=\"elementCopy.$invalid\"></ms-button>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modal/scenario_create.tpl.html',
    "<div data-ms-id=\"scenarioCreateModal\">\n" +
    "\t<div class=\"header\">\n" +
    "\t\t<h4 class=\"title\">Create a Scenario</h4>\n" +
    "\t</div>\n" +
    "\t<div class=\"body\">\n" +
    "\t\t<div class=\"content\">\n" +
    "\t\t\t<form class=\"main-content scenario-create\" name=\"ScenarioCreate\" id=\"ScenarioCreate\" novalidate>\n" +
    "\t\t\t\t<div class=\"inputGroup\" ng-show=\"showFields\">\n" +
    "\t\t\t\t\t<label>Enter Scenario Name\n" +
    "\t\t\t\t\t\t<input type=\"text\" focus placeholder=\"Enter Scenario Name\" required ng-maxlength=\"256\" ng-minlength=\"2\" ng-pattern='inputRestrictions.characterRestrictions' validator=\"isScenarioTitleUnique\" error-type=\"'isNotUnique'\" ng-model=\"scenario.name\" data-ms-id=\"ScenarioCreate.inputName\"/>\n" +
    "\t\t\t\t\t\t<div class=\"alert alert-danger\" role=\"alert\" ng-if=\"ScenarioCreate.$invalid && ScenarioCreate.$dirty\">\n" +
    "\t\t\t\t\t\t\t{{getError(ScenarioCreate.$error)}}\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</label>\n" +
    "\t\t\t\t\t<label>Enter Description (Optional)\n" +
    "\t\t\t\t\t\t<input class=\"description\" type=\"text\" placeholder=\"Enter Scenario description (optional)\" ng-model=\"scenario.description\" ng-maxlength=\"1024\" data-ms-id=\"ScenarioCreate.inputDescription\">\n" +
    "\t\t\t\t\t</label>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div class=\"baseGroup\">\n" +
    "\t\t\t\t\t<label for=\"baseScenario\" ng-click=\"showBaseScenario()\" data-ms-id=\"ScenarioCreate.inputBaseScenario\">Base Scenario\n" +
    "\t\t\t\t\t\t<input type=\"text\" class=\"clickable\" id=\"baseScenario\" ng-model=\"scenario.referenceScenario.name\" readonly>\n" +
    "\t\t\t\t\t\t<icon type=\"folder-open-o\" cname=\"open\"></icon>\n" +
    "\t\t\t\t\t</label>\n" +
    "\n" +
    "\t\t\t\t\t<!-- Begin hidden group -->\n" +
    "\t\t\t\t\t<div class=\"radios\" ng-show=\"!showFields\">\n" +
    "\t\t\t\t\t\t<div class='search-box'>\n" +
    "\t\t\t\t\t\t\t<icon type=\"search\"></icon>\n" +
    "\t\t\t\t\t\t\t<input type=\"text\" id=\"search\" placeholder=\"Search by Name\" ng-model=\"searchText\"/>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t<accordion close-others=\"false\">\n" +
    "\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t<accordion-group ng-repeat=\"project in scenarioList | filterProjects: searchText\" is-open=\"project.open\">\n" +
    "\t\t\t\t\t\t\t\t<accordion-heading>{{::project.name}}</accordion-heading>\n" +
    "\t\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"row\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-1\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t&nbsp;\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-6\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<span><strong>Name</strong></span>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-5\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<span><strong>Type</strong></span>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t<div ng-repeat=\"scenario in getScenarios(project, searchText)\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"row\" ng-click=\"setScenario(scenario)\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-1\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<span ng-show=\"showRow(scenario)\"><icon type=\"check-circle\" cname=\"ok-sign\"></icon></span>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-6\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<span class=\"clickable\" data-ms-id=\"scenario-title\">{{::scenario.name}}</span>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-5\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<span class=\"clickable\" data-ms-id=\"scenario-type\">{{::scenario.type}}</span>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</accordion-group>\n" +
    "\t\t\t\t\t\t</accordion>\n" +
    "\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<!-- End hidden group -->\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</form>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"action-buttons\" ng-show=\"showFields\">\n" +
    "\t\t\t<ms-button type=\"cancel\" action=\"close()\" label=\"Cancel\" data-ms-id=\"ScenarioCreate.cancel\"></ms-button>\n" +
    "\t\t\t<ms-button type=\"submit\" action=\"submit(scenario)\" label=\"Continue\" ng-disabled=\"ScenarioCreate.$invalid || ScenarioCreate.$pristine || !scenarioList\" data-ms-id=\"ScenarioCreate.submit\"></ms-button>\n" +
    "\t\t\t<span ng-show=\"loadingScenarios\" class=\"loaderHolder\">\n" +
    "\t\t\t\t<span class=\"loading\"></span>Loading scenarios\n" +
    "\t\t\t</span>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"action-buttons\" ng-hide=\"showFields\">\n" +
    "\t\t\t<ms-button type=\"cancel\" action=\"cancel()\" label=\"Cancel\" data-ms-id=\"ScenarioCreate.cancelBaseScenario\"></ms-button>\n" +
    "\t\t\t<ms-button type=\"submit\" action=\"confirm()\" label=\"Select\" data-ms-id=\"ScenarioCreate.confirmBaseScenario\"></ms-button>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modal/scenario_templates.tpl.html',
    "<div class=\"scenarioTemplates row\">\n" +
    "\t<flipbook workflow={{CONFIG.view.ScenarioTemplates.workflow}} type=\"{{templateType.label}}\" template-url=\"views/directives/scenario_templates_navigation.tpl.html\" basePath=\"views/includes/scenario_templates\" submit-callback=\"submit\" cancel-callback=\"cancel\" enable-next=\"{{enableNext}}\">\n" +
    "\t\t\t<ng-include src=\"url\"></ng-include>\n" +
    "\t</flipbook>\n" +
    "</div>\n"
  );


  $templateCache.put('views/modal/select_base_scenario.tpl.html',
    "<div class=\"choose-base-scenario\" data-ms-id=\"chooseBaseScenario\">\n" +
    "\t<div class=\"header\">\n" +
    "\t\t<div class=\"title\">Select recommendation base scenario</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"body\">\n" +
    "\t\t<div class=\"content\">\n" +
    "\t\t\t<div class=\"main-content\">\n" +
    "\t\t\t\t<div class=\"toolbar\">\n" +
    "\t\t\t\t\t<div class=\"dropdown-box scenario-type\">\n" +
    "\t\t\t\t\t\t<div class=\"dropdown\">\n" +
    "\t\t\t\t\t\t\t<div class=\"dropdown-toggle clickable\"><span class=\"text\">{{currentScenarioType}}</span><icon type=\"caret-down\"></icon></div>\n" +
    "\t\t\t\t\t\t\t<ul class=\"dropdown-menu\" ms-link-group selected-item=\"{{currentScenarioType}}\" radio=\"true\">\n" +
    "\t\t\t\t\t\t\t\t<li ng-repeat=\"item in scenarioTypeItems\" ng-click=\"changeScenarioType(item)\" class=\"menu-item\" ms-link=\"{{currentScenarioType}}\">{{::item}}</li>\n" +
    "\t\t\t\t\t\t\t</ul>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"dropdown-box template-type\">\n" +
    "\t\t\t\t\t\t<div class=\"dropdown\">\n" +
    "\t\t\t\t\t\t\t<div class=\"dropdown-toggle clickable\">\n" +
    "\t\t\t\t\t\t\t\t<span class=\"template-icon\" ng-if=\"getCurrentTemplate().isIconVisible\">{{getCurrentTemplate().icon}}</span>\n" +
    "\t\t\t\t\t\t\t\t<span class=\"text\">{{getCurrentTemplate().text}}</span>\n" +
    "\t\t\t\t\t\t\t\t<icon type=\"caret-down\"></icon>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t<ul class=\"dropdown-menu\" ms-link-group selected-item=\"{{getCurrentTemplate().text}}\" radio=\"true\">\n" +
    "\t\t\t\t\t\t\t\t<li ng-click=\"changeTemplate('ALL')\" class=\"menu-item\" ms-link=\"All\">All</li>\n" +
    "\t\t\t\t\t\t\t\t<li ng-repeat=\"template in getTemplates()\" ng-click=\"changeTemplate(template)\" class=\"menu-item\" ms-link=\"{{template.name}}\">\n" +
    "\t\t\t\t\t\t\t\t\t<span class=\"template-icon\">{{::getTemplateIcon(template)}}</span>\n" +
    "\t\t\t\t\t\t\t\t\t<span class=\"\">{{::template.name}}</span>\n" +
    "\t\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t\t</ul>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"search-box\">\n" +
    "\t\t\t\t\t\t<icon type=\"search\"></icon>\n" +
    "\t\t\t\t\t\t<input type=\"text\" ng-model=\"searchTerm.name\" placeholder=\"Search\">\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"list-box\">\n" +
    "\t\t\t\t\t<form>\n" +
    "\t\t\t\t\t\t<div ng-repeat=\"project in getProjects() | filter:searchTerm | orderBy:'auditInfo[lastUpdatedOn]':true\" class=\"project clickable\">\n" +
    "\t\t\t\t\t\t\t<div class=\"project-name text-holder\" ng-click=\"toggleProject(project)\">\n" +
    "\t\t\t\t\t\t\t\t<icon type=\"caret-right\" ng-if=\"!isProjectExpanded(project)\"></icon><icon type=\"caret-down\" ng-if=\"isProjectExpanded(project)\"></icon>{{::project.name}}\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"scenarios-list\" ng-class=\"{'collapse': !isProjectExpanded(project)}\">\n" +
    "\t\t\t\t\t\t\t\t<div ng-repeat=\"scenario in getScenarios(project) | filter:searchTerm | orderBy:'auditInfo[lastUpdatedOn]':true\" class=\"scenario clickable\" ng-click=\"selectScenario(scenario)\">\n" +
    "\t\t\t\t\t\t\t\t\t<input type=\"radio\" name=\"baseScenario\" id=\"radio{{scenario.id}}\" ng-model=\"selectedScenario.id\" value=\"{{scenario.id}}\">\n" +
    "\t\t\t\t\t\t\t\t\t<label class=\"scenario-item\" for=\"radio{{scenario.id}}\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"radio-button\"><icon type=\"circle-o\" class=\"selected\"></icon><icon type=\"dot-circle-o\" class=\"not-selected\"></icon></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"scenario-info text-holder\"><span>{{::scenario.name}}</span></div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"scenario-meta text-holder\">{{scenario.auditInfo.lastUpdatedOn | timeago}}, {{scenario.auditInfo.createdBy.name}}</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"scenario-template-type text-holder\"><span class=\"template-icon\">{{::getTemplateIcon(scenario.template)}}</span><span>{{scenario.template.name}}<span></div>\n" +
    "\t\t\t\t\t\t\t\t\t</label>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</form>\n" +
    "\t\t\t\t\t<div ng-hide=\"isListLoaded\" class=\"status-message\"><icon type=\"refresh\" class=\"fa-spin\"></icon>Loading data ...</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"action-buttons\">\n" +
    "\t\t\t<ms-button type=\"cancel\" action=\"cancel()\" label=\"Cancel\" data-dismiss=\"modal\"></ms-button>\n" +
    "\t\t\t<ms-button type=\"submit\" action=\"submit()\" label=\"Confirm\" data-dismiss=\"modal\"></ms-button>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modal/select_module.tpl.html',
    "<div class=\"scenarioTemplates light-box\" data-ms-id=\"simpleModal\">\n" +
    "\t<div class=\"header\">\n" +
    "\t\tHello!\n" +
    "\t</div>\n" +
    "\t<div class=\"body\">\n" +
    "\t\t<div class=\"content\">\n" +
    "\t\t\tWhat type of Scenario Template would you like to create?\n" +
    "\t\t</div>\n" +
    "\t\t<form>\n" +
    "\t\t\t<ul class=\"type-buttons\">\n" +
    "\t\t\t\t<li class=\"ms-{{module.name}}\" ng-repeat=\"module in modules\" ng-click=\"select(module)\">\n" +
    "\t\t\t\t\t<input type=\"radio\" id=\"radio{{$index}}\" name=\"selectModule\" />\n" +
    "\t\t\t\t\t<label class=\"animated bounceIn\" for=\"radio{{$index}}\">\n" +
    "\t\t\t\t\t\t{{module.label}}\n" +
    "\t\t\t\t\t</label>\n" +
    "\t\t\t\t</li>\n" +
    "\t\t\t</ul>\n" +
    "\t\t</form>\n" +
    "\t\t<div class=\"form-buttons\">\n" +
    "\t\t\t<ms-button type=\"cancel\" action=\"close($event)\" label=\"Cancel\"></ms-button>\n" +
    "\t\t\t<ms-button type=\"submit\" action=\"submit()\" label=\"START\" data-ms-id=\"modalSubmit\" ng-disabled=\"!isModuleSelected()\"></ms-button>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modal/simple_input.tpl.html',
    "<div data-ms-id=\"simpleModal\">\n" +
    "\t<div class=\"header\">\n" +
    "\t\t<h4 class=\"title\">{{modalProperties.title}}</h4>\n" +
    "\t</div>\n" +
    "\t<div class=\"body\" ui-keypress=\"{13: 'submit(item.name, $event)'}\">\n" +
    "\t\t<div class=\"content\">\n" +
    "\t\t\t<form class=\"main-content\" name=\"nameDialog\" novalidate role=\"form\">\n" +
    "\t\t\t\t<div class=\"form-group input-group-lg\" ng-class=\"{'has-error': nameDialog.$invalid}\">\n" +
    "\t\t\t\t\t<label class=\"control-label\" for=\"inputField\">{{modalProperties.field}}:\n" +
    "\t\t\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"inputField\" ng-model=\"item.name\" focus required ng-maxlength=\"256\" ng-minlength=\"2\" ng-pattern='inputRestrictions.characterRestrictions' validator=\"validator\" error-type=\"errorType\"/>\n" +
    "\t\t\t\t\t</label>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"alert alert-danger\" role=\"alert\" ng-if=\"nameDialog.$invalid && nameDialog.$dirty\">\n" +
    "\t\t\t\t\t{{getError(nameDialog.$error)}}\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</form>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"action-buttons\">\n" +
    "\t\t\t<ms-button type=\"cancel\" action=\"close($event)\" label=\"Cancel\"></ms-button>\n" +
    "\t\t\t<ms-button type=\"submit\" action=\"submit(item.name)\" label=\"{{modalProperties.button}}\" ui-keypress=\"{13: 'submit(item.name, $event)'}\" data-ms-id=\"modalSubmit\" ng-disabled=\"nameDialog.$invalid\"></ms-button>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );

}]);
