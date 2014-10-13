'use strict';

// spreadjs controller
angular.module("ThreeSixtyOneView").controller("spreadjsCtrl", function($scope, $http, $timeout) {
	$timeout(function() { init(); }, 60);
	
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

});
