'use strict';

// spreadjs controller
angular.module("ThreeSixtyOneView").controller("spreadjsCtrlz", ['$scope', '$timeout', function($scope, $timeout) {
	$timeout(function() { init(); }, 400);
	
	var init = function() {
		// Behrooz: getting data from outer controller
		$scope.data = $scope.pivotTableData;
		$scope.headers = $scope.pivotTableHeaders;

		var rowLevel = 1;
		var rowCnt = $scope.data.length - rowLevel;
		var colLevel = 2;
		var colCnt = $scope.headers.length - colLevel;

		// initiate the jquery plugins
		var spread = $('#spreadjs').wijspread('spread');
		// console.log($('#spreadjs'));
		var sheet = spread.getActiveSheet();

		// use custom theme
		spread.useWijmoTheme = true;

		// hide row and column headers.
		sheet.setColumnHeaderVisible(true);
		sheet.setRowHeaderVisible(false);
		sheet.autoGenerateColumns = true;

		// selection background color and border color
		sheet.selectionBackColor("rgba(229,243,252,0.3)");
		sheet.selectionBorderColor("#8796B4");

		// add sort
		sheet.setRowHeight(0, 30, $.wijmo.wijspread.SheetArea.colHeader);
		sheet.rowFilter(new $.wijmo.wijspread.HideRowFilter(new $.wijmo.wijspread.Range(-1, -1, -1, $scope.headers.length)));

		// add formatter for columns
		for (var h = 0; h < $scope.headers.length; h++) {
			var header = $scope.headers[h].toLowerCase();
			var column = sheet.getColumn(h);

			if (h > colLevel - 1) {
				// column.formatter("$#,###.00[<1000];$#,.0K[>=1000]");
				// column.formatter("$#,###.00");
			}

			sheet.getColumns(0, colLevel-1).hAlign($.wijmo.wijspread.HorizontalAlign.left);
			sheet.getColumns(2, $scope.headers.length).hAlign($.wijmo.wijspread.HorizontalAlign.right);
			column.vAlign($.wijmo.wijspread.VerticalAlign.center);
			column.textIndent(2);
		}

		// add styling
		spread.grayAreaBackColor("Transparent");

		sheet.defaults.colWidth = 149;
		sheet.defaults.rowHeight = 30;

		sheet.getColumn(colLevel - 1).borderRight(new $.wijmo.wijspread.LineBorder("#D0D7E5", $.wijmo.wijspread.LineStyle.thin));
		sheet.getRow(rowLevel - 1).borderBottom(new $.wijmo.wijspread.LineBorder("#D0D7E5", $.wijmo.wijspread.LineStyle.thin));
		sheet.setFrozenRowCount(rowLevel - 1);
		sheet.setFrozenColumnCount(colLevel);
		sheet.frozenlineColor("#D0D7E5");
		// sheet.getRows(0, rowLevel - 1).backColor("#E5F3FC").foreColor("#8796B4").font("bold 12px/14px Arial");
		sheet.getColumns(0, colLevel - 1).font("bold 12px/14px Arial");
		sheet.isPaintSuspended(false);
		sheet.repaint();

		// add spanning, temporaraly fake the behavior
		for (var i = 0; i < rowCnt / 2; i++) {
			// sheet.addSpan(i * 2, 0, 2, 1);
		}
		sheet.bind($.wijmo.wijspread.Events.RangeSorting, function (e) {
			var spans = sheet.getSpans();
			for(var i = 0; i < spans.length; i++)
				{
					sheet.removeSpan(spans[i].row,spans[i].col,$.wijmo.wijspread.SheetArea.viewport);
				}
		});
		sheet.bind($.wijmo.wijspread.Events.RangeSorted, function (e) {
			for (var i = 0; i < rowCnt / 2; i++) {
				sheet.addSpan(i * 2, 0, 2, 1);
			}
		});


		// lock cells
		$scope.toggleText = "Lock Cells";
		$scope.lockFlag = false;

		$scope.spread.sheet = sheet;
	}

	$scope.lockCell = function() {
		$scope.toggleText = $scope.toggleText == "Lock Cells" ? "Unlock Cells" : "Lock Cells";
		$scope.lockFlag = $scope.lockFlag == false ? true : false;
		sheet.setIsProtected($scope.lockFlag);
	};

	// sort ascending
	$scope.sortAscending = function() {
		try {
			//sort a to z
			var cr = sheet.getSelections()[0];

			sheet.sortRange(0, cr.col, -1, 1, true, [{
				index: sheet.getActiveColumnIndex(),
				ascending: true
			}]);

		} catch (ex) {
			alert(ex.message);
		}
	};

	// sort descending
	$scope.sortDescending = function() {
		try {
			//sort z to a
			var cr = sheet.getSelections()[0];

			sheet.sortRange(0, cr.col, -1, 1, true, [{
				index: sheet.getActiveColumnIndex(),
				ascending: false
			}]);

		} catch (ex) {
			alert(ex.message);
		}
	};
}]).controller("spreadjsCtrlzz", ["$scope", "pivotableService", "$timeout", function($scope, pivotableService, $timeout) {
	
	$timeout(function() {
		init();
	}, 200);

	var sheet,
		spread;

	var init = function() {

		// $scope.data = response.data;
		$scope.data = $scope.pivotTableData;

		spread = $("#spreadjs").wijspread("spread").grayAreaBackColor("Transparent");
		sheet = spread.getActiveSheet();

		var oriRowCnt = $scope.data.length;
		var oriColCnt = _.keys($scope.data[0]).length;

		sheet.defaults.colWidth = 150;
		sheet.setColumnHeaderVisible(false);
		sheet.setRowHeaderVisible(false);
		sheet.setColumnHeaderVisible(false);
		sheet.setIsProtected(true);
		sheet.autoGenerateColumns = true;

		sheet.isPaintSuspended(true);
		formatSheet($scope.data);
		validateSheet();
		sheet.isPaintSuspended(false);
		$scope.addDataBarText = "Show Bar Chart";

		$scope.spread.sheet = sheet;
	}

	$scope.addColumn = function() {

		var new_data = angular.copy($scope.data);
		getDimension(new_data);
		$scope.colCnt += 1;
		for (var i = 0; i < $scope.rowCnt; i++) {
			var colText = 'Column' + $scope.colCnt;
			if (i == $scope.rowHeaderCnt - 1) {
				new_data[i]['Column' + $scope.colCnt] = colText;
			} else {
				if ((i - $scope.rowHeaderCnt) % 3 == 0) {
					new_data[i]['Column' + $scope.colCnt] = "";
				} else {
					new_data[i]['Column' + $scope.colCnt] = randomNumber(0, 2000);
				}
			}

		}
		updateSheet(new_data);
	}

	$scope.deleteColumn = function() {

		var new_data = angular.copy($scope.data);
		getDimension(new_data);
		var key = 'Column' + $scope.colCnt;
		if ($scope.colCnt > oriColCnt) {
			_.each(new_data, function(v, k) {
				delete v[key];
			});
			$scope.colCnt -= 1;
			updateSheet(new_data);
		}
	}

	$scope.addRow = function() {

		var new_data = angular.copy($scope.data);
		getDimension(new_data);
		new_data[$scope.rowCnt] = {};
		var key = _.keys(new_data[0]);
		_.each(key, function(v, k) {
			if (k < $scope.colHeaderCnt) {
				if ($scope.rowDataCnt % 3 == 0) {
					new_data[$scope.rowCnt][v] = k == 0 ? 'Row' + $scope.rowCnt : "";
				} else {
					new_data[$scope.rowCnt][v] = k == 1 ? 'Row' + $scope.rowCnt : "";
				}
			} else {
				new_data[$scope.rowCnt][v] = randomNumber(0, 2000);
			}
		});
		updateSheet(new_data);
	}

	$scope.deleteRow = function() {

		var new_data = angular.copy($scope.data);
		getDimension(new_data);
		if ($scope.rowCnt > oriRowCnt) {
			new_data.splice(-1, 1);
			updateSheet(new_data);
		}
	}

	$scope.addDataBar = function() {

		getDimension($scope.data);
		var dataBarRule = new $.wijmo.wijspread.DataBarRule();
		dataBarRule.ranges = [new $.wijmo.wijspread.Range($scope.colHeaderCnt, $scope.rowHeaderCnt, $scope.rowDataCnt, $scope.colDataCnt)];
		dataBarRule.color("#E6E6E6");
		dataBarRule.showBorder(true);
		dataBarRule.borderColor("#E6E6E6");
		dataBarRule.axisPosition($.wijmo.wijspread.DataBarAxisPosition.Automatic);
		dataBarRule.axisColor("#E6E6E6");
		dataBarRule.showBarOnly(false);
		if ($scope.addDataBarText === "Show Bar Chart") {
			sheet.getConditionalFormats().addRule(dataBarRule);
			$scope.addDataBarText = "Hide Bar Chart";
		} else {
			$scope.addDataBarText = "Show Bar Chart";
			sheet.getConditionalFormats().clearRule(dataBarRule);
		}
	}

	$scope.sendToBackend = function() {

		console.log(sheet.toJSON().dataBinding.source);
	}

	function getDimension(_data) {

		$scope.rowCnt = _data.length;
		$scope.rowHeaderCnt = 2;
		$scope.rowDataCnt = $scope.rowCnt - $scope.rowHeaderCnt;

		$scope.colCnt = _.keys(_data[0]).length;
		$scope.colHeaderCnt = 2;
		$scope.colDataCnt = $scope.colCnt - $scope.colHeaderCnt;
	}

	function formatSheet(_data) {

		// getDimension(_data);

		fakeData();

		// set default column width and height
		sheet.defaults.colWidth = 150;
		sheet.defaults.rowHeight = 47;

		// set selection background and border color
		sheet.selectionBackColor("rgba(204, 204, 204, 0.2)");
		sheet.selectionBorderColor("#e6e6e6");

		// set forzenline position and color
		sheet.setFrozenRowCount($scope.rowHeaderCnt);
		sheet.setFrozenColumnCount($scope.colHeaderCnt);
		sheet.frozenlineColor("#FFFFFF");

		// set col style
		for (var j = 0; j < $scope.colCnt; j++) {
			var column = sheet.getColumn(j);
			column.vAlign($.wijmo.wijspread.VerticalAlign.center);
			column.textIndent(2);
			if (j < $scope.colHeaderCnt) {
				column.hAlign($.wijmo.wijspread.HorizontalAlign.left);
				if (j == $scope.colHeaderCnt - 1) {
					column.borderRight(new $.wijmo.wijspread.LineBorder("#CCCCCC", $.wijmo.wijspread.LineStyle.thick));
				}
			} else {
				column.hAlign($.wijmo.wijspread.HorizontalAlign.right);
				column.borderRight(new $.wijmo.wijspread.LineBorder("#E6E6E6", $.wijmo.wijspread.LineStyle.thin));
				column.formatter("$#,###");
			}
		}

		// set row style
		for (var i = 0; i < $scope.rowCnt; i++) {
			var row = sheet.getRow(i);
			if (i < $scope.rowHeaderCnt) {
				row.borderBottom(new $.wijmo.wijspread.LineBorder("#E6E6E6", $.wijmo.wijspread.LineStyle.thin));
				if (i == $scope.rowHeaderCnt - 1) {
					row.borderBottom(new $.wijmo.wijspread.LineBorder("#CCCCCC", $.wijmo.wijspread.LineStyle.thick));
				}
				sheet.setRowHeight(i, 25.0, $.wijmo.wijspread.SheetArea.viewport);
				row.formatter("0").backColor("#FFFFFF").foreColor("#888888");
				row.hAlign($.wijmo.wijspread.HorizontalAlign.center);
			} else {
				for (var j = $scope.colHeaderCnt; j < $scope.colCnt; j++) {
					sheet.getCell(i, j).locked(false);
				}

			}
		}

		// add span
		addSpan();

		// add formula
		// addFormula();

		}

		function fakeData() {

			// set fake value
			for (var i = $scope.rowHeaderCnt; i < $scope.rowCnt; i++) {
				for (var j = $scope.colHeaderCnt; j < $scope.colCnt; j++) {
					sheet.getCell(i, j).value(randomNumber(0, 2000));
				}
			}
		}

		function addSpan() {

			// header span
			for (var i = $scope.colHeaderCnt - 1; i >= 0; i--) {
				sheet.addSpan(0, i, $scope.rowHeaderCnt, 1);
			};

			// row span
			for (var i = 0; i < $scope.rowHeaderCnt - 1; i++) {
				var rowSpan = {},
				colIndex = $scope.colHeaderCnt;
				_.each($scope.data[i], function(v, k) {
					if (k > $scope.colHeaderCnt - 1) {
						if (!rowSpan[v]) {
							rowSpan[v] = 1;
						} else {
							rowSpan[v] += 1;
						}
					}
				});
				_.each(rowSpan, function(v, k) {
					sheet.addSpan(i, colIndex, 1, v);
					colIndex += v;
				});
			}

			// col span
			for (var j = 0; j < $scope.colHeaderCnt - 1; j++) {
				var colSpan = {},
				rowIndex = $scope.colHeaderCnt;
				_.each($scope.data, function(v, k) {
					if (k > $scope.rowHeaderCnt - 1) {
						var key = v[j];
						if (!colSpan[key]) {
							colSpan[key] = 1;
						} else {
							colSpan[key] += 1;
						}
					}
				});
				_.each(colSpan, function(v, k) {
					sheet.addSpan(rowIndex, j, v, 1);
					for(var l = $scope.colHeaderCnt; l <$scope.colCnt; l++) {
						sheet.getCell(rowIndex, l).formula("=SUM(" + colName(l) + (rowIndex+1) + ":" + colName(l) + (rowIndex+v) + ")");
					}
					rowIndex += v;
				});
			}
		}

		$scope.spread.updateSheet = function(data, numCols, numRows, totalCols, totalRows) {

			$scope.colHeaderCnt = numCols;
			$scope.rowHeaderCnt = numRows;
			$scope.colCnt = totalCols;
			$scope.rowCnt = totalRows;

			$scope.data = data;
			sheet.isPaintSuspended(true);
			formatSheet($scope.data);
			validateSheet();
			sheet.isPaintSuspended(false);
		}

		function colName(n) {
			var s = "";
			while (n >= 0) {
				s = String.fromCharCode(n % 26 + 97) + s;
				n = Math.floor(n / 26) - 1;
			}
			return s;
		}

		function validateSheet() {

			var dv = $.wijmo.wijspread.DefaultDataValidator.createNumberValidator($.wijmo.wijspread.ComparisonOperator.GreaterThanOrEqualsTo, 0, true);
			dv.errorMessage = "value should be a positive number";
			for (var i = $scope.colHeaderCnt; i < $scope.colCnt; i++) {
				for (var j = $scope.rowHeaderCnt; j < $scope.rowCnt; j++) {
					sheet.getCell(i, j).dataValidator(dv);
				}
			}
			spread.bind($.wijmo.wijspread.Events.ValidationError, function(event, data) {
				var dv = data.validator;
				if (dv) {
					alert(dv.errorMessage);
					data.validationResult = $.wijmo.wijspread.DataValidationResult.Discard;
				}
			});
		}

		function randomNumber(min, max) {

			return Math.floor(Math.random() * (max - min + 1) + min);
		}

	}
]).controller("spreadjsCtrlzzz", ["$scope", "pivotableService", "$timeout", function($scope, pivotableService, $timeout) {

	var sheet,
		spread,
		pivotTableData = $scope.pivotTableData;

	$timeout(function() {
		init();
	}, 200);

			$scope.data = pivotTableData;
	var init = function() {

		// pivotableService.fetch('c3r3').then(function(pivotTableData) {

			$scope.rowCnt = pivotTableData.length;
			$scope.rowHeaderCnt = 2;
			$scope.rowDataCnt = $scope.rowCnt - $scope.rowHeaderCnt;
			$scope.colCnt = _.keys(pivotTableData).length;
			$scope.colHeaderCnt = 2;
			$scope.colDataCnt = $scope.colCnt - $scope.colHeaderCnt;

			spread = $("#spreadjs").wijspread("spread").grayAreaBackColor("Transparent");
			sheet = spread.getActiveSheet();

			sheet.defaults.colWidth = 150;
			sheet.setColumnHeaderVisible(false);
			sheet.setRowHeaderVisible(false);
			sheet.setColumnHeaderVisible(false);
			sheet.setIsProtected(true);
			sheet.autoGenerateColumns = true;

			// sheet.isPaintSuspended(true);
			formatSheet();
			// validateSheet();
			// sheet.isPaintSuspended(false);

		// });
	}

	$scope.spread.updateSheet = function(data, numCols, numRows, totalColCount, totalRowCount) {

		$scope.data = data;

		$scope.rowHeaderCnt = numCols;
		$scope.colHeaderCnt = numRows;
		$scope.rowDataCnt = totalRowCount - numCols;
		$scope.colDataCnt = totalColCount - numRows;
		console.log($scope.rowHeaderCnt + ':' + $scope.colHeaderCnt);

		// sheet.isPaintSuspended(true);
		formatSheet();
		validateSheet();
		// sheet.isPaintSuspended(false);
	}

	$scope.addDataBarText = "Show Bar Chart";
	$scope.addDataBar = function() {
		var dataBarRule = new $.wijmo.wijspread.DataBarRule();
		dataBarRule.ranges = [new $.wijmo.wijspread.Range($scope.rowHeaderCnt, $scope.colHeaderCnt, $scope.rowDataCnt, $scope.colDataCnt)];
		dataBarRule.color("#E6E6E6");
		dataBarRule.showBorder(true);
		dataBarRule.borderColor("#E6E6E6");
		dataBarRule.axisPosition($.wijmo.wijspread.DataBarAxisPosition.Automatic);
		dataBarRule.axisColor("#E6E6E6");
		dataBarRule.showBarOnly(false);
		if ($scope.addDataBarText === "Show Bar Chart") {
			sheet.getConditionalFormats().addRule(dataBarRule);
			$scope.addDataBarText = "Hide Bar Chart";
		} else {
			$scope.addDataBarText = "Show Bar Chart";
			sheet.getConditionalFormats().clearRule(dataBarRule);
		}
	}

	$scope.sendToBackend = function() {
		console.log(sheet.toJSON().dataBinding.source);
	}

	function formatSheet() {

		// fakeData();
		sheet.isPaintSuspended(true);
		// for (var i = $scope.rowHeaderCnt; i < $scope.rowCnt; i++) {
		// 	for (var j = $scope.colHeaderCnt; j < $scope.colCnt; j++) {
		// 		sheet.getCell(i, j).value(1234);
		// 		// sheet.getCell(i, j).value(randomNumber(0, 2000));
		// 	}
		// }

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

		// set col style
		for (var j = 0; j < $scope.colCnt; j++) {
			var column = sheet.getColumn(j);
			column.vAlign($.wijmo.wijspread.VerticalAlign.center);
			column.textIndent(2);
			if (j < $scope.colHeaderCnt) {
				column.hAlign($.wijmo.wijspread.HorizontalAlign.left);
				column.formatter("0").foreColor("#888888");
				if (j == $scope.colHeaderCnt - 1) {
					column.borderRight(new $.wijmo.wijspread.LineBorder("#888888", $.wijmo.wijspread.LineStyle.mediumDashed));
				}
			} else {
				column.hAlign($.wijmo.wijspread.HorizontalAlign.right);
				column.formatter("$#,###");
				column.borderRight(new $.wijmo.wijspread.LineBorder("#E6E6E6", $.wijmo.wijspread.LineStyle.thin));
				if (j == $scope.colCnt - 1) {
					column.borderRight(new $.wijmo.wijspread.LineBorder("#FFFFFF", $.wijmo.wijspread.LineStyle.thin));
				}
			}
		}

		// set row style
		for (var i = 0; i < $scope.rowCnt; i++) {
			var row = sheet.getRow(i);
			row.borderBottom(new $.wijmo.wijspread.LineBorder("#E6E6E6", $.wijmo.wijspread.LineStyle.thin));
			if (i < $scope.rowHeaderCnt) {
				if (i == $scope.rowHeaderCnt - 1) {
					row.borderBottom(new $.wijmo.wijspread.LineBorder("#888888", $.wijmo.wijspread.LineStyle.mediumDashed));
				}
				sheet.setRowHeight(i, 25.0, $.wijmo.wijspread.SheetArea.viewport);
				row.formatter("0").foreColor("#888888");
				row.hAlign($.wijmo.wijspread.HorizontalAlign.center);
			} else {
				for (var j = $scope.colHeaderCnt; j < $scope.colCnt; j++) {
					sheet.getCell(i, j).locked(false);
				}

			}
		}

		// set header style
		for (var i = 0; i < $scope.rowHeaderCnt; i++) {
			for (var j = 0; j < $scope.colHeaderCnt; j++) {
				sheet.getCell(i, j).backColor("#FFFFFF");
			}
		}

		// add span
		addSpan();

		sheet.isPaintSuspended(false);
	}

	function fakeData() {

		// set fake value
		for (var i = $scope.rowHeaderCnt; i < $scope.rowCnt; i++) {
			for (var j = $scope.colHeaderCnt; j < $scope.colCnt; j++) {
				sheet.getCell(i, j).value(1234);
				// sheet.getCell(i, j).value(randomNumber(0, 2000));
			}
		}
		$timeout(function() {
			// sheet.isPaintSuspended(true);
			formatSheet();
			// sheet.isPaintSuspended(false);
		}, 100);
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
		_.each(rowOrder, function(v, k) {
			var span = rowSpan[v];
			if (span == 1) {
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
		_.each(colOrder, function(v, k) {
			var span = colSpan[v];
			if (span == 1 && level != 0) {
				return;
			}
			sheet.addSpan(min, level, span, 1);
			// add formula
			// for (var l = $scope.colHeaderCnt; l < $scope.colCnt; l++) {
			//     sheet.getCell(min, l).formula("=SUM(" + colName(l) + (min + 2) + ":" + colName(l) + (min + span) + ")");
			// }
			var cMin = min,
				cMax = min + span;
			// createColSpan(level + 1, cMin + 1, cMax - 1);
			createColSpan(level + 1, cMin, cMax - 1);
			min += span;
		});
	}

	function addSpan() {

		// header span
		for (var i = $scope.colHeaderCnt - 1; i >= 0; i--) {
			sheet.addSpan(0, i, $scope.rowHeaderCnt, 1);
		};

		// row span
		var l = 0;
		createRowSpan(l, $scope.colHeaderCnt, $scope.colCnt);
		createColSpan(l, $scope.rowHeaderCnt, $scope.rowCnt);
	}

	function colName(n) {
		var s = "";
		while (n >= 0) {
			s = String.fromCharCode(n % 26 + 97) + s;
			n = Math.floor(n / 26) - 1;
		}
		return s;
	}

	function validateSheet() {

		var dv = $.wijmo.wijspread.DefaultDataValidator.createNumberValidator($.wijmo.wijspread.ComparisonOperator.GreaterThanOrEqualsTo, 0, true);
		dv.errorMessage = "value should be a positive number";
		for (var i = $scope.colHeaderCnt; i < $scope.colCnt; i++) {
			for (var j = $scope.rowHeaderCnt; j < $scope.rowCnt; j++) {
				sheet.getCell(i, j).dataValidator(dv);
			}
		}
		spread.bind($.wijmo.wijspread.Events.ValidationError, function(event, data) {
			var dv = data.validator;
			if (dv) {
				alert(dv.errorMessage);
				data.validationResult = $.wijmo.wijspread.DataValidationResult.Discard;
			}
		});
	}

	function randomNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
}]).controller("spreadjsCtrl", ["$scope", "$timeout",
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

                spread = $("#spreadjs").wijspread("spread").grayAreaBackColor("Transparent");
                sheet = spread.getActiveSheet();

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

                // fakeData();
                // validateSheet();

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

                // set col style
                for (var j = 0; j < $scope.colCnt; j++) {
                    var column = sheet.getColumn(j);
                    column.vAlign($.wijmo.wijspread.VerticalAlign.center);
                    column.textIndent(2);
                    if (j < $scope.colHeaderCnt) {
                        column.hAlign($.wijmo.wijspread.HorizontalAlign.left);
                        column.formatter("0").foreColor("#888888");
                        if (j == $scope.colHeaderCnt - 1) {
                            column.borderRight(new $.wijmo.wijspread.LineBorder("#888888", $.wijmo.wijspread.LineStyle.mediumDashed));
                        }
                    } else {
                        column.hAlign($.wijmo.wijspread.HorizontalAlign.right);
                        column.formatter("$#,###");
                        column.borderRight(new $.wijmo.wijspread.LineBorder("#E6E6E6", $.wijmo.wijspread.LineStyle.thin));
                        if (j == $scope.colCnt - 1) {
                            column.borderRight(new $.wijmo.wijspread.LineBorder("#FFFFFF", $.wijmo.wijspread.LineStyle.thin));
                        }
                    }
                }

                // set row style
                for (var i = 0; i < $scope.rowCnt; i++) {
                    var row = sheet.getRow(i);
                    row.borderBottom(new $.wijmo.wijspread.LineBorder("#E6E6E6", $.wijmo.wijspread.LineStyle.thin));
                    if (i < $scope.rowHeaderCnt) {
                        if (i == $scope.rowHeaderCnt - 1) {
                            row.borderBottom(new $.wijmo.wijspread.LineBorder("#888888", $.wijmo.wijspread.LineStyle.mediumDashed));
                        }
                        sheet.setRowHeight(i, 25.0, $.wijmo.wijspread.SheetArea.viewport);
                        row.formatter("0").foreColor("#888888");
                        row.hAlign($.wijmo.wijspread.HorizontalAlign.center);
                    } else {
                        for (var j = $scope.colHeaderCnt; j < $scope.colCnt; j++) {
                            sheet.getCell(i, j).locked(false);
                            sheet.getCell(i, j).value(randomNumber(0, 2000));
                        }

                    }
                }

                // set header style
                for (var i = 0; i < $scope.rowHeaderCnt; i++) {
                    for (var j = 0; j < $scope.colHeaderCnt; j++) {
                        sheet.getCell(i, j).backColor("#FFFFFF");
                    }
                }

                // add span
                addSpan();
                sheet.isPaintSuspended(false);
            }

            function fakeData() {

                // set fake value
                for (var i = $scope.rowHeaderCnt; i < $scope.rowCnt; i++) {
                    for (var j = $scope.colHeaderCnt; j < $scope.colCnt; j++) {
                        sheet.getCell(i, j).value(randomNumber(0, 2000));
                    }
                }
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
                _.each(rowOrder, function(v, k) {
                    var span = rowSpan[v];
                    if (span == 1) {
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
                _.each(colOrder, function(v, k) {
                    var span = colSpan[v];
                    if (span == 1 && level != 0) {
                        return;
                    }
                    sheet.addSpan(min, level, span, 1);
                    // for (var l = $scope.colHeaderCnt; l < $scope.colCnt; l++) {
                    //     sheet.getCell(min, l).formula("=SUM(" + colName(l) + (min + 2) + ":" + colName(l) + (min + span) + ")");
                    // }
                    var cMin = min,
                        cMax = min + span;
                    // createColSpan(level + 1, cMin + 1, cMax - 1);
                    createColSpan(level + 1, cMin, cMax - 1);
                    min += span;
                });
            }

            function addSpan() {

                // header span
                for (var i = $scope.colHeaderCnt - 1; i >= 0; i--) {
                    sheet.addSpan(0, i, $scope.rowHeaderCnt, 1);
                };

                // row span
                var l = 0;
                createRowSpan(l, $scope.colHeaderCnt, $scope.colCnt);
                createColSpan(l, $scope.rowHeaderCnt, $scope.rowCnt);
            }

            $scope.spread.updateSheet = function(_data, numRows, numCols, totalCols, totalRows) {

                sheet.reset();
                $scope.data = _data;
                $scope.spread.sheet.loading = true;

                $timeout(function() {
	                $scope.spread.sheet.loading = false;
                }, (numCols + numRows) * 1000);

                $timeout(function() {
	                $scope.rowCnt = $scope.data.length;
	                $scope.rowHeaderCnt = numRows;
	                $scope.rowDataCnt = $scope.rowCnt - $scope.rowHeaderCnt;
	                // $scope.colCnt = _.keys($scope.data[0]).length;
	                $scope.colCnt = totalCols + numRows;
	                $scope.colHeaderCnt = numCols;
	                $scope.colDataCnt = $scope.colCnt - $scope.colHeaderCnt;
	                console.log($scope);
	                formatSheet();
                }, 100);
            }

            function colName(n) {
                var s = "";
                while (n >= 0) {
                    s = String.fromCharCode(n % 26 + 97) + s;
                    n = Math.floor(n / 26) - 1;
                }
                return s;
            }

            function validateSheet() {

                var dv = $.wijmo.wijspread.DefaultDataValidator.createNumberValidator($.wijmo.wijspread.ComparisonOperator.GreaterThanOrEqualsTo, 0, true);
                dv.errorMessage = "value should be a positive number";
                for (var i = $scope.colHeaderCnt; i < $scope.colCnt; i++) {
                    for (var j = $scope.rowHeaderCnt; j < $scope.rowCnt; j++) {
                        sheet.getCell(i, j).dataValidator(dv);
                    }
                }
                spread.bind($.wijmo.wijspread.Events.ValidationError, function(event, data) {
                    var dv = data.validator;
                    if (dv) {
                        alert(dv.errorMessage);
                        data.validationResult = $.wijmo.wijspread.DataValidationResult.Discard;
                    }
                });
            }

            function randomNumber(min, max) {
                return Math.floor(Math.random() * (max - min + 1) + min);
            }

            $scope.addDataBarText = "Show Bar Chart";
            $scope.addDataBar = function() {

                var dataBarRule = new $.wijmo.wijspread.DataBarRule();
                dataBarRule.ranges = [new $.wijmo.wijspread.Range($scope.rowHeaderCnt, $scope.colHeaderCnt, $scope.rowDataCnt, $scope.colDataCnt)];
                dataBarRule.color("#E6E6E6");
                dataBarRule.showBorder(true);
                dataBarRule.borderColor("#E6E6E6");
                dataBarRule.axisPosition($.wijmo.wijspread.DataBarAxisPosition.Automatic);
                dataBarRule.axisColor("#E6E6E6");
                dataBarRule.showBarOnly(false);
                if ($scope.addDataBarText === "Show Bar Chart") {
                    sheet.getConditionalFormats().addRule(dataBarRule);
                    $scope.addDataBarText = "Hide Bar Chart";
                } else {
                    $scope.addDataBarText = "Show Bar Chart";
                    sheet.getConditionalFormats().clearRule(dataBarRule);
                }
            }

            $scope.sendToBackend = function() {
                console.log(sheet.toJSON().dataBinding.source);
            }
        }
    ]);