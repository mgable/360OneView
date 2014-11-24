/* global $:false, _:false */

'use strict';

angular.module("ThreeSixtyOneView")
    .controller("pivotTableCtrl", ["$scope", "$timeout",
        function($scope, $timeout) {

            var sheet,
                spread;

            $scope.data = $scope.pivotTableData;

            $timeout(function() {
                init();
            }, 400);

            function formatSheet() {

                sheet.isPaintSuspended(true);

                // set default column width and height
                var maxW = 250,
                    minW = 120;
                var canvasW = $('#pivotTablevp').width();
                var calcW = (canvasW / $scope.colCnt);

                if (calcW > minW && calcW < maxW) {
                    sheet.defaults.colWidth = calcW;
                } else if (calcW <= minW) {
                    sheet.defaults.colWidth = minW;
                } else {
                    sheet.defaults.colWidth = maxW;
                }

                // set selection background and border color
                sheet.selectionBackColor("rgba(229, 229, 229, 0.3)");
                sheet.selectionBorderColor("#CCCCCC");

                // set forzenline position and color
                sheet.setFrozenRowCount($scope.rowHeaderCnt);
                sheet.setFrozenColumnCount($scope.colHeaderCnt);
                sheet.frozenlineColor("transparent");

                // hide gridline
                sheet.setGridlineOptions({showVerticalGridline: false, showHorizontalGridline: false});

                // add span
                addSpan();

                // add default style
                var ns = $.wijmo.wijspread;
                var style = sheet.getDefaultStyle();
                style.borderLeft = new ns.LineBorder("#ffffff", $.wijmo.wijspread.LineStyle.empty);
                style.borderTop = new ns.LineBorder("#e5e5e5", $.wijmo.wijspread.LineStyle.thin);
                style.borderRight = new ns.LineBorder("#ffffff", $.wijmo.wijspread.LineStyle.empty);
                style.borderBottom = new ns.LineBorder("#e5e5e5", $.wijmo.wijspread.LineStyle.thin);

                // set col style
                for (var j = 0; j < $scope.colCnt; j++) {
                    var column = sheet.getColumn(j);
                    column.vAlign($.wijmo.wijspread.VerticalAlign.center).textIndent(1);
                    if (j < $scope.colHeaderCnt) {
                        column.formatter("0").font("14px proxima-nova").foreColor("#000000");
                        column.wordWrap(true);
                    } else {
                        column.formatter("$#,###");
                    }
                }

                // set row style
                for (var i = 0; i < $scope.rowCnt; i++) {
                    var row = sheet.getRow(i);
                        sheet.setRowHeight(i, 40, $.wijmo.wijspread.SheetArea.viewport);
                    if (i < $scope.rowHeaderCnt) {
                        if (i === $scope.rowHeaderCnt - 1) {
                            row.borderBottom(new $.wijmo.wijspread.LineBorder("#CCCCCC", $.wijmo.wijspread.LineStyle.thick));
                        }
                        row.formatter("0").font("11px proxima-nova").foreColor("#888888");
                        row.hAlign($.wijmo.wijspread.HorizontalAlign.center);
                        row.wordWrap(true);
                        // sheet.autoFitRow(i);
						sheet.getCell(i, $scope.colHeaderCnt-1).borderRight(new $.wijmo.wijspread.LineBorder("#CCCCCC", $.wijmo.wijspread.LineStyle.thick));
                    } else {
                        for (j = $scope.colHeaderCnt; j < $scope.colCnt; j++) {
                            sheet.getCell(i, j).font("14px proxima-nova").foreColor("#000000").value(randomNumber(0, 2000)).locked(false);
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
                    for(var i = 0; i < $scope.rowHeaderCnt; i++) {
                        sheet.getCell(i, min).borderLeft(new $.wijmo.wijspread.LineBorder("#e5e5e5", $.wijmo.wijspread.LineStyle.thin));
                    }
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
                    sheet.getCell(min, level).vAlign($.wijmo.wijspread.VerticalAlign.top);
                    var cMin = min,
                        cMax = min + span;
                    for(var j = 0; j < $scope.colHeaderCnt; j++) {
                        sheet.getCell(min, j).borderTop(new $.wijmo.wijspread.LineBorder("#e5e5e5", $.wijmo.wijspread.LineStyle.thin));
                    }
                    createColSpan(level + 1, cMin, cMax - 1);
                    min += span;
                });

            }

            function addSpan() {

                // row span
                var l = 0;
                createRowSpan(l, $scope.colHeaderCnt, $scope.colCnt);
                createColSpan(l, $scope.rowHeaderCnt, $scope.rowCnt);

            }

            function randomNumber(min, max) {

                return Math.floor(Math.random() * (max - min + 1) + min);

            }

            function init() {

                $scope.rowCnt = $scope.data.length;
                $scope.rowHeaderCnt = 2;
                $scope.rowDataCnt = $scope.rowCnt - $scope.rowHeaderCnt;
                $scope.colCnt = _.keys($scope.data[0]).length;
                $scope.colHeaderCnt = 2;
                $scope.colDataCnt = $scope.colCnt - $scope.colHeaderCnt;

                spread = $("#pivotTable").wijspread("spread");
                sheet = spread.getActiveSheet();

                spread.grayAreaBackColor("Transparent");
                spread.scrollbarMaxAlign(true);
                sheet.setColumnHeaderVisible(false);
                sheet.setRowHeaderVisible(false);
                sheet.setColumnHeaderVisible(false);
                sheet.setIsProtected(true);
                sheet.autoGenerateColumns = true;

                formatSheet();

            }

            $scope.spread.updateSheet = function(_data, numRows, numCols) {

                $scope.data = _data;

                $scope.spread.sheet.loading = true;
                $timeout(function() {
                    $scope.spread.sheet.loading = false;
                }, (numCols + numRows) * 400);

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
