angular.module('ThreeSixtyOneView').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/directives/display_actions.tpl.html',
    "<div class=\"display-actions\">\n" +
    "\t<h4 class=\"pull-left title\">{{SortAndFilterService.getSelectedLabel()}}&nbsp;<span>({{SortAndFilterService.getCount()}})</span><span ng-click=\"toggle()\" class=\"filtertoggle\"><icon type=\"caret-down\"></icon></span></h4>\n" +
    "\n" +
    "\t<ul ms-link-group firstSelected=\"{{CONFIG.filterMenu.items[CONFIG.filterMenu.firstSelected].label}}\" radio=\"true\" class='filterDropdown title hide menu'>\n" +
    "\t\t<li ng-repeat=\"item in CONFIG.filterMenu.items\" class=\"header\" ng-class=\"{selected: item.label === selectedItem}\">\n" +
    "\t\t\t <a ms-link=\"{{item.label}}\" ng-click=\"setFilter(item.filterType, item, true)\">{{item.label}}</a>\n" +
    "\t\t</li>\n" +
    "\t\t<li>I Can Edit</li>\n" +
    "    </ul>\n" +
    "\t<span>\n" +
    "\t\t<icon type=\"filter\"></icon>\n" +
    "\t\t<input type=\"text\" class=\"search-input\" ng-model=\"SortAndFilterService.searchText\" ng-change=\"SortAndFilterService.filter()\" placeholder=\"Filter Search\"/>&nbsp;\n" +
    "\t</span>\n" +
    "\t<div class=\"button-holder\">\n" +
    "\t\t<div class=\"actions\">\n" +
    "\t\t\t<span ng-if=\"view.create\" ng-click=\"create(CONFIG.displayActionsCreate)\"><icon type=\"plus\"></icon>CREATE</span>\n" +
    "\t\t\t<!-- <span ng-if=\"view.filter\"><icon type=\"filter\"></icon></span>\n" +
    "\t\t\t<span ng-if=\"view.search\"><search></search></span> -->\n" +
    "\t\t</div>\n" +
    "\t\t\n" +
    "\t</div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/directives/inline_description.tpl.html',
    "<form class=\"inlineDescription\" name=\"inlineDescription\">\n" +
    "\t<span class='field-label'>Description</span>\n" +
    "\t<a ng-hide=\"isActive\" class='edit'ng-click=\"action()\"><icon  type=\"pencil\"></icon></a>\n" +
    "\n" +
    "\t<span ng-show=\"isActive\" class=\"controls\"><button ng-click=\"submit(item)\" ng-disabled=\"(inlineDescription.$dirty && inlineDescription.$invalid) || inlineDescription.$pristine\"><icon type=\"check\"></icon></button>&nbsp;<button ng-click=\"cancel()\"><icon type=\"times\"></icon></button></span>\n" +
    "\n" +
    "\t<textarea ng-disabled=\"!isActive\" ng-maxlength=\"256\" ng-pattern='/^[^\\\\\\/\\?\\:\\*\"><|]+$/' ng-model=\"item.description\" class=\"description inputTarget\"></textarea>\n" +
    "</form>"
  );


  $templateCache.put('views/directives/inline_rename.tpl.html',
    "<form class=\"inlineRename\" name=\"rename\" novalidate role=\"form\">\n" +
    "\t<span ng-transclude></span>\n" +
    "\t<h4 class=\"title\" ng-hide=\"isActive\">{{item.title}}</h4>&nbsp;\n" +
    "\t<a class=\"edit\" ng-click=\"action()\"><icon ng-hide=\"isActive\" type=\"pencil\" cname=\"pencil clearfix\"></icon></a>\n" +
    "    <h4 ng-show=\"isActive\" class=\"title\">\n" +
    "    \t<input type=\"text\" class=\"inputTarget\" ng-model=\"item.title\" required ng-maxlength=\"256\" ng-minlength=\"2\" ng-pattern='inputRestrictions.characterRestrictions' tabindex=\"1\" />&nbsp;\n" +
    "    \t<button ng-click=\"submit(item)\" ng-disabled=\"(rename.$dirty && rename.$invalid) || rename.$pristine\"><icon type=\"check\"></icon></button>&nbsp;\n" +
    "    \t<button ng-click=\"cancel()\"><icon type=\"times\"></icon></button>\n" +
    "    </h4>\n" +
    "</form>"
  );


  $templateCache.put('views/directives/ms_dropdown.tpl.html',
    "<div class=\"ms-dropdown\" id=\"{{id}}\"> \n" +
    "\t<h6 class=\"ms-label\" ng-class=\"{active: DropdownService.isActive(id)}\"><span ng-show=\"filterBy\"><icon type=\"filter\" cname=\"filter-icon\"></icon></span><span ng-click=\"select(selectedItem)\" class=\"status select\">{{selectedItem.label}}</span>&nbsp<span ng-click=\"toggle()\" class=\"toggle\"><icon type=\"caret-down\"></icon></span></h6> \n" +
    "\t<ul class=\"ms-select-list dropshadow hide\"> \n" +
    "\t\t<li class=\"ms-item selectSort\" ng-repeat=\"item in items\" ng-class=\"{disabled:item.label === selectedItem.label}\" ng-click=\"selectSort(item)\"><icon type=\"check\" cname=\"ms-ok\"></icon>{{item.label}}</li> \n" +
    "\t\t<ul ng-if=\"selectedItem.filters\"> \n" +
    "\t\t\t<li class=\"divider\"></li> \n" +
    "\t\t\t<li class=\"ms-sublabel\">FILTER</li> \n" +
    "\t\t\t<li ng-repeat=\"filter in selectedItem.filters\" class=\"ms-item selectFilter\" ng-click=\"selectFilter(filter)\" ng-class=\"{selected:selectedFilter === filter}\"><icon type=\"check\" cname=\"ms-ok\"></icon>{{filter.label}}</li> \n" +
    "\t\t\t<li ng-if=\"selectedItem.template\"><ng-include src=\"selectedItem.template\"></ng-include></li> \n" +
    "\t\t</ul> \n" +
    "\t</ul> \n" +
    "</div>"
  );


  $templateCache.put('views/directives/name.tpl.html',
    "<li class=\"ms-holder\">\n" +
    "\t<input type=\"text\" class=\"ms-name-input\" ng-model=\"name\" placeholder=\"Enter Name\" ng-disabled=\"enabledOn(selectedFilter)\" ng-click=\"dontPassEvent($event)\"/>\n" +
    "</li>\n" +
    "<li class=\"ms-holder\">\n" +
    "\t<button class=\"btn btn-primary ms-apply submit-button\" ng-disabled=\"!name || enabledOn(selectedFilter)\" ng-click=\"submit(name)\">apply</button>\n" +
    "</li>\n"
  );


  $templateCache.put('views/directives/sortable_columns.tpl.html',
    "<div ng-switch on=\"displayBy\" class=\"text-holder\"> \n" +
    "\t<span ng-switch-when=\"Last Modified\" bind-once>{{item.modifiedOn | timeago }}</span> \n" +
    "\t<span ng-switch-when=\"Modified By\" bind-once>{{item.modifiedBy}}</span> \n" +
    "\t<span ng-switch-when=\"Type\" bind-once>{{item.type}}</span> \n" +
    "\t<span ng-switch-when=\"Creator\" bind-once>{{item.createdBy}}</span> \n" +
    "\t<span ng-switch-when=\"Created Date\" bind-once>{{item.createdOn | date: 'longDate' }}</span> \n" +
    "\t<span ng-switch-default>FAIL</span> \n" +
    "</div>"
  );


  $templateCache.put('views/directives/sorting_options.tpl.html',
    "<div class=\"{{label}} heading\" ng-class=\"{'active': SortAndFilterService.isActive(label)}\">\n" +
    "\t<a ng-click=\"sort($event, label)\" ng-bind=\"display\"></a>&nbsp;\n" +
    "</div> "
  );

}]);
