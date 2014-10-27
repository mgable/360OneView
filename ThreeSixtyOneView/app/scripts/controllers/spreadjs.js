/* global $:false, _:false */

'use strict';

angular.module("ThreeSixtyOneView")
    .controller("spreadjsCtrl", ["$scope", "$timeout",
        function($scope, $timeout) {

            var sheet,
                spread;

            $scope.data = $scope.pivotTableData;

            $timeout(function() {
                init();
            }, 200);

            function init() {

                $scope.rowCnt = $scope.data.length;
                $scope.rowHeaderCnt = 2;
                $scope.rowDataCnt = $scope.rowCnt - $scope.rowHeaderCnt;
                $scope.colCnt = _.keys($scope.data[0]).length;
                $scope.colHeaderCnt = 2;
                $scope.colDataCnt = $scope.colCnt - $scope.colHeaderCnt;

                spread = $("#spreadjs").wijspread("spread");
                sheet = spread.getActiveSheet();

                spread.grayAreaBackColor("Transparent");
                sheet.defaults.colWidth = 150;
                sheet.setColumnHeaderVisible(false);
                sheet.setRowHeaderVisible(false);
                sheet.setColumnHeaderVisible(false);
                sheet.setIsProtected(true);
                sheet.autoGenerateColumns = true;

                formatSheet();

            }

            function formatSheet() {

                sheet.isPaintSuspended(true);

                // set default column width and height
                sheet.defaults.colWidth = 150;
                sheet.defaults.rowHeight = 47;

                // set selection background and border color
                sheet.selectionBackColor("rgba(204, 204, 204, 0.2)");
                sheet.selectionBorderColor("#e6e6e6");

                // set forzenline position and color
                sheet.setFrozenRowCount($scope.rowHeaderCnt);
                sheet.setFrozenColumnCount($scope.colHeaderCnt);
                sheet.frozenlineColor("transparent");

                // add span
                addSpan();

                // add default style
                var ns = $.wijmo.wijspread;
                var style = sheet.getDefaultStyle();
                style.borderLeft = new ns.LineBorder("#E6E6E6", $.wijmo.wijspread.LineStyle.dotted);
                style.borderTop = new ns.LineBorder("#E6E6E6", $.wijmo.wijspread.LineStyle.dotted);
                style.borderRight = new ns.LineBorder("#E6E6E6", $.wijmo.wijspread.LineStyle.dotted);
                style.borderBottom = new ns.LineBorder("#E6E6E6", $.wijmo.wijspread.LineStyle.dotted);

                // set col style
                for (var j = 0; j < $scope.colCnt; j++) {
                    var column = sheet.getColumn(j);
                    column.vAlign($.wijmo.wijspread.VerticalAlign.center).textIndent(2);
                    if (j < $scope.colHeaderCnt) {
                        column.formatter("0").foreColor("#888888");
                        column.wordWrap(true);
                        if (j === $scope.colHeaderCnt - 1) {
                            column.borderRight(new $.wijmo.wijspread.LineBorder("#E6E6E6", $.wijmo.wijspread.LineStyle.thin));
                        }
                    } else {
                        column.formatter("$#,###");
                    }
                }

                // set row style
                for (var i = 0; i < $scope.rowCnt; i++) {
                    var row = sheet.getRow(i);
                    if (i < $scope.rowHeaderCnt) {
                        if (i === $scope.rowHeaderCnt - 1) {
                            row.borderBottom(new $.wijmo.wijspread.LineBorder("#E6E6E6", $.wijmo.wijspread.LineStyle.thin));
                        }
                        row.formatter("0").foreColor("#888888");
                        row.hAlign($.wijmo.wijspread.HorizontalAlign.center);
                        row.wordWrap(true);
                    } else {
                        for (j = $scope.colHeaderCnt; j < $scope.colCnt; j++) {
                            sheet.getCell(i, j).value(randomNumber(0, 2000)).locked(false);
                        }
                    }
                }

                sheet.isPaintSuspended(false);

            }

            function createRowSpan(level, min, max) {

                if (level > $scope.rowHeaderCnt) {
                    return;
                }
                var rowSpan = {};
                var rowOrder = [];
                _.each($scope.data[level], function(v, k) {
                    if (min <= k && max >= k) {
                        if (!rowSpan[v]) {
                            rowSpan[v] = 1;
                            rowOrder.push(v);
                        } else {
                            rowSpan[v] += 1;
                        }
                    }
                });
                _.each(rowOrder, function(v) {
                    var span = rowSpan[v];
                    if (span === 1) {
                        return;
                    }
                    sheet.addSpan(level, min, 1, span);
                    var rMin = min,
                        rMax = min + span;
                    createRowSpan(level + 1, rMin, rMax - 1);
                    min += span;
                });

            }

            function createColSpan(level, min, max) {

                if (level > $scope.colHeaderCnt) {
                    return;
                }
                var colSpan = {};
                var colOrder = [];
                _.each($scope.data, function(v, k) {
                    if (min <= k && max >= k) {
                        var key = v[level];
                        if (!colSpan[key]) {
                            colSpan[key] = 1;
                            colOrder.push(key);
                        } else {
                            colSpan[key] += 1;
                        }
                    }
                });
                _.each(colOrder, function(v) {
                    var span = colSpan[v];
                    if (span === 1 && level !== 0) {
                        return;
                    }
                    sheet.addSpan(min, level, span, 1);
                    var cMin = min,
                        cMax = min + span;
                    createColSpan(level + 1, cMin, cMax - 1);
                    min += span;
                });

            }

            function addSpan() {

                // header span
                sheet.addSpan(0, 0, $scope.rowHeaderCnt, $scope.colHeaderCnt);

                // row span
                var l = 0;
                createRowSpan(l, $scope.colHeaderCnt, $scope.colCnt);
                createColSpan(l, $scope.rowHeaderCnt, $scope.rowCnt);

            }

            function randomNumber(min, max) {

                return Math.floor(Math.random() * (max - min + 1) + min);

            }

            $scope.spread.updateSheet = function(_data, numRows, numCols) {

                $scope.data = _data;

                // $scope.spread.sheet.loading = true;
                // $timeout(function() {
                //     $scope.spread.sheet.loading = false;
                // }, (numCols + numRows) * 1000);

                $scope.rowCnt = $scope.data.length;
                $scope.rowHeaderCnt = numRows;
                $scope.rowDataCnt = $scope.rowCnt - $scope.rowHeaderCnt;
                $scope.colCnt = _.keys($scope.data[0]).length;
                $scope.colHeaderCnt = numCols;
                $scope.colDataCnt = $scope.colCnt - $scope.colHeaderCnt;

                sheet.reset();
                $timeout(function() {
                    formatSheet();
                }, 200);

            };

        }
    ]);
