angular.module('ThreeSixtyOneView').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/directives/display_actions.tpl.html',
    "<div class=\"display-actions\">\n" +
    "\t<h4 ng-click=\"toggle()\" class=\"pull-left title\">{{SortAndFilterService.getSelectedLabel()}}&nbsp;<span>({{SortAndFilterService.getCount()}})</span><span  class=\"filtertoggle\"><icon type=\"caret-down\"></icon></span></h4>\n" +
    "\n" +
    "\t<ul ms-link-group firstSelected=\"{{CONFIG.filterMenu.items[CONFIG.filterMenu.firstSelected].label}}\" radio=\"true\" class='filterDropdown dropdownshadow title hide menu'>\n" +
    "\t\t<li ng-repeat=\"item in CONFIG.filterMenu.items\" class=\"header\" ng-class=\"{selected: item.label === selectedItem}\">\n" +
    "\t\t\t <a ms-link=\"{{item.label}}\" ng-click=\"setFilter(item.filterType, item, true)\">{{item.label}}</a>\n" +
    "\t\t</li>\n" +
    "    </ul>\n" +
    "\n" +
    "\t<span>\n" +
    "\t\t<icon type=\"filter\"></icon>\n" +
    "\t\t<input type=\"text\" class=\"search-input\" ng-model=\"SortAndFilterService.searchText\" ng-change=\"SortAndFilterService.filter()\" placeholder=\"Filter List\"/>&nbsp;\n" +
    "\t</span>\n" +
    "\n" +
    "\t<div class=\"button-holder\">\n" +
    "\t\t<span ng-click=\"create(CONFIG.displayActionsCreate)\" data-ms-id='createButton'><icon type=\"plus\"></icon>CREATE</span>\n" +
    "\t</div>\n" +
    "</div>\n"
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

}]);
