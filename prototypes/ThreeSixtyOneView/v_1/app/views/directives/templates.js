angular.module('ThreeSixtyOneView').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/directives/contextual_menu.tpl.html',
    "<div class=\"contextual-menu\">\r" +
    "\n" +
    "\t<div class='dropdown-toggle' data-toggle=\"dropdown\">\r" +
    "\n" +
    "\t\t<icon type=\"ellipsis-v\" cname=\"dropdown-trigger\"></icon>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\t<ul class=\"dropdown-menu contextual-menu-body\" role=\"menu\">\r" +
    "\n" +
    "\t\t<li ng-if=\"base.show\" class='base'>\r" +
    "\n" +
    "\t\t\t<a ng-click=\"alert('this behavior has not been defined')\">\r" +
    "\n" +
    "\t\t\t\t<icon type=\"download\"></icon>\r" +
    "\n" +
    "\t\t\t\t<!-- Use as a base for a new scenario -->\r" +
    "\n" +
    "\t\t\t\t{{base.label}}\r" +
    "\n" +
    "\t\t\t</a>\r" +
    "\n" +
    "\t\t</li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t<li ng-if=\"copy.show\" class='copy'>\r" +
    "\n" +
    "\t\t\t<!-- <a ng-click=\"DiaglogService.copy(item, {header: 'Copy Project'}, service)\"> -->\r" +
    "\n" +
    "\t\t\t<a ng-click=\"copyFn(item)\">\r" +
    "\n" +
    "\t\t\t\t<icon type=\"files-o\"></icon>\r" +
    "\n" +
    "\t\t\t\t<!-- copy -->\r" +
    "\n" +
    "\t\t\t\t{{copy.label}}\r" +
    "\n" +
    "\t\t\t</a>\r" +
    "\n" +
    "\t\t</li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t<li ng-if=\"set.show\" class='set'>\r" +
    "\n" +
    "\t\t\t<a ng-click=\"\">\r" +
    "\n" +
    "\t\t\t\t<icon type=\"marketshare\"></icon>\r" +
    "\n" +
    "\t\t\t\t<!-- Set as current plan -->\r" +
    "\n" +
    "\t\t\t\t{{set.label}}\r" +
    "\n" +
    "\t\t\t</a>\r" +
    "\n" +
    "\t\t</li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t<li ng-if=\"favorites.show\" class='favorites no-after'>\r" +
    "\n" +
    "\t\t\t<a ng-click=\"FavoritesService.toggleFavorite(item)\">\r" +
    "\n" +
    "\t\t\t\t<span ng-if=\"!FavoritesService.isFavorite(item.id)\">\r" +
    "\n" +
    "\t\t\t\t\t<icon type=\"star\"></icon>\r" +
    "\n" +
    "\t\t\t\t\t{{favorites.label}}\r" +
    "\n" +
    "\t\t\t\t</span>\r" +
    "\n" +
    "\t\t\t\t<span ng-if=\"FavoritesService.isFavorite(item.id)\">\r" +
    "\n" +
    "\t\t\t\t\t<icon type=\"star-o\"></icon>\r" +
    "\n" +
    "\t\t\t\t\tun-{{favorites.label}}\r" +
    "\n" +
    "\t\t\t\t</span>\r" +
    "\n" +
    "\t\t\t</a>\r" +
    "\n" +
    "\t\t</li>\r" +
    "\n" +
    "\t\t<li ng-if=\"default.show\" class='default'>\r" +
    "\n" +
    "\t\t\t<a ng-click=\"alert('this behavior has not been defined')\" ng-class=\"{disabled: item.defaults}\">\t\r" +
    "\n" +
    "\t\t\t\t<img src=\"images/ms-confirm_gray.png\" width=\"18\" height=\"16\">\r" +
    "\n" +
    "\t\t\t\t<span>&nbsp;{{default.label}}</span>\r" +
    "\n" +
    "\t\t\t</a>\r" +
    "\n" +
    "\t\t</li>\r" +
    "\n" +
    "\t\t<li ng-if=\"add.show\" class=\"add\">\r" +
    "\n" +
    "\t\t\t<a ng-click=\"alert('this behavior has not been defined')\">\r" +
    "\n" +
    "\t\t\t\t<icon type=\"download\"></icon>\r" +
    "\n" +
    "\t\t\t\t{{add.label}}\r" +
    "\n" +
    "\t\t\t</a>\r" +
    "\n" +
    "\t\t</li>\r" +
    "\n" +
    "\t\t<li ng-if=\"sharing.show\" class='sharing\"'>\r" +
    "\n" +
    "\t\t\t<a ng-click=\"alert('this behavior has not been defined')\">\r" +
    "\n" +
    "\t\t\t\t<icon type=\"users\"></icon>\r" +
    "\n" +
    "\t\t\t\t{{sharing.label}}\r" +
    "\n" +
    "\t\t\t</a>\r" +
    "\n" +
    "\t\t</li>\r" +
    "\n" +
    "\t\t<li ng-if=\"archive.show\" class=\"delete\">\r" +
    "\n" +
    "\t\t\t<a ng-click=\"DiaglogService.trash(item, service)\">\r" +
    "\n" +
    "\t\t\t\t<icon type=\"trash-o\"></icon>\r" +
    "\n" +
    "\t\t\t\t{{archive.label}}\r" +
    "\n" +
    "\t\t\t</a>\r" +
    "\n" +
    "\t\t</li>\r" +
    "\n" +
    "\t\t<li ng-if=\"rename.show\" class=\"rename\">\r" +
    "\n" +
    "\t\t\t<a ng-click=\"DiaglogService.rename(item, service)\">\r" +
    "\n" +
    "\t\t\t\t<icon type=\"pencil\"></icon>\r" +
    "\n" +
    "\t\t\t\t{{rename.label}}\r" +
    "\n" +
    "\t\t\t</a>\r" +
    "\n" +
    "\t\t</li>\r" +
    "\n" +
    "\t\t<li ng-if=\"details.show\" class=\"divider\"></li>\r" +
    "\n" +
    "\t\t<li ng-if=\"details.show\" class=\"details\">\r" +
    "\n" +
    "\t\t\t<a ng-click=\"ActiveSelection.setActiveItem(item);InfoTrayService.toggleInfoTray()\">\r" +
    "\n" +
    "\t\t\t\t<icon type=\"info-circle\"></icon>\r" +
    "\n" +
    "\t\t\t\t{{details.label}}\r" +
    "\n" +
    "\t\t\t</a>\r" +
    "\n" +
    "\t\t</li>\r" +
    "\n" +
    "\t</ul>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/directives/display_actions.tpl.html',
    "<div class=\"display-actions\">\r" +
    "\n" +
    "\t<h4 class=\"pull-left title\">{{SortAndFilterService.getSelectedLabel()}}&nbsp;<span>({{SortAndFilterService.getCount()}})</span></h4>\r" +
    "\n" +
    "\t\r" +
    "\n" +
    "\t<div class=\"button-holder\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "<!-- \t\t<span ng-show=\"FileDeleteService.getFileCount()\" ng-click=\"trash()\" class=\"trash\"><icon type=\"trash-o\"></icon>&nbsp;Delete({{FileDeleteService.getFileCount()}})</span> -->\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t<div class=\"actions\">\r" +
    "\n" +
    "\t\t\t<span ng-if=\"view.create\" ng-click=\"create('project')\"><icon type=\"plus\"></icon></span>\r" +
    "\n" +
    "\t\t\t<span ng-if=\"view.filter\"><icon type=\"filter\"></icon></span>\r" +
    "\n" +
    "\t\t\t<span ng-if=\"view.search\"><search></search></span>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/directives/msDropdown.tpl.html',
    "<div class=\"ms-dropdown\" id=\"{{id}}\"> \r" +
    "\n" +
    "\t<h6 class=\"ms-label\" ng-class=\"{active: DropdownService.getActive() === id}\"><span ng-show=\"filterBy\"><icon type=\"filter\" cname=\"filter-icon\"></icon></span><span ng-click=\"select(selectedItem)\" class=\"status\">{{selectedItem.label}}</span>&nbsp<span ng-click=\"toggle()\"><icon type=\"caret-square-o-down\"></icon></span></h6> \r" +
    "\n" +
    "\t<ul class=\"ms-select-list dropshadow hide\"> \r" +
    "\n" +
    "\t\t<li class=\"ms-item\" ng-repeat=\"item in items\" ng-class=\"{disabled:item.label === selectedItem.label}\" ng-click=\"selectSort(item)\"><span class=\"glyphicon glyphicon-ok ms-ok\"></span>{{item.label}}</li> \r" +
    "\n" +
    "\t\t<ul ng-if=\"selectedItem.filters\"> \r" +
    "\n" +
    "\t\t\t<li class=\"divider\"></li> \r" +
    "\n" +
    "\t\t\t<li class=\"ms-sublabel\">FILTER</li> \r" +
    "\n" +
    "\t\t\t<li ng-repeat=\"filter in selectedItem.filters\" class=\"ms-item\" ng-click=\"selectFilter(filter)\" ng-class=\"{selected:selectedFilter === filter}\"><span class=\"glyphicon glyphicon-ok ms-ok\"></span>{{filter.label}}</li> \r" +
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
    "\t<span ng-switch-when=\"Last Modified\">{{item.modifiedOn | timeago }}</span> \r" +
    "\n" +
    "\t<span ng-switch-when=\"Modified By\">{{item.modifiedBy}}</span> \r" +
    "\n" +
    "\t<span ng-switch-when=\"Type\">{{item.type}}</span> \r" +
    "\n" +
    "\t<span ng-switch-when=\"Creator\">{{item.createdBy}}</span> \r" +
    "\n" +
    "\t<span ng-switch-default>FAIL</span> \r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/directives/sorting_options.html',
    "<div class=\"{{label}} heading\" ng-class=\"{'active': SortAndFilterService.isActive(label)}\">\r" +
    "\n" +
    "\t<a ng-click=\"sort($event, label)\" ng-bind=\"display\"></a>&nbsp;\r" +
    "\n" +
    "</div> "
  );

}]);
