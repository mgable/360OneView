/* global $:false, _:false */

'use strict';

angular.module('ThreeSixtyOneView')
.controller('pivotTableCtrl', [
    '$scope', '$timeout', 'PivotTableService',

    function($scope, $timeout, PivotTableService) {
        var sheet, spread,
            $pivottable, $canvas,
            WijS = $.wijmo.wijspread;

        function createRegionSpan(region, axis, meta) {
            var regionSpan = {}, order = [],
                level = region.level,
                min = region.min,
                max = region.max;

            var data = $scope.data,
                isRows = (axis === 'rows');

            if (level > meta.headerCount) {
                return false;
            } else if (isRows) {
                data = data[level];
            }

            _.each(data, function(v, k) {
                if (min <= k && max >= k) {
                    if (!isRows) {
                        v = v[level];
                    }
                    if (regionSpan[v]) {
                        order[v] += 1;
                    } else {
                        order.push(v);
                        regionSpan[v] = 1;
                    }
                }
            });

            order.forEach(function(v) {
                var span = regionSpan[v],
                    position, cell,
                    oMin, oMax,
                    i = -1;

                if (span === 1) {
                    if (isRows || level !== 0) {
                        return false;
                    }
                }

                oMax = (oMin = min) + span;

                if (isRows) {
                    position = 'Left';
                    sheet.addSpan(level, min, 1, span);
                } else { // 'cols'
                    position = 'Top';
                    sheet.addSpan(min, level, span, 1);
                    sheet.getCell(min, level).vAlign(WijS.VerticalAlign.top);
                }

                while (++i < meta.headerCount) {
                    cell = isRows? sheet.getCell(i, min) : sheet.getCell(min, i);
                    cell['border' + position](
                        new WijS.LineBorder('#e5e5e5', WijS.LineStyle.thin)
                    );
                }

                createRegionSpan({ level: level + 1, max: oMax - 1, min: oMin }, axis, meta);
                min += span;
            });
        }

        function formatSheet() {
            sheet.isPaintSuspended(true);

            function randomWithRange(min, max) {
                return Math.floor(Math.random() * (max - min + 1) + min);
            }

            var row, col, i, j,
                meta = $scope.sheet,
                colHeaders = meta.cols.headers,
                rowHeaders = meta.rows.headers,
                colCount = meta.cols.data.length,
                rowCount = meta.rows.data.length,
                width = $canvas.width() / colCount;

            setSheetDefaults({ cols: colHeaders, rows: rowHeaders }, width);

            // add spans for columns and rows
            angular.forEach(meta, function(axis) {
                createRegionSpan({
                    level: axis.level, min: axis.headers, max: axis.getCount()
                }, axis, meta);
            });

            // set col style
            for (i = 0; i < colCount; i++) {
                col = sheet.getColumn(i);
                col.vAlign(WijS.VerticalAlign.center).textIndent(1);
                if (i < colHeaders) {
                    col.formatter('0').font('14px proxima-nova').foreColor('#333');
                    col.wordWrap(true);
                } else {
                    col.formatter('$#,###');
                }
            }

            // set row style
            for (i = 0; i < rowCount; i++) {
                row = sheet.getRow(i);
                sheet.setRowHeight(i, 40, WijS.SheetArea.viewport);
                if (i < rowHeaders) {
                    if (i === rowHeaders - 1) {
                        row.borderBottom(new WijS.LineBorder('#CCC', WijS.LineStyle.thick));
                    }
                    row.formatter('0').font('11px proxima-nova').foreColor('#888');
                    row.hAlign(WijS.HorizontalAlign.center);
                    row.wordWrap(true);
                } else {
                    for (j = colHeaders; j < colCount; j++) {
                        sheet.getCell(i, j).font('14px proxima-nova').foreColor('#333')
                        .value(randomWithRange(0, 2000)).locked(false);
                    }
                }
            }

            sheet.isPaintSuspended(false);
            $pivottable.show();
        }

        function setSheetDefaults(headers, width, min, max) {
            min = min || 120; max = max || 250;
            if (width > min && width < max) {
                sheet.defaults.colWidth = width;
            } else if (width <= min) {
                sheet.defaults.colWidth = min;
            } else {
                sheet.defaults.colWidth = max;
            }

            sheet.selectionBackColor('rgba(229, 229, 229, 0.3)');
            sheet.selectionBorderColor('#CCCCCC');
            sheet.frozenlineColor('transparent');
            sheet.autoGenerateColumns = true;

            sheet.setFrozenColumnCount(headers.cols);
            sheet.setFrozenRowCount(headers.rows);
            sheet.setColumnHeaderVisible(false);
            sheet.setRowHeaderVisible(false);
            sheet.setIsProtected(true);
            sheet.setGridlineOptions({
                showHorizontalGridline: false,
                showVerticalGridline: false
            });

            // add default style
            var style = sheet.getDefaultStyle();
            style.borderLeft = new WijS.LineBorder('#fff', WijS.LineStyle.empty);
            style.borderTop = new WijS.LineBorder('#e5e5e5', WijS.LineStyle.thin);
            style.borderRight = new WijS.LineBorder('#fff', WijS.LineStyle.empty);
            style.borderBottom = new WijS.LineBorder('#e5e5e5', WijS.LineStyle.thin);
        }

        function updateSheet(_data, numRows, numCols) {
            $scope.spread.sheet.loading = true;

            $scope.sheet.cols.data = _.keys(_data[0]);
            $scope.sheet.rows.data = _data;
            $scope.data = _data;

            $timeout(function() {
                $scope.spread.sheet.loading = false;
            }, (numCols + numRows) * 100);

            sheet.reset();
            formatSheet();
        }

        function init(data) {
            console.time('PivotTableCtrl');

            $scope.data = data ? data : $scope.pivotTableData;

            $scope.sheet = angular.forEach({
                cols: { data: _.keys($scope.data[0]) },
                rows: { data: $scope.data }
            }, function(axis) {
                angular.extend(axis, {
                    getCount: function() {
                        return this.data.length - this.headers;
                    },
                    headers: 2,
                    level: 0
                });
            });

            $canvas = $pivottable.find('#pivotTablevp');

            spread = $pivottable.wijspread('spread');
            spread.grayAreaBackColor('Transparent');
            spread.scrollbarMaxAlign(true);

            sheet = spread.getActiveSheet();
            formatSheet();

            console.timeEnd('PivotTableCtrl');
            // 187.648ms, 153.081ms, 122.897ms
            // 128.837ms, 158.878ms, 194.668ms
            // Average Load Time: ~157ms
        }

        $scope.spread.updateSheet = updateSheet;

        PivotTableService.fetch().finally(init);
        
        $pivottable = $('#pivotTable').hide();
    }

]);
