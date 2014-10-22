angular.module('ThreeSixtyOneView').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/directives/display_actions.tpl.html',
    "<div class=\"display-actions\">\r" +
    "\n" +
    "\t<h4 class=\"pull-left title\">{{SortAndFilterService.getSelectedLabel()}}&nbsp;<span>({{SortAndFilterService.getCount()}})</span><icon type=\"sort-desc\"></icon></h4>\r" +
    "\n" +
    "\t<div class=\"filterDropdown\">\r" +
    "\n" +
    "\t\t<span class=\"selected\">All Projects</span>\r" +
    "\n" +
    "\t\t<span>Favorites</span>\r" +
    "\n" +
    "\t\t<span>Created by Me</span>\r" +
    "\n" +
    "\t\t<span>I Can Edit</span>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\t<span>\r" +
    "\n" +
    "\t\t<icon type=\"filter\"></icon>\r" +
    "\n" +
    "\t\t<input type=\"text\" class=\"search-input\" ng-model=\"SortAndFilterService.searchText\" ng-change=\"SortAndFilterService.filter()\" placeholder=\"Filter Search\"/>&nbsp;\r" +
    "\n" +
    "\t</span>\r" +
    "\n" +
    "\t<div class=\"button-holder\">\r" +
    "\n" +
    "\t\t<div class=\"actions\">\r" +
    "\n" +
    "\t\t\t<span ng-if=\"view.create\" ng-click=\"create(CONFIG.displayActionsCreate)\"><icon type=\"plus\"></icon>CREATE</span>\r" +
    "\n" +
    "\t\t\t<!-- <span ng-if=\"view.filter\"><icon type=\"filter\"></icon></span>\r" +
    "\n" +
    "\t\t\t<span ng-if=\"view.search\"><search></search></span> -->\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/directives/inline_description.tpl.html',
    "<form class=\"inlineDescription\" name=\"inlineDescription\">\r" +
    "\n" +
    "\t<span class='field-label'>Description</span>\r" +
    "\n" +
    "\t<a ng-hide=\"isActive\" class='edit'ng-click=\"action()\"><icon  type=\"pencil\"></icon></a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t<span ng-show=\"isActive\" class=\"controls\"><button ng-click=\"submit(item)\" ng-disabled=\"(inlineDescription.$dirty && inlineDescription.$invalid) || inlineDescription.$pristine\"><icon type=\"check\"></icon></button>&nbsp;<button ng-click=\"cancel()\"><icon type=\"times\"></icon></button></span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t<textarea ng-disabled=\"!isActive\" ng-maxlength=\"256\" ng-pattern='/^[^\\\\\\/\\?\\:\\*\"><|]+$/' ng-model=\"item.description\" class=\"description inputTarget\"></textarea>\r" +
    "\n" +
    "</form>"
  );


  $templateCache.put('views/directives/inline_rename.tpl.html',
    "<form class=\"inlineRename\" name=\"rename\" novalidate role=\"form\">\r" +
    "\n" +
    "\t<span ng-transclude></span>\r" +
    "\n" +
    "\t<h4 class=\"title\" ng-hide=\"isActive\">{{item.title}}</h4>&nbsp;\r" +
    "\n" +
    "\t<a class=\"edit\" ng-click=\"action()\"><icon ng-hide=\"isActive\" type=\"pencil\" cname=\"pencil clearfix\"></icon></a>\r" +
    "\n" +
    "    <h4 ng-show=\"isActive\">\r" +
    "\n" +
    "    \t<input type=\"text\" class=\"inputTarget\" ng-model=\"item.title\" required ng-maxlength=\"256\" ng-minlength=\"2\" ng-pattern='inputRestrictions.characterRestrictions' tabindex=\"1\" />&nbsp;\r" +
    "\n" +
    "    \t<button ng-click=\"submit(item)\" ng-disabled=\"(rename.$dirty && rename.$invalid) || rename.$pristine\"><icon type=\"check\"></icon></button>&nbsp;\r" +
    "\n" +
    "    \t<button ng-click=\"cancel()\"><icon type=\"times\"></icon></button>\r" +
    "\n" +
    "    </h4>\r" +
    "\n" +
    "</form>"
  );


  $templateCache.put('views/directives/ms_dropdown.tpl.html',
    "<div class=\"ms-dropdown\" id=\"{{id}}\"> \r" +
    "\n" +
    "\t<h6 class=\"ms-label\" ng-class=\"{active: DropdownService.isActive(id)}\"><span ng-show=\"filterBy\"><icon type=\"filter\" cname=\"filter-icon\"></icon></span><span ng-click=\"select(selectedItem)\" class=\"status select\">{{selectedItem.label}}</span>&nbsp<span ng-click=\"toggle()\" class=\"toggle\"><icon type=\"caret-square-o-down\"></icon></span></h6> \r" +
    "\n" +
    "\t<ul class=\"ms-select-list dropshadow hide\"> \r" +
    "\n" +
    "\t\t<li class=\"ms-item selectSort\" ng-repeat=\"item in items\" ng-class=\"{disabled:item.label === selectedItem.label}\" ng-click=\"selectSort(item)\"><icon type=\"check\" cname=\"ms-ok\"></icon>{{item.label}}</li> \r" +
    "\n" +
    "\t\t<ul ng-if=\"selectedItem.filters\"> \r" +
    "\n" +
    "\t\t\t<li class=\"divider\"></li> \r" +
    "\n" +
    "\t\t\t<li class=\"ms-sublabel\">FILTER</li> \r" +
    "\n" +
    "\t\t\t<li ng-repeat=\"filter in selectedItem.filters\" class=\"ms-item selectFilter\" ng-click=\"selectFilter(filter)\" ng-class=\"{selected:selectedFilter === filter}\"><icon type=\"check\" cname=\"ms-ok\"></icon>{{filter.label}}</li> \r" +
    "\n" +
    "\t\t\t<li ng-if=\"selectedItem.template\"><ng-include src=\"selectedItem.template\"></ng-include></li> \r" +
    "\n" +
    "\t\t</ul> \r" +
    "\n" +
    "\t</ul> \r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/directives/name.tpl.html',
    "<li class=\"ms-holder\">\r" +
    "\n" +
    "\t<input type=\"text\" class=\"ms-name-input\" ng-model=\"name\" placeholder=\"Enter Name\" ng-disabled=\"enabledOn(selectedFilter)\" ng-click=\"dontPassEvent($event)\"/>\r" +
    "\n" +
    "</li>\r" +
    "\n" +
    "<li class=\"ms-holder\">\r" +
    "\n" +
    "\t<button class=\"btn btn-primary ms-apply submit-button\" ng-disabled=\"!name || enabledOn(selectedFilter)\" ng-click=\"submit(name)\">apply</button>\r" +
    "\n" +
    "</li>\r" +
    "\n"
  );


  $templateCache.put('views/directives/sortable_columns.tpl.html',
    "<div ng-switch on=\"displayBy\" class=\"text-holder\"> \r" +
    "\n" +
    "\t<span ng-switch-when=\"Last Modified\" bind-once>{{item.modifiedOn | timeago }}</span> \r" +
    "\n" +
    "\t<span ng-switch-when=\"Modified By\" bind-once>{{item.modifiedBy}}</span> \r" +
    "\n" +
    "\t<span ng-switch-when=\"Type\" bind-once>{{item.type}}</span> \r" +
    "\n" +
    "\t<span ng-switch-when=\"Creator\" bind-once>{{item.createdBy}}</span> \r" +
    "\n" +
    "\t<span ng-switch-when=\"Created Date\" bind-once>{{item.createdOn | date: 'longDate' }}</span> \r" +
    "\n" +
    "\t<span ng-switch-default>FAIL</span> \r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/directives/sorting_options.tpl.html',
    "<div class=\"{{label}} heading\" ng-class=\"{'active': SortAndFilterService.isActive(label)}\">\r" +
    "\n" +
    "\t<a ng-click=\"sort($event, label)\" ng-bind=\"display\"></a>&nbsp;\r" +
    "\n" +
    "</div> "
  );

}]);
