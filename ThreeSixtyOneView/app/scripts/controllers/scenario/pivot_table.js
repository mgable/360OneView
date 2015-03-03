/* global $:false, _:false */

'use strict';

angular.module("ThreeSixtyOneView").controller("PivotTableCtrl", ["$scope", "$rootScope", "$timeout", "$q", "PivotService", "CONFIG", "EVENTS", function($scope, $rootScope, $timeout, $q, PivotService, CONFIG, EVENTS) {
			var sheet = {},
				spread = {},
				pivotTableConfig = CONFIG.view.PivotTable,
				rowCnt = 0,
				rowHeaderCnt = 0,
				colCnt = 0,
				colHeaderCnt = 0,
				savingCellsCount = 0,
				setDefaultWidth = function(){
					// set default column width and height
					var maxWidth = pivotTableConfig.size.maxColumnWidth,
						minWidth = pivotTableConfig.size.minColumnWidth,
						canvasWidth = $('#pivotTablevp').width(),
						calculatedWidth = (canvasWidth / colCnt);

					if (calculatedWidth > minWidth && calculatedWidth < maxWidth) {
						sheet.defaults.colWidth = calculatedWidth;
					} else if (calculatedWidth <= minWidth) {
						sheet.defaults.colWidth = minWidth;
					} else {
						sheet.defaults.colWidth = maxWidth;
					}
				},
				setBackgroundAndBorderColor = function(){
					// set selection background and border color
					sheet.selectionBackColor(pivotTableConfig.color.msSelectionColor);
					sheet.selectionBorderColor(pivotTableConfig.color.msMediumLightGray);
				},
				setFrozenLinePositionAndColor = function(){
					// set frozenline position and color
					sheet.setFrozenRowCount(rowHeaderCnt);
					sheet.setFrozenColumnCount(colHeaderCnt);
					sheet.frozenlineColor("transparent");
				},
				hideGrid = function(){
					sheet.setGridlineOptions({showVerticalGridline: false, showHorizontalGridline: false});
				},
				addDefaultStyles = function(){
					var spreadjs = $.wijmo.wijspread,
						style = sheet.getDefaultStyle();
					style.borderLeft = new spreadjs.LineBorder(pivotTableConfig.color.msPureWhite, $.wijmo.wijspread.LineStyle.empty);
					style.borderTop = new spreadjs.LineBorder(pivotTableConfig.color.msLightGray, $.wijmo.wijspread.LineStyle.thin);
					style.borderRight = new spreadjs.LineBorder(pivotTableConfig.color.msPureWhite, $.wijmo.wijspread.LineStyle.empty);
					style.borderBottom = new spreadjs.LineBorder(pivotTableConfig.color.msLightGray, $.wijmo.wijspread.LineStyle.thin);
				},
				addColumnStyle = function(){
					for (var j = 0; j < colCnt; j++) {
						var column = sheet.getColumn(j);
						column.vAlign($.wijmo.wijspread.VerticalAlign.center);
						column.shrinkToFit(true);
						// column.textIndent(1);
						column.width(sheet.defaults.colWidth);
						if (j < colHeaderCnt) {
							column.formatter("0").font(pivotTableConfig.font.headerFontStyle).foreColor(pivotTableConfig.color.msBlack);
							column.wordWrap(true);
						}
					}
				},
				addRowStyle = function(formatObject){
					for (var i = 0; i < rowCnt; i++) {
						var row = sheet.getRow(i);
						sheet.setRowHeight(i, pivotTableConfig.size.rowHeight, $.wijmo.wijspread.SheetArea.viewport);
						if (i < rowHeaderCnt) {
							if (i === rowHeaderCnt - 1) {
								row.borderBottom(new $.wijmo.wijspread.LineBorder(pivotTableConfig.color.msMediumLightGray, $.wijmo.wijspread.LineStyle.thick));
							}
							row.formatter("0").font(pivotTableConfig.font.cellFontStyle).foreColor(pivotTableConfig.color.msMediumGray);
							row.hAlign($.wijmo.wijspread.HorizontalAlign.center);
							row.wordWrap(true);
						} else {
							for (var j = colHeaderCnt; j < colCnt; j++) {
								if(sheet.getCell(i, j).value() === null) {
									sheet.getCell(i, j).backColor(pivotTableConfig.color.msLightGray).locked(false);
								} else {
									if(!!formatObject && !!formatObject[i][j]) {
										sheet.getCell(i, j).font(pivotTableConfig.font.headerFontStyle).foreColor(pivotTableConfig.color.msBlack).locked(false).formatter(formatObject[i][j].currency + formatObject[i][j].format);
									}
								}
							}
						}
					}
				},
				createRowSpan = function (level, min, max) {
					if (level > rowHeaderCnt) {
						return;
					}
					var rowSpan = {},
						rowOrder = [];
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
						if (span === 1 && level > 0) {
							return;
						}
						sheet.addSpan(level, min, 1, span);
						var rMin = min,
							rMax = min + span;
						for(var i = 0; i < rowHeaderCnt; i++) {
							sheet.getCell(i, min).borderLeft(new $.wijmo.wijspread.LineBorder(pivotTableConfig.color.msLightGray, $.wijmo.wijspread.LineStyle.thin));
						}
						createRowSpan(level + 1, rMin, rMax - 1);
						min += span;
					});
				},
				createColSpan = function (level, min, max) {
					if (level > colHeaderCnt) {
						return;
					}
					var colSpan = {},
						colOrder = [];
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
						for(var j = 0; j < colHeaderCnt; j++) {
							sheet.getCell(min, j).borderTop(new $.wijmo.wijspread.LineBorder(pivotTableConfig.color.msLightGray, $.wijmo.wijspread.LineStyle.thin));
						}
						createColSpan(level + 1, cMin, cMax - 1);
						min += span;
					});
				},
				addSpan = function  () {
					// row span
					var l = 0;
					createRowSpan(l, colHeaderCnt, colCnt);
					createColSpan(l, rowHeaderCnt, rowCnt);
				},
				formatSheet = function (formatObject) {
					sheet.isPaintSuspended(true);

					setDefaultWidth();
					setBackgroundAndBorderColor();
					setFrozenLinePositionAndColor();
					hideGrid();
					addSpan();
					addDefaultStyles();
					addColumnStyle();
					addRowStyle(formatObject);

					sheet.isPaintSuspended(false);
				},
				cellValueChanged = function(dirtyCell) {
					// if the cell was empty, do not allow change and revert back to empty
					if(dirtyCell.oldValue === null || !angular.isNumber(dirtyCell.newValue) || Number(dirtyCell.newValue) < 0) {
						sheet.setValue(dirtyCell.row, dirtyCell.col, dirtyCell.oldValue);
						return;
					}

					$scope.setState("NOT_CALCULATED");

					var cellObject = false;

					_.each($scope.pivotTableObject[dirtyCell.row - rowHeaderCnt], function(column) {
						var match = true;
						if(!cellObject) {
							_.each(column.key.value.coordinates.columnAddresses, function(columnAddress, columnAddressIndex) {
								if(match && columnAddress.cellValue.specification.members[0].label !== sheet.getValue(columnAddressIndex, dirtyCell.col)) {
									match = false;
								}
							});
							if(match) {
								cellObject = column.key.value;
							}
						}
					});

					cellObject.oldvalue = dirtyCell.oldValue;
					cellObject.newvalue = dirtyCell.newValue;

					sheet.getCell(dirtyCell.row, dirtyCell.col).backColor(pivotTableConfig.color.msLightGray).locked(true);
					$rootScope.$broadcast(EVENTS.pivotTableStatusChange, CONFIG.application.models.PivotServiceModel.pivotDataStatus.saving);
					savingCellsCount++;
					PivotService.updateCell($scope.selectedScenarioElement.id, $scope.viewData.id, cellObject).then(function() {
						sheet.getCell(dirtyCell.row, dirtyCell.col).backColor(pivotTableConfig.color.msPureWhite).locked(false);
						if(--savingCellsCount == 0) {
							$rootScope.$broadcast(EVENTS.pivotTableStatusChange, CONFIG.application.models.PivotServiceModel.pivotDataStatus.saved);
						}
					});
				};

			// This is public because it needs to be called from the template
			$scope.init = function () {
				// get spread object
				spread = $("#pivotTable").wijspread("spread");
				// wait until spread is available then execute the rest
				if(spread) {                    // get active sheet
					sheet = spread.getActiveSheet();

					spread.grayAreaBackColor("Transparent");
					spread.scrollbarMaxAlign(true);
					sheet.setColumnHeaderVisible(false);
					sheet.setRowHeaderVisible(false);
					sheet.setColumnHeaderVisible(false);
					sheet.setIsProtected(true);
					sheet.autoGenerateColumns = true;
					sheet.clipBoardOptions($.wijmo.wijspread.ClipboardPasteOptions.Values);

					// initially clear the pivot table
					$scope.spread.updateSheet('');

					// find the cells that has been changed and request save in the backend
					spread.bind($.wijmo.wijspread.Events.ValueChanged, function (event, data) {
						var row = data.row,
							col = data.col;
						if(row === undefined || col === undefined) {
							return;
						}

						if(sheet.hasPendingChanges(row, col)) {
							var dirtyDataArray = sheet.getDirtyCells(row, col);
							if (dirtyDataArray.length > 0) {
								if(!!dirtyDataArray[0].newValue && Number(dirtyDataArray[0].oldValue) >= 0 && Number(dirtyDataArray[0].newValue) >= 0) {
									cellValueChanged(dirtyDataArray[0]);
								} else if(Number(dirtyDataArray[0].newValue) < 0 || !angular.isNumber(dirtyDataArray[0].newValue)) {
									sheet.setValue(dirtyDataArray[0].row, dirtyDataArray[0].col, dirtyDataArray[0].oldValue);
								}
							}
						}
					});

					// update all copy/paste cells in the table
					sheet.bind($.wijmo.wijspread.Events.ClipboardPasted, function (sender, args) {
						var i,
							dirtyDataArray = sheet.getDirtyCells(args.cellRange.row, args.cellRange.col, args.cellRange.rowCount, args.cellRange.colCount);

						for(i = 0; i < dirtyDataArray.length; i++) {
							cellValueChanged(dirtyDataArray[i]);
						}
					});
				}
			};


			// $scope.spread is in ScenarioCtrl and how pivottable and pivotbuilder communicate
			$scope.spread.updateSheet = function(_data_, numRows, numCols, formatObject) {
				if(_data_ !== '') {
					$scope.spread.sheet.loading = false;
					$scope.spread.sheet.empty = false;
					if(typeof _data_ === 'undefined') {
						$rootScope.$broadcast(EVENTS.pivotTableStatusChange, CONFIG.application.models.PivotServiceModel.pivotDataStatus.empty);
					} else {
						$rootScope.$broadcast(EVENTS.pivotTableStatusChange, CONFIG.application.models.PivotServiceModel.pivotDataStatus.loaded);
					}
				}

				if (_.isEmpty(_data_) && !$scope.spread.sheet.loading) {
					$scope.spread.sheet.empty = true;
				}

				if(!_.isEqual(_data_, $scope.data)) {
					$scope.data = _data_ || {};
					rowCnt = $scope.data.length;
					rowHeaderCnt = numRows;// || 2;
					colCnt = _.keys($scope.data[0]).length;
					colHeaderCnt = numCols;// || 2;

					sheet.reset();
					$timeout(function() {
						formatSheet(formatObject);
					});
				}
			};

			//init is called in the template (scenario_edit.tpl.html) because html needs to render before controller is executed
		}
	]);
