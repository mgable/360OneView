'use strict';

angular.module('ThreeSixtyOneView.services', ['dialogs.main', 'ThreeSixtyOneView.filters']);
angular.module('ThreeSixtyOneView.directives', ['ThreeSixtyOneView.services']);
angular.module('ThreeSixtyOneView.filters', []);
angular.module('ThreeSixtyOneView.config',['ui.router']);

angular.module('ThreeSixtyOneView', [
    'wijspread',
    'ngResource',
    'ngSanitize',
    'ngAnimate',
    'ui.bootstrap',
    'ui.utils',
    'dialogs.main',
    'ui.router',
    'ui.sortable',
    'ThreeSixtyOneView.directives',
    'ThreeSixtyOneView.services',
    'ThreeSixtyOneView.config'
]);
/*
 *
 * SpreadJS Library 3.20143.14
 * http://wijmo.com/
 *
 * Copyright(c) GrapeCity, Inc.  All rights reserved.
 *
 * Licensed under the Wijmo Commercial License. Also available under the GNU GPL Version 3 license.
 * licensing@wijmo.com
 * http://wijmo.com/widgets/license/
 *
 *
 **/

/*
 *
 * SpreadJS Library 3.20143.14
 * http://wijmo.com/
 *
 * Copyright(c) GrapeCity, Inc.  All rights reserved.
 *
 * Licensed under the Wijmo Commercial License. Also available under the GNU GPL Version 3 license.
 * licensing@wijmo.com
 * http://wijmo.com/widgets/license/
 *
 *
 **/
(function(){
    var m = angular.module("wijspread", []);
    function ColumnWrapper(index)
    {
        this.headerText = "";
        this.dataField = ""
    }
    ColumnWrapper.prototype = {
        width: function(value)
        {
            if (arguments.length === 0)
            {
                if (this.column)
                {
                    return this.column.width()
                }
                return undefined
            }
            else
            {
                this._width = value;
                if (this.column)
                {
                    this.column.width(value)
                }
                return this
            }
        }, visible: function(value)
            {
                if (arguments.length === 0)
                {
                    if (this.column)
                    {
                        return this.column.visible()
                    }
                    return undefined
                }
                else
                {
                    this._visible = value;
                    if (this.column)
                    {
                        this.column.visible(value)
                    }
                    return this
                }
            }, resizable: function(value)
            {
                if (arguments.length === 0)
                {
                    if (this.column)
                    {
                        return this.column.resizable()
                    }
                    return undefined
                }
                else
                {
                    this._resizable = value;
                    if (this.column)
                    {
                        this.column.resizable(value)
                    }
                    return this
                }
            }, defaultStyle: function(value)
            {
                if (arguments.length === 0)
                {
                    if (this.sheet)
                    {
                        return this.sheet.getStyle(-1, this.index, $.wijmo.wijspread.SheetArea.viewport)
                    }
                    return null
                }
                else
                {
                    this._defaultStyle = value;
                    if (this.sheet)
                    {
                        this.sheet.setStyle(-1, this.index, value, $.wijmo.wijspread.SheetArea.viewport)
                    }
                    return this
                }
            }, attach: function(sheet, column, index)
            {
                this.sheet = sheet;
                this.column = column;
                this.index = index;
                this.updata()
            }, updata: function()
            {
                this.sheet.suspendEvent();
                if (this._width !== undefined)
                {
                    this.column.width(this.width)
                }
                if (this._visible !== undefined)
                {
                    this.column.visible(this._visible)
                }
                if (this._resizable !== undefined)
                {
                    this.column.resizable(this._resizable)
                }
                if (this._defaultStyle)
                {
                    this.sheet.setStyle(-1, this.index, this._defaultStyle, $.wijmo.wijspread.SheetArea.viewport)
                }
                if (this.autoFit)
                {
                    this.sheet.autoFitColumn(this.index)
                }
                this.sheet.resumeEvent()
            }
    };
    $.wijmo.wijspread.ColumnWrapper = ColumnWrapper;
    function lineBorderConverter(stringValue)
    {
        if (!stringValue)
        {
            return undefined
        }
        stringValue = stringValue.trim();
        var parts;
        if (stringValue.indexOf(",") >= 0)
        {
            parts = stringValue.split(",")
        }
        else
        {
            parts = stringValue.split(" ")
        }
        var lineBorder = new $.wijmo.wijspread.LineBorder;
        lineBorder.color = parts[0].trim();
        if (parts.length > 1)
        {
            lineBorder.style = $.wijmo.wijspread.LineStyle[parts[1].trim()]
        }
        return lineBorder
    }
    function setValidator(style, validatorType, value)
    {
        if (!style || !validatorType)
        {
            return
        }
        validatorType = validatorType.toLowerCase();
        var validator;
        if (validatorType === "numbervalidator")
        {
            validator = $.wijmo.wijspread.DefaultDataValidator.createNumberValidator(value.comparisonOperator, value.value1, value.value2, value.isIntegervalue)
        }
        else if (validatorType === "datevalidator")
        {
            validator = $.wijmo.wijspread.DefaultDataValidator.createDateValidator(value.comparisonOperator, value.value1, value.value2)
        }
        else if (validatorType === "textlengthvalidator")
        {
            validator = $.wijmo.wijspread.DefaultDataValidator.createTextLengthValidator(value.comparisonOperator, value.value1, value.value2)
        }
        else if (validatorType === "formulavalidator")
        {
            validator = $.wijmo.wijspread.DefaultDataValidator.createFormulaValidator(value.formula)
        }
        else if (validatorType === "formulalistvalidator")
        {
            validator = $.wijmo.wijspread.DefaultDataValidator.createFormulaListValidator(value.formulaList)
        }
        else if (validatorType === "listvalidator")
        {
            validator = $.wijmo.wijspread.DefaultDataValidator.createListValidator(value.list)
        }
        if (validator)
        {
            if (value.ignoreBlank !== undefined)
            {
                validator.ignoreBlank = value.ignoreBlank
            }
            if (value.inCellDropdown !== undefined)
            {
                validator.inCellDropdown = value.inCellDropdown
            }
            if (value.showInputMessage !== undefined)
            {
                validator.showInputMessage = value.showInputMessage
            }
            if (value.showErrorMessage !== undefined)
            {
                validator.showErrorMessage = value.showErrorMessage
            }
            if (value.errorStyle !== undefined)
            {
                validator.errorStyle = value.errorStyle
            }
            if (value.inputMessage !== undefined)
            {
                validator.inputMessage = value.inputMessage
            }
            if (value.inputTitle !== undefined)
            {
                validator.inputTitle = value.inputTitle
            }
            if (value.errorMessage !== undefined)
            {
                validator.errorMessage = value.errorMessage
            }
            if (value.errorTitle !== undefined)
            {
                validator.errorTitle = value.errorTitle
            }
            style.validator = validator
        }
    }
    function setDataValidationResult(spread, name, value)
    {
        spread._angularDataValidationResult = value
    }
    function setComboboxItems(comboBoxCellType, itemType, value)
    {
        if (value.text === undefined && value.value === undefined)
        {
            return
        }
        if (value.text === undefined)
        {
            value.text = value.value
        }
        else if (value.value === undefined)
        {
            value.value = value.text
        }
        var items;
        if (!comboBoxCellType.items())
        {
            items = [];
            comboBoxCellType.items(items)
        }
        else
        {
            items = comboBoxCellType.items()
        }
        items.push(value)
    }
    function setSheetGroup(sheet, groupType, value)
    {
        if (groupType && value.groups)
        {
            groupType = groupType.toLowerCase().trim();
            angular.forEach(value.groups, function(groupInfo)
            {
                if (groupType === "rowrangegroup")
                {
                    sheet.rowRangeGroup.group(groupInfo.index, groupInfo.count)
                }
                else
                {
                    sheet.colRangeGroup.group(groupInfo.index, groupInfo.count)
                }
            })
        }
    }
    function addGroup(rangeGroup, groupType, value)
    {
        if (!rangeGroup.groups)
        {
            rangeGroup.groups = []
        }
        rangeGroup.groups.push(value)
    }
    function addColumns(sheet, type, value)
    {
        if (!rangeGroup.groups)
        {
            rangeGroup.groups = []
        }
        rangeGroup.groups.push(value)
    }
    function getCurrentTheme(sheet, property)
    {
        return sheet[property].call(sheet).name()
    }
    function setColumns(sheet, name, value)
    {
        sheet._columnDefs = value
    }
    function setSheets(spread, name, value)
    {
        spread._sheetDefs = value;
        value.spread = spread
    }
    function addColumn(columns, name, value)
    {
        columns.push(value)
    }
    function addSheet(sheets, name, value)
    {
        sheets.push(value);
        sheets.spread.addSheet(sheets.length - 1, value)
    }
    function setDataSource(sheet, name, value)
    {
        sheet._angularDataSource = value
    }
    function setBorder(border, name, value)
    {
        if (!border.borderLeft)
        {
            border.borderLeft = value
        }
        if (!border.borderTop)
        {
            border.borderTop = value
        }
        if (!border.borderRight)
        {
            border.borderRight = value
        }
        if (!border.borderBottom)
        {
            border.borderBottom = value
        }
    }
    var styleDef = {
            backcolor: {
                type: "string", name: "backColor"
            }, forecolor: {
                    type: "string", name: "foreColor"
                }, halign: {
                    type: "enum, HorizontalAlign", name: "hAlign"
                }, valign: {
                    type: "enum, VerticalAlign", name: "vAlign"
                }, font: {
                    type: "string", name: "font"
                }, themefont: {
                    type: "string", name: "themeFont"
                }, formatter: {
                    type: "string", name: "formatter"
                }, border: {
                    type: "LineBordeer", name: "border", getProperties: ["borderLeft", "borderTop", "borderRight", "borderBottom"], setFunction: setBorder, converter: lineBorderConverter
                }, borderleft: {
                    type: "LineBorder", name: "borderLeft", converter: lineBorderConverter
                }, bordertop: {
                    type: "LineBorder", name: "borderTop", converter: lineBorderConverter
                }, borderright: {
                    type: "LineBorder", name: "borderRight", converter: lineBorderConverter
                }, borderbottom: {
                    type: "LineBorder", name: "borderBottom", converter: lineBorderConverter
                }, locked: {
                    type: "boolean", name: "locked"
                }, wordwrap: {
                    type: "boolean", name: "wordWrap"
                }, textindent: {
                    type: "number", name: "textIndent"
                }, shrinktofit: {
                    type: "boolean", name: "shrinkToFit"
                }, backgroundimage: {
                    type: "string", name: "backgroundImage"
                }, backgroundimagelayout: {
                    type: "enum, ImageLayout", name: "backgroundImageLayout"
                }, numbervalidator: {
                    type: "object", name: "numberValidator", setFunction: setValidator, properties: {
                            comparisonoperator: {
                                type: "enum,ComparisonOperator", name: "comparisonOperator"
                            }, value1: {
                                    type: "string", name: "value1"
                                }, value2: {
                                    type: "string", name: "value2"
                                }, isintegervalue: {
                                    type: "boolean", name: "isIntegerValue"
                                }
                        }
                }, datevalidator: {
                    type: "object", name: "dateValidator", setFunction: setValidator, properties: {
                            comparisonoperator: {
                                type: "enum,ComparisonOperator", name: "comparisonOperator"
                            }, value1: {
                                    type: "string", name: "value1"
                                }, value2: {
                                    type: "string", name: "value2"
                                }
                        }
                }, textlengthvalidator: {
                    type: "object", name: "textLengthValidator", setFunction: setValidator, properties: {
                            comparisonoperator: {
                                type: "enum,ComparisonOperator", name: "comparisonOperator"
                            }, value1: {
                                    type: "string", name: "value1"
                                }, value2: {
                                    type: "string", name: "value2"
                                }
                        }
                }, formulavalidator: {
                    type: "object", name: "formulaValidator", setFunction: setValidator, properties: {formula: {
                                type: "string", name: "formula"
                            }}
                }, formulalistvalidator: {
                    type: "object", name: "formulaListValidator", setFunction: setValidator, properties: {formulalist: {
                                type: "string", name: "formulaList"
                            }}
                }, listvalidator: {
                    type: "object", name: "listValidator", setFunction: setValidator, properties: {list: {
                                type: "string", name: "list"
                            }}
                }, textcelltype: {
                    type: "TextCellType", name: "cellType", properties: {}
                }, buttoncelltype: {
                    type: "ButtonCellType", name: "cellType", properties: {
                            buttonbackcolor: {
                                type: "string", name: "buttonBackColor", setFunction: "buttonBackColor"
                            }, marginleft: {
                                    type: "number", name: "marginLeft", setFunction: "marginLeft"
                                }, margintop: {
                                    type: "number", name: "marginTop", setFunction: "marginTop"
                                }, marginright: {
                                    type: "number", name: "marginRight", setFunction: "marginRight"
                                }, marginbottom: {
                                    type: "number", name: "marginBottom", setFunction: "marginBottom"
                                }, text: {
                                    type: "string", name: "text", setFunction: "text"
                                }
                        }
                }, checkboxcelltype: {
                    type: "CheckBoxCellType", name: "cellType", properties: {
                            caption: {
                                type: "string", name: "caption", setFunction: "caption"
                            }, isthreestate: {
                                    type: "boolean", name: "isThreeState", setFunction: "isThreeState"
                                }, textalign: {
                                    type: "enum,CheckBoxTextAlign", name: "textAlign", setFunction: "textAlign"
                                }, textfalse: {
                                    type: "string", name: "textFalse", setFunction: "textFalse"
                                }, textindeterminate: {
                                    type: "string", name: "textIndeterminate", setFunction: "textIndeterminate"
                                }, texttrue: {
                                    type: "string", name: "textTrue", setFunction: "textTrue"
                                }
                        }
                }, comboboxcelltype: {
                    type: "ComboBoxCellType", name: "cellType", properties: {
                            editorvaluetype: {
                                type: "enum,EditorValueType", name: "editorValueType", setFunction: "editorValueType"
                            }, item: {
                                    type: "object", name: "items", setFunction: setComboboxItems, properties: {
                                            value: {
                                                type: "string", name: "value"
                                            }, text: {
                                                    type: "string", name: "text"
                                                }
                                        }
                                }
                        }
                }, hyperlinkcelltype: {
                    type: "HyperLinkCellType", name: "cellType", properties: {
                            linkcolor: {
                                type: "string", name: "linkColor", setFunction: "linkColor"
                            }, linktooltip: {
                                    type: "string", name: "linkToolTip", setFunction: "linkToolTip"
                                }, text: {
                                    type: "string", name: "text", setFunction: "text"
                                }, visitedlinkcolor: {
                                    type: "string", name: "visitedLinkColor", setFunction: "visitedLinkColor"
                                }
                        }
                }
        };
    var validators = ["numbervalidator", "datevalidator", "textlengthvalidator", "formulavalidator", "formulalistvalidator", "listvalidator"];
    for (var i = 0; i < validators.length; i++)
    {
        var validatorProperties = styleDef[validators[i]]["properties"];
        validatorProperties["ignoreblank"] = {
            type: "boolean", name: "ignoreBlank"
        };
        validatorProperties["incelldropdown"] = {
            type: "boolean", name: "inCellDropdown"
        };
        validatorProperties["showinputmessage"] = {
            type: "boolean", name: "showInputMessage"
        };
        validatorProperties["showerrormessage"] = {
            type: "boolean", name: "showErrorMessage"
        };
        validatorProperties["errorstyle"] = {
            type: "enum, ErrorStyle", name: "errorStyle"
        };
        validatorProperties["inputmessage"] = {
            type: "string", name: "inputMessage"
        };
        validatorProperties["inputtitle"] = {
            type: "string", name: "inputTitle"
        };
        validatorProperties["errormessage"] = {
            type: "string", name: "errorMessage"
        };
        validatorProperties["errortitle"] = {
            type: "string", name: "errorTitle"
        }
    }
    var groupDef = {group: {
                type: "object", name: "group", setFunction: addGroup, properties: {
                        index: {
                            type: "number", name: "index"
                        }, count: {
                                type: "number", name: "count"
                            }
                    }
            }};
    var columnPropertyMap = {
            datafield: {
                type: "string", name: "dataField"
            }, headertext: {
                    type: "string", name: "headerText"
                }, width: {
                    type: "number", name: "width", setFunction: "width", getFunction: "width"
                }, visible: {
                    type: "boolean", name: "visible", setFunction: "visible", getFunction: "visible"
                }, resizable: {
                    type: "boolean", name: "resizable", setFunction: "resizable", getFunction: "resizable"
                }, defaultstyle: {
                    type: "Style", name: "defaultStyle", setFunction: "defaultStyle", getFunction: "defaultStyle", properties: styleDef
                }, autofit: {
                    type: "boolean", name: "autoFit"
                }
        };
    var columnsDef = {column: {
                type: "ColumnWrapper", name: "column", setFunction: addColumn, properties: columnPropertyMap
            }};
    var sheetPropertyMap = {
            name: {
                type: "string", name: "name", setFunction: "setName", getFunction: "getName"
            }, referencestyle: {
                    type: "enum, ReferenceStyle", name: "referenceStyle", setFunction: "referenceStyle", getFunction: "referenceStyle"
                }, frozentrailingcolumncount: {
                    type: "number", name: "frozenTrailingColumnCount", setFunction: "setFrozenTrailingColumnCount", getFunction: "getFrozenTrailingColumnCount"
                }, frozentrailingrowcount: {
                    type: "number", name: "frozenTrailingRowCount", setFunction: "setFrozenTrailingRowCount", getFunction: "getFrozenTrailingRowCount"
                }, frozencolumncount: {
                    type: "number", name: "frozenColumnCount", setFunction: "setFrozenColumnCount", getFunction: "getFrozenColumnCount"
                }, frozenrowcount: {
                    type: "number", name: "frozenRowCount", setFunction: "setFrozenRowCount", getFunction: "getFrozenRowCount"
                }, defaultstyle: {
                    type: "Style", name: "defaultStyle", setFunction: {
                            name: "setDefaultStyle", args: ["$value-replace$", $.wijmo.wijspread.SheetArea.viewport]
                        }, properties: styleDef
                }, rowheaderdefaultstyle: {
                    type: "Style", name: "rowHeaderDefaultStyle", setFunction: {
                            name: "setDefaultStyle", args: ["$value-replace$", $.wijmo.wijspread.SheetArea.rowHeader]
                        }, properties: styleDef
                }, columnheaderdefaultstyle: {
                    type: "Style", name: "columnHeaderDefaultStyle", setFunction: {
                            name: "setDefaultStyle", args: ["$value-replace$", $.wijmo.wijspread.SheetArea.colHeader]
                        }, properties: styleDef
                }, cornerheaderdefaultstyle: {
                    type: "Style", name: "cornerHeaderDefaultStyle", setFunction: {
                            name: "setDefaultStyle", args: ["$value-replace$", $.wijmo.wijspread.SheetArea.corner]
                        }, properties: styleDef
                }, allowcelloverflow: {
                    type: "boolean", name: "allowCellOverflow", setFunction: "allowCellOverflow", getFunction: "allowCellOverflow"
                }, frozenlinecolor: {
                    type: "string", name: "frozenlineColor", setFunction: "frozenlineColor", getFunction: "frozenlineColor"
                }, sheettabcolor: {
                    type: "string", name: "sheetTabColor", setFunction: "sheetTabColor", getFunction: "sheetTabColor"
                }, rowcount: {
                    type: "number", name: "rowCount", setFunction: "setRowCount", getFunction: "getRowCount"
                }, selectionpolicy: {
                    type: "enum, SelectionPolicy", name: "selectionPolicy", setFunction: "selectionPolicy", getFunction: "selectionPolicy"
                }, selectionunit: {
                    type: "enum,SelectionUnit", name: "selectionUnit", setFunction: "selectionUnit", getFunction: "selectionUnit"
                }, zoom: {
                    type: "number", name: "zoom", setFunction: "zoom", getFunction: "zoom"
                }, currenttheme: {
                    type: "string", name: "currentTheme", setFunction: "currentTheme", getFunction: getCurrentTheme
                }, clipboardoptions: {
                    type: "enum,ClipboardPasteOptions", name: "clipBoardOptions", setFunction: "clipBoardOptions", getFunction: "clipBoardOptions"
                }, canuserdragfill: {
                    type: "boolean", name: "canUserDragFill", setFunction: "canUserDragFill", getFunction: "canUserDragFill"
                }, canuserdragdrop: {
                    type: "boolean", name: "canUserDragDrop", setFunction: "canUserDragDrop", getFunction: "canUserDragDrop"
                }, rowheadervisible: {
                    type: "boolean", name: "rowHeaderVisible", setFunction: "setRowHeaderVisible", getFunction: "getRowHeaderVisible"
                }, columnheadervisible: {
                    type: "boolean", name: "columnHeaderVisible", setFunction: "setColumnHeaderVisible", getFunction: "getColumnHeaderVisible"
                }, rowheaderautotext: {
                    type: "enum, HeaderAutoText", name: "rowHeaderAutoText", setFunction: "setRowHeaderAutoText", getFunction: "getRowHeaderAutoText"
                }, columnheaderautotext: {
                    type: "enum, HeaderAutoText", name: "columnHeaderAutoText", setFunction: "setColumnHeaderAutoText", getFunction: "getColumnHeaderAutoText"
                }, rowheaderautotextindex: {
                    type: "number", name: "rowHeaderAutoTextIndex", setFunction: "setRowHeaderAutoTextIndex", getFunction: "getRowHeaderAutoTextIndex"
                }, columnheaderautotextindex: {
                    type: "number", name: "columnHeaderAutoTextIndex", setFunction: "setColumnHeaderAutoTextIndex", getFunction: "getColumnHeaderAutoTextIndex"
                }, isprotected: {
                    type: "boolean", name: "isProtected", setFunction: "setIsProtected", getFunction: "getIsProtected"
                }, showrowrangegroup: {
                    type: "boolean", name: "showRowRangeGroup", setFunction: "showRowRangeGroup", getFunction: "showRowRangeGroup"
                }, showcolumnrangegroup: {
                    type: "boolean", name: "showColumnRangeGroup", setFunction: "showColumnRangeGroup", getFunction: "showColumnRangeGroup"
                }, rowrangegroup: {
                    type: "object", name: "rowRangeGroup", setFunction: setSheetGroup, properties: groupDef
                }, colrangegroup: {
                    type: "object", name: "colRangeGroup", setFunction: setSheetGroup, properties: groupDef
                }, selectionbackcolor: {
                    type: "string", name: "selectionBackColor", setFunction: "selectionBackColor", getFunction: "selectionBackColor"
                }, selectionbordercolor: {
                    type: "string", name: "selectionBorderColor", setFunction: "selectionBorderColor", getFunction: "selectionBorderColor"
                }, columns: {
                    type: "[]", name: "columns", setFunction: setColumns, properties: columnsDef
                }, datasource: {
                    type: "[]", name: "dataSource", setFunction: setDataSource
                }, datasourcedeepwatch: {
                    type: "boolean", name: "dataSourceDeepWatch"
                }
        };
    var sheetsDef = {sheet: {
                type: "Sheet", name: "sheet", setFunction: addSheet, properties: sheetPropertyMap
            }};
    var spreadPropertyMap = {
            name: {
                type: "string", name: "name"
            }, usewijmotheme: {
                    type: "boolean", name: "useWijmoTheme"
                }, allowuserzoom: {
                    type: "boolean", name: "allowUserZoom", setFunction: "allowUserZoom", getFunction: "allowUserZoom"
                }, allowuserresize: {
                    type: "boolean", name: "allowUserResize", setFunction: "allowUserResize", getFunction: "allowUserResize"
                }, tabstripvisible: {
                    type: "boolean", name: "tabStripVisible", setFunction: "tabStripVisible", getFunction: "tabStripVisible"
                }, tabeditable: {
                    type: "boolean", name: "tabEditable", setFunction: "tabEditable", getFunction: "tabEditable"
                }, newtabvisible: {
                    type: "boolean", name: "newTabVisible", setFunction: "newTabVisible", getFunction: "newTabVisible"
                }, canusereditformula: {
                    type: "boolean", name: "canUserEditFormula", setFunction: "canUserEditFormula", getFunction: "canUserEditFormula"
                }, autofittype: {
                    type: "enum, AutoFitType", name: "autoFitType", setFunction: "autoFitType", getFunction: "autoFitType"
                }, canuserdragfill: {
                    type: "boolean", name: "canUserDragFill", setFunction: "canUserDragFill", getFunction: "canUserDragFill"
                }, canuserdragdrop: {
                    type: "boolean", name: "canUserDragDrop", setFunction: "canUserDragDrop", getFunction: "canUserDragDrop"
                }, highlightinvaliddata: {
                    type: "boolean", name: "highlightInvalidData", setFunction: "highlightInvalidData", getFunction: "highlightInvalidData"
                }, referencestyle: {
                    type: "enum, ReferenceStyle", name: "referenceStyle", setFunction: "referenceStyle", getFunction: "referenceStyle"
                }, backcolor: {
                    type: "string", name: "backColor", setFunction: "backColor", getFunction: "backColor"
                }, grayareabackcolor: {
                    type: "string", name: "grayAreaBackColor", setFunction: "grayAreaBackColor", getFunction: "grayAreaBackColor"
                }, backgroundimage: {
                    type: "string", name: "backgroundImage", setFunction: "backgroundImage", getFunction: "backgroundImage"
                }, backgroundimagelayout: {
                    type: "enum, ImageLayout", name: "backgroundImageLayout", setFunction: "backgroundImageLayout", getFunction: "backgroundImageLayout"
                }, showverticalscrollbar: {
                    type: "boolean", name: "showVerticalScrollbar", setFunction: "showVerticalScrollbar", getFunction: "showVerticalScrollbar"
                }, showhorizontalscrollbar: {
                    type: "boolean", name: "showHorizontalScrollbar", setFunction: "showHorizontalScrollbar", getFunction: "showHorizontalScrollbar"
                }, showscrolltip: {
                    type: "enum, ShowScrollTip", name: "showScrollTip", setFunction: "showScrollTip", getFunction: "showScrollTip"
                }, showresizetip: {
                    type: "enum, ShowResizeTip", name: "showResizeTip", setFunction: "showResizeTip", getFunction: "showResizeTip"
                }, showdragdroptip: {
                    type: "boolean", name: "showDragDropTip", setFunction: "showDragDropTip", getFunction: "showDragDropTip"
                }, showdragfilltip: {
                    type: "boolean", name: "showDragFillTip", setFunction: "showDragFillTip", getFunction: "showDragFillTip"
                }, datavalidationresult: {
                    type: "enum, DataValidationResult", name: "DataValidationResult", setFunction: setDataValidationResult
                }, sheets: {
                    type: "[]", name: "sheets", setFunction: setSheets, properties: sheetsDef
                }
        };
    var Node;
    (function(Node)
    {
        Node._map = [];
        Node.ELEMENT_NODE = 1;
        Node.ATTRIBUTE_NODE = 2;
        Node.TEXT_NODE = 3;
        Node.CDATA_SECTION_NODE = 4;
        Node.ENTITY_REFERENCE_NODE = 5;
        Node.ENTITY_NODE = 6;
        Node.PROCESSING_INSTRUCTION_NODE = 7;
        Node.COMMENT_NODE = 8;
        Node.DOCUMENT_NODE = 9;
        Node.DOCUMENT_TYPE_NODE = 10;
        Node.DOCUMENT_FRAGMENT_NODE = 11;
        Node.NOTATION_NODE = 12
    })(Node || (Node = {}));
    var SpreadAngularManager;
    (function(SpreadAngularManager)
    {
        var ngMgr = SpreadAngularManager;
        SpreadAngularManager.setValues = function(scope)
        {
            if (ngMgr.valueCatch)
            {
                angular.forEach(ngMgr.valueCatch, function(catchObject)
                {
                    var target = catchObject.target;
                    angular.forEach(catchObject.setting, function(propertySet)
                    {
                        var nodeDef = propertySet.nodeDef;
                        var value = propertySet.value;
                        ngMgr.setPropertyValue(target, nodeDef, value)
                    })
                })
            }
            ;
        };
        SpreadAngularManager.setBindings = function(scope)
        {
            var parentScope = scope.$parent;
            if (ngMgr.bindings)
            {
                angular.forEach(ngMgr.bindings, function(attBinding)
                {
                    if (attBinding.dynamicText)
                    {
                        var bindingPath = attBinding.dynamicText.substring(2, attBinding.dynamicText.length - 2);
                        if (!attBinding.target._angularBindingPath)
                        {
                            attBinding.target._angularBindingPath = {}
                        }
                        attBinding.target._angularBindingPath[attBinding.name] = bindingPath;
                        var bindingPathLowerCase = bindingPath;
                        if (parentScope[bindingPathLowerCase] === undefined)
                        {
                            parentScope[bindingPathLowerCase] = SpreadAngularManager.getPropertyValue(attBinding.target, attBinding.metadata)
                        }
                        else
                        {
                            ngMgr.setPropertyValue(attBinding.target, attBinding.metadata, parentScope[bindingPathLowerCase])
                        }
                        parentScope.$watch(bindingPath, function(value)
                        {
                            ngMgr.setPropertyValue(attBinding.target, attBinding.metadata, value)
                        })
                    }
                })
            }
            ;
        };
        SpreadAngularManager.initSpread = function(scope, element, attrs)
        {
            var node = element[0];
            ngMgr._readNodeWithChildren(scope, node, spreadPropertyMap, "sheets", false)
        };
        SpreadAngularManager._readNodeWithChildren = function(target, node, map, excludeChildren, setValueDirectly)
        {
            if (!setValueDirectly)
            {
                if (!ngMgr.valueCatch)
                {
                    ngMgr.valueCatch = []
                }
                var catchObject;
                angular.forEach(ngMgr.valueCatch, function(catchTmp)
                {
                    if (catchTmp.target === target)
                    {
                        catchObject = catchTmp
                    }
                });
                if (!catchObject)
                {
                    catchObject = {
                        target: target, setting: []
                    };
                    ngMgr.valueCatch.push(catchObject)
                }
            }
            angular.forEach(node.attributes, function(attNode)
            {
                ngMgr._readNode(target, attNode, map, catchObject, setValueDirectly)
            });
            if (node.childNodes.length > 0)
            {
                angular.forEach(node.childNodes, function(childNode)
                {
                    var nodeName = childNode.nodeName.toLowerCase();
                    nodeName = ngMgr.normalizeName(nodeName);
                    var nodeDef = map[nodeName];
                    if (!nodeDef || !nodeDef.type)
                    {
                        return
                    }
                    var childTarget;
                    if (nodeDef.type === "object")
                    {
                        childTarget = {}
                    }
                    else if (nodeDef.type === "[]")
                    {
                        childTarget = []
                    }
                    else
                    {
                        var type = $.wijmo.wijspread[nodeDef.type];
                        if (!type)
                        {
                            return
                        }
                        childTarget = new type
                    }
                    if (nodeDef.name === "sheets" || nodeDef.name === "sheet" || nodeDef.name === "columns" || nodeDef.name === "column")
                    {
                        ngMgr._readNodeWithChildren(childTarget, childNode, nodeDef.properties, undefined, false)
                    }
                    else
                    {
                        ngMgr._readNodeWithChildren(childTarget, childNode, nodeDef.properties, undefined, true)
                    }
                    if (setValueDirectly)
                    {
                        ngMgr.setPropertyValue(target, nodeDef, childTarget)
                    }
                    else
                    {
                        catchObject.setting.push({
                            nodeDef: nodeDef, value: childTarget
                        })
                    }
                })
            }
        };
        SpreadAngularManager.convertValue = function(value, targetType, converter)
        {
            if (converter)
            {
                return converter.call(null, value)
            }
            if (value === undefined || targetType === undefined)
            {
                return value
            }
            if (typeof value === "string")
            {
                value = value.trim()
            }
            if (targetType.length > 2 && targetType[0] === "[")
            {
                var argType = targetType.substring(1, targetType.length - 2);
                if (value.length > 2)
                {
                    if (value[0] === "[" && value[value.length - 1] === "]")
                    {
                        value = value.substring(1, value.length - 2)
                    }
                    var partsValue = value.split(",");
                    var result = [];
                    for (var i = 0; i < partsValue.length; i++)
                    {
                        result.push(ngMgr.convertValue(partsValue[i], argType, converter))
                    }
                    return result
                }
            }
            switch (targetType)
            {
                case"string":
                    return value;
                case"boolean":
                    if (typeof value === "boolean")
                    {
                        return value
                    }
                    if (value.toLowerCase() === "true")
                    {
                        return true
                    }
                    else if (value.toLowerCase() === "false")
                    {
                        return false
                    }
                    return Boolean(value);
                case"number":
                    return Number(value);
                case"color":
                    return value;
                case"[]":
                    return value
            }
            if (targetType.length > 5 && targetType.substring(0, 5) === "enum,")
            {
                if (typeof value === "number" || typeof value === "string" && parseInt(value) !== undefined && !isNaN(parseInt(value)))
                {
                    result = parseInt(value)
                }
                else
                {
                    targetType = targetType.substring(5).trim();
                    var resultType = $.wijmo.wijspread;
                    if (targetType.indexOf(".") > 0)
                    {
                        var parts = name.split(".");
                        for (var i = 0; i < parts.length; i++)
                        {
                            resultType = result[parts[i]]
                        }
                    }
                    else
                    {
                        resultType = resultType[targetType]
                    }
                    result = resultType[value];
                    if (result === undefined)
                    {
                        value = value[0].toUpperCase() + value.substring(1);
                        result = resultType[value]
                    }
                }
                return result
            }
            return value
        };
        SpreadAngularManager.normalizeName = function(name)
        {
            if (name.match(/-/))
            {
                var parts = name.split("-");
                name = parts.shift();
                angular.forEach(parts, function(p)
                {
                    name += p
                })
            }
            return name
        };
        SpreadAngularManager._readNode = function(target, node, map, catchObject, setValueDirectly)
        {
            var $node = $(node),
                value,
                name,
                propPath;
            switch (node.nodeType)
            {
                case Node.ATTRIBUTE_NODE:
                    value = $node.val();
                    break;
                case Node.ELEMENT_NODE:
                    value = $node.text();
                    break;
                default:
                    return
            }
            name = node.nodeName || node.name;
            name = name.toLowerCase();
            name = ngMgr.normalizeName(name);
            var metadata = map[name];
            if (metadata)
            {
                name = metadata.name
            }
            else
            {
                return
            }
            if (!ngMgr.hasChildElements(node) && value && value.length > 4 && value.substring(0, 2) === "{{" && value.substring(value.length - 2) === "}}")
            {
                if (!ngMgr.bindings)
                {
                    ngMgr.bindings = []
                }
                ngMgr.bindings.push({
                    target: target, metadata: metadata, path: name, name: name, dynamicText: value
                });
                return
            }
            if (value.match(/^[^\d]/) && node.nodeType === Node.ATTRIBUTE_NODE && (metadata.changeEvent || metadata.twoWayBinding))
            {
                if (!ngMgr.bindings)
                {
                    ngMgr.bindings = []
                }
                _ngMgr.bindings.push({
                    target: target, path: (path && path + ".") + name, name: name, expression: value
                })
            }
            else if (node.nodeType === Node.ATTRIBUTE_NODE)
            {
                if (setValueDirectly)
                {
                    ngMgr.setPropertyValue(target, metadata, value)
                }
                else
                {
                    catchObject.setting.push({
                        nodeDef: metadata, value: value
                    })
                }
            }
            else
            {}
        };
        SpreadAngularManager.setPropertyValue = function(target, metadata, value)
        {
            if (value === undefined)
            {
                return
            }
            if (target.$scopeObject)
            {
                target = target.$scopeObject
            }
            try
            {
                value = ngMgr.convertValue(value, metadata.type, metadata.converter);
                if (metadata.setFunction)
                {
                    if (typeof metadata.setFunction === "function")
                    {
                        metadata.setFunction.call(ngMgr, target, metadata.name, value)
                    }
                    else
                    {
                        ngMgr.setPropertyValueCore(target, value, undefined, metadata.setFunction)
                    }
                }
                else
                {
                    ngMgr.setPropertyValueCore(target, value, metadata.name);
                    target[metadata.name] = value
                }
            }
            catch(ex) {}
        };
        SpreadAngularManager.setPropertyValueCore = function(target, value, propertyName, setFunction)
        {
            if (propertyName)
            {
                target[propertyName] = value
            }
            else if (setFunction)
            {
                if (typeof setFunction === "string")
                {
                    target[setFunction].call(target, value)
                }
                else
                {
                    var functionName = setFunction.name;
                    var args = [];
                    for (var i = 0; i < setFunction.args.length; i++)
                    {
                        if (setFunction.args[i] === "$value-replace$")
                        {
                            args[i] = value
                        }
                        else
                        {
                            args[i] = setFunction.args[i]
                        }
                    }
                    switch (args.length)
                    {
                        case 1:
                            target[functionName].call(target, args[0]);
                            break;
                        case 2:
                            target[functionName].call(target, args[0], args[1]);
                            break;
                        case 3:
                            target[functionName].call(target, args[0], args[1], args[2]);
                            break;
                        case 4:
                            target[functionName].call(target, args[0], args[1], args[2], args[3]);
                            break;
                        case 5:
                            target[functionName].call(target, args[0], args[1], args[2], args[3], args[4]);
                            break
                    }
                }
            }
        };
        SpreadAngularManager.getPropertyValue = function(target, metadata)
        {
            if (target.$scopeObject)
            {
                target = target.$scopeObject
            }
            var value = "";
            try
            {
                if (metadata.getProperties)
                {
                    angular.forEach(metadata.getProperties, function(setProperty)
                    {
                        if (value === "")
                        {
                            value = ngMgr.setPropertyValueCore(target, value, setProperty)
                        }
                        else
                        {
                            value = value + "," + ngMgr.setPropertyValueCore(target, value, setProperty)
                        }
                    })
                }
                else if (metadata.getFunction)
                {
                    if (typeof metadata.getFunction === "function")
                    {
                        return metadata.getFunction.call(ngMgr, target, metadata.name)
                    }
                    else
                    {
                        value = ngMgr.getPropertyValueCore(target, undefined, metadata.getFunction)
                    }
                }
                else
                {
                    value = ngMgr.getPropertyValueCore(target, name)
                }
            }
            catch(ex) {}
            return value
        };
        SpreadAngularManager.getPropertyValueCore = function(target, propertyName, getFunction)
        {
            if (propertyName)
            {
                return target[propertyName]
            }
            else if (getFunction)
            {
                if (typeof getFunction === "string")
                {
                    return target[getFunction].call(target)
                }
            }
            return ""
        };
        SpreadAngularManager.hasChildElements = function(node)
        {
            if (!node || !node.childNodes)
            {
                return false
            }
            var len = node.childNodes.length;
            for (var i = 0; i < len; i++)
            {
                var child = node.childNodes[i];
                if (child.nodeType == Node.ELEMENT_NODE)
                {
                    return true
                }
            }
            return false
        }
    })(SpreadAngularManager || (SpreadAngularManager = {}));
    m.directive("wijSpread", function()
    {
        return {
                restrict: "E", replace: true, transclude: true, template: "<div ng-transclude/>", scope: {}, controller: ["$scope", function($scope){}], link: function(scope, element, attrs)
                    {
                        SpreadAngularManager.initSpread(scope, element, attrs);
                        element.wijspread({sheetCount: 0});
                        var spread = element.wijspread("spread");
                        var ns = $.wijmo.wijspread;
                        var parnetScope = scope.$parent;
                        scope.$scopeObject = spread;
                        spread.suspendCalcService(true);
                        spread.isPaintSuspended(true);
                        SpreadAngularManager.setValues(scope);
                        var sheetDefs = spread._sheetDefs;
                        var hasDataSourceBind = false;
                        if (sheetDefs && sheetDefs.length > 0)
                        {
                            for (var i = 0; i < sheetDefs.length; i++)
                            {
                                var sheet = sheetDefs[i];
                                sheet.suspendEvent();
                                initSheet(sheet);
                                if (sheet._angularDataSource)
                                {
                                    hasDataSourceBind = true;
                                    var dataSourceDeepWatch = true;
                                    if (sheet.dataSourceDeepWatch !== undefined)
                                    {
                                        dataSourceDeepWatch = sheet.dataSourceDeepWatch
                                    }
                                    var watchSheet = function(sheet1, dataSourceDeepWatch1)
                                        {
                                            parnetScope.$watch(sheet1._angularDataSource, function(newValue, oldValue)
                                            {
                                                bindSheet(sheet1, oldValue, newValue)
                                            }, dataSourceDeepWatch1)
                                        };
                                    watchSheet(sheet, dataSourceDeepWatch)
                                }
                                sheet.resumeEvent()
                            }
                        }
                        if (!hasDataSourceBind)
                        {
                            spread.isPaintSuspended(false)
                        }
                        spread.resumeCalcService(false);
                        function initSheet(sheet)
                        {
                            var hasColumns = sheet._columnDefs && sheet._columnDefs.length > 0;
                            if (hasColumns)
                            {
                                sheet.setColumnCount(sheet._columnDefs.length);
                                for (var cIndex = 0; cIndex < sheet._columnDefs.length; cIndex++)
                                {
                                    sheet._columnDefs[cIndex].attach(sheet, sheet.getColumn(cIndex), cIndex)
                                }
                            }
                            sheet.bind(ns.Events.ValidationError, function(event, data)
                            {
                                if (spread._angularDataValidationResult !== undefined)
                                {
                                    data.validationResult = spread._angularDataValidationResult
                                }
                                else
                                {
                                    data.validationResult = ns.DataValidationResult.Discard
                                }
                            });
                            sheet.bind(ns.Events.ColumnWidthChanged, function(event, data)
                            {
                                var sheet = data.sheet;
                                var colList = data.colList;
                                for (var col = 0; col < colList.length; col++)
                                {
                                    var columnWrapper = sheet._columnDefs[colList[col]];
                                    var bindingPath = columnWrapper._angularBindingPath && columnWrapper._angularBindingPath["width"];
                                    if (bindingPath)
                                    {
                                        parnetScope[bindingPath] = sheet.getColumnWidth(colList[col])
                                    }
                                }
                                parnetScope.$apply()
                            });
                            sheet.bind(ns.Events.SheetNameChanged, function(event, data)
                            {
                                var bindingPath = sheet._angularBindingPath && sheet._angularBindingPath["name"];
                                if (bindingPath)
                                {
                                    parnetScope[bindingPath] = data.newValue;
                                    parnetScope.$apply()
                                }
                            });
                            sheet.bind(ns.Events.UserZooming, function(event, data)
                            {
                                var bindingPath = sheet._angularBindingPath && sheet._angularBindingPath["zoom"];
                                if (bindingPath)
                                {
                                    parnetScope[bindingPath] = data.newValue;
                                    parnetScope.$apply()
                                }
                            });
                            SpreadAngularManager.setBindings(scope)
                        }
                        function bindSheet(sheet, oldDataSource, newDataSource)
                        {
                            if (newDataSource)
                            {
                                if (newDataSource !== sheet.getDataSource())
                                {
                                    sheet.isPaintSuspended(true);
                                    var hasColumns = sheet._columnDefs && sheet._columnDefs.length > 0;
                                    if (hasColumns)
                                    {
                                        sheet.autoGenerateColumns = false;
                                        sheet.setDataSource(newDataSource, false);
                                        sheet.setColumnCount(sheet._columnDefs.length);
                                        for (var col = 0; col < sheet._columnDefs.length; col++)
                                        {
                                            bindColumn(sheet, col)
                                        }
                                    }
                                    else
                                    {
                                        var colWidths = getColWidths(sheet);
                                        sheet.autoGenerateColumns = true;
                                        sheet.setDataSource(newDataSource, false);
                                        for (var col = 0; col < sheet.getColumnCount(); col++)
                                        {
                                            var header = sheet.getValue(0, col, ns.SheetArea.colHeader);
                                            header = getHeader(header);
                                            sheet.setValue(0, col, header, ns.SheetArea.colHeader);
                                            if (header.indexOf("$$") == 0)
                                            {
                                                sheet.deleteColumns(col, 1);
                                                col--
                                            }
                                        }
                                        setColWidths(sheet, colWidths)
                                    }
                                    if (sheet.parent.isPaintSuspended())
                                    {
                                        sheet.parent.isPaintSuspended(false)
                                    }
                                    else
                                    {
                                        sheet.isPaintSuspended(false)
                                    }
                                }
                                else if (newDataSource && oldDataSource && newDataSource.length != oldDataSource.length)
                                {
                                    sheet.setRowCount(newDataSource.length);
                                    sheet.invalidateLayout();
                                    sheet.repaint()
                                }
                                else
                                {
                                    sheet.invalidateLayout();
                                    sheet.repaint()
                                }
                            }
                            else if (oldDataSource)
                            {
                                sheet.setDataSource(null, true)
                            }
                        }
                        function bindColumn(sheet, index)
                        {
                            var column = sheet.getColumn(index);
                            var columnWraper = sheet._columnDefs[index];
                            if (columnWraper.dataField || columnWraper.headerText)
                            {
                                sheet.bindColumn(index, {
                                    name: columnWraper.dataField, displayName: columnWraper.headerText
                                })
                            }
                            columnWraper.updata()
                        }
                        function getHeader(name)
                        {
                            name = name.charAt(0).toUpperCase() + name.slice(1);
                            while (name.indexOf("_") > -1)
                                name = name.replace("_", " ");
                            return name
                        }
                        function getColWidths(sheet)
                        {
                            var arr = [];
                            for (var i = 0; i < sheet.getColumnCount(); i++)
                            {
                                arr.push(sheet.getColumn(i).width())
                            }
                            return arr
                        }
                        function setColWidths(sheet, colWidths)
                        {
                            if (sheet.getColumnCount() == colWidths.length)
                            {
                                for (var i = 0; i < sheet.getColumnCount(); i++)
                                {
                                    sheet.getColumn(i).width(colWidths[i])
                                }
                            }
                        }
                    }
            }
    })
})()


/**
 * Note:
 *      1. This version requires Angular UI Bootstrap >= v0.10.0 with templates
 *      2. This version requires angular-translate for i18n support
 */

//== Controllers =============================================================//

angular.module('dialogs.controllers', ['ui.bootstrap.modal', 'pascalprecht.translate'])

    /**
     * Default translations in English.
     * 
     * Use angular-translate's $translateProvider to provide translations in an
     * alternate language.
     *
     * $translateProvider.translations('[lang]',{[translations]});
     * To use alternate translations set the preferred language to your desired
     * language.
     * $translateProvider.preferredLanguage('[lang]');
     */
    .config(['$translateProvider',function($translateProvider){
        $translateProvider.translations('en-US',{
            DIALOGS_ERROR: "Error",
            DIALOGS_ERROR_MSG: "An unknown error has occurred.",
            DIALOGS_CLOSE: "Close",
            DIALOGS_PLEASE_WAIT: "Please Wait",
            DIALOGS_PLEASE_WAIT_ELIPS: "Please Wait...",
            DIALOGS_PLEASE_WAIT_MSG: "Waiting on operation to complete.",
            DIALOGS_PERCENT_COMPLETE: "% Complete",
            DIALOGS_NOTIFICATION: "Notification",
            DIALOGS_NOTIFICATION_MSG: "Unknown application notification.",
            DIALOGS_CONFIRMATION: "Confirmation",
            DIALOGS_CONFIRMATION_MSG: "Confirmation required.",
            DIALOGS_OK: "OK",
            DIALOGS_YES: "Yes",
            DIALOGS_NO: "No"
        });

        $translateProvider.preferredLanguage('en-US');
    }]) // end config


    /**
     * Error Dialog Controller 
     */
    .controller('errorDialogCtrl',['$scope','$modalInstance','$translate','header','msg',function($scope,$modalInstance,$translate,header,msg){
        //-- Variables -----//

        $scope.header = (angular.isDefined(header)) ? header : $translate.instant('DIALOGS_ERROR');
        $scope.msg = (angular.isDefined(msg)) ? msg : $translate.instant('DIALOGS_ERROR_MSG');

        //-- Methods -----//

        $scope.close = function(){
            $modalInstance.close();
            $scope.$destroy();
        }; // end close
    }]) // end ErrorDialogCtrl

    /**
     * Wait Dialog Controller 
     */
    .controller('waitDialogCtrl',['$scope','$modalInstance','$translate','$timeout','header','msg','progress',function($scope,$modalInstance,$translate,$timeout,header,msg,progress){
        //-- Variables -----//

        $scope.header = (angular.isDefined(header)) ? header : $translate.instant('DIALOGS_PLEASE_WAIT_ELIPS');
        $scope.msg = (angular.isDefined(msg)) ? msg : $translate.instant('DIALOGS_PLEASE_WAIT_MSG');
        $scope.progress = (angular.isDefined(progress)) ? progress : 100;

        //-- Listeners -----//

        // Note: used $timeout instead of $scope.$apply() because I was getting a $$nextSibling error

        // close wait dialog
        $scope.$on('dialogs.wait.complete',function(){
            $timeout(function(){ $modalInstance.close(); $scope.$destroy(); });
        }); // end on(dialogs.wait.complete)

        // update the dialog's message
        $scope.$on('dialogs.wait.message',function(evt,args){
            $scope.msg = (angular.isDefined(args.msg)) ? args.msg : $scope.msg;
        }); // end on(dialogs.wait.message)

        // update the dialog's progress (bar) and/or message
        $scope.$on('dialogs.wait.progress',function(evt,args){
            $scope.msg = (angular.isDefined(args.msg)) ? args.msg : $scope.msg;
            $scope.progress = (angular.isDefined(args.progress)) ? args.progress : $scope.progress;
        }); // end on(dialogs.wait.progress)

        //-- Methods -----//

        $scope.getProgress = function(){
            return {'width': $scope.progress + '%'};
        }; // end getProgress
    }]) // end WaitDialogCtrl

    /**
     * Notify Dialog Controller 
     */
    .controller('notifyDialogCtrl',['$scope','$modalInstance','$translate','header','msg',function($scope,$modalInstance,$translate,header,msg){
        //-- Variables -----//

        $scope.header = (angular.isDefined(header)) ? header : $translate.instant('DIALOGS_NOTIFICATION');
        $scope.msg = (angular.isDefined(msg)) ? msg : $translate.instant('DIALOGS_NOTIFICATION_MSG');

        //-- Methods -----//

        $scope.close = function(){
            $modalInstance.close();
            $scope.$destroy();
        }; // end close
    }]) // end WaitDialogCtrl

    /**
     * Confirm Dialog Controller 
     */
    .controller('confirmDialogCtrl',['$scope','$modalInstance','$translate','header','msg',function($scope,$modalInstance,$translate,header,msg){
        //-- Variables -----//

        $scope.header = (angular.isDefined(header)) ? header : $translate.instant('DIALOGS_CONFIRMATION');
        $scope.msg = (angular.isDefined(msg)) ? msg : $translate.instant('DIALOGS_CONFIRMATION_MSG');

        //-- Methods -----//

        $scope.no = function(){
            $modalInstance.dismiss('no');
        }; // end close

        $scope.yes = function(){
            $modalInstance.close('yes');
        }; // end yes
    }]); // end ConfirmDialogCtrl / dialogs.controllers


//== Services ================================================================//

angular.module('dialogs.services',['ui.bootstrap.modal','dialogs.controllers'])

    .provider('dialogs',[function(){
        var _b = true; // backdrop
        var _k = true; // keyboard
        var _w = 'dialogs-default'; // windowClass
        var _copy = true; // controls use of angular.copy
        var _wTmpl = null; // window template
        var _wSize = 'lg'; // large modal window default

        var _setOpts = function(opts){
            var _opts = {};
            opts = angular.isDefined(opts) ? opts : {};
            _opts.kb = (angular.isDefined(opts.keyboard)) ? opts.keyboard : _k; // values: true,false
            _opts.bd = (angular.isDefined(opts.backdrop)) ? opts.backdrop : _b; // values: 'static',true,false
            _opts.ws = (angular.isDefined(opts.size) && (angular.equals(opts.size,'sm') || angular.equals(opts.size,'lg'))) ? opts.size : _wSize; // values: 'sm', 'lg'
            _opts.wc = (angular.isDefined(opts.windowClass)) ? opts.windowClass : _w; // additional CSS class(es) to be added to a modal window

            return _opts;
        } // end _setOpts

        /**
         * Use Backdrop
         * 
         * Sets the use of the modal backdrop.  Either to have one or not and
         * whether or not it responds to mouse clicks ('static' sets the 
         * backdrop to true and does not respond to mouse clicks).
         *
         * @param   val     mixed   (true, false, 'static')
         */
        this.useBackdrop = function(val){ // possible values : true, false, 'static'
            if(angular.isDefined(val))
                _b = val;
        }; // end useStaticBackdrop

        /**
         * Use ESC Close
         * 
         * Sets the use of the ESC (escape) key to close modal windows.
         *
         * @param   val     boolean
         */
        this.useEscClose = function(val){ // possible values : true, false
            if(angular.isDefined(val))
                _k = (!angular.equals(val,0) && !angular.equals(val,'false') && !angular.equals(val,'no') && !angular.equals(val,null) && !angular.equals(val,false)) ? true : false;
        }; // end useESCClose

        /**
         * Use Class
         *
         * Sets the additional CSS window class of the modal window template.
         *
         * @param   val     string
         */
        this.useClass = function(val){
            if(angular.isDefined(val))
                _w = val;
        }; // end useClass

        /**
         * Use Copy
         * 
         * Determines the use of angular.copy when sending data to the modal controller.
         *
         * @param   val     boolean
         */
        this.useCopy = function(val){
            if(angular.isDefined(val))
                _copy = (!angular.equals(val,0) && !angular.equals(val,'false') && !angular.equals(val,'no') && !angular.equals(val,null) && !angular.equals(val,false)) ? true : false;
        }; // end useCopy

        /**
         * Set Window Template
         *
         * Sets a path to a template to use overriding modal's window template.
         *
         * @param   val     string
         */
        this.setWindowTmpl = function(val){
            if(angular.isDefined(val))
                _wTmpl = val;
        }; // end setWindowTmpl

        /**
         * Set Size
         *
         * Sets the modal size to use (sm,lg), requires Angular-ui-Bootstrap 0.11.0 and Bootstrap 3.1.0 + 
         *
         * @param   val     string (sm,lg)
         */
        this.setSize = function(val){
            if(angular.isDefined(val))
                _wSize = (angular.equals(val,'sm') || angular.equals(val,'lg')) ? val : _wSize;
        }; // end setSize


        this.$get = ['$modal',function ($modal){

            return {
                /**
                 * Error Dialog
                 *
                 * @param   header  string
                 * @param   msg     string
                 * @param   opts    object
                 */
                error : function(header,msg,opts){
                    opts = _setOpts(opts);

                    return $modal.open({
                        templateUrl : '/dialogs/error.html',
                        controller : 'errorDialogCtrl',
                        backdrop: opts.bd,
                        keyboard: opts.kb,
                        windowClass: opts.wc,
                        size: opts.ws,
                        resolve : {
                            header : function() { return angular.copy(header); },
                            msg : function() { return angular.copy(msg); }
                        }
                    }); // end modal.open
                }, // end error

                /**
                 * Wait Dialog
                 *
                 * @param   header      string
                 * @param   msg         string
                 * @param   progress    int
                 * @param   opts    object
                 */
                wait : function(header,msg,progress,opts){
                    opts = _setOpts(opts);

                    return $modal.open({
                        templateUrl : '/dialogs/wait.html',
                        controller : 'waitDialogCtrl',
                        backdrop: opts.bd,
                        keyboard: opts.kb,
                        windowClass: opts.wc,
                        size: opts.ws,
                        resolve : {
                            header : function() { return angular.copy(header); },
                            msg : function() { return angular.copy(msg); },
                            progress : function() { return angular.copy(progress); }
                        }
                    }); // end modal.open
                }, // end wait

                /**
                 * Notify Dialog
                 *
                 * @param   header      string
                 * @param   msg         string
                 * @param   opts    object
                 */
                notify : function(header,msg,opts){
                    opts = _setOpts(opts);

                    return $modal.open({
                        templateUrl : '/dialogs/notify.html',
                        controller : 'notifyDialogCtrl',
                        backdrop: opts.bd,
                        keyboard: opts.kb,
                        windowClass: opts.wc,
                        size: opts.ws,
                        resolve : {
                            header : function() { return angular.copy(header); },
                            msg : function() { return angular.copy(msg); }
                        }
                    }); // end modal.open
                }, // end notify

                /**
                 * Confirm Dialog
                 *
                 * @param   header  string
                 * @param   msg     string
                 * @param   opts    object
                 */
                confirm : function(header,msg,opts){
                    opts = _setOpts(opts);

                    return $modal.open({
                        templateUrl : '/dialogs/confirm.html',
                        controller : 'confirmDialogCtrl',
                        backdrop: opts.bd,
                        keyboard: opts.kb,
                        windowClass: opts.wc,
                        size: opts.ws,
                        resolve : {
                            header : function() { return angular.copy(header); },
                            msg : function() { return angular.copy(msg); }
                        }
                    }); // end modal.open
                }, // end confirm

                /**
                 * Create Custom Dialog
                 *
                 * @param   url     string
                 * @param   ctrlr   string
                 * @param   data    object
                 * @param   opts    object
                 */
                create : function(url,ctrlr,data,opts){
                    var copy = (angular.isDefined(opts) && angular.isDefined(opts.copy)) ? opts.copy : _copy;
                    opts = _setOpts(opts);

                    return $modal.open({
                        templateUrl : url,
                        controller : ctrlr,
                        keyboard : opts.kb,
                        backdrop : opts.bd,
                        windowClass: opts.wc,
                        size: opts.ws,
                        resolve : {
                            data : function() { 
                                // removed to speed up filter selection
                                // if(copy)
                                //     return angular.copy(data);
                                // else
                                    return data;
                            }
                        }
                    }); // end modal.open
                } // end create

            }; // end return

        }]; // end $get
    }]); // end provider

//== Module ==================================================================//

angular.module('dialogs.main',['dialogs.services','ngSanitize']) // requires angular-sanitize.min.js (ngSanitize) //code.angularjs.org/1.2.1/angular-sanitize.min.js

    // Add default templates via $templateCache
    .run(['$templateCache','$interpolate',function($templateCache,$interpolate){
    
        // get interpolation symbol (possible that someone may have changed it in their application instead of using '{{}}')
        var startSym = $interpolate.startSymbol();
        var endSym = $interpolate.endSymbol();
    
        $templateCache.put('/dialogs/error.html','<div class="modal-header dialog-header-error"><button type="button" class="close" ng-click="close()">&times;</button><h4 class="modal-title text-danger"><span class="glyphicon glyphicon-warning-sign"></span> <span ng-bind-html="header"></span></h4></div><div class="modal-body text-danger" ng-bind-html="msg"></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="close()">'+startSym+'"DIALOGS_CLOSE" | translate'+endSym+'</button></div>');
        $templateCache.put('/dialogs/wait.html','<div class="modal-header dialog-header-wait"><h4 class="modal-title"><span class="glyphicon glyphicon-time"></span> '+startSym+'"DIALOGS_PLEASE_WAIT" | translate'+endSym+'</h4></div><div class="modal-body"><p ng-bind-html="msg"></p><div class="progress progress-striped active"><div class="progress-bar progress-bar-info" ng-style="getProgress()"></div><span class="sr-only">'+startSym+'progress'+endSym+''+startSym+'"DIALOGS_PERCENT_COMPLETE" | translate'+endSym+'</span></div></div>');
        $templateCache.put('/dialogs/notify.html','<div class="modal-header dialog-header-notify"><button type="button" class="close" ng-click="close()" class="pull-right">&times;</button><h4 class="modal-title text-info"><span class="glyphicon glyphicon-info-sign"></span> '+startSym+'header'+endSym+'</h4></div><div class="modal-body text-info" ng-bind-html="msg"></div><div class="modal-footer"><button type="button" class="btn btn-primary" ng-click="close()">'+startSym+'"DIALOGS_OK" | translate'+endSym+'</button></div>');
        $templateCache.put('/dialogs/confirm.html','<div class="modal-header dialog-header-confirm"><button type="button" class="close" ng-click="no()">&times;</button><h4 class="modal-title"><span class="glyphicon glyphicon-check"></span> '+startSym+'header'+endSym+'</h4></div><div class="modal-body" ng-bind-html="msg"></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="yes()">'+startSym+'"DIALOGS_YES" | translate'+endSym+'</button><button type="button" class="btn btn-primary" ng-click="no()">'+startSym+'"DIALOGS_NO" | translate'+endSym+'</button></div>');
    }]); // end run / dialogs
angular.module('ThreeSixtyOneView.config')
	.value('SERVER', window.Marketshare.SERVERS);
'use strict';

angular.module('ThreeSixtyOneView.config')
.constant('CONFIG', {
		"application": {
			// application level data here
			"api": {
				"projects": "/rubix/v1/project",
				"favorites": "/rubix/v1/favorite",
				"scenarios": "/rubix/v1/project/:id/scenario",
				"cube": "/rubix/v1/model/cube/:id",
				"pivotview": "/rubix/v1/cube/:cubeId/analysis-view/:viewId",
				"pivotdata": "/rubix/v1/pivot/analysis-element/:elementId/analysis-view/:viewId",
				"scenarioElement": "/rubix/v1/scenario/:id",
				"scenarioAnalytics": "/rubix/v1/analytics/scenario/:id/calculate",
				"importResource": "/rubix/v1/import/analysis-element/:elementId",
				"exportResource": "/rubix/v1/export/analysis-element/:elementId",
				"reports": "/rubix/v1/reports/analysis-element/:elementId/analysis-view/:viewId/summary",
				"template": "/rubix/v1/template/:templateId"
			},
			"models": {
				"ProjectsModel": {
					// want: get
					//"responseTranslator": {"isMaster": "isMaster", "id" : "uuid", "title": "name", "description": "description", "createdBy": "auditInfo.createdBy.name", "createdOn":"auditInfo.createdOn", "modifiedBy":"auditInfo.lastUpdatedBy.name", "modifiedOn": "auditInfo.lastUpdatedOn"},
					// want: get
					//"requestTranslator": {"uuid" : "id", "name": "title", "description": "description", "isMaster": "isMaster"},
					"newProject": {"name": "","description" : "", "isMaster": false}
				},
				"ScenarioModel": {
					// want: get
					//"responseTranslator": {"referenceScenario": "referenceScenario", "template": "template", "title": "name", "id": "id", "description": "description", "type":"prediction.type", "createdBy":"auditInfo.createdBy.name", "createdOn": "auditInfo.createdOn", "modifiedBy":"auditInfo.lastUpdatedBy.name", "modifiedOn":"auditInfo.lastUpdatedOn"},
					"responseTranslator": null,
					"requestTranslator": {"id": "id", "name":"name", "referenceScenario": "referenceScenario", "description": "description", "prediction": "prediction", "type": "type", "template": "template", "isPlanOfRecord": "isPlanOfRecord", "modellingStartTime": "modellingStartTime", "modellingEndTime": "modellingEndTime"},
					"newScenario": {"name" : "", "description": "", "referenceScenario": {"id": "", "name": ""}, "prediction" : {"type": "Simulation"}}
				},
				"MetaDataModel" : {
					"responseTranslator": "",
					"requestTranslator": ""
				},
				"FavoritesModel" : {
					"responseTranslator": "",
					"requestTranslator": ""
				},
				"ScenarioElement": {
					// "responseTranslator": {"id":"id", "name": "name", "group":"group", "cubeMeta":"cubeMeta", "title":"cubeMeta.label"},
					// "requestTranslator": {"id":"id", "name": "title"}
					"responseTranslator": "",
					"requestTranslator": ""
				},
				"ScenarioAnalytics": {
					"states": {
						"FAILED": {
							"message": "FAILED",
							"description": "Calculation Failed",
							"icon": "failed"
						},
						"NOT_CALCULATED": {
							"message": "not_calculated",
							"description": "Scenario has not been calculated",
							"icon": "not_calculated"
						},
						"SUCCESS": {
							"message": "SUCCESSFUL",
							"description": "Calculation succeed",
							"icon": "successful"
						},
						"IN_PROGRESS": {
							"message": "in_progress",
							"description": "Simulation is in progress",
							"icon": "in_progress"
						}
					},
				},
				"ImportModel": {
					"uploadStates": {
						"success": {
							"message": "IMPORT_REQUEST_ACCEPTED",
							"description": "Upload successful.",
							"code": 201
						},
						"fail": {
							"message": "FILE_UPLOAD_FAILED",
							"description": "File upload failed, please try again.",
							"code": 400
						},
						"empty": {
							"message": "EMPTY_FILE_IMPORTED",
							"description": "Uploaded file is empty.",
							"code": 400
						}
					},
					"importStates": {
						"init": {
							"message": "INIT",
							"description": "Initializing the import process ...",
							"code": 201
						},
						"success": {
							"message": "COMPLETED",
							"description": "Import completed.",
							"code": 201
						},
						"inprogress": {
							"message": "IN_PROGRESS",
							"description": "Processing the imported file ...",
							"code": 201
						},
						"fail": {
							"message": "FAILED",
							"description": "Processing the uploaded file failed, please try again.",
							"code": 400
						},
						"notfound": {
							"message": "IMPORT_REQUEST_NOT_FOUND",
							"description": "Import request was not found.",
							"code": 201 // for now the code is changed to 201 in the back-end
						}
					},
					"acceptedFileType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
				},
				"ExportModel": {
					"exportStates": {
						"success": {
							"message": "EXPORT_REQUEST_ACCEPTED",
							"description": "Initializing the export process ...",
							"code": 201
						}
					},
					"processingStates": {
						"init": {
							"message": "INIT",
							"description": "Initializing the export process ...",
							"code": 201
						},
						"complete": {
							"message": "COMPLETED",
							"description": "Export process completed, initializing the download process ...",
							"code": 201
						},
						"inprogress": {
							"message": "IN_PROGRESS",
							"description": "Preparing the file to download ...",
							"code": 201
						},
						"fail": {
							"message": "FAILED",
							"description": "Export failed, please try again.",
							"code": 400
						},
						"download": {
							"message": "DOWNLOADED",
							"description": "File downloaded successfully.",
							"code": 201
						},
						"notfound": {
							"message": "EXPORT_REQUEST_NOT_FOUND",
							"description": "Export request was not found.",
							"code": 201 // for now the code is changed to 201 in the back-end
						}
					}
				},
				"PivotServiceModel": {
					"pivotDataStatus": {
						"saved": {"status": "Data saved successfully."},
						"saving": {"status": "Saving data ..."},
						"loaded": {"status": "Data loaded successfully."},
						"loading": {"status": "Loading data ..."},
						"empty": {"status": "No data for selected filters."}
					}
				}
			},
			"inputRestrictions": {
				"characterRestrictions": /^[^\\\/\?\:\*"><|]+$/,
				"minimumCharacterLimit": 2,
				"maximumCharacterLimit": 256
			}
		},
		"view": {
			"Dashboard": {
				"orderBy": 'auditInfo.lastUpdatedOn',
				"reverse": true,
				"favoriteType": "scenario",
				"nameClickAction": "gotoScenarioEdit",
				"alertSrc": "views/includes/display/no_scenarios_alert.tpl.html",
				"planOfRecordCreate": "views/includes/display/planofrecord_create_alert.tpl.html",
				"displayActionsCreateSimulation": "gotoScenarioCreate",
				"displayActionsCreateOptimization": "gotoCreateRecommendation",
				"renameAction": "renameScenario",
				"editAction": "editScenario",
				"trayButtons": [{
					"action": "trayCopy",
					"label": "copy",
					"icon": "files-o"
				}],
				"filterMenu": {
					"firstSelected": 0,
					"title": "Scenarios",
					"icon": "database",
					"items": [{
						"label": "all scenarios",
						"filterType": "activeFilter",
						"filter" : {}
					},{
						"label": "Favorites",
						"filterType": "filterPipeline",
						"filter": "isFavorite"
					}]
				},
				"sortMenu": {
					"displayColumns": [{
						"label": "Last Modified",
						"filter": "auditInfo.lastUpdatedOn"
					},
					// {
					//     "label": "Type",
					//     "filter": "type"
					// },
					{
						"label": "Created Date",
						"filter": "auditInfo.createdOn"
					}]
				},
			},
			"ProjectManager": {
				"orderBy": 'auditInfo.lastUpdatedOn',
				"reverse": true,
				"favoriteType": "project",
				"nameClickAction": 'gotoDashboard',
				"displayActionsCreate": "getNewProjectTitle",
				"renameAction": "renameProject",
				"editAction": "renameProject",
				"trayButtons": [],
				"filterMenu": {
					"firstSelected": 0,
					"icon": "suitcase",
					"title": "Projects",
					"items": [{
						"label": "All Projects",
						"filterType": "activeFilter",
						"filter": {}
					}, {
						"label": "Favorites",
						"filterType": "filterPipeline",
						"filter": "isFavorite"
					}]
				},
				"sortMenu": {
					"displayColumns": [{
						"label": "Last Modified",
						"filter": "auditInfo.lastUpdatedOn"
					},
					{
						"label": "Created Date",
						"filter": "auditInfo.createdOn"
					}]
				}
			},
			"ScenarioCalculate": {
				"timerInterval": 10000
			},
			"PivotTable": {
				"size": {
					"minColumnWidth": 150,
					"maxColumnWidth": 250,
					"rowHeight": 40
				},
				"color": {
					"msPureWhite": "#fff",
					"msLightGray": "#e6e6e6",
					"msMediumLightGray": "#cdcdcd",
					"msMediumGray": "#999",
					"msBlack": "#333",
					"msSelectionColor": "rgba(229, 229, 229, 0.3)"
				},
				"font": {
					"headerFontStyle": "14px proxima-nova, arial, sans-serif",
					"cellFontStyle": "14px proxima-nova, arial, sans-serif"
				}
			},
			"ScenarioTemplates": {
				"types": [
					{"name": "action", "label": "Action"},
					{"name": "strategy", "label": "Strategy"}
				],
				"workflow": [
					{url: "name_and_describe.tpl.html", label: "Name & Describe"},
					{url: "choose_dimensions.tpl.html", label: "Choose Dimensions"},
					{url: "choose_defaults.tpl.html", label: "Choose Defaults"},
					{url: "review.tpl.html", buttonLabel: "CREATE TEMPLATE", label: "Review"}
				]
			}
		},
		"client": {
			"name": "Ford"
		}
	});

"use strict";

angular.module('ThreeSixtyOneView.config').config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/projects");

    $stateProvider
    .state('Playground', {
      url: "/playground",
      templateUrl: "views/includes/create_recommendation/base_scenario/base_scenario.tpl.html",
      // templateUrl: "playground/views/playground.tpl.html",
      // controller: "PlaygroundCtrl",
      breadcrumb: "<li class='single'>Playground</li>"
    })
    .state('CreateRecommendation', {
      url: "/createrecommendation/:projectId",
      templateUrl: "views/create_recommendation.tpl.html",
      controller: "CreateRecommendationCtrl",
      breadcrumb: "<li class='single'>Create Budget Optimzation</li>"
    }).
    state('CreateRecommendation.base',{
      views: {
        'recommend': {
          templateUrl:"views/includes/create_recommendation/drawer/choose.tpl.html"
        },
      },
      breadcrumb: "<li class='single'>Create Budget Optimzation</li>"
    })
    .state('CreateRecommendation.assumptions',{
      views: {
        'recommend': {
          templateUrl:"views/includes/create_recommendation/drawer/assumptions.tpl.html"
        }
      },
      breadcrumb: "<li class='single'>Create Budget Optimzation</li>"
    })
    .state('ScenarioTemplates', {
      url: "/scenariotemplates/:type",
      templateUrl: "views/scenario_templates.tpl.html",
      controller: "ScenarioTemplatesCtrl",
      breadcrumb: "<li class='single'>Scenario Templates</li>"
    })
    .state('ProjectManager', {
      url: "/projects",
      templateUrl: "views/projects.tpl.html",
      controller: "ProjectListingCtrl",
      resolve: {
        'Projects': ["ProjectsService", function(ProjectsService){return ProjectsService.get();}],
        'Favorites': ["FavoritesService", function(FavoritesService){return FavoritesService.get("project");}]
      },
      breadcrumb: "<li class='single'>All Projects</li>"
    })
    .state('Dashboard', {
      url: "/dashboard/:projectId",
      templateUrl: "views/projects.tpl.html",
      controller: "ScenarioListingCtrl",
      resolve: {
        'Project' : ["ProjectsService", "$stateParams", function(ProjectsService, $stateParams){return ProjectsService.getProjectItemById($stateParams.projectId);}],
        'Scenarios': ["ScenarioService", "$stateParams", function(ScenarioService, $stateParams){return ScenarioService.get($stateParams.projectId);}],
        'Favorites': ["FavoritesService", "$stateParams", function(FavoritesService, $stateParams){return FavoritesService.getFavoritesScenarios($stateParams.projectId);}],
      },
      breadcrumb: "<li class='parent'><a goto='projects'>All Projects</a></li><br><li>{{project.name}}</li>"
    })
    .state('ScenarioCreate', {
      url: "/scenarioCreate/:projectId",
      templateUrl: "views/scenario_create.tpl.html",
      controller: "ScenarioCreateCtrl",
      resolve: {
        'Project' : ["ProjectsService", "$stateParams", function(ProjectsService, $stateParams){return ProjectsService.getProjectItemById($stateParams.projectId);}],
        'Scenarios': ["ScenarioService", "$stateParams", function(ScenarioService, $stateParams){return ScenarioService.get($stateParams.projectId);}]
      },
      breadcrumb: "<li><a goto='projects'>All Projects</a></li><li>{{project.name}} &gt; Create Scenario</li>"
    })
    .state('Scenario', {
      abstract: true,
      url: "/scenario/:projectId/:scenarioId",
      templateUrl: "views/scenarios.tpl.html",
      controller: "ScenarioCtrl",
      resolve: {
        'Project' : ["ProjectsService", "$stateParams", function(ProjectsService, $stateParams){return ProjectsService.getProjectItemById($stateParams.projectId);}],
        'Scenarios': ["ScenarioService", "$stateParams", function(ScenarioService, $stateParams){return ScenarioService.get($stateParams.projectId);}],
        'Scenario': ["ScenarioService", "Scenarios", "$stateParams", function(ScenarioService, Scenarios, $stateParams){return ScenarioService.find(Scenarios, $stateParams.scenarioId);}],
        'ScenarioAnalysisElements': ["ManageScenariosService", "$stateParams", function(ManageScenariosService, $stateParams){return ManageScenariosService.get($stateParams.scenarioId);}],
        'Calculate': ["AnalyticCalculationsService", "$stateParams", function(AnalyticCalculationsService, $stateParams){return AnalyticCalculationsService.get($stateParams.scenarioId);}]
      },
      breadcrumb: "<li class='parent'><a goto='dashboard' params='{{project.uuid}}'>{{project.name}}</a></li><br><li>{{scenario.title || scenario.name}}</li>"
    })
    .state("Scenario.edit", {
        url: "/edit/:scenarioElementId",
        views: {
          'editor' : {
            controller: "ScenarioEditorCtrl",
            templateUrl: "views/includes/scenario/editor.tpl.html"
          }
        },
        breadcrumb: "<li class='parent'><a goto='dashboard' params='{{project.uuid}}'>{{project.name}}</a></li><br><li>{{scenario.title || scenario.name}}</li>"
    })
    .state("Scenario.results", {
      url: "/results",
      views: {
        'result': {
          controller: "scenarioResultsCtrl",
          templateUrl: "views/includes/scenario/results.tpl.html"
        }
      },
      breadcrumb: "<li class='parent'><a goto='dashboard' params='{{project.uuid}}'>{{project.name}}</a></li><br><li>{{scenario.title || scenario.name}}</li>"
    })
    .state("Scenario.calculate", {
        url: "/calculate",
        resolve: {
          'Status': ["AnalyticCalculationsService", "$stateParams", function(AnalyticCalculationsService, $stateParams){return AnalyticCalculationsService.get($stateParams.scenarioId);}],
          'SubmitCalculate': ["AnalyticCalculationsService", "$stateParams", "Status", function(AnalyticCalculationsService, $stateParams, Status) {return AnalyticCalculationsService.startCalculation(Status, $stateParams.scenarioId);}]
        },
        views: {
          'calculate': {
            controller: "ScenarioCalculationCtrl",
            templateUrl: "views/includes/scenario/calculate.tpl.html"
          }
        },
        breadcrumb: "<li class='parent'><a goto='dashboard' params='{{project.uuid}}'>{{project.name}}</a></li><br><li>{{scenario.title || scenario.name}}</li>"
    });
}]);
'use strict';

angular.module('ThreeSixtyOneView.config').constant('EVENTS', {
    createScenario: 'ScenarioService:create',
    copyScenario: 'ScenarioService:copy',
    scenarioCopied: 'ScenarioService:copyCompleted',
    createProject: 'ProjectsService:create',
    renameProject: 'ProjectsService:rename',
    editScenario: 'ScenarioService:edit',
    updateProjects: 'ProjectsService:updateProjects',
    gotoScenarioCreate: 'GotoService:scenarioCreate',
    gotoCreateRecommendation: 'GotoService:createRecommendation',
    gotoDashboard: 'GotoService:dashboard',
    filter: 'SortAndFilterService:filter',
    getNewProjectTitle: "DialogService:create",
    openScenarioCreate: "DialogService:openCreateScenario",
    newSelectedItem: "ListingView:newSelectedItem",
    trayCopy: "Tray:copy",
    changePivotTableFilter: "PivotTable:changeFilter",
    tabClosed: "TabControl:closeAll",
    noop: "noop",
    // Scenario editor and results
    scenarioElementChange: "PivotBuilderCtrl:loadCube",
    pivotTableStatusChange: "ScenarioCtrl:pivotTableStatusChange",
    pivotViewChange: "PivotBuilderCtrl:pivotViewChange",
    dimensionsReady: 'dimensionsReady',
    // ERRORS
    noDataReceived: "ErrorService:noDataReceived",
    serverError: "ErrorService:serverError",
    error: "ErrorService:error",
    // TEST
    test: "test",
    // PIVOT TABLE
    heightChanged: "heightChanged",
    // BROADCAST STATES
    broadcastStates: "broadcastStates",
    // FLIPBOOK
    flipbookAdvance: 'flipbookAdvance',
    flipbookAllowAdvance: 'flipbookAllowAdvance',
    // FILTER MEMBERS
    selectTime: 'selectTime',
    // LOADING DIMENSIONS
    dimensionsIsLoaded: 'dimensionsIsLoaded',
    spendCubeIdLoaded: 'spendCubeIdLoaded',
    // PLAN OF RECORD
    planOfRecordCreated: 'planOfRecordCreated',
    // CREATE RECOMMENDATION
    spendViewCreated: 'spendViewCreated',
    outcomeDimensionsReady: 'outcomeDimensionsReady'
});

"use strict";

angular.module('ThreeSixtyOneView').config(["$logProvider", function($logProvider) {
    String.prototype.bool = function() {
        return (/^true$/i).test(this);
    };
    // turn off logging primarily for angular-virtual-scroll
    $logProvider.debugEnabled(false);
}]).run([function() {
}]);
/* globals _, window */
/*jshint unused:false*/

'use strict';

// View controllers
angular.module('ThreeSixtyOneView')
.controller("MainCtrl", ["$scope", "$location", "ErrorService", "CONFIG", "ServerService", "ManageTemplatesService", "$state",
	function($scope, $location, ErrorService, CONFIG, ServerService, ManageTemplatesService, $state) {
		var init = function() {
			ManageTemplatesService.getAll().then(function(templates) {
				if(templates.length === 0) {
					$state.go('ScenarioTemplates');
				}
			});
		};
		// Error service surfaced here
		// For unit testing only;
		$scope.ErrorService = ErrorService;
		$scope.CONFIG = CONFIG;

		// querystring 'e2e' formats data for protractor tests
		if ($location.search().e2e === "true"){
			$scope.e2e = true;
		}

		console.info(ServerService.get($location.host()));

		// convenience methods
		$scope.console = function console(msg) {
			window.console.info(msg);
		};

		$scope.alert = function alert(msg, evt) {
			window.alert(msg);
			if (evt){
				evt.stopPropagation();
			}
		};

		init();
	}]);
/* globals _, window */
/*jshint unused:false*/

'use strict';

// View controllers
angular.module('ThreeSixtyOneView')
.controller("ScenarioListingCtrl", ["$scope", "$rootScope", "$controller", "Project", "Scenarios", "ScenarioService", "EVENTS", "DialogService", "ManageScenariosService", "ScenarioStatesService", "$state", 'GotoService',
    function($scope, $rootScope, $controller, Project, Scenarios, ScenarioService, EVENTS, DialogService, ManageScenariosService, ScenarioStatesService, $state, GotoService) {

        // Inherit from base class
        angular.extend(this, $controller('ListingViewCtrl', {$scope: $scope}));

        // bootstrap all data
        var init = function(project, scenarios){
            $scope.init(scenarios, getProject);

            $scope.project = project;
            $scope.scenarios = scenarios;

            ScenarioStatesService.startPull(_.pluck($scope.scenarios, 'id'));

            $scope.hasAlerts = scenarios.length < 1 ? $scope.CONFIG.alertSrc : false;
            $scope.hasAlerts = ($scope.project.isMaster && ScenarioService.isPlanOfRecordCreating()) ? $scope.CONFIG.planOfRecordCreate : $scope.hasAlerts;
        },
        addStatusToScenarios = function(scenarios, statuses){
            _.each(scenarios, function(scenarioValue) {
                _.each(statuses, function(statusValue) {
                    if(statusValue.scenarioId === scenarioValue.id) {
                        _.extend(scenarioValue, _.omit(statusValue, ['id', 'scenarioId']));
                    }
                });
            });
        },
        getProject = function(){
            return $scope.project;
        },
        setMasterScenario = function(scenario){
            scenario.isMaster = true;
        },
        getScenarioElements = function(id){
            return  ManageScenariosService.get(id);
        };

        // API
        // Click handler interface
        $scope.selectItem = function(item){
            // the return is for unit tests, it does nothing in the UI
            $scope.showDetails(item);
            $scope.limit = 3;
            $scope.limitText = 'All';
            return $scope.getDetails(item.id, getScenarioElements).then(function(data){
                item.scenarioElements = data;
            });
        };

        $scope.gotoScenarioCreate = function(){
            DialogService.openCreateScenario($scope.project, $scope.scenarios);
        };

        $scope.gotoCreateRecommendation = function(){
             $state.go('CreateRecommendation', {projectId: $scope.project.uuid});
        };

        // $scope.isScenarioTitleUnique = function(scenarioName) {
        //     return !_.findWhere($scope.scenarios, {name: scenarioName});
        // };

        $scope.gotoBaseScenario = function(scenario){
            ScenarioService.getProjectIdByScenarioId(scenario.id).then(function(project){
                $scope.goto({},"gotoBaseScenario", project.uuid, scenario.id);
            });
        };

        $scope.createTemplate = function() {
            $state.go('ScenarioTemplates');
        };

        // Event Listeners
        $scope.$on(EVENTS.gotoScenarioCreate, function(){
            $scope.gotoScenarioCreate();
        });

        $scope.$on(EVENTS.gotoCreateRecommendation, function(){
            $scope.gotoCreateRecommendation();
        });

        $scope.$on(EVENTS.copyScenario, function(evt, scenario){
            // sanaize scenario by deleting id and making sure it has a description
            delete scenario.id;
            scenario.description = scenario.description || "";
            ScenarioService.create(getProject().uuid, scenario).then(function(response){
                $scope.goto(evt, 'gotoScenarioEdit', response);
            });
        });

        $scope.$on(EVENTS.renameScenario, function(evt, scenario){
            ScenarioService.rename(scenario, getProject().uuid);
        });

        $scope.$on(EVENTS.editScenario, function($event, scenario){
            ScenarioService.getProjectIdByScenarioId(scenario.id).then(function(project){
                 ScenarioService.edit(scenario, project.uuid);
            });
        });

        $scope.$on(EVENTS.broadcastStates, function($event, response) {
            addStatusToScenarios($scope.scenarios, response);
        });

        $scope.$on(EVENTS.planOfRecordCreated, function(event, scenario) {
            ScenarioService.get($scope.project.uuid).then(function(scenarios) {
                $scope.hasAlerts = false;
                ScenarioStatesService.stopPull();
                init($scope.project, scenarios);
            });
        });

        init(Project, Scenarios);
    }]).controller("ProjectListingCtrl", ["$scope",  "$controller", "FavoritesService", "ProjectsService", "ScenarioService", "Projects", "GotoService", "DialogService", "EVENTS", "CONFIG", "$timeout", function($scope, $controller, FavoritesService, ProjectsService, ScenarioService, Projects,  GotoService, DialogService, EVENTS, CONFIG, $timeout) {

        // Inherit from base class
        angular.extend(this, $controller('ListingViewCtrl', {$scope: $scope}));

        var init = function(){
            $scope.init(Projects, getProject);
            ProjectsService.getMasterProject().then(function(master) {
                if (master) {
                    // add it to even queue to keep it from getting in before the all other favorites
                    $timeout(function() {FavoritesService.addFavorite(master.uuid);})
                }
            });
        },
        getScenarios = function(id){
            return ScenarioService.get(id);
        },
        getProject = function(){
            return $scope.selectedItem;
        };

        // API
        // click handler interface
        $scope.selectItem = function(item){
            // the return is for unit tests, it does nothing in the UI
            $scope.showDetails(item);
            $scope.setLimit(3, true);
            return $scope.getDetails(item.uuid, getScenarios).then(function(data){
                item.scenarios = data;
            });
        };

        // Event listeners
        // create new project dialog box to get new project title
        $scope.$on(EVENTS.getNewProjectTitle, function(){
            DialogService.create();
        });

        // create project API call
        $scope.$on(EVENTS.createProject, function(evt, name){
            var newProject = angular.copy(CONFIG.application.models.ProjectsModel.newProject);
            newProject.name = name;
            ProjectsService.create(newProject).then(function(response){
                GotoService.dashboard(response.uuid);
            });
        });

        init();
    }]).controller("ListingViewCtrl", ["$scope", "$rootScope", "$state", "SortAndFilterService", "DialogService", "GotoService", "CONFIG", "EVENTS", "FavoritesService", "$stateParams", "AnalyticCalculationsService", function($scope, $rootScope, $state, SortAndFilterService, DialogService, GotoService, CONFIG, EVENTS, FavoritesService, $stateParams, AnalyticCalculationsService){

        var selectFirstItem = function(){
                var firstItem = SortAndFilterService.getData()[0];
                if(firstItem){
                    $scope.selectItem(firstItem);
                }
            },
            getUuid = function(project){
                return project.uuid;
            };

        $scope.init = function(_data_, fn){
            var currentView = CONFIG.view[$state.current.name],
                filter = currentView.filterMenu.items[0],
                reverse = currentView.reverse,
                orderBy = currentView.orderBy;

            $scope.CONFIG = currentView;
            $scope.data = _data_;
            $scope.selectedItem = null;
            $scope.getProject = fn;
            $scope.setLimit(3, true);

            // tray variables
            $scope.trayActions = CONFIG.view[$state.current.name].trayActions;

            _.extend($scope.CONFIG, $stateParams);
            _.extend($scope.CONFIG, CONFIG.view[$state.current.name]);

            SortAndFilterService.resetSearchText();

            SortAndFilterService.init({
                data: _data_,
                orderBy: orderBy,
                filter: filter,
                reverse: reverse
            });
        };

        $scope.getDetails = function(id, model){
            return model(id).then(function(response){
                return response;
            });
        };

        $scope.goto = function(evt, where, item, id){
            if (evt && evt.stopPropagation){ evt.stopPropagation(); }
            switch(where){
                case "gotoScenarioEdit": GotoService.scenarioEdit(getUuid($scope.getProject()), item.id, id); break;
                case "gotoScenarioCalculate": GotoService.scenarioCalculate(getUuid($scope.getProject()), item.id); break;
                case "gotoDashboard": GotoService.dashboard(item.uuid); break;
                case "gotoProjects": GotoService.projects(); break;
                case "gotoBaseScenario" : GotoService.baseScenario(item, id); break;
            }
        };

        $scope.showDetails = function(item){
            $scope.selectedItem = item;
            $rootScope.$broadcast(EVENTS.newSelectedItem, $scope.selectedItem);
        };

        $scope.isActiveItem = function (item){
            return $scope.selectedItem === item;
        };

        $scope.getData = function () {
            return SortAndFilterService.getData();
        };

        $scope.getSorter = function(column) {
            return SortAndFilterService.getSorter(column);
        };

        $scope.getCount = function() {
            return SortAndFilterService.getCount();
        };

        $scope.setFilter = function(type, item, forceFilter) {
            SortAndFilterService.setFilter(type, item, forceFilter);
        };

        $scope.create = function(action, _data_) {
            console.info("here!!!!!!");
            var data = _data_ || {};
            $rootScope.$broadcast(EVENTS[action], data);
        };

        $scope.toggleFavorite = function(evt, item){
            evt.stopPropagation();
            var itemId = item.uuid || item.id;
            if (!item.isMaster) {
                FavoritesService.toggleFavorite(itemId, $scope.CONFIG.favoriteType, item);
                SortAndFilterService.filter();
                selectFirstItem();
            }
        };

        $scope.isFavorite = function(itemID){
            return FavoritesService.isFavorite(itemID);
        };

        // tray button actions
        // NOT inline edit action
         $scope.action = function(action, _data_){
            var data = _data_ || {};
            if(action){
                $rootScope.$broadcast(EVENTS[action], action, data);
            }
        };

        $scope.gotoScenarioCalculate = function(action, item) {
            if(!_.has(item, 'isMaster')) {
                if(AnalyticCalculationsService.isInProgress(item.currentState.message) || AnalyticCalculationsService.isFailed(item.currentState.message)) {
                    return 'gotoScenarioCalculate';
                } else {
                    return action;
                }
            } else {
                return action;
            }
        };

        $scope.isScenarioTitleUnique = function(scenarioName) {
            return !_.findWhere($scope.scenarios, {name: scenarioName});
        };

        $scope.setLimit = function(limit, reset) {
            if (reset) {
                $scope.limit = limit;
                $scope.limitText = 'All';
            } else {
                $scope.limit = $scope.limit === limit ? Infinity : limit;
                $scope.limitText = $scope.limit === limit ? 'All' : 'Less';
            }
        };

        // tray event listeners
        $scope.$on(EVENTS.filter, function(){
            selectFirstItem();
        });

        $scope.$on(EVENTS.trayCopy, function(evt, action, data){
            data.validator = $scope.isScenarioTitleUnique;
            data.errorType = "isNotUnique";
            if (data){
                DialogService[action](data);
            } else {
                DialogService.notify("ERROR: no scenarios", "There are no scenarios to copy.");
            }
        });

    }]);
/* global _ */
'use strict';

angular.module('ThreeSixtyOneView')
.controller('AllViewsCtrl', ["$scope", "$controller", "$modalInstance", "CONFIG", "data",
function($scope, $controller, $modalInstance, CONFIG, data) {
	angular.extend(this, $controller('ListLightboxBaseCtrl', {$scope: $scope, $controller: $controller, $modalInstance: $modalInstance, CONFIG: CONFIG}));

	var init = function() {
		$scope.list = data.viewsList;
		$scope.e2e = data.e2e;

		$scope.subtitle = 'Select A ' + (data.subTitle || 'View');
		$scope.isDropdownHidden = true;
		$scope.dateProperty = 'createdOn';
		$scope.ownerProperty = 'createdBy';
		$scope.isListLoaded = true;

		$scope.currentItem = {
			id: data.selectedViewId
		};
	};

	// pass back the selected file and dismiss the modal
	$scope.submit = function() {
		var newViewId = $scope.currentItem.id;
		$modalInstance.close(newViewId);
	};

	init();
}]);
'use strict';

angular.module('ThreeSixtyOneView')
	.controller('FilterSelectionCtrl', ["$scope", "$window", "$rootScope", "$modalInstance", "$controller", "data", "CONFIG", "PivotMetaService", '$timeout',
	function($scope, $window, $rootScope, $modalInstance, $controller, data, CONFIG, PivotMetaService, $timeout) {
		angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, CONFIG: CONFIG, data: data}));

		var init = function() {
			$scope.selectedFilter = {};
			$scope.selectedFilter.dimension = data.dimension;
			$scope.addedFilter = data.addedFilters;
			$scope.e2e = data.e2e;

			$scope.isListMultiLevel = false;
			$scope.categorizedValue = [];
			$scope.filterSearch = {label: ''};
			$scope.emptyFiltersList = [];
			$scope.noFilterSelected = false;
			$scope.selectedDimensionIndex = 0;

			_.each(data.dimensions, function(dimension, index) {
				$scope.categorizeValuesCount(index, $scope.addedFilter[dimension.label]);
				if($scope.selectedFilter.dimension.label === dimension.label) {
					$scope.selectedDimensionIndex = index;
				}
			});

			$scope.chooseFilter($scope.selectedFilter.dimension, $scope.selectedDimensionIndex, false);
		},
		dimensions = data.dimensions,
		viewData = data.viewData,
		searchTimeoutHandler = false,
		// choose the view based on added levels in the column/row
		chooseViewBy = function(levels, index) {
			var levelIndex = angular.isNumber(index) ? index : 0;
			if(!angular.isNumber(index)) {
				_.each(levels, function(level, index) {
					_.each(viewData, function(item) {
						if(level.label === item.level.label) {
							levelIndex = index;
						}
					});
				});
			}
			$scope.searchFilters(levels[levelIndex], $scope.filterSearch);
			return levels[levelIndex];
		};

		// open the filters modal for the selected filter
		$scope.chooseFilter = function(dimension, dimensionIndex, levelIndex) {
			if(angular.isNumber(levelIndex)) {
				$scope.selectedFilter.level = chooseViewBy(dimension.members, levelIndex);
			} else {
				$scope.selectedDimensionIndex = dimensionIndex;

				$scope.filterSearch.label = '';
				$scope.selectedFilter.dimension = dimension;
				$scope.selectedFilter.level = chooseViewBy(dimension.members, false);
			}
		};

		// choose a filter based on the passed name
		$scope.chooseFilterByName = function(name) {
			_.each(dimensions, function(dimension, index) {
				if(dimension.label === name) {
					$scope.chooseFilter(dimension, index, false);
				}
			});
		};

		// cancel the made changes to the filter
		$scope.cancel = function() {
			$scope.filterCollapse = {};
			$modalInstance.dismiss('canceled');
		};

		// search filter values
		$scope.searchFilters = function(obj, search) {
			if(!obj) {
				return null;
			}

			if(!!searchTimeoutHandler) {
				$timeout.cancel(searchTimeoutHandler);
				searchTimeoutHandler = false;
			}

			var searchResults = {},
				treeSearch = function(tree, searchLabel, initial) {
					var output = null;

					if(angular.lowercase(tree.label).indexOf(angular.lowercase(searchLabel)) > -1 && !initial && !tree.na) {
						return tree;
					}

					if(tree.members.length > 0 && !tree.na) {
						for(var i = 0; i < tree.members.length; i++) {
							var results = treeSearch(tree.members[i], searchLabel, false);
							if(!!results && !!results.members) {
								if(!output) {
									output = {
										label: tree.label,
										members: []
									};
								}
								output.members.push(results);
							}
						}
					} else {
						if(angular.lowercase(tree.label).indexOf(angular.lowercase(searchLabel)) > -1 && !tree.na) {
							return tree;
						} else {
							return null;
						}
					}

					return output;
				};

			searchTimeoutHandler = $timeout(function() {
				searchResults = treeSearch(obj, search.label, true);

				$scope.searchResults = searchResults;
				$scope.countFilters(searchResults, $scope.addedFilter);
				
				searchTimeoutHandler = false;
			}, 300);

		};

		// count number of selected and total filters
		$scope.countFilters = function(object, _addedFilter) {
			var output = {
				selected: 0,
				total: 0
			};

			if(!object) {
				$scope.filterCount = output;
				return output;
			}
			var treeCount = function(tree) {
				var output = {
					selected: 0,
					total: 0
				};

				if(tree.members.length > 0) {
					for(var i = 0; i < tree.members.length; i++) {
						var results = treeCount(tree.members[i]);
						output.selected += results.selected;
						output.total += results.total;
					}
				} else {
					if(_addedFilter[$scope.selectedFilter.dimension.label][tree.id + ',' + tree.label]) {
						output.selected++;
					}
					output.total++;
				}
				return output;
			};

			output = treeCount(object);

			$scope.filterCount = output;
			return output;
		};

		// handle select/deselect of visible/invisible filter search values
		$scope.selectFilters = function(category, visible, add) {
			var item;

			var getFilters = function(list) {
				var output = [];

				if(list.members.length > 0) {
					_.each(list.members, function(member) {
						output = output.concat(getFilters(member));
					});
				} else {
					return [list.id + ',' + list.label];
				}

				return output;
			};

			var list = getFilters($scope.searchResults);

			if(visible) {
				_.each(list, function(item) {
					$scope.addedFilter[category][item] = add;
				});
			} else {
				for(item in $scope.addedFilter[category]) {
					if($scope.addedFilter[category][item] && list.indexOf(item) === -1) {
						$scope.addedFilter[category][item] = add;
					}
				}
			}
			$scope.categorizeValuesCount($scope.selectedDimensionIndex, $scope.addedFilter[category]);
		};

		// make the temporary changes in the filters
		$scope.submit = function() {
			$modalInstance.close($scope.addedFilter);
		};

		$scope.categorizeValuesCount = function(_index, addedFilter) {
			var index, output = PivotMetaService.getCategorizeValues(dimensions[_index], addedFilter);
			$scope.categorizedValue[_index] = output;

			// add empty category to the empty items list and show error
			if(output.selected === 0) {
				index = $scope.emptyFiltersList.indexOf(dimensions[_index].label);
				if(index < 0) {
					$scope.emptyFiltersList.push(dimensions[_index].label);
				}
				$scope.noFilterSelected = true;
			}
			// check if any item is selected from an empty list, remove it
			if($scope.noFilterSelected && output.selected > 0) {
				index = $scope.emptyFiltersList.indexOf(dimensions[_index].label);
				if(index > -1) {
					$scope.emptyFiltersList.splice(index, 1);
					if($scope.emptyFiltersList.length < 1) {
						$scope.noFilterSelected = false;
					}
				}
			}

			$scope.countFilters($scope.searchResults, $scope.addedFilter);
			return output;
		};

		$scope.getDimensions = function() {
			return dimensions;
		};

		$scope.allFiltersSelected = function(filterValues) {
			return filterValues.selected < filterValues.total;
		};

		$scope.getValuesList = function(filterValues) {
			if(!!filterValues) {
				return filterValues.label.join(', ');
			}
			return '';
		};

		$scope.getEmptyFiltersList = function() {
			return $scope.emptyFiltersList;
		};

		$scope.isDimensionSignleMembered = function(dimension) {
			return dimension.members.length === 1;
		};

		$scope.multiLevelList = function(status) {
			if(typeof status !== 'undefined') {
				$scope.isListMultiLevel = status;
			}

			return $scope.isListMultiLevel;
		};

		init();
	}]);
/* global _ */
'use strict';

angular.module('ThreeSixtyOneView')
.controller('ListLightboxBaseCtrl', ["$scope", "$controller", "$modalInstance", "CONFIG",
function($scope, $controller, $modalInstance, CONFIG, data, MetaDataService) {
	angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, CONFIG: CONFIG, data: {}}));

	$scope.list = [];
	$scope.isListLoaded = false;
	$scope.cancelButtonLabel = 'Cancel';
	$scope.submitButtonLabel = 'Replace';
	$scope.dateProperty = 'lastUpdatedOn';
	$scope.ownerProperty = 'lastUpdatedBy';

	$scope.getList = function() {
		return $scope.list;
	};

	// cancel the changes and dismiss the modal
	$scope.cancel = function() {
		$scope.fileList = [];
		$modalInstance.dismiss('canceled');
	};
}]);
/* global _ */

'use strict';

angular.module('ThreeSixtyOneView')
    .controller("ModalBaseCtrl", ["$scope", "$modalInstance", "CONFIG", "ErrorService", "data", function($scope, $modalInstance, CONFIG, ErrorService, data){
        $scope.inputRestrictions = CONFIG.application.inputRestrictions;

        $scope.getError = function(type){
        	return ErrorService.getError(type);
        }

        $scope.close = function(evt) {
            if (evt) { evt.preventDefault(); }
            $modalInstance.dismiss('canceled');
        };

        $scope.validator = data.validator || function(){return true};
        $scope.errorType = data.errorType || "";
    }]);
/* global _ */

'use strict';

angular.module('ThreeSixtyOneView')
.controller("SelectModuleCtrl", ["$scope", "$rootScope", "$controller", "$modalInstance", "data",
	function($scope, $rootScope, $controller, $modalInstance, data) {
		angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, data: data}));

		var init = function() {
			$scope.modules = data.modules;
			$scope.selectedModule = false;
		};

		$scope.select = function(module) {
			$scope.selectedModule = module;
		};

		$scope.isModuleSelected = function() {
			return !!$scope.selectedModule;
		};

		$scope.submit = function() {
			$modalInstance.close({selectedModule: $scope.selectedModule});
		};

		init();
	}]);
/* global _ */

'use strict';

angular.module('ThreeSixtyOneView')
    .controller('ProjectCreateCtrl', ["data" ,"$scope", "$rootScope", "$controller", "$modalInstance", "EVENTS", function(data, $scope, $rootScope, $controller, $modalInstance, EVENTS) {

        angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, data: data, $modalInstance: $modalInstance}));

        
        $scope.modalProperties = {
            title: "Create a New Project",
            field: "Name",
            button: "Create New Project",
            icon: "star"
        };

        $scope.submit = function(title, evt) {
            if (evt) { evt.preventDefault(); }
            $rootScope.$broadcast(EVENTS.createProject, title.trim());
            $modalInstance.dismiss('create');
        };
    }]);
/* global _ */

'use strict';

angular.module('ThreeSixtyOneView')
    .controller('ScenarioAnalysisElementCopyCtrl', ["$scope", "$controller", "$modalInstance", "CONFIG", "data",
    function($scope, $controller, $modalInstance, CONFIG, data) {
        angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, CONFIG: CONFIG, data: data}));

        var init = function() {
            $scope.selectedScenarioElement = data.selectedScenarioElement;

            $scope.newElement = {
                name: data.selectedScenarioElement.name + ' - copy',
                description: ''
            };
        };

        // cancel the changes and dismiss the modal
        $scope.cancel = function() {
            $modalInstance.dismiss('canceled');
        };

        // pass back the selected file and dismiss the modal
        $scope.submit = function() {
            $modalInstance.close($scope.newElement);
        };

        init();
    }]);
/* global _ */
'use strict';

angular.module('ThreeSixtyOneView')
.controller('ScenarioAnalysisElementFilesCtrl', ["$scope", "$controller", "$modalInstance", "CONFIG", "data", "MetaDataService",
function($scope, $controller, $modalInstance, CONFIG, data, MetaDataService) {        
	angular.extend(this, $controller('ListLightboxBaseCtrl', {$scope: $scope, $controller: $controller, $modalInstance: $modalInstance, CONFIG: CONFIG}));

	var init = function() {
		$scope.selectedScenarioElement = data.selectedScenarioElement;
		$scope.currentItem = {id: data.selectedScenarioElement.id};
		$scope.e2e = data.e2e;

		$scope.testHandleName = 'analysisElementReplace';
		$scope.title = $scope.selectedScenarioElement.cubeMeta.label;
		$scope.subtitle = 'Select A New File';
		$scope.isDropdownHidden = true;

		MetaDataService.getCubeAnalysisElements($scope.selectedScenarioElement.cubeMeta.id).then(function(response) {
			$scope.list = response;
			$scope.isListLoaded = true;
		});
	};

	// pass back the selected file and dismiss the modal
	$scope.submit = function() {
		var newFile = _.find($scope.list, function(file) {
			return file.id === $scope.currentItem.id;
		});
		$modalInstance.close(newFile);
	};

	init();
}]);
/* global _ */

'use strict';

angular.module('ThreeSixtyOneView')
    .controller("ScenarioCopyCtrl", ["$scope", "$rootScope", "$controller", "$modalInstance", "data", "CONFIG", "EVENTS", function($scope, $rootScope, $controller, $modalInstance, data, CONFIG, EVENTS) {
        angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, data: data}));

        $scope.item = angular.copy(data);
        $scope.item.name = "COPY -- " + $scope.item.name;

        $scope.modalProperties = {
            title: "Copy a Scenario",
            field: "Name",
            button: "Copy Scenario",
            icon: "files-o"
        };

         $scope.submit = function(name, evt){
            if (evt) { evt.preventDefault(); }
            $scope.item.name = name;
            $rootScope.$broadcast(EVENTS.copyScenario, $scope.item);
            $modalInstance.dismiss('create');
         };

        $scope.close = function(evt) {
            if (evt) { evt.preventDefault(); }

            $modalInstance.dismiss('canceled');
        };
    }]);
/* global _ */

'use strict';

angular.module('ThreeSixtyOneView')
    .controller('ScenarioCreateCtrl', ["$scope", "$modalInstance", "$controller", "data", "ScenarioService", "CONFIG", "EVENTS", "GotoService", '$filter', 'ManageTemplatesService',
        function($scope, $modalInstance, $controller, data, ScenarioService, CONFIG, EVENTS, GotoService, $filter, ManageTemplatesService) {
        
        angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, data: data}));

        var findBaseScenario = function(project, templateIds){
                return _.find(project.data, function(scenario){return (/simulation/i).test(scenario.prediction.type) && (templateIds.indexOf(scenario.template.id) > -1);});
            },
            getMasterProject = function(projects){
                return _.findWhere(projects, {"isMaster": true});
            },
            sortScenarios = function(scenarios){
                var scenarioList = scenarios,
                // remove master project from scenarioList
                masterProject = scenarioList.splice(_.indexOf(scenarioList, $scope.masterProject),1)[0];

                // bring current project to top of the list
                angular.forEach(scenarioList, function(k,v){
                    if (k.title === $scope.project.title){
                        scenarioList.unshift(scenarioList.splice(v,1)[0]);
                    }
                });

                // put the master project in first position
                scenarioList.unshift (masterProject);

                return scenarioList;
            },
            removeInvalidScenarios = function(projects, templateIds) {
                var output = [];

                _.each(projects, function(_project) {
                    var project = {
                        name: _project.name,
                        isMaster: _project.isMaster,
                        data: []
                    }
                    _.each(_project.data, function(_scenario) {
                        if(templateIds.indexOf(_scenario.template.id) > -1) {
                            project.data.push(_scenario);
                        }
                    });
                    if(project.data.length > 0) {
                        output.push(project);
                    }
                });

                return output;
            },
            init = function() {
                $scope.showFields = true;
                $scope.project = data.project;
                $scope.scenarios = data.scenarios;
                $scope.scenario = angular.copy(CONFIG.application.models.ScenarioModel.newScenario);
                $scope.loadingScenarios = true;

                ManageTemplatesService.getAll().then(function(templatesList) {
                    var templateIds = _.pluck(templatesList, 'id');
                    ScenarioService.getAll().then(function(response){
                        $scope.loadingScenarios = false;
                        var baseScenario;
                        $scope.masterProject = getMasterProject(response);
                        baseScenario = findBaseScenario($scope.masterProject, templateIds);
                        // $scope.scenarioList = sortScenarios(response);
                        // following filter is added to remove scenarios with master template
                        $scope.scenarioListUnformatted = sortScenarios(response);
                        $scope.scenarioList = removeInvalidScenarios($scope.scenarioListUnformatted, templateIds);

                        //set the first scenario to be "open" in the modal accordion
                        $scope.scenarioList[0].open = true;

                        $scope.scenario.referenceScenario.id  = baseScenario.id;
                        $scope.scenario.referenceScenario.name  = baseScenario.name;
                        $scope.scenario.referenceScenario.type  = baseScenario.type;
                        $scope.scenario.template  = baseScenario.template;
                        $scope.scenario.prediction  = baseScenario.prediction;
                        $scope.scenario.type = baseScenario.type;
                        $scope.scenario.isPlanOfRecord = false;
                        if(baseScenario.type === 'Action') {
                            $scope.scenario.modellingStartTime = baseScenario.modellingStartTime;
                            $scope.scenario.modellingEndTime = baseScenario.modellingEndTime;
                        } else {
                            delete $scope.scenario.modellingStartTime;
                            delete $scope.scenario.modellingEndTime;
                        }

                        $scope.setScenario($scope.scenario.referenceScenario);
                    });
                });
            },
            selectedBaseScenario;

        $scope.showBaseScenario = function() {
            $scope.showFields = false;
        };

        $scope.setScenario = function(item){
            selectedBaseScenario = item;
        };

        $scope.getScenarios = function(project, searchTerm) {
            var searchTerm = searchTerm || '',
                regExp = new RegExp(searchTerm.toLowerCase(), "g");

            if(regExp.test(project.name.toLowerCase())) {
                return project.data;
            } else {
                return $filter('filter')(project.data, {name: searchTerm});
            }
        };

        $scope.hideMasterProject = function(projectTitle, scenarioTitle, searchTerm) {
            if(!searchTerm || searchTerm.length === 0) {
                return false;
            }

            return projectTitle.toLowerCase().indexOf(searchTerm) === -1 && scenarioTitle.toLowerCase().indexOf(searchTerm) === -1;
        };

        $scope.showRow = function(item){
            return item.id === selectedBaseScenario.id;
        };

        $scope.isScenarioTitleUnique = function(scenarioName) {
            return ! _.findWhere($scope.scenarios, {name:scenarioName});
        };

        $scope.confirm = function(){
            $scope.scenario.type = selectedBaseScenario.type;
            $scope.scenario.referenceScenario.id = selectedBaseScenario.id;
            $scope.scenario.referenceScenario.name = selectedBaseScenario.name;
            $scope.scenario.referenceScenario.type = selectedBaseScenario.type;
            $scope.scenario.template  = selectedBaseScenario.template;
            $scope.showFields = true;
            if(selectedBaseScenario.type === 'Action') {
                $scope.scenario.modellingStartTime = selectedBaseScenario.modellingStartTime;
                $scope.scenario.modellingEndTime = selectedBaseScenario.modellingEndTime;
            } else {
                delete $scope.scenario.modellingStartTime;
                delete $scope.scenario.modellingEndTime;
            }
        };

        $scope.cancel = function(){
            $scope.showFields = true;
        };

        $scope.submit = function(scenario){
            $scope.close();
            ScenarioService.create($scope.project.uuid, scenario).then(function(response){
                GotoService.scenarioEdit($scope.project.uuid, response.id);
            });
        };

        $scope.$on(EVENTS.updateBaseScenario, function(event, data){
            $scope.scenario.referenceScenario.id = data.id;
            $scope.scenario.referenceScenario.name = data.name;
        });

        init();
    }]);
'use strict';

angular.module('ThreeSixtyOneView')
.controller('ScenarioTemplatesViewsCtrl', ['$scope', '$rootScope', '$controller', '$modalInstance', 'CONFIG', 'EVENTS', 'data', 'ManageTemplatesService', 'DimensionService', 'ManageScenariosService', 'PivotMetaService', 'MetaDataService', 'ScenarioService', 'AnalyticCalculationsService',
	function($scope, $rootScope, $controller, $modalInstance, CONFIG, EVENTS, data, ManageTemplatesService, DimensionService, ManageScenariosService, PivotMetaService, MetaDataService, ScenarioService, AnalyticCalculationsService) {
	angular.extend(this, $controller('ModalBaseCtrl', {$scope: $scope, $modalInstance: $modalInstance, data: data}));

	var init = function() {
		$scope.CONFIG = CONFIG;
		// this sets the following
		// $scope.templateType, $scope.scenarioTemplates, $scope.masterProject
		angular.extend($scope, data);
		$scope.dimensions = [];
		$scope.dimensionsSchema = [];
		$scope.spendCube = [];
		$scope.spendCubeLoading = false;
		$scope.modelingPeriod = [];

		initializeTemplate($scope.templateType);
		
		ManageScenariosService.getBase($scope.templateType.label).then(function(baseScenario) {
			$scope.baseScenario = baseScenario;
			ManageTemplatesService.get(baseScenario.template.id, false).then(function(baseTemplate) {
				$scope.baseTemplate = baseTemplate;
				$scope.template.source.id = baseTemplate.id;
				$scope.dimensionsList = baseTemplate.dimensions;
				$scope.kpisList = baseTemplate.kpis;
				DimensionService.getDimensions(baseScenario.template.id);
			});
		});
	},
	initializeTemplate = function(type) {
		$scope.template = {
			name: '',
			description: '',
			type: $scope.templateType.label,
			source: {},
			dimensions: [],
			kpis: []
		};

		$scope.dimensionsIsLoaded = false;
		$scope.timeGranularity = false;
		$scope.standardDimensionsLabels = '';
		$scope.kpiDimensionsLabels = '';

		$scope.performancePeriod = {
			from: null,
			to: null
		};

		$scope.addedDimensionMembers = false;
		$scope.defaultView = {};
	},
	timeDimension = false,
	addTimeDimension = function(addedMembers) {
		var dimension = {
			id: $scope.filteredTimeDimension.id,
			type: $scope.filteredTimeDimension.type,
			attributes: []
		};
		_.each($scope.filteredTimeDimension.members, function(_attribute, _attributeIndex) {
			var attribute = {
					id: _attribute.id,
					specification: {}
				},
				members = PivotMetaService.getCategorizeValues($scope.filteredTimeDimension, addedMembers[$scope.filteredTimeDimension.label], _attributeIndex);
			if(members.selected === members.total) {
				attribute.specification.type = 'All';
			} else {
				attribute.specification.type = 'Include';
				attribute.specification.members = [];
				_.each(members.id, function(_id) {
					attribute.specification.members.push({id: _id});
				})
			}
			dimension.attributes.push(attribute);
		});
		$scope.template.dimensions.push(dimension);
	},
	makePlanOfRecord = function(template, baseScenario) {
		var planOfRecord = angular.copy(CONFIG.application.models.ScenarioModel.newScenario);
		planOfRecord.name = 'Plan of Record';
		planOfRecord.type = template.type;
		planOfRecord.isPlanOfRecord = true;
		planOfRecord.prediction = baseScenario.prediction;
		planOfRecord.template = template;
		planOfRecord.referenceScenario = {
			id: baseScenario.id,
			name: baseScenario.name,
			type: baseScenario.type
		};
		if(template.type === 'Action') {
			planOfRecord.modellingStartTime = $scope.performancePeriod.from.id;
			planOfRecord.modellingEndTime = $scope.performancePeriod.to.id;
		}
		return planOfRecord;
	};

	$scope.createDraftTemplate = function() {
		if(typeof $scope.template.id === 'undefined') {
			ManageTemplatesService.create($scope.template).then(function(response) {
				$scope.template.id = response.id;
			});
		}
	};

	$scope.getTimeGranularity = function() {
		return $scope.timeGranularity;
	};

	$scope.setTimeGranularity = function(time) {
		var i, levelFound = false;
		$scope.timeGranularity = time;

		if(!!time) {
			if(!timeDimension) {
				timeDimension = _.find($scope.dimensions, function(dimension) { return dimension.type === 'TimeDimension' });
				$scope.filteredTimeDimension = {
					id: timeDimension.id,
					label: timeDimension.label,
					type: timeDimension.type,
					members: []
				};
			}
			$scope.filteredTimeDimension.members = [];
			_.each(timeDimension.members, function(level) {
				if(!levelFound) {
					$scope.filteredTimeDimension.members.push(level);
				}
				levelFound = levelFound || level.label === time;
			});
		}
	};

	$scope.getAddedDimensionMembers = function() {
		return $scope.addedDimensionMembers;
	};

	$scope.setAddedDimensionMembers = function(addedMembers) {
		$scope.addedDimensionMembers = addedMembers;
	};

	$scope.getSpendCube = function() {
		return $scope.spendCube;
	};

	$scope.getDefaultView = function() {
		return $scope.defaultView;
	}

	$scope.setDefaultView = function(view) {
		$scope.defaultView = view;
	};

	$scope.setPerformancePeriod = function(fromDate, toDate) {
		$scope.performancePeriod.from = fromDate;
		$scope.performancePeriod.to = toDate;
	};

	$scope.setDimensionsLabel = function(dimensions, categorizedValue, type) {
		$scope[type + 'DimensionsLabel'] = DimensionService.getSelectedDimensionsLabels(dimensions, categorizedValue, type);
	}

	$scope.setStandardDimensions = function(dimensions, dimensionsSchema, addedMembers) {
		$scope.spendCubeLoading = true;
		// empty the default view if previously created, to avoid conflicts if used dimensions are modified
		$scope.defaultView = {};
		$scope.template.dimensions = [];
		_.each(dimensionsSchema, function(_dimension, _dimensionIndex) {
			if(!_dimension.isSelected) return;
			var dimension = {
					id: _dimension.id,
					type: _dimension.type,
					attributes: []
				};
			_.each(_dimension.members,function(_attribute, _attributeIndex) {
				if(!_attribute.isSelected) return;
				var attribute = {
					id: _attribute.id,
					specification: {}
				}, members = [],
				i;

				members = PivotMetaService.getCategorizeValues(dimensions[_dimensionIndex], addedMembers[_dimension.label], _attributeIndex);
				if(members.selected === members.total) {
					attribute.specification.type = 'All';
				} else {
					attribute.specification.type = 'Include';
					attribute.specification.members = [];
					_.each(members.id, function(_id) {
						attribute.specification.members.push({id: _id});
					})
				}
				dimension.attributes.push(attribute);
			});
			$scope.template.dimensions.push(dimension);
		});
		addTimeDimension(addedMembers);
		ManageTemplatesService.update($scope.template, false).then(function(template) {
			ManageTemplatesService.getTemplateCubesByType(template.id, 'Spend').then(function(cubeId) {
				MetaDataService.buildDimensionsTree(cubeId[0]).then(function(spendCube) {
					$scope.spendCube = spendCube;
					$scope.$broadcast(EVENTS.spendCubeIdLoaded, spendCube);
					$scope.spendCubeLoading = false;
				});
			});
		});
	};

	$scope.setKpiDimension = function(kpis) {
		$scope.template.kpis = [];
		_.each(kpis, function(kpi) {
			if(!kpi.isSelected) return;
			$scope.template.kpis.push({id: kpi.id});
		});
	};

	$scope.getTimeGranularityInfo = function() {
		return $scope.filteredTimeDimension.members[$scope.filteredTimeDimension.members.length - 1];
	};

	$scope.cancel = function() {
		if(!!$scope.template.id) {
			ManageTemplatesService.delete($scope.template.id);
		}
		$modalInstance.dismiss();
	};

	// pass back the selected file and dismiss the modal
	$scope.submit = function() {
		ManageTemplatesService.update($scope.template, true).then(function(templateResponse) {
			var planOfRecord = makePlanOfRecord(templateResponse, $scope.baseScenario);
			ManageTemplatesService.createView($scope.template.id, $scope.defaultView);//.then(function(viewResponse) {});
			ScenarioService.create($scope.masterProject.uuid, planOfRecord).then(function(scenario) {
				AnalyticCalculationsService.post(scenario.id).then(function(calculate) {
					$rootScope.$broadcast(EVENTS.planOfRecordCreated, scenario);
				});
			});
			$modalInstance.close(templateResponse);
		});
	};

    $scope.$on(EVENTS.selectTime, function(evt, data) {
        $scope.timeGranularity = data;
    });

    $scope.$on(EVENTS.dimensionsIsLoaded, function(evt, data) {
        $scope.dimensionsIsLoaded = true;
        $scope.dimensions = data;
        _.each($scope.dimensions, function(_dimension) {
        	var dimension = {
        		id: _dimension.id,
        		label: _dimension.label,
        		type: _dimension.type,
        		members: []
        	};
        	_.each(_dimension.members, function(_attribute) {
        		dimension.members.push({
        			id: _attribute.id,
        			label: _attribute.label
        		});
        	});
        	$scope.dimensionsSchema.push(dimension);
        });
    });

	$scope.$on(EVENTS.flipbookAllowAdvance, function(evt, data){
		$scope.enableNext = data;
	});

	init();
}]);
/* globals _, window */
/*jshint unused:false*/

'use strict';
angular.module('ThreeSixtyOneView')
.controller("ScenarioCtrl", ["$scope", "$rootScope", "$timeout", "Project", "Scenario", "ScenarioAnalysisElements", "$state", "EVENTS", "Calculate", "AnalyticCalculationsService", "CONFIG", "ScenarioStatesService",
	function($scope, $rootScope, $timeout, Project, Scenario, ScenarioAnalysisElements, $state, EVENTS, Calculate, AnalyticCalculationsService, CONFIG, ScenarioStatesService) {

		var init = function() {
			$scope.project = Project;
			$scope.scenario = Scenario;

			$scope.simulateButtonDisabled = false;

			// plan of record should be read-only
			if($scope.scenario.isPlanOfRecord) {
				$scope.readOnlyMode = true;
			} else {
				$scope.readOnlyMode = false;
			}

			$scope.pivotTableSaveStatus = '';

			$scope.scenarioElements = ScenarioAnalysisElements;
			$scope.groupedScenarioElements = getGroupedScenarioElements();

			// either load the element selected in scenario listing page or TOUCHPOINT related element if none selected
			$scope.setScenarioElement(!!parseInt($state.params.scenarioElementId) ? getScenarioElementById($scope.scenarioElements, parseInt($state.params.scenarioElementId)) : getScenarioElementByCubeName($scope.scenarioElements, 'TOUCHPOINT'), true);

			$scope.getlocation();
			$scope.scenarioState = ScenarioStatesService.getScenarioState(Calculate.currentState);
			$scope.scenarioStates = CONFIG.application.models.ScenarioAnalytics.states;

			setView($scope.scenarioState);
		},
		getScenarioElementById = function(data, id){
			return _.findWhere(data, {id: id});
		},
		getScenarioElementByCubeName = function(_data, _name){
			if(_data.length === 1) {
				return _data[0];
			} else {
				return _.find(_data, function(element) { return element.cubeMeta.name === _name; });
			}
		},
		setView = function(currentState){
			if (AnalyticCalculationsService.isInProgress($scope.scenarioState.message) || AnalyticCalculationsService.isFailed($scope.scenarioState.message)){
				$timeout(function(){$state.go("Scenario.calculate");});
			}
		},
		getGroupedScenarioElements = function(){
			return  _.groupBy($scope.scenarioElements, function(element) {return element.group;});
		};

		$scope.setScenarioElement = function(element, cubeChanged) {
			if(cubeChanged) {
				$rootScope.$broadcast(EVENTS.scenarioElementChange, element.cubeMeta);
				$rootScope.$broadcast(EVENTS.pivotViewChange, {});

				$scope.cubeId = element.cubeMeta.id;
				$scope.groupedScenarioElements = getGroupedScenarioElements();
			}
			$rootScope.$broadcast(EVENTS.pivotTableStatusChange, CONFIG.application.models.PivotServiceModel.pivotDataStatus.loading);

			$scope.selectedScenarioElement = element;
			$scope.selectedScenarioElementsFile = element.name;
		};

		$scope.setState = function(state){
			$scope.scenarioState = CONFIG.application.models.ScenarioAnalytics.states[state];
		};

		$scope.updateCalculateState = function(response) {
			var currentState = ScenarioStatesService.getScenarioState(response),
	        	setState;
            _.each($scope.scenarioStates, function(v, k) {
                if (v.message === currentState.message) { setState = k; }
            });
            $scope.setState(setState);
		};

		$scope.getlocation = function (){
			var url = $state.current.url.match(/\/\w+/)[0],
				location;

			switch(url){
				case "/edit" : location = url; break;
				default: location = "/results";
			}
			$scope.location = location;
		};

		$scope.gotoResults = function(){
			if (AnalyticCalculationsService.isInProgress($scope.scenarioState.message) || AnalyticCalculationsService.isFailed($scope.scenarioState.message)) {
				$state.go("Scenario.calculate");
			} else {
				$state.go("Scenario.results");
			}
		};

		$scope.setReadOnlyMode = function(mode) {
			if(typeof mode !== 'undefined') {
				$scope.readOnlyMode = mode;
			}

			return $scope.readOnlyMode;
		};

		$scope.disableSimulateButton = function(state) {
			if(!_.isUndefined(state)) {
				$scope.simulateButtonDisabled = state;
			}
			return $scope.simulateButtonDisabled;
		};

		$scope.isScenarioStrategy = function() {
			return $scope.scenario.type === 'Strategy';
		};

		$scope.$on(EVENTS.pivotTableStatusChange, function(event, data) {
			$scope.pivotTableSaveStatus = data.status;
		});

		$scope.$on('$locationChangeStart', function(){
			$scope.getlocation();
		});

		init();
	}]);
/* globals _, window */
/*jshint unused:false*/

'use strict';
angular.module('ThreeSixtyOneView')
.controller("ScenarioEditorCtrl", ["$scope", "$rootScope", "EVENTS", "PivotMetaService", "PivotService", "ManageAnalysisViewsService", "ScenarioStatesService", "CONFIG",
	function($scope, $rootScope, EVENTS, PivotMetaService, PivotService, ManageAnalysisViewsService, ScenarioStatesService, CONFIG) {

		var init = function() {
			// determines if the current view is a draft view
			$scope.draftView = false;
			// determines if adding time dimensions in rows and columns is disabled
			$scope.timeDisabled = false;
			// added items in rows and columns
			$scope.added = {};
			// added filters
			$scope.addedFilters = {};
			// added filters in categorized format
			$scope.categorizedValue = [];
			$scope.pivotTableData = '';

			ScenarioStatesService.startPull([$scope.scenario.id]);

			// this is how pivotbuilder and pivottable communicate
			$scope.spread = {sheet: {loading: true}};

			initiateModel($scope.selectedScenarioElement.cubeMeta);
		},
		initiateModel = function(cubeMeta) {
			$scope.viewData = {name: 'Loading ...'};
			PivotMetaService.initModel(cubeMeta).then(function(result) {
				var foundView = _.find(result.viewsList, function(view){ return view.id === result.viewData.id; });
				if (foundView) {
					$scope.draftView = foundView.isDraft;
				}

				// broadcast dimension for Action analysis element toolbar
				$rootScope.$broadcast(EVENTS.dimensionsReady, result.dimensions);

				angular.extend($scope, result);
				$scope.viewName = result.viewData.name;

				$scope.added = PivotMetaService.setUpAddedLevels(result.viewData.columns.concat(result.viewData.rows));
				$scope.membersList = PivotMetaService.generateMembersList(result.dimensions);
				$scope.determineTimeDisability($scope.added);
				$scope.addedFilters = PivotMetaService.getAddedFilters(result.viewData.filters, result.dimensions);
				$scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, result.dimensions, result.viewData);

				$scope.lockVariableDimension($scope.added);

				$scope.loadPivotTable($scope.selectedScenarioElement, result.viewData);
			});
		};

		$scope.deleteView = function(cubeId, viewId) {
			ManageAnalysisViewsService.deleteView(viewId, cubeId).then(function() {
				$scope.viewsList = _.reject($scope.viewsList, function(view) { return view.id === viewId; });
				$scope.draftView = false;
			});
		};

		// save the draft view
		$scope.saveDraftView = function() {
			if(!$scope.draftView) {
				ManageAnalysisViewsService.defaultView($scope.cubeId, $scope.viewData.id, false);
				$scope.draftView = true;
				var draftView = angular.copy($scope.viewData);
				draftView.name = 'Draft - ' + draftView.name;
				draftView.isDraft = true;
				$scope.createView($scope.cubeId, draftView).then(function() {
					$scope.loadPivotTable($scope.selectedScenarioElement, $scope.viewData);
				});
			} else {
				PivotMetaService.updateView($scope.cubeId, $scope.viewData).then(function() {
					$scope.loadPivotTable($scope.selectedScenarioElement, $scope.viewData);
				});
			}
		};

		// save the changes in the current view
		$scope.saveView = function() {
			if($scope.draftView) {
				var originalViewName = $scope.viewData.name.substring(8),
					originalViewId = _.find($scope.viewsList, function(view) { return originalViewName === view.name; }).id,
					draftViewId = $scope.viewData.id;

				$scope.viewData.name = originalViewName;
				$scope.viewData.id = originalViewId;
				$scope.viewData.isDraft = false;
				PivotMetaService.updateView($scope.cubeId, $scope.viewData).then(function(view) {
					$scope.viewData = view;
					$scope.added = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
					$scope.determineTimeDisability($scope.added);
				});
				$scope.deleteView($scope.cubeId, draftViewId);
			}
		};

		$scope.loadPivotTable = function(element, view) {
			if(!!$scope.spread.updateSheet) {
				$scope.spread.sheet.loading = true;
				$scope.spread.updateSheet('');
				$rootScope.$broadcast(EVENTS.pivotTableStatusChange, CONFIG.application.models.PivotServiceModel.pivotDataStatus.loading);
				PivotService.getSlice(element.id, view.id).then(function(response) {
					var numCols = view.columns.length,
						numRows = view.rows.length;
					$scope.spread.updateSheet(response.formatted, numCols, numRows, response.helperObject);
					$scope.pivotTableObject = response.original;
					$scope.pivotTableData = response.formatted;
					$scope.pivotTableHelper = response.helperObject;
				});
			}
		};

		// update filter values after any change made to them in the filters modal
		$scope.updateFilterValues = function(newFilterData) {
			$scope.addedFilters = newFilterData;

			$scope.viewData.filters = PivotMetaService.updateFilters($scope.dimensions, $scope.addedFilters, $scope.membersList, $scope.viewData.filters);
			$scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, $scope.dimensions, $scope.viewData);
		};

		// load a view from the backend
		$scope.loadView = function(cubeId, viewId) {
			var oldViewId = $scope.viewData.id;
			$scope.viewData = {name: 'Loading ...'};
			$rootScope.$broadcast(EVENTS.pivotViewChange, {});
			ManageAnalysisViewsService.getView(viewId, cubeId).then(function(view) {
				//undefault the previous view
				if(!!oldViewId && !$scope.draftView) {
					ManageAnalysisViewsService.defaultView(cubeId, oldViewId, false);
				}
				// remove the draft view if one exists and is not selected
				if($scope.draftView) {
					var draftId = _.find($scope.viewsList, function(view) {return view.name.substring(0,8) === 'Draft - ';}).id;

					if(viewId !== draftId) {
						$scope.deleteView($scope.cubeId, draftId);
					}
				}

				$scope.viewData = view;
				$scope.added = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
				$scope.determineTimeDisability($scope.added);
				$scope.membersList = PivotMetaService.generateMembersList($scope.dimensions);
				$scope.addedFilters = PivotMetaService.getAddedFilters(view.filters, $scope.dimensions);
				$scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, $scope.dimensions, view);

				$scope.lockVariableDimension($scope.added);

				$scope.loadPivotTable($scope.selectedScenarioElement, view);
			});
		};

		$scope.createView = function(cubeId, view) {
			view.id = null;
			return ManageAnalysisViewsService.createView(view, cubeId).then(function(view) {
				$scope.viewData = angular.copy(view);
				$scope.added = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
				$scope.determineTimeDisability($scope.added);
				$scope.viewsList.unshift(view);
				$scope.addedFilters = PivotMetaService.getAddedFilters(view.filters, $scope.dimensions);
				return view;
			});
		};

		$scope.renameView = function(cubeId, view) { // rename the view
			ManageAnalysisViewsService.renameView(view.id, cubeId, view).then(function(response) {
				view.isDraft = false;
				$scope.draftView = false;
				_.each($scope.viewsList, function(item) {
					if(item.id === response.id) {
						item.name = response.name;
					}
				});
			});
		};

		$scope.isViewDraft = function(draft) {
			if(typeof draft === 'undefined') {
				return $scope.draftView;
			} else {
				$scope.draftView = draft;
			}
		};

		$scope.determineTimeDisability = function(added) {
			$scope.timeDisabled = PivotMetaService.determineTimeDisability($scope.dimensions, added);
		};

		// locks the last variable item in rows/columns if its aggregatable type is false
		$scope.lockVariableDimension = function(addedItems) {
			var variableDimension = _.find($scope.dimensions, function(dimension) {
				return dimension.hasOwnProperty('aggregatable') && dimension.aggregatable === false;
			}),
			addedVariableMembers = [];

			$scope.lockedDimensions = {};

			if(variableDimension) {
				_.each(variableDimension.members, function(member) {
					if(addedItems[member.label]) {
						addedVariableMembers.push(member.label);
					}
				});
			}

			if(addedVariableMembers.length === 1) {
				$scope.isVariableDimensionLocked = true;
				$scope.lockedDimensions[addedVariableMembers[0]] = true;
			} else {
				$scope.isVariableDimensionLocked = false;
			}
		};

		$scope.determineReadOnlyMode = function(currentState) {
			var states = CONFIG.application.models.ScenarioAnalytics.states;

			if(states.IN_PROGRESS.message === currentState) {
				if(!$scope.readOnlyMode) {
					$scope.setReadOnlyMode(true);
					$scope.disableSimulateButton(true);
					if(!!$scope.spread.setReadOnly) {
						$scope.spread.setReadOnly(true);
					}
				}
			} else {
				if($scope.readOnlyMode) {
					if(!$scope.scenario.isPlanOfRecord) {
						$scope.setReadOnlyMode(false);
						if(!!$scope.spread.setReadOnly) {
							$scope.spread.setReadOnly(false);
						}
					} else {
						if(!!$scope.spread.setReadOnly) {
							$scope.spread.setReadOnly(true);
						}
					}
					$scope.disableSimulateButton(false);
				}
			}
		};

		$scope.$on(EVENTS.scenarioElementChange, function(evt, cubeMeta) {
			initiateModel(cubeMeta);
		});

		$scope.$on(EVENTS.broadcastStates, function($event, response) {
			$scope.determineReadOnlyMode(response[0].currentState.message);
			$scope.updateCalculateState(response[0].currentState);
		});

		init();
	}]);
/* globals _, window */
/*jshint unused:false*/

'use strict';

// View controllers
angular.module('ThreeSixtyOneView')
	.controller("AnalysisElementCtrl", ["$scope", 'EVENTS', "DialogService", "ManageScenariosService", 'ScenarioService',
	function($scope, EVENTS, DialogService, ManageScenariosService, ScenarioService) {
		// Inherited from parent controller scenario.js
		// $scope.scenarioElements
		// $scope.setScenarioElement
		// $scope.selectedScenarioElement
		// $scope.selectedScenarioElementsFile
		// $scope.groupedScenarioElements;
		// $scope.loadPivotTable()
		var init = function(){
			},
			replaceScenarioElement = function(newElement) {
				_.each($scope.scenarioElements, function(element, index) {
					if(element.cubeMeta.id === newElement.cubeMeta.id) {
						$scope.scenarioElements.splice(index, 1, newElement);
					}
				});
				$scope.setScenarioElement(newElement, false);
				$scope.loadPivotTable($scope.selectedScenarioElement, $scope.viewData);
			},
			replaceAnalysisElementForCube = function(scenarioId, cubeId, elementId) {
				ManageScenariosService.replaceAnalysisElementForCube(scenarioId, cubeId, elementId).then(function(element) {
					replaceScenarioElement(element);
				});
			},
			copyAndReplaceAnalysisElementForCube = function(scenarioId, cubeId, sourceElementId, newElementData) {
				ManageScenariosService.copyAndReplaceAnalysisElementForCube(scenarioId, cubeId, sourceElementId, newElementData).then(function(element){
					replaceScenarioElement(element);
				});
			},
			getModelingPeriod = function(timeLevelId) {
				if($scope.scenario.type === 'Action') {
					ManageScenariosService.getModelingPeriod(timeLevelId).then(function(periods) {
						$scope.modelingPeriod = periods;
						$scope.fromDate = _.find(periods, function(period) {
							return period.id === $scope.scenario.modellingStartTime;
						});
						$scope.toDate = _.find(periods, function(period) {
							return period.id === $scope.scenario.modellingEndTime;
						});
					});
				}
			},
			updateScenario = function() {
				ScenarioService.setModelingTime($scope.project.uuid, $scope.scenario);//.then(function(scenario) {});
			};

		// hide scenario copy and replace options if part of the marketing plan
		$scope.isHiddenElement = function(element) {
			return element.group === 'Marketing Plan';
		};

		$scope.getGroupedScenarioElements = function() {
			return $scope.groupedScenarioElements;
		};

		$scope.openScenarioElementFileModal = function(scenarioId, selectedScenarioElement, e2e) {
			var dialog = DialogService.openLightbox('views/modal/ms_list_lightbox.tpl.html', 'ScenarioAnalysisElementFilesCtrl',
				{selectedScenarioElement: selectedScenarioElement, e2e: e2e},
				{windowSize: 'lg', windowClass: 'list-lightbox'});

			dialog.result.then(function(data) {
				replaceAnalysisElementForCube(scenarioId, selectedScenarioElement.cubeMeta.id, data.id);
			});
		};

		$scope.openScenarioElementCopyModal = function(scenarioId, selectedScenarioElement) {
			var dialog = DialogService.openLightbox('views/modal/scenario_analysis_element_copy.tpl.html', 'ScenarioAnalysisElementCopyCtrl',
				{selectedScenarioElement: selectedScenarioElement},
				{windowSize: 'lg', windowClass: 'form-lightbox'});

			dialog.result.then(function(data) {
				copyAndReplaceAnalysisElementForCube($scope.scenario.id, $scope.cubeId, selectedScenarioElement.id, data);
			});
		};

		$scope.setFromDate = function(time) {
			$scope.fromDate = time;
			$scope.scenario.modellingStartTime = time.id;
			updateScenario();
		};

		$scope.setToDate = function(time) {
			$scope.toDate = time;
			$scope.scenario.modellingEndTime = time.id;
			updateScenario();
		};

		$scope.$on(EVENTS.dimensionsReady, function(event, dimensions) {
			var timeDimension, timeLevelId;
			timeDimension = _.filter(dimensions, function(dimension) {
				return dimension.type === 'TimeDimension';
			})[0];
			timeLevelId = timeDimension.members[timeDimension.members.length - 1].id;
			getModelingPeriod(timeLevelId);
		});

		init();
	}]);
'use strict';

/**
* @ngdoc function
* @name ThreeSixtyOneView.controller:PivotbuilderctrlCtrl
* @description
* # PivotbuilderctrlCtrl
* Controller of the ThreeSixtyOneView
*/
angular.module('ThreeSixtyOneView')
.controller('PivotBuilderCtrl', ['$scope', 'EVENTS', 'DialogService', 'ManageAnalysisViewsService', 'PivotViewService',
	function ($scope, EVENTS, DialogService, ManageAnalysisViewsService, PivotViewService) {
		var init = function() {
			$scope.pivotBuilderItems = [{name:'columns', label: 'Columns', other: 'rows'}, {name:'rows', label: 'Rows', other: 'columns'}];
			$scope.saveAs = false;

			// loads the pivot table after page was initially loaded from the results tab
			if(!!$scope.viewData.id && $scope.pivotTableData === '') {
				$scope.loadPivotTable($scope.selectedScenarioElement, $scope.viewData);
			}

			$scope.dragOptions = {
				itemMoved: function() {
					$scope.saveDraftView();
				},
				orderChanged: function() {
					$scope.saveDraftView();
				},
				dragStart: function() {
					$scope.isDragging = true;
				},
				dragEnd: function() {
					$scope.isDragging = false;
				},
				containment: '#dragDropArea'
			};
		},
		rename = false;

		// $added contains added levels in rows/columns and is coming from parent controller
		$scope.deleteItem =  function(index, element) {
			PivotViewService.deleteItem($scope.viewData, $scope.added, index, element,
				[$scope.determineTimeDisability, $scope.saveDraftView, $scope.lockVariableDimension]);
		};

		$scope.addItem = function(item, element) {
			PivotViewService.addItem($scope.viewData, $scope.added, item, element,
				[$scope.determineTimeDisability, $scope.saveDraftView, $scope.lockVariableDimension]);
		};

		$scope.replaceItem = function(selected, priorLabel, element) {
			PivotViewService.replaceItem($scope.viewData, $scope.added, selected, priorLabel, element,
				[$scope.determineTimeDisability, $scope.saveDraftView, $scope.lockVariableDimension]);
		};

		// open/dismiss filters selection modal
		$scope.filtersModal = function(category) {
			var filtersModalCallback = function(newFilterData) {
				$scope.updateFilterValues(newFilterData);
				$scope.saveDraftView();
			};

			DialogService.filtersModal(category, $scope.addedFilters, $scope.viewData.rows.concat($scope.viewData.columns), $scope.dimensions, filtersModalCallback);
		};

		// returns list of all the views in the current cube
		$scope.getViewsList = function() {
			return $scope.viewsList;
		};

		$scope.getDimensions = function() {
			return $scope.dimensions;
		};

		$scope.openAllViewsModal = function() {
			var dialog = DialogService.openLightbox('views/modal/ms_list_lightbox.tpl.html', 'AllViewsCtrl',
				{viewsList: $scope.viewsList, selectedViewId: $scope.viewData.id, e2e: $scope.e2e},
				{windowSize: 'lg', windowClass: 'list-lightbox'});

			dialog.result.then(function(data) {
				$scope.loadView($scope.cubeId, data);
			});
		};

		// returns element titles in the view: rows and columns
		$scope.getPivotBuilderItems = function() {
			return $scope.pivotBuilderItems;
		};

		$scope.getViewData = function(element) {
			return $scope.viewData[element];
		};

		// reset the view to the last saved state
		$scope.revertView = function() {
			var originalViewName, originalViewId;
			if($scope.isViewDraft()) {
				originalViewName = $scope.viewData.name.substring(8);
				originalViewId = _.find($scope.viewsList, function(view) { return originalViewName === view.name; }).id;

				// load view automatically deletes draft view if a non-draft is loaded
				$scope.loadView($scope.cubeId, originalViewId);
			}
		};

		$scope.startSaveAs = function(name) {
			$scope.saveAsName = name;
			$scope.saveAs = true;
			rename = false;
		};

		$scope.submitSaveAs = function(evt) {
			var oldViewId = $scope.viewData.id,
				newView;

			if (evt){
				evt.stopPropagation();
			}

			if (rename) {
				$scope.viewData.name = $scope.saveAsName;
				if ($scope.isViewDraft()) {
					$scope.isViewDraft(false);
				}
				$scope.renameView($scope.cubeId, $scope.viewData);
			} else if (!rename) {
				newView = angular.copy($scope.viewData);
				newView.name = $scope.saveAsName;
				newView.isDraft = false;
				if ($scope.isViewDraft()) {
					$scope.deleteView($scope.cubeId, $scope.viewData.id);
				} else {
					ManageAnalysisViewsService.defaultView($scope.cubeId, oldViewId, false);
				}
				$scope.createView($scope.cubeId, newView);
			}

			$scope.cancelSaveAs();
		};

		$scope.cancelSaveAs = function(evt) {
			if (evt && evt.stopPropagation){
				evt.stopPropagation();
			}
			rename = false;
			$scope.saveAs = false;
		};

		$scope.startRename = function() {
			$scope.saveAsName = $scope.viewData.name;
			$scope.saveAs = true;
			rename = true;
		};

		// show table/filters section and update height for pivot table
		$scope.showTable = function(filtersVisible){
			$scope.isFiltersVisible = filtersVisible;
		};

		$scope.$on(EVENTS.tabClosed, function(){
			$scope.$apply($scope.cancelSaveAs);
		});

		$scope.$on(EVENTS.pivotViewChange, function(){
			$scope.cancelSaveAs();
		});

		init();
	}]);
/* global $:false, _:false */

'use strict';

angular.module("ThreeSixtyOneView").controller("PivotTableCtrl", ["$scope", "$rootScope", "$timeout", "PivotService", "CONFIG", "EVENTS", function($scope, $rootScope, $timeout, PivotService, CONFIG, EVENTS) {
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
					$scope.spread.setReadOnly($scope.readOnlyMode);

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
								if(angular.isNumber(dirtyDataArray[0].oldValue) && angular.isNumber(dirtyDataArray[0].newValue) && Number(dirtyDataArray[0].oldValue) >= 0 && Number(dirtyDataArray[0].newValue) >= 0) {
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

			$scope.spread.setReadOnly = function(readonly) {
				for (var i = rowHeaderCnt; i < rowCnt; i++) {
					for (var j = colHeaderCnt; j < colCnt; j++) {
						if(sheet.getCell(i, j).value() === null) {
							sheet.getCell(i, j).locked(readonly);
						} else {
							sheet.getCell(i, j).locked(readonly);
						}
					}
				}
			};

			//init is called in the template (scenario_edit.tpl.html) because html needs to render before controller is executed
		}
	]);

'use strict';

angular.module('ThreeSixtyOneView').controller('ExportCtrl', ['$scope', 'ExportResourceService', '$timeout', 'DialogService', 'PivotMetaService', 'CONFIG', 'PivotViewService',
	function($scope, ExportResourceService, $timeout, DialogService, PivotMetaService, CONFIG, PivotViewService) {
		var init = function() {
			$scope.exportViewData = {}; // contains the view data modified for export tab
			$scope.addedExportFilters = {}; // contains the added filter values for the export view
			$scope.categorizedExportValue = []; // categorized filter values based on selected filters for the export tab
			$scope.exportAddedDimensions = {}; // contains the added dimensions for the export view
			$scope.isExportInProgress = false;

			var unwatchViewData = $scope.$watch('viewData', function() {
				$scope.setupExportView();
			});

			$scope.$on('$destroy', function() {
				unwatchViewData();
			});

			$scope.dragOptions = {
				dragStart: function() {
					$scope.isDragging = true;
				},
				dragEnd: function() {
					$scope.isDragging = false;
				},
				containment: '#exportDragArea'
			};
		}, setupExportViewFilters = function() {
			if(!!$scope.addedFilters && !!$scope.dimensions) {
				$scope.addedExportFilters = angular.copy($scope.addedFilters);
				$scope.exportViewData.filters = PivotMetaService.updateFilters($scope.dimensions, $scope.addedFilters, $scope.membersList, $scope.exportViewData.filters);
				$scope.categorizedExportValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, $scope.dimensions, $scope.exportViewData);
				getLockedDimensions($scope.dimensions, $scope.membersList, $scope.categorizedExportValue);
			}
		}, trackProgress = function() {
			ExportResourceService.checkStatus($scope.exportElementId).then(function(response) {
				switch(response.status) {
					case exportModel.processingStates.init.message:
						$scope.statusMessage = exportModel.processingStates.init.description;
						break;
					case exportModel.processingStates.complete.message:
						$scope.isDownloadReady = true;
						$scope.statusMessage = exportModel.processingStates.complete.description;
						$scope.downloadFile();
						break;
					case exportModel.processingStates.download.message:
						$scope.statusMessage = exportModel.processingStates.download.description;
						$scope.isDownloadCompleted = true;
						$scope.cancelExport();
						return;
						break;
					case exportModel.processingStates.fail.message:
						$scope.statusMessage = exportModel.processingStates.fail.description;
						$scope.isExportFailed = true;
						$scope.cancelExport();
						return;
					case exportModel.processingStates.notfound.message:
					case exportModel.processingStates.inprogress.message:
						$scope.statusMessage = exportModel.processingStates.inprogress.description;
						break;
					default:
						console.log(response);
				}
				
				progressPromise = $timeout(function() {
					trackProgress();
				}, 2000);
			});
		}, exportModel = CONFIG.application.models.ExportModel,
		progressPromise,
		// get dimensions that cannot be removed due to filters applied on them
		getLockedDimensions = function(dimensions, membersList, filters) {
			$scope.lockedDimensions = {};

			_.each(dimensions, function(dimension, dimensionIndex) {
				var filteredLevel,
					highestLevelAdded,
					sameHierarchyItems = 0;

				if(filters[dimensionIndex].selected < filters[dimensionIndex].total) {
					_.each(dimension.members, function(level) {
						if(level.levelId === membersList[dimension.id][filters[dimensionIndex].id[0] + ',' + filters[dimensionIndex].label[0]].levelId) {
							filteredLevel = level;
						}
						if(!!filteredLevel && level.hierarchyId === filteredLevel.hierarchyId && $scope.exportAddedDimensions[level.label]) {
							sameHierarchyItems++;
							if(!highestLevelAdded) {
								highestLevelAdded = level;
							}
						}
					});

					if(sameHierarchyItems === 0) {
						$scope.addItem(filteredLevel);
						$scope.lockedDimensions[filteredLevel.label] = true;
					} else if(sameHierarchyItems === 1) {
						$scope.lockedDimensions[highestLevelAdded.label] = true;
					}
				}
			});
			
			lockLastItem($scope.exportAddedDimensions, true);
		},
		// lock (disable remove) if there is only one item remaining
		lockLastItem = function(addedDimensions, filtersRestrictionsChecked) {
			var addedItems = [];
			_.each(addedDimensions, function(value, key) {
				if(value) {
					addedItems.push(key);
				}
			});
			if(addedItems.length === 1) {
				$scope.lockedDimensions[addedItems[0]] = true;
			} else if(!filtersRestrictionsChecked) {
				getLockedDimensions($scope.dimensions, $scope.membersList, $scope.categorizedExportValue);
			}
		};

		$scope.setupExportView = function() {
			if($scope.viewData.filters) {
				$scope.exportViewData = angular.copy($scope.viewData);
				$scope.exportViewData.rows = $scope.viewData.rows.concat($scope.viewData.columns);
				$scope.exportViewData.columns = [];
				$scope.exportAddedDimensions = angular.copy($scope.added);
				setupExportViewFilters();
			}
		};

		$scope.deleteItem = function(index) {
			PivotViewService.deleteItem($scope.exportViewData, $scope.exportAddedDimensions, index, 'rows', [lockLastItem]);
		};

		$scope.addItem = function(item) {
			PivotViewService.addItem($scope.exportViewData, $scope.exportAddedDimensions, item, 'rows', [lockLastItem]);
		};

		$scope.replaceItem = function(selected, priorLabel) {
			PivotViewService.replaceItem($scope.exportViewData, $scope.exportAddedDimensions, selected, priorLabel, 'rows', []);
		};

		// open/dismiss filters selection modal
		$scope.filtersModal = function(category) {
			var filtersModalCallback = function(newFilterData) {
				$scope.addedExportFilters = newFilterData;
				$scope.exportViewData.filters = PivotMetaService.updateFilters($scope.dimensions, $scope.addedExportFilters, $scope.membersList, $scope.exportViewData.filters);
				$scope.categorizedExportValue = PivotMetaService.generateCategorizeValueStructure($scope.addedExportFilters, $scope.dimensions, $scope.exportViewData);
				getLockedDimensions($scope.dimensions, $scope.membersList, $scope.categorizedExportValue);
			};

			DialogService.filtersModal(category, $scope.addedExportFilters, $scope.exportViewData.rows, $scope.dimensions, filtersModalCallback);
		};

		// get list of the dimensions in the current cube
		$scope.getDimensions = function() {
			return $scope.dimensions;
		};

		// get all added rows and columns in the current view
		$scope.getExportViewDataRows = function() {
			return $scope.exportViewData.rows;
		};

		// start the export process
		$scope.requestExport = function() {
			$scope.isExportInProgress = true;
			$scope.isDownloadReady = false;
			$scope.progressPercentage = 0;

			$scope.exportElementId = $scope.selectedScenarioElement.id;
			$scope.exportElementName = $scope.selectedScenarioElement.name;

			ExportResourceService.requestExport($scope.exportElementId, $scope.exportViewData).then(function(response) {
				if(response.status === exportModel.exportStates.success.message) {
					$scope.statusMessage = exportModel.exportStates.success.description;
					$scope.isExportFailed = false;
					$scope.isDownloadCompleted = false;
					$timeout(function() {
						trackProgress();
					}, 1000);
				} else {
					console.log(response);
				}
			});
		};

		// download the prepared export file
		$scope.downloadFile = function() {
			ExportResourceService.downloadFile($scope.exportElementId).then(function(response) {
				var a = angular.element('<a>').css('display', 'none').attr('href',response).attr('id','exportLink');//.attr('download',$scope.exportElementName+'.xlsx');
				$('body').append(a);
				$timeout(function() {
					document.getElementById('exportLink').click();
					a.remove();
				}, 100);
			});
			$scope.cancelExport();
		};

		// cancel the export process
		$scope.cancelExport = function() {
			$timeout.cancel(progressPromise);
			$scope.statusMessage = '';
			$scope.isExportInProgress = false;
			$scope.isDownloadReady = false;
		};

		init();
}]);
'use strict';

angular.module('ThreeSixtyOneView')
    .controller('ImportCtrl', ['$scope', 'ImportResourceService', '$timeout', 'CONFIG', function($scope, ImportResourceService, $timeout, CONFIG) {
		var init = function() {
			$scope.resetUploadForm();
		},	importModel = CONFIG.application.models.ImportModel;

		$scope.newFileSelected = function(event) {
			var files = event.target.files;
			if (files.length > 0) {
				$scope.selectedFile = files[0];
				$scope.selectedFileName = $scope.selectedFile.name;
				$scope.isFileSelected = true;
				$scope.isFileInvalid = $scope.selectedFile.type.toLowerCase() !== importModel.acceptedFileType;
			} else {
				$scope.selectedFile = {};
				$scope.selectedFileName = 'Select a file to import';
				$scope.isFileSelected = false;
				$scope.isFileInvalid = false;
			}
			$scope.$apply();
		};

		$scope.startUpload = function() {
			$scope.isImportStarted = true;
			$scope.isImportCompleted = false;
			$scope.statusMessage = 'Uploading file ...';

			ImportResourceService.uploadFile($scope.selectedScenarioElement.id, $scope.selectedFile).then(function(response) {
				switch(response.status) {
					case importModel.uploadStates.success.message:
						$scope.statusMessage = importModel.uploadStates.success.description;
						$timeout(function() {
							$scope.checkStatus();
						}, 1000);
						break;
					case importModel.uploadStates.empty.message:
						$scope.statusMessage = importModel.uploadStates.empty.description;
						$scope.cancelButtonLabel = 'Reset';
						$scope.isImportFailed = true;
						break;
					case importModel.uploadStates.fail.message:
						$scope.statusMessage = importModel.uploadStates.fail.description;
						$scope.isImportFailed = true;
						break;
					default:
						console.log(response);
						break;

				}
			});
		};

		$scope.checkStatus = function() {
			if($scope.isImportStarted && !$scope.isImportCompleted) {
				ImportResourceService.checkStatus($scope.selectedScenarioElement.id).then(function(response) {
					switch(response.status) {
						case importModel.importStates.success.message:
							$scope.statusMessage = importModel.importStates.success.description;
							$scope.isImportCompleted = true;
							$scope.cancelButtonLabel = 'Reset';
							$scope.loadPivotTable($scope.selectedScenarioElement, $scope.viewData);
							return;
							break;
						case importModel.importStates.init.message:
							$scope.statusMessage = importModel.importStates.init.description;
							break;
						case importModel.importStates.notfound.message:
						case importModel.importStates.inprogress.message:
							$scope.statusMessage = importModel.importStates.inprogress.description;
							break;
						case importModel.importStates.fail.message:
							$scope.statusMessage = importModel.importStates.fail.description;
							$scope.cancelButtonLabel = 'Reset';
							$scope.isImportFailed = true;
							return;
							break;
						default:
							console.log(response);
					}

					$scope.statusPromise = $timeout(function() {
						$scope.checkStatus();
					}, 2000);
				});
			}
		};

		$scope.resetUploadForm = function() {
			$timeout.cancel($scope.statusPromise);
			$scope.selectedFile = {};
			$scope.selectedFileName = 'Select a file to import';
			$scope.cancelButtonLabel = 'Cancel';
			$scope.isFileSelected = false;
			$scope.isImportStarted = false;
			$scope.isImportCompleted = false;
			$scope.isImportFailed = false;
			$scope.isFileInvalid = false;
			$scope.statusMessage = '';
			if(!!document.getElementById('fileInput')) {
				document.getElementById('fileInput').value = '';
			}
		};

		init();
    }]);
'use strict';

/**
* @ngdoc function
* @name ThreeSixtyOneView.controller:ScenarioCalculationCtrl
* @description
* # ScenarioCalculationCtrl
* Controller of the ThreeSixtyOneView
*/
angular.module('ThreeSixtyOneView').controller('ScenarioCalculationCtrl', ['$scope', 'AnalyticCalculationsService', 'CONFIG', '$state', 'ScenarioStatesService',
    function ($scope, AnalyticCalculationsService, CONFIG, $state, ScenarioStatesService) {

    var stepLength,
        stepValue,
        runningStates = {},
        scenarioId = $state.params.scenarioId,

        // init function
        init = function() {
            $scope.progressValue = 0;
            $scope.step = 0;
            $scope.errorMessage = "";
            ScenarioStatesService.startPull([scenarioId]);
        },
        // get the current index for status
        getCurrentStateIndex = function(_data) {
            if (AnalyticCalculationsService.isSuccess($scope.scenarioState.message)) {
                return stepLength;
            } else {
                var step = _.indexOf(_.pluck(_data.runningStates, 'completed'), false);
                return step === -1 ? 0 : step;
            }
        },
        // initiate the model
        getCalcStatesData = function(response) {
            if (_.isUndefined(stepLength)) {
                stepLength = response.runningStates.length;
                stepValue = 100 / stepLength;
            }

            runningStates = response.runningStates;
            $scope.updateCalculateState(response.currentState);

            $scope.step = getCurrentStateIndex(response);
            $scope.progressValue = stepValue * $scope.step;
            getCurrentStateTitle();
            getProgressbarType();
            runningStates = addIcons(runningStates);
            updateCalcStatesData(response);
        },
        // update states data
        updateCalcStatesData = function(response) {
            if (AnalyticCalculationsService.isSuccess($scope.scenarioState.message)) {
                $state.go("Scenario.results");
            } else if (AnalyticCalculationsService.isFailed($scope.scenarioState.message)) {
                ScenarioStatesService.stopPull();
                $scope.errorMessage = response.additionalInfo.message;
            }
        },
        // change progressbar color based on states
        getProgressbarType = function() {
            $scope.progressbarType = AnalyticCalculationsService.isFailed($scope.scenarioState.message) ? 'danger' : 'success';
        },
        // add icons to state list
        addIcons = function(data) {
            _.each(data, function(v, k) {
                if (k === $scope.step) {
                    if (AnalyticCalculationsService.isFailed($scope.scenarioState.message)) {
                        v.iconType = 'failed';
                        v.iconText = 'Error';
                    } else if (AnalyticCalculationsService.isInProgress($scope.scenarioState.message)) {
                        v.iconType = 'in_progress';
                        v.iconText = '';
                    }
                } else if (k < $scope.step) {
                    v.iconType = 'check';
                    v.iconText = '';
                }
            });
            return data;
        },
        // get the current state title
        getCurrentStateTitle = function() {
            $scope.currentStateTitle = _.find($scope.scenarioStates, function(v){
                return v.message === $scope.scenarioState.message;
            });
        };

    // get states data
    $scope.getStates = function() {
        return runningStates;
    };
    // reset the progress
    $scope.retry = function() {
        ScenarioStatesService.stopPull();
        AnalyticCalculationsService.post(scenarioId).then(function() {
            init();
        });
    };
    // go to the edit page
    $scope.gotoEdit = function() {
        ScenarioStatesService.stopPull();
        $state.go("Scenario.edit");
    };
    // style complated state
    $scope.styleState = function(index) {
        return $scope.step >= index ? true : false;
    };

    $scope.$on('broadcastStates', function(event, response) {
        getCalcStatesData(response[0]);
        $scope.disableSimulateButton(false);
        if(AnalyticCalculationsService.isInProgress($scope.scenarioState.message)) {
            $scope.disableSimulateButton(true);
        } else if (AnalyticCalculationsService.isSuccess($scope.scenarioState.message)) {
            $state.go("Scenario.results");
        }
    });

    // fire off init function
    init();

}]);
 'use strict';

/**
* @ngdoc function
* @name ThreeSixtyOneView.controller:scenarioResultCtrl
* @description
* # scenarioResultCtrl
* Controller of the ThreeSixtyOneView
*/
angular.module('ThreeSixtyOneView').controller('scenarioResultsCtrl',
    ['$scope', 'ManageTemplatesService', 'ManageAnalysisViewsService', 'ManageScenariosService', 'MetaDataService', 'DialogService', 'PivotMetaService', 'ReportsService', 'CONFIG', 'ScenarioStatesService', 'ScenarioService',
    function ($scope, ManageTemplatesService, ManageAnalysisViewsService, ManageScenariosService, MetaDataService, DialogService, PivotMetaService, ReportsService, CONFIG, ScenarioStatesService, ScenarioService) {

    // private variables
    var syncedDimensions = [],

    // get scenarios list
    getScenariosList = function() {

        ScenarioService.getAll().then(function(response) {
            var allScenarios = [];
            // get all scenarios across the application
            _.each(_.pluck(response, 'data'), function(scenarios) {
                allScenarios = _.union(allScenarios, scenarios);
            });

            // filter scenarios with the current scenario tempalte id
            allScenarios = _.filter(allScenarios, function(scenario) {
                return scenario.template.id === $scope.scenario.template.id;
            });

            // filter scenarios with calculation status success
            ScenarioStatesService.getAllScenariosStates(_.pluck(allScenarios, 'id')).then(function(response) {
                var scenarioStates = CONFIG.application.models.ScenarioAnalytics.states,
                    idArray = _.pluck(_.filter(response, function(scenario) {
                    return scenario.currentState.message === scenarioStates.SUCCESS.message;
                }), 'scenarioId');
                allScenarios = _.filter(allScenarios, function(scenario) {
                    return _.indexOf(idArray, scenario.id) !== -1;
                });
            });

            // save the scenariosList
            $scope.scenariosList = allScenarios;

            _.each($scope.scenariosList, function(v) {
                if(!_.has(v, 'title')) {
                    v.title = v.name;
                } else {
                    v.name = v.title;
                }
                if(_.has(v, 'createdBy') && _.has(v, 'createdOn')) {
                    v.auditInfo = {};
                    v.auditInfo.createdBy = {};
                    v.auditInfo.createdOn = v.createdOn;
                    v.auditInfo.createdBy.name = v.createdBy;
                }
            });

            if ($scope.scenario.isPlanOfRecord) {
                $scope.selectedScenario = _.find($scope.scenariosList, function(scenario) { return scenario.id === $scope.scenario.id; });
            } else {
                $scope.selectedScenario = _.find($scope.scenariosList, function(scenario) { return scenario.id === $scope.scenario.referenceScenario.id; });
            }

        });
    },

    // get kpi cube
    getKPICube = function() {
        ManageTemplatesService.getTemplateCubesByType($scope.scenario.template.id, 'Outcome').then(function(cubeId) {
            $scope.kpiCubeId = cubeId[0];
            ManageScenariosService.getAnalysisElementByScenarioAndCube($scope.scenario.id, $scope.kpiCubeId).then(function(analysisElement) {
                $scope.kpiElementId = analysisElement.id;
                $scope.kpiCubeMeta = analysisElement.cubeMeta;
                return getKPIMeta();
            })
        });
    },

    // get kpi meta data
    getKPIMeta = function() {
        MetaDataService.buildDimensionsTree($scope.kpiCubeId).then(function(_KPIDimensions) {
            $scope.kpiDimensions = _KPIDimensions;
            getKPIView($scope.spendViewId);
        });
    },

    // get kpi view
    getKPIView = function(_spendViewId) {
        ManageAnalysisViewsService.getViewRelatedBy(_spendViewId, $scope.kpiCubeId).then(function(_KPIView) {
            if (_KPIView.id === null) {
                return PivotMetaService.createEmptyView($scope.kpiDimensions, $scope.kpiCubeMeta, _spendViewId).then(function(_KPINewView) {
                    $scope.kpiView = _KPINewView;
                    initiateKPIModel();
                });
            } else {
                $scope.kpiView = _KPIView;
                initiateKPIModel();
            }
        });
    },

    // initalte the kpi view
    initiateKPIModel = function() {
        $scope.kpiViewId = $scope.kpiView.id;
        $scope.kpiViewData = $scope.kpiView;
        $scope.kpiViewName = $scope.kpiView.name;

        $scope.kpiAdded = PivotMetaService.setUpAddedLevels($scope.kpiView.columns.concat($scope.kpiView.rows));
        $scope.kpiMembersList = PivotMetaService.generateMembersList($scope.kpiDimensions);
        $scope.kpiAddedFilters = PivotMetaService.getAddedFilters($scope.kpiView.filters, $scope.kpiDimensions);
        if ($scope.isSynced) {
            copyFilters($scope.spendAddedFilters, $scope.kpiAddedFilters);
        }
        $scope.kpiCategorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.kpiAddedFilters, $scope.kpiDimensions, $scope.kpiView);

        $scope.isViewLoaded = true;

        getKPISummary();
    },

    // initiate spend view, get kpi cube, get spend summary and kpi summary,
    initiateSpendModel = function(cubeMeta) {
        PivotMetaService.initModel(cubeMeta).then(function(result) {
            var foundView = _.find(result.viewsList, function(view){ return view.id === result.viewData.id; });
            if (foundView) {
                $scope.draftView = foundView.isDraft;
            }
            angular.extend($scope, result);
            $scope.spendViewId = result.viewData.id;
            $scope.spendViewsList = result.viewsList;
            $scope.spendViewData = result.viewData;
            $scope.spendViewName = result.viewData.name;
            $scope.spendDimensions = result.dimensions;

            $scope.spendAdded = PivotMetaService.setUpAddedLevels(result.viewData.columns.concat(result.viewData.rows));
            $scope.spendMembersList = PivotMetaService.generateMembersList(result.dimensions);
            $scope.spendAddedFilters = PivotMetaService.getAddedFilters(result.viewData.filters, result.dimensions);
            $scope.spendCategorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.spendAddedFilters, result.dimensions, result.viewData);

            // spend summary
            getSpendSummary();

            // kpi cube
            getKPICube();
        });
    },

    // copy synced spend filters to kpi filters
    copyFilters = function(srcFilters, destFilters) {
        syncedDimensions = [];
        _.each(destFilters, function(v, k) {
            if (k !== 'VARIABLE') {
                if (_.has(destFilters, k) && _.has(srcFilters, k)) {
                    destFilters[k] = srcFilters[k];
                    syncedDimensions.push(k);
                }
            }
        })
        return syncedDimensions;
    },

    // get kpi summary data
    getKPISummary = function() {
        ReportsService.getSummary($scope.kpiElementId, $scope.kpiViewId).then(function(_KPISummaryData) {
            $scope.kpiSummaryData = transformKPISummaryData(_KPISummaryData);
            ManageTemplatesService.getTemplateCubesByType($scope.selectedScenario.template.id, 'Outcome').then(function(cube) {
                ManageScenariosService.getAnalysisElementByScenarioAndCube($scope.selectedScenario.id, cube[0]).then(function(analysisElement) {
                    $scope.kpiComparedElementId = analysisElement.id;
                    ReportsService.getSummary($scope.kpiComparedElementId, $scope.kpiViewId).then(function(_KPIComparedSummaryData) {
                        $scope.kpiComparedSummaryData = transformKPISummaryData(_KPIComparedSummaryData);
                        _.each($scope.kpiSummaryData, function(v, i) {
                            var tmpkpiIncremental = v.total - $scope.kpiComparedSummaryData[i].total
                            v.incremental = Math.abs(v.total - $scope.kpiComparedSummaryData[i].total);
                            if(v.incremental < 1) {
                               v.incremental = 0;
                            }
                            v.percent = $scope.kpiComparedSummaryData[i].total !== 0 ? v.incremental / $scope.kpiComparedSummaryData[i].total : 0;
                            if (v.incremental !== 0) {
                                if (tmpkpiIncremental >= 0) {
                                    v.direction = "increase";
                                } else {
                                    v.direction = "decrease";
                                }
                            } else {
                                v.direction = "increase";
                            }
                        });
                    });
                })
            });
        });
    },

    // transform kpi summary data
    transformKPISummaryData = function(_KPISummaryData) {
        var tmpKPISummaryData = _.pairs(_KPISummaryData[0]).slice(0,5);
        var kpiSummaryData = [];
        _.each(tmpKPISummaryData, function(v,i){
            var kpiSummaryDatum = {};
            kpiSummaryDatum.id = i+1;
            kpiSummaryDatum.title=v[0];
            kpiSummaryDatum.total=v[1].value;
            kpiSummaryDatum.currency=v[1].currency;
            kpiSummaryData.push(kpiSummaryDatum);
        });
        return kpiSummaryData;
    },

    // get spend summary data through API
    getSpendSummary= function() {
        ReportsService.getSummary($scope.spendElementId, $scope.spendViewId).then(function(_spendSummaryData) {
            $scope.spendSummaryData = _spendSummaryData;
            ManageTemplatesService.getTemplateCubesByType($scope.selectedScenario.template.id, 'Spend').then(function(cube) {
                ManageScenariosService.getAnalysisElementByScenarioAndCube($scope.selectedScenario.id, cube[0]).then(function(analysisElement) {
                    $scope.spendComparedElementId = analysisElement.id;
                    ReportsService.getSummary($scope.spendComparedElementId, $scope.spendViewId).then(function(_spendComparedSummaryData) {
                        $scope.spendComparedSummaryData = _spendComparedSummaryData;
                        transformSpendSummaryData($scope.spendSummaryData, $scope.spendComparedSummaryData);
                    });
                })
            });
        });
    },

    // transform spend summary data
    transformSpendSummaryData = function(_spendSummaryData, _spendComparedSummaryData) {
        var spendData = {};
        spendData.header = {};
        spendData.header.title = 'Total Spend';
        spendData.header.total = _.values(_spendSummaryData[0])[0].value;
        spendData.header.currency = _.values(_spendSummaryData[0])[0].currency;
        var tmpSpendHeaderIncremental = _.values(_spendSummaryData[0])[0].value - _.values(_spendComparedSummaryData[0])[0].value;
        spendData.header.incremental = Math.abs(tmpSpendHeaderIncremental);
        if(spendData.header.incremental < 1) {
           spendData.header.incremental = 0;
        }
        spendData.header.percent = _.values(_spendComparedSummaryData[0])[0].value !== 0 ? spendData.header.incremental / _.values(_spendComparedSummaryData[0])[0].value : 0;
        if (spendData.header.incremental !== 0) {
            if (tmpSpendHeaderIncremental >= 0) {
                spendData.header.direction = "increase";
            } else {
                spendData.header.direction = "decrease";
            }
        } else {
            spendData.header.direction = "increase";
        }

        spendData.body = [];
        _.each(_spendSummaryData, function(v,i) {
            if(i > 0) {
                var spendDatum = {};
                spendDatum.id = i-1;
                spendDatum.children = [];
                var spendDatumChild = {};
                spendDatumChild.id = 0;
                spendDatumChild.title = '';
                spendDatumChild.total = '';
                spendDatumChild.currency = '';
                spendDatumChild.incremental = '';
                spendDatumChild.percent = '';
                spendDatumChild.direction = '';
                spendDatum.children.push(spendDatumChild);
                _.each(_.pairs(v), function(v1, i1){
                    spendDatumChild = {};
                    spendDatumChild.id = i1+1;
                    spendDatumChild.title = v1[0];
                    spendDatumChild.total = v1[1].value;
                    spendDatumChild.currency = v1[1].currency;
                    var tmpSpendDatumChildIncremental = v1[1].value - _.pairs(_spendComparedSummaryData[i])[i1][1].value;
                    spendDatumChild.incremental = Math.abs(tmpSpendDatumChildIncremental);
                    if(Math.abs(spendDatumChild.incremental) < 1) {
                       spendDatumChild.incremental = 0;
                    }
                    spendDatumChild.percent = _.pairs(_spendComparedSummaryData[i])[i1][1].value !== 0 ? spendDatumChild.incremental / _.pairs(_spendComparedSummaryData[i])[i1][1].value : 0;
                    if (spendDatumChild.incremental !== 0) {
                        if (tmpSpendDatumChildIncremental >= 0) {
                            spendDatumChild.direction = "increase";
                        } else {
                            spendDatumChild.direction = "decrease";
                        }
                    } else {
                        spendDatumChild.direction = "increase";
                    }
                    spendDatum.children.push(spendDatumChild);
                });
                spendData.body.push(spendDatum);
            }
        });
        $scope.spendData = spendData;
    },

    // init function
    init = function() {
        $scope.saveAs = false;
        $scope.draftView = false;
        $scope.isSynced = true;
        $scope.isViewLoaded = false;
        $scope.toggleIcon = false;

        $scope.spendAdded = {};
        $scope.spendAddedFilters = {};
        $scope.spendCategorizedValue = [];
        $scope.spendViewData = {name: 'Loading ...'};

        getScenariosList();

        ManageTemplatesService.getTemplateCubesByType($scope.scenario.template.id, 'Spend').then(function(cubeId) {
            $scope.spendCubeId = cubeId[0];
            ManageScenariosService.getAnalysisElementByScenarioAndCube($scope.scenario.id, $scope.spendCubeId).then(function(analysisElement) {
                $scope.spendElementId = analysisElement.id;
                $scope.spendCubeMeta = analysisElement.cubeMeta;
                initiateSpendModel(analysisElement.cubeMeta);
            })
        });
    };

    // DUPE: open the modal for the list of all spend views
    $scope.openAllViewsModal = function() {
        var dialog = DialogService.openLightbox('views/modal/ms_list_lightbox.tpl.html', 'AllViewsCtrl',
            {viewsList: $scope.spendViewsList, selectedViewId: $scope.spendViewData.id, e2e: $scope.e2e},
            {windowSize: 'lg', windowClass: 'list-lightbox'});

        dialog.result.then(function(data) {
            $scope.loadView($scope.spendCubeId, data);
        });
    };
    // open the modal for the list of all views
    $scope.openAllComparedScenariossModal = function() {
        var dialog = DialogService.openLightbox('views/modal/ms_list_lightbox.tpl.html', 'AllViewsCtrl',
            {viewsList: $scope.scenariosList, selectedViewId: $scope.selectedScenario.id, e2e: $scope.e2e, subTitle: 'Scenario'},
            {windowSize: 'lg', windowClass: 'list-lightbox'});

        dialog.result.then(function(replacedComparedViewId) {
            $scope.loadComparedScenarios(replacedComparedViewId);
        });
    };
    // DUPE: returns list of all the views in the current cube
    $scope.getViewsList = function() {
        return $scope.spendViewsList;
    };
    // delete a view
    $scope.deleteView = function(cubeId, viewId) {
        ManageAnalysisViewsService.deleteView(viewId, cubeId).then(function() {
            $scope.spendViewsList = _.reject($scope.spendViewsList, function(view) { return view.id === viewId; });
            $scope.draftView = false;
        });
    };
    // load spend view and render kpi view
    $scope.loadView = function(cubeId, viewId) {
        var oldViewId = $scope.spendViewData.id;
        $scope.isViewLoaded = false;
        $scope.spendViewData = {name: 'Loading ...'};
        ManageAnalysisViewsService.getView(viewId, cubeId).then(function(view) {
            if(!!oldViewId && !$scope.draftView) {
                ManageAnalysisViewsService.defaultView(cubeId, oldViewId, false);
            }
            if($scope.draftView) {
                var draftId = _.find($scope.spendViewsList, function(view) {return view.name.substring(0,8) === 'Draft - ';}).id;
                if(viewId !== draftId) {
                    $scope.deleteView($scope.spendCubeId, draftId);
                }
            }
            $scope.spendViewId = view.id;
            $scope.spendViewData = view;
            $scope.spendAdded = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
            $scope.spendMembersList = PivotMetaService.generateMembersList($scope.spendDimensions);
            $scope.spendAddedFilters = PivotMetaService.getAddedFilters(view.filters, $scope.spendDimensions);
            $scope.spendCategorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.spendAddedFilters, $scope.spendDimensions, view);

            // get related kpi view
            getKPIView($scope.spendViewId);

            // get spend summary
            getSpendSummary();
        });
    };
    // set compared view
    $scope.loadComparedScenarios = function(scenarioId) {
        _.find($scope.scenariosList, function(scenario) {
            if(scenario.id === scenarioId) { $scope.selectedScenario = scenario; }
        });
        // get spend summary
        getSpendSummary();
        // get kpi summary
        getKPISummary();
    };
    // reset the view to the last saved state
    //DUPE
    $scope.revertView = function() {
        if($scope.draftView) {
            var originalViewName = $scope.spendViewData.name.substring(8);
            var originalViewId = _.find($scope.spendViewsList, function(_view) { return originalViewName === _view.name; }).id;

            // load view automatically deletes draft view if a non-draft is loaded
            $scope.isSynced = true;
            $scope.loadView($scope.spendCubeId, originalViewId);
        }
    };
    // create a new view
    $scope.createView = function(cubeId, view, type) {
        var relatedByView;
        view.id = null;
        type === 'spend' ? relatedByView = null : relatedByView = $scope.spendViewId;
        return ManageAnalysisViewsService.createView(view, cubeId, relatedByView).then(function(view) {
            if (type === 'spend') { $scope[type+'ViewsList'].unshift(view); }
            $scope[type+'ViewId'] = view.id
            $scope[type+'ViewData'] = angular.copy(view);
            $scope[type+'Added'] = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
            $scope[type+'AddedFilters'] = PivotMetaService.getAddedFilters(view.filters, $scope[type+'Dimensions']);
            return view;
        });
    };
    // save the changes in spend and kpi view
    $scope.saveView = function() {
        if ($scope.draftView && $scope.isViewLoaded) {
            var originalViewName = $scope.spendViewData.name.substring(8),
                originalViewId = _.find($scope.spendViewsList, function(_view) { return originalViewName === _view.name; }).id,
                draftViewId = $scope.spendViewData.id;

            $scope.spendViewData.name = originalViewName;
            $scope.spendViewData.id = originalViewId;
            $scope.spendViewData.isDraft = false;

            // update spend view
            PivotMetaService.updateView($scope.spendCubeId, $scope.spendViewData).then(function(view) {
                $scope.spendViewData = view;
                $scope.spendAdded = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
                // update kpi view
                ManageAnalysisViewsService.getViewRelatedBy($scope.spendViewData.id, $scope.kpiCubeId).then(function(orikpiView) {
                    _.extend($scope.kpiViewData, _.omit(orikpiView, 'filters'));
                    $scope.kpiViewData.isDraft = false;
                    PivotMetaService.updateView($scope.kpiCubeId, $scope.kpiViewData).then(function(view) {
                        $scope.kpiViewData = view;
                        $scope.kpiAdded = PivotMetaService.setUpAddedLevels(view.columns.concat(view.rows));
                    });
                })
            });
            // delete spend draft View
            $scope.deleteView($scope.spendCubeId, draftViewId);
        }
    };
    // save the draft view
    $scope.saveDraftView = function() {
        if(!$scope.draftView) {
            $scope.draftView = true;
            var spendDraftView = angular.copy($scope.spendViewData);
            ManageAnalysisViewsService.defaultView($scope.spendCubeId, $scope.spendViewData.id, false);
            spendDraftView.name = 'Draft - ' + spendDraftView.name;
            spendDraftView.isDraft = true;
            $scope.createView($scope.spendCubeId, spendDraftView, 'spend').then(function(response) {
                getSpendSummary();

                if ($scope.isSynced) {
                    copyFilters($scope.spendAddedFilters, $scope.kpiAddedFilters);
                    $scope.kpiViewData.filters = PivotMetaService.updateFilters($scope.kpiDimensions, $scope.kpiAddedFilters, $scope.kpiMembersList, $scope.kpiViewData.filters);
                    $scope.kpiCategorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.kpiAddedFilters, $scope.kpiDimensions, $scope.kpiViewData);
                }
                var kpiDraftView = angular.copy($scope.kpiViewData);
                kpiDraftView.name = 'Draft - ' + kpiDraftView.name;
                kpiDraftView.isDraft = true;
                $scope.createView($scope.kpiCubeId, kpiDraftView, 'kpi').then(function(response) {
                    getKPISummary($scope.spendViewId);
                });
            });
        } else {
            PivotMetaService.updateView($scope.spendCubeId, $scope.spendViewData).then(function(response) {
                getSpendSummary();

                if ($scope.isSynced) {
                    copyFilters($scope.spendAddedFilters, $scope.kpiAddedFilters);
                    $scope.kpiViewData.filters = PivotMetaService.updateFilters($scope.kpiDimensions, $scope.kpiAddedFilters, $scope.kpiMembersList, $scope.kpiViewData.filters);
                    $scope.kpiCategorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.kpiAddedFilters, $scope.kpiDimensions, $scope.kpiViewData);
                }
                PivotMetaService.updateView($scope.kpiCubeId, $scope.kpiViewData).then(function(response) {
                    getKPISummary($scope.spendViewId);
                });
            });
        }
    };
    // open/dismiss filters selection modal
    $scope.filtersModal = function(type, category) {
        var dialog = DialogService.openLightbox('views/modal/filter_selection.tpl.html', 'FilterSelectionCtrl',
            {dimension: category, addedFilters: $scope[type+'AddedFilters'], viewData: $scope[type+'ViewData'].rows.concat($scope[type+'ViewData'].columns), dimensions: $scope[type+'Dimensions']},
            {windowSize: 'lg', windowClass: 'filters-modal'});

        dialog.result.then(function(data) {
            $scope[type+'AddedFilters'] = data;
            $scope[type+'ViewData'].filters = PivotMetaService.updateFilters($scope[type+'Dimensions'], $scope[type+'AddedFilters'], $scope[type+'MembersList'], $scope[type+'ViewData'].filters);
            $scope[type+'CategorizedValue'] = PivotMetaService.generateCategorizeValueStructure($scope[type+'AddedFilters'], $scope[type+'Dimensions'], $scope[type+'ViewData']);
            $scope.saveDraftView();
        });
    }
    // add prefix to incremental numbers
    $scope.addPrefix = function(direction, incremental, type) {
        var prefix = {increase: '', decrease: ''};
        if (type === 'sign') {
            prefix.increase = '+';
            prefix.decrease = '-';
        } else if (type === 'arrow') {
            prefix.increase = 'arrow-up';
            prefix.decrease = 'arrow-down';
        }
        if (incremental > 0 && !!direction) {
            if (direction === 'increase') {
                return prefix.increase;
            } else if (direction === 'decrease') {
                return prefix.decrease;
            } else {
                return '';
            }
        } else {
            return '';
        }
    };
    $scope.setToggleSwitch = function(_isSynced) {
        if(_isSynced) {
            $scope.isSynced = true;
            $scope.saveDraftView();
        } else {
            $scope.isSynced = false;
        }
    };
    $scope.isInSyncedDimensions = function(cat) {
        if(_.indexOf(syncedDimensions, cat.label) !== -1) {
            return true;
        } else {
            return false;
        }
    };

    // fire off init function
    init();

}]);
'use strict';

angular.module('ThreeSixtyOneView')
.controller('ScenarioTemplatesCtrl',['$scope', '$state', 'DialogService', 'CONFIG', 'ManageTemplatesService', 'ProjectsService',
	function ($scope, $state, DialogService, CONFIG, ManageTemplatesService, ProjectsService) {
		var masterProject,
			init = function() {
				$scope.onboardingState = false;
				ManageTemplatesService.getAll().then(function(response) {
					$scope.scenarioTemplates = response;
					startWorkflow();
				});
				ProjectsService.getMasterProject().then(function(response) {
					masterProject = response;
				});
				$scope.templateType = _.find(CONFIG.view.ScenarioTemplates.types, function(type) {
					return type.name === $state.params.type;
				});
			}, openScenarioTemplatesCreateModal = function(type, templates) {
				var scenarioTemplates = templates,
					dialog = DialogService.openLightbox('views/modal/scenario_templates.tpl.html', 'ScenarioTemplatesViewsCtrl',
						{templateType: type, scenarioTemplates: $scope.scenarioTemplates, masterProject: masterProject},
						{windowSize: 'lg', windowClass: 'scenario_templates'}
					);

				dialog.result.then(function(data) {
					createTemplate(data);
				}, function() {
					if(!$scope.onboardingState) {
						gotoProject(masterProject.uuid);
					}
				});
			}, createTemplate = function(data) {
				console.log('template created');
				console.log(data);
				gotoProject(masterProject.uuid);
			}, gotoProject = function(uuid) {
				$state.go('Dashboard', {projectId: uuid});
			}, startWorkflow = function() {
				if(typeof $scope.templateType !== 'undefined') {
					openScenarioTemplatesCreateModal($scope.templateType);
				} else if($scope.scenarioTemplates.length === 0) {
					$scope.onboardingState = true;
				} else {
					$scope.openModulePickDialog();
				}
			};

		$scope.openModulePickDialog = function() {
			var modulePickDialog = DialogService.openLightbox('views/modal/select_module.tpl.html', 'SelectModuleCtrl',
				{modules: CONFIG.view.ScenarioTemplates.types, e2e: $scope.e2e},
				{windowSize: 'lg', windowClass: 'module_pick'});

			modulePickDialog.result.then(function(data) {
				openScenarioTemplatesCreateModal(data.selectedModule);
			}, function() {
				if(!$scope.onboardingState) {
					gotoProject(masterProject.uuid);
				}
			});
		};

		init();
	}]);

'use strict';

/**
 * @ngdoc function
 * @name ThreeSixtyOneView.controller:ScenarioTemplatesCtrl
 * @description
 * # ScenarioTemplatesCtrl
 * Controller of the ThreeSixtyOneView
 */
angular.module('ThreeSixtyOneView')
.controller('ScenarioTemplatesChooseDefaultsCtrl', ['$scope', 'PivotMetaService', 'PivotViewService', 'datepickerConfig', 'MetaDataService', 'DialogService', 'ManageScenariosService', 'EVENTS',
	function ($scope, PivotMetaService, PivotViewService, datepickerConfig, MetaDataService, DialogService, ManageScenariosService, EVENTS) {

	var init = function() {
		if(!$scope.spendCubeLoading) {
			$scope.spendCube = $scope.getSpendCube();
			initializeDefaultView();
			$scope.spendCubeLoaded = true;
			$scope.$emit(EVENTS.flipbookAllowAdvance, true);
		} else {
			$scope.$emit(EVENTS.flipbookAllowAdvance, false);
			$scope.spendCubeLoaded = false;
			$scope.spendCube = [];
		}
		$scope.pivotBuilderItems = [{name:'columns', label: 'Columns', other: 'rows'}, {name:'rows', label: 'Rows', other: 'columns'}];
		$scope.modelingPeriod = [];

		$scope.dragOptions = {
			itemMoved: function() {
			},
			orderChanged: function() {
			},
			dragStart: function() {
				$scope.isDragging = true;
			},
			dragEnd: function() {
				$scope.isDragging = false;
			},
			containment: '#dragDropArea'
		};

		setModelingPeriod();
	},
	determineTimeDisability = function(added) {
		$scope.timeDisabled = PivotMetaService.determineTimeDisability($scope.spendCube, added);
	},
	initializeDefaultView = function() {
		$scope.viewData = $scope.getDefaultView();
		if(!$scope.viewData.rows) {
			$scope.viewData = PivotMetaService.formEmptyView($scope.spendCube, {label: 'Touchpoint'});
		}
		
		$scope.added = PivotMetaService.setUpAddedLevels($scope.viewData.rows.concat($scope.viewData.columns));
		$scope.addedFilters = PivotMetaService.getAddedFilters($scope.viewData.filters, $scope.spendCube);
		$scope.membersList = PivotMetaService.generateMembersList($scope.spendCube);
		$scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, $scope.spendCube, $scope.viewData);
		determineTimeDisability($scope.added);
	},
	setModelingPeriod = function() {
		if($scope.template.type === 'Action') {
			ManageScenariosService.getModelingPeriod($scope.getTimeGranularityInfo().id).then(function(period) {
				$scope.modelingPeriod = period;
				$scope.fromDate = period[0];
				$scope.toDate = period[period.length - 1];
			});
		}
	};

	// returns element titles in the view: rows and columns
	$scope.getPivotBuilderItems = function() {
		return $scope.pivotBuilderItems;
	};

	$scope.getViewData = function(element) {
		return $scope.viewData[element];
	};

	$scope.getDimensions = function() {
		return $scope.spendCube;
	};

	$scope.deleteItem =  function(index, element) {
		PivotViewService.deleteItem($scope.viewData, $scope.added, index, element, [determineTimeDisability]);
	};

	$scope.addItem = function(item, element) {
		PivotViewService.addItem($scope.viewData, $scope.added, item, element, [determineTimeDisability]);
	};

	$scope.replaceItem = function(selected, priorLabel, element) {
		PivotViewService.replaceItem($scope.viewData, $scope.added, selected, priorLabel, element, [determineTimeDisability]);
	};

	$scope.filtersModal = function(category) {
		var filtersModalCallback = function(newFilterData) {
			$scope.addedFilters = newFilterData;
			$scope.viewData.filters = PivotMetaService.updateFilters($scope.spendCube, newFilterData, $scope.membersList, $scope.viewData.filters);
			$scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure(newFilterData, $scope.spendCube, $scope.viewData);
		};

		DialogService.filtersModal(category, $scope.addedFilters, $scope.viewData.rows.concat($scope.viewData.columns), $scope.spendCube, filtersModalCallback);
	};

	$scope.isDatePickerVisible = function() {
		return $scope.templateType.label === 'Action';
	};

	$scope.setFromDate = function(period) {
		$scope.fromDate = period;
	};

	$scope.setToDate = function(period) {
		$scope.toDate = period;
	};

	$scope.$on(EVENTS.flipbookAdvance, function() {
		$scope.setDefaultView($scope.viewData);
		$scope.setPerformancePeriod($scope.fromDate, $scope.toDate);
	});

	$scope.$on(EVENTS.spendCubeIdLoaded, function(event, spendCube) {
		$scope.spendCube = spendCube;
		initializeDefaultView();
		$scope.spendCubeLoaded = true;
		$scope.$emit(EVENTS.flipbookAllowAdvance, true);
	});

	init();
}]);

'use strict';

/**
 * @ngdoc function
 * @name ThreeSixtyOneView.controller:ChooseDimensionsCtrl
 * @description
 * # ChooseDimensionsCtrl
 * Controller of the ThreeSixtyOneView
 */
angular.module('ThreeSixtyOneView')
    .controller('ChooseDimensionsCtrl', ['$scope', 'EVENTS', 'PivotMetaService', function($scope, EVENTS, PivotMetaService) {
        var scenarioTemplateId,
        init = function() {
            $scope.setTime($scope.getTimeGranularity());

            buildDimensions($scope.dimensions, $scope.kpisList, $scope.dimensionsSchema);
            if (checkIfInitial($scope.dimensionsSchema) && checkIfInitial($scope.kpisList)) {
                addSelectedValue($scope.kpiDimensions);
                addSelectedValue($scope.standardDimensionsSchema);
            }

            $scope.addedFilters = $scope.getAddedDimensionMembers();
            if(!$scope.addedFilters) {
                $scope.addedFilters = PivotMetaService.addAllFilters($scope.dimensions);
                $scope.setAddedDimensionMembers($scope.addedFilters);
            }
            $scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, $scope.standardDimensions, $scope.addedFilters);
        },
        checkIfInitial = function(dimensions) {
            var initial = true;
            _.each(dimensions, function(dimension) {
                if (dimension.isSelected !== undefined) {
                    initial = false;
                }
            });
            return initial;
        },
        addSelectedValue = function(dimensions) {
            _.each(dimensions, function(dimension) {
                dimension.isSelected = dimension.isSelected || true;
                var childrenList = dimension.members ? dimension.members : dimension.attributes;
                _.each(childrenList, function(children) {
                    children.isSelected = children.isSelected || true;
                });
            });
            return dimensions;
        },
        buildDimensions = function(dimensions, kpisList, dimensionsSchema) {
            // filter to get time dimensions
            $scope.timeDimension = _.find(dimensions, function(dimension) { return dimension.type === 'TimeDimension' });
            $scope.times = _.pluck($scope.timeDimension.members, 'label');
            // filter to get kpi dimensions
            $scope.kpiDimensions = kpisList;
            // filter to get standard dimensions
            $scope.standardDimensions = _.reject(dimensions, function(dimension) { return dimension.type === 'TimeDimension' });
            $scope.standardDimensionsSchema = _.reject(dimensionsSchema, function(dimension) { return dimension.type === 'TimeDimension' });
        };

        $scope.setTime = function(time) {
            $scope.selectedTime = time;
            $scope.setTimeGranularity(time);
            if(!!time) {
                $scope.$emit(EVENTS.flipbookAllowAdvance, true);
            } else {
                $scope.$emit(EVENTS.flipbookAllowAdvance, false);
            }
        };

        $scope.updateMembers = function(addedMembers) {
            $scope.addedFilters = addedMembers;
            $scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure(addedMembers, $scope.standardDimensions, $scope.addedFilters);
            $scope.setAddedDimensionMembers(addedMembers);
        };

		$scope.$on(EVENTS.flipbookAdvance, function() {
            $scope.setDimensionsLabel($scope.standardDimensionsSchema, $scope.categorizedValue, 'standard');
            $scope.setDimensionsLabel($scope.kpiDimensions, $scope.categorizedValue, 'kpi');
            $scope.setStandardDimensions($scope.standardDimensions, $scope.standardDimensionsSchema, $scope.addedFilters);
            $scope.setKpiDimension($scope.kpiDimensions);
		});

		init();

	}]);

'use strict';

/**
 * @ngdoc function
 * @name ThreeSixtyOneView.controller:NameAndDescribeCtrl
 * @description
 * # NameAndDescribeCtrl
 * Controller of the ThreeSixtyOneView
 */
angular.module('ThreeSixtyOneView')
.controller('NameAndDescribeCtrl', ["$scope", "EVENTS", function($scope, EVENTS) {

	$scope.isTemplateNameUnique = function(templateName) {
		return !_.findWhere($scope.scenarioTemplates, {name: templateName});
	};

	$scope.$watch("template.name", function(){
		if ($scope.template.name && $scope.template.name.length > 0 && $scope.dimensionsIsLoaded && $scope.isTemplateNameUnique($scope.template.name)){
			$scope.$emit(EVENTS.flipbookAllowAdvance, true);
		} else {
			$scope.$emit(EVENTS.flipbookAllowAdvance, false);
		}
	});

	$scope.$on(EVENTS.flipbookAdvance, function() {
		$scope.createDraftTemplate();
	});

	$scope.$on(EVENTS.dimensionsIsLoaded, function() {
		 if ($scope.template.name && $scope.template.name.length > 0){
			$scope.$emit(EVENTS.flipbookAllowAdvance, true);
		} 
	});
}]);

'use strict';

angular.module('ThreeSixtyOneView.directives')
.directive('breadcrumb', ["$compile", "$state", "$stateParams", "$sce", "$interpolate", "GotoService", "ProjectsService", "ScenarioService", function ($compile, $state, $stateParams, $sce, $interpolate, GotoService, ProjectsService, ScenarioService) {
	return {
		template: "<ol class='breadcrumb' ng-bind-html='breadcrumbs' ng-click='goto($event)'></ol>",
		restrict: 'AE',
		link: function (scope) {
			var breadcrumbs, where, params;
			scope.goto = function(evt){
				if (evt.target.attributes.goto){
					where = evt.target.attributes.getNamedItem('goto').value;

					if (evt.target.attributes.getNamedItem('params')){
						params = evt.target.attributes.getNamedItem('params').value;
					}
					GotoService[where](params);
				}
			};

			scope.$on("$stateChangeSuccess", function(){
				scope.project = $stateParams.projectId ? ProjectsService.getProjectItemById($stateParams.projectId) : "";

				if ($stateParams.scenarioId){
					ScenarioService.get($stateParams.projectId).then(function(scenarios){
						scope.scenario = ScenarioService.find(scenarios, $stateParams.scenarioId);
						breadcrumbs = $sce.trustAsHtml($interpolate($state.current.breadcrumb)(scope));
						scope.breadcrumbs = breadcrumbs;
					});
				} else {
					console.info($state.current);
					breadcrumbs = $sce.trustAsHtml($interpolate($state.current.breadcrumb)(scope));
					scope.breadcrumbs = breadcrumbs;
				}
			});
		},
		replace: true
	};
}]);

'use strict';

/**
 * @ngdoc directive
 * @name ThreeSixtyOneView.directive:dimension-filter
 * @description
 * # dimension filter handler showing filter label and selected values
 * # plus a handler for opening the filters modal
 */
angular.module('ThreeSixtyOneView.directives').directive('dimensionFilter', [function() {
	return {
		restrict: 'AE',
		replace: true,
		scope: {
			dimension: '=',
			categorizedValues: '=',
			action: '&'
		},
		// templateUrl: 'views/directives/dimension_filter.tpl.html',
		templateUrl: function(element, attrs) {
			if(attrs.listView) {
				return 'views/directives/dimension_filter_list.tpl.html';
			} else {
				return 'views/directives/dimension_filter.tpl.html';
			}
		},
		link: function(scope) {
			scope.allValuesSelected = function(values) {
				return values.selected < values.total;
			};

			// get comma separated labels for filter values
			scope.getFormattedLabels = function(labels) {
				return labels.join(', ');
			};

			scope.callAction = function(dimension) {
				scope.action({dimension: dimension});
			};
		}
	};
}]);
'use strict';

angular.module('ThreeSixtyOneView.directives')
	.directive('draggableDimension', function() {
		return {
			templateUrl: function(elem, attrs) {
				return "views/directives/" + attrs.template + ".tpl.html";
			},
			restrict: "AE",
			replace: true,
			controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
				var init = function() {
					var currentDimension;
					$scope.addDimension = $attrs.template === 'add_dimension_button' ? true : false;
					if(!$scope.addDimension) {
						currentDimension = _.find($scope.dimensions, function(dimension) {
							return dimension.id === $scope.item.dimension.id;
						});
					}
					if(currentDimension && currentDimension.hasOwnProperty('aggregatable')) {
						$scope.aggregatable = currentDimension.aggregatable;
					}
				},
				added = !!$attrs.addedValues ? $attrs.addedValues : false,
				isSelected = function(label) {
					 return added ? $scope[added][label] : $scope.$parent.added[label];
				};

				var currentItem = angular.copy($scope.item);

				// determines if an item in the pop up add menu is disabled
				$scope.isItemDisabled = function(item, dimension) {

					if(isSelected(item.label)) {
						return true; // if item has been added, it should be disabled in the list
					} else {
						if(dimension.type === 'TimeDimension' && $scope.timeDisabled) {
							if((!!currentItem && currentItem.dimension.id === dimension.id) || !!added) {
								return false; // if a time item is clicked, others should not be disabled
							}
							return true; // if a time item is added and a non-time item is clicked, time items should be disabled
						}
					}

					return false;
				};

				$scope.selectDimension = function(selected, prioLabel) {
					if($scope.addDimension) {
						$scope.$parent.addItem(selected, $attrs.rowOrCol);
					} else {
						$scope.$parent.replaceItem(selected, prioLabel, $attrs.rowOrCol);
					}
				};

				$scope.delete = function(index) {
					$scope.$parent.deleteItem(index, $attrs.rowOrCol);
				};

				init();
			}]
		};
	});
'use strict';

/**
* @ngdoc directive
* @name msTestsApp.directive:flipbook
* @description
* # flipbook
*/
angular.module('ThreeSixtyOneView.directives')
.directive('flipbook', ['EVENTS', '$window', function (EVENTS, $window) {
	return {
		templateUrl: function(element, attrs) {
			return attrs.templateUrl;
		},
		restrict: 'E',
		transclude: true,
		link: function (scope, element, attrs) {
			var views = JSON.parse(attrs.workflow),
				totalViews = views.length,
				basePath = attrs.basepath,
				submitCallback = attrs.submitCallback,
				cancelCallback = attrs.cancelCallback,
				enableNext = attrs.enableNext,
				setView = function(i) {
					scope.view = views[i];
					scope.url = basePath + "/" + views[i].url;
					scope.label = views[i].buttonLabel || scope.DIRECTION;
				}, init = function() {
					scope.DIRECTION = "NEXT";
					scope.views = views;
					scope.currentViewIndex = 0;

					setView(scope.currentViewIndex);
				};


			scope.forward = function(){
				if (scope.currentViewIndex  === totalViews - 1) {
					scope[submitCallback]();
					scope.currentViewIndex = totalViews;
				} else {
					setView(++scope.currentViewIndex < totalViews ? scope.currentViewIndex : --scope.currentViewIndex);
					scope.$broadcast(EVENTS.flipbookAdvance ,{});
				}
			};

			scope.backward = function() {
				setView(--scope.currentViewIndex >= 0 ? scope.currentViewIndex : ++scope.currentViewIndex);
			};

			scope.dismiss = function() {
				scope[cancelCallback]();
			};

			scope.isCurrentView = function(index) {
				return index === scope.currentViewIndex;
			};

			scope.isDisabled = function(direction) {
				if (direction === scope.DIRECTION) {
					if (!enableNext){
						return true;
					}
					return scope.currentViewIndex >= totalViews;
				} else {
					return scope.currentViewIndex <= 0;
				}
			};

			attrs.$observe("enableNext", function(){
				enableNext = attrs.enableNext.bool();
			});

			init();
		}
	};
}]);

/* jshint  quotmark: false, unused: false */
/* globals $, _, window */
'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive('focus', ["$timeout", function($timeout) {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                $timeout(function() {
                    element[0].focus();
                }, 300);
            }
        };
    }]);
/* jshint  quotmark: false, unused: false */
/* globals $, _, window */
'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive("icon", [function() {
        return {
            restrict: "E",
            scope: {
                icon: "@type",
                cname: "@"
            },
            replace: true,
            template: '<i class="fa fa-{{icon}} {{cname}}"></i>'
        };
    }]);
/* jshint  quotmark: false, unused: false */
/* globals $, _, window */
'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive('inlineEdit', ["$timeout", "$rootScope", "CONFIG", "EVENTS", function($timeout, $rootScope, CONFIG, EVENTS) {
        return {
            replace: true,
            templateUrl: function(elem, attrs){
                return "views/directives/" + attrs.template + ".tpl.html";
            },
            restrict: 'E',
            transclude: true,
            scope: {
                item: "=",
                test: "=",
                submitaction: "=",
                focustarget: "@",
                comparisonModel: "="
            },
            link: function($scope, $element, $attrs) {
                var tempItem = angular.copy($scope.item),
                    inputTarget;

                $timeout(function(){inputTarget = $element.find($scope.focustarget || "input");});
                $scope.isActive = false;
                $scope.inputRestrictions = CONFIG.application.inputRestrictions;

                // edit action
                $scope.action = function() {
                    $rootScope.$broadcast(EVENTS.newSelectedItem);
                    if (!$scope.isActive) {
                        tempItem = angular.copy($scope.item);
                        $scope.isActive = true;
                        $timeout(function(){inputTarget[0].focus();}, 100);
                    } else {
                        $scope.isActive = false;
                    }
                };


                $scope.submit = function(item) {
                    $scope.item = item;
                    $rootScope.$broadcast(EVENTS[$scope.submitaction], $scope.item);
                    $scope.form.$setPristine();
                    $scope.isActive = false;
                };

                $scope.cancel = function() {
                    if($scope.isActive){
                        $scope.item.name = tempItem.name;
                        $scope.item.description = tempItem.description;
                        $scope.form.$setPristine();
                        $scope.isActive = false;
                    }
                };

                $scope.$on(EVENTS.newSelectedItem, $scope.cancel);

            }
        };
    }]);
'use strict';

/**
 * @ngdoc directive
 * @name ThreeSixtyOneView.directive:member
 * @description
 * # member
 */
angular.module('ThreeSixtyOneView.directives')
.directive('member', ['$compile', function($compile) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			member: '=', // <object> {label: <dimension>, members: []} individual filter dimension i.e. touchpoint (magazine, newspaper, radio), nameplate (brand, car truck), region (New York, Miami, Seattle), time (August 2014, September 2014)
			filters: '=', // <object> {touchpoint:{}, nameplate: {}, Region: {}, Time: {}, KPI: {}} summation of all members
			category: '=', // <object> {label: <filter dimention>} currently selected filter dimension (time, touchpoint, region, nameplate)
			expanded: '=', // empty || <object> {<filter dimenstion>: true, <filter dimenstion>: true} all expanded filters
			expandall: '=', // <object> {label: <search text> } object containing search text
			updater: '&', // <function> that should be called to updated selected filters values and counts
			dimensionindex: '=' // <number> index of the selected dimension
		},
		templateUrl: 'views/directives/member.tpl.html',
		link: function(scope, element) {
			var modifyItems = function(member, add) {
				if(member.members.length > 0) {
					for(var i = 0; i < member.members.length; i++) {
						modifyItems(member.members[i], add);
					}
				} else {
					scope.filters[scope.category.label][member.id + ',' + member.label] = add;
				}
			},
			checkedItems = function(member) {
				var output = {checked: 0, total: 0};

				if(member.members.length > 0) {
					for(var i = 0; i < member.members.length; i++) {
						var tempOutput = checkedItems(member.members[i]);
						output.checked += tempOutput.checked;
						output.total += tempOutput.total;
					}
				} else {
					output.total++;
					if(!!scope.filters[scope.category.label][member.id + ',' + member.label]) {
						output.checked++;
					}
				}

				return output;
			};

			scope.updaterFunction = function(index, addedFilters) {
				scope.updater({index: index, addedFilters: addedFilters});
			};

			scope.expanded = scope.expanded || {};
			scope.isAllExpanded = scope.expandall.label === '';

			scope.toggleMember = function(member) {
				var item = checkedItems(member);

				if(item.checked < item.total) {
					modifyItems(member, true);
				} else {
					modifyItems(member, false);
				}

				scope.updaterFunction(scope.dimensionindex, scope.filters[scope.category.label]);
			};

			scope.determineStyle = function(member){
				var result;
				switch(checkedItems(member).checked / checkedItems(member).total){
					case 1: result = 'ALL_SELECTED'; break;
					case 0: result = 'NOT_SELECTED'; break;
					default: result = 'INDETERMINENT'; break;
				}
				return result;
			};

			scope.outputSelectedOverTotal = function(member){
				return checkedItems(member).checked.toString() + '/' + checkedItems(member).total.toString();
			};

			scope.hasMembers = function(){
				return scope.member.members.length > 0;
			};

			scope.toggleCollapse = function() {
				scope.expanded[scope.member.label] = !scope.expanded[scope.member.label];
				scope.isAllExpanded = !scope.isAllExpanded;
				return scope.expanded[scope.member.label];
			};

			scope.setToggleStyle = function() {
				return (!scope.isAllExpanded) ? 'fa-rotate-90':'';
			};

			scope.isAllSelected = function(member) {
				var selection = scope.determineStyle(member);
				return  (selection === 'ALL_SELECTED') || (selection === 'INDETERMINENT');
			};

			if(scope.member.members.length > 0) {
				$compile('<div class="list-category" ng-class="{collapsed: isAllExpanded}"><member ng-repeat="child in member.members | orderBy:\'label\':false" member="child" filters="filters" category="category" expanded="expanded" expandall="expandall" updater="updaterFunction(index, addedFilters)" dimensionindex="dimensionindex"></member></div>')(scope, function(cloned) {
					element.after(cloned);
				});
			}
		}
	};
}]);
/**
* @name ms-button
* @desc Directive of standard button - defaults to 'Submit button' <ms-button></ms-button>
* @requires {directive} icon.js
* @param label - label="{label string}" - defalut is "Submit"
* @param icon - icon="{fa-icon name}" - deafault ng-show(false)
* @param type - type="{type string}" - default is type of 'submit'
* @param action - REQUIRED - action="{action event}" - no default
* @event action - ng-click event
*/

/* jshint  quotmark: false, unused: false */
/* globals $, _, window */
'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive('msButton', [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                label: "@",
                icon: "@",
                type: "@",
                shape: "@",
                action: "&"
            },
            template: '<button class="btn btn-default ms-btn-{{type}} ms-btn-{{shape}}" ng-click="action()"><icon ng-if="hasIcon" type="{{icon}}"></icon>{{label}}</button>',
            link: function($scope) {
                $scope.label = $scope.label || "Submit";

                $scope.hasIcon = $scope.icon || false;

                $scope.type = $scope.type || "submit";

                $scope.shape = $scope.shape || "normal";
            }
        };
    }]);

'use strict';

/**
 * @ngdoc directive
 * @name ThreeSixtyOneView.directives:msDimensionCard
 * @description
 * # ms-dimension-card
 */

angular.module('ThreeSixtyOneView.directives')
    .directive('msDimensionCard', ['PivotMetaService', 'DialogService', 'DimensionService', function(PivotMetaService, DialogService, DimensionService) {
        return {
            restrict: "AE",
            replace: true,
            scope: {
                dimensionData: '=',
                allDimensionsData: '=',
                filtersData: '=',
                categorizedData: '=',
                templateType: '=',
                filterUpdateCallback: '&',
                allDimensionsSchema: '=',
                dimensionIndex: '='
            },
            templateUrl: function(elem, attrs){
                return "views/directives/ms_" + attrs.dimensionType + "_dimension_card.tpl.html";
            },
            link: function(scope) {

                if(!!scope.allDimensionsSchema) {
                    scope.dimensionSchema = scope.allDimensionsSchema[scope.dimensionIndex];
                }
                scope.filtersModal = function(category) {
                    var filteredDimensions = DimensionService.getSelectedDimensions(scope.allDimensionsData, scope.allDimensionsSchema),
                        filteredDimension = _.find(filteredDimensions, function(v) { return category.id === v.id; }),
                        filtersModalCallback = function(newFilterData) {
                            scope.filterUpdateCallback({addedMembers: newFilterData});
                        };
                    DialogService.filtersModal(filteredDimension, scope.filtersData, scope.viewData, filteredDimensions, filtersModalCallback);
                };
                scope.getFormattedLabel = function(categorizedData) {
                    if (categorizedData.selected < categorizedData.total) {
                        return categorizedData.label.join(', ');
                    } else {
                        return 'All';
                    }
                };
                scope.isMeasure = function(dimension) {
                    return dimension.type === 'MeasureDimension' ? true : false;
                };
                scope.isEmpty = function(item, dimension) {
                    var memberLength = _.filter(dimension.members, function(member) { return member.isSelected; }).length;
                    if (dimension.type === 'MeasureDimension') {
                        if (memberLength === 1 && item.isSelected) {
                            return true;
                        } else { return false; }
                    } else { return false; }
                };
            }
        };
    }]);

/* jshint  quotmark: false, unused: false */
/* globals $, _, window */
'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive('msDropdown', ["$document", "$timeout", "$state", "$rootScope", "$filter", "CONFIG", "DropdownService", "SortAndFilterService", "EVENTS", function($document, $timeout, $state, $rootScope, $filter, CONFIG, DropdownService, SortAndFilterService, EVENTS) {
        return {
            restrict: "AE",
            templateUrl: "views/directives/ms_dropdown.tpl.html",
            replace: true,
            scope: {
                isActive: "@",
                id: "@msid",
                reverse: "@"
            },
            controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
                var dropdown = $($element).find('.ms-select-list'),
                    currentView = $state.current.name,
                    close = function() {
                        dropdown.addClass('hide');
                        $document.off('click', close);
                    },
                    setOrderBy = function(item) {
                        DropdownService.setActive($scope.id);
                        SortAndFilterService.setFilter("reset", "", false);
                        SortAndFilterService.setFilter("orderBy", item.filter, true);
                        SortAndFilterService.setSorter($scope.id, item.label);
                    },
                    isActive = function() {
                        return $scope.id === DropdownService.getActive();
                    };

                $scope.DropdownService = DropdownService;
                $scope.reverse = $scope.reverse.bool();

                $scope.items = CONFIG.view[currentView].sortMenu.displayColumns;
                $scope.selectedItem = CONFIG.view[currentView].sortMenu.displayColumns[0];

                SortAndFilterService.setSorter($scope.id, $scope.selectedItem.label);

                if ($scope.isActive) {
                    DropdownService.setActive($scope.id);
                    SortAndFilterService.setFilter("orderBy", $scope.selectedItem.filter, false);
                }


                $scope.toggle = function() {
                    if (dropdown.hasClass('hide')) {
                        dropdown.removeClass('hide');

                        $timeout(function() {
                            $document.on('click', close);
                        });
                    } else {
                        dropdown.addClass('hide');
                        $document.off('click', close);
                    }
                };

                $scope.selectSort = function(item) {
                    $scope.selectedItem = item;
                    SortAndFilterService.setFilter("reset", "", false);
                    setOrderBy(item);
                };

                $scope.select = function(item) {

                    if (typeof $scope.reverse !== "boolean") {
                        $scope.reverse = $scope.reverse.bool();
                    }

                    if (!isActive()) {
                        $scope.selectedItem = item;
                        SortAndFilterService.setFilter("reverse", $scope.reverse, false);
                        setOrderBy(item);
                    } else {
                        $scope.reverse = !$scope.reverse;
                        SortAndFilterService.setFilter("reverse", $scope.reverse, true);
                    }
                };
            }]
        };
    }]);
/* jshint  quotmark: false, unused: false */
/* globals $, _, window */
'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive("msFilterInput", ["SortAndFilterService", function(SortAndFilterService) {
        return {
            restrict: "AE",
            replace: true,
            templateUrl: "views/directives/ms_filter_input.tpl.html",
            controller: ["$scope", function($scope) {
                $scope.SortAndFilterService = SortAndFilterService;
            }]
        };
    }]);
/* jshint  quotmark: false, unused: false */
/* globals $, _, window */
'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive('msLinkGroup', ["$timeout", function($timeout) {
        return {
            restrict: 'A',
            scope: {
                selectedItem: "@"
            },
            controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
                var self = this, items= [], init = function(){
                    self.selectedItem = $scope.selectedItem || 'none';
                    if ($attrs.radio){
                        $scope.radio = $attrs.radio === "true" ? true : false;
                    } else {
                        $scope.radio = true;
                    }
                };

                this.removeState = function(){
                    _.each(items, function(k,v,i){
                        k.removeClass("selected");
                    });
                };

                this.register = function(elem){
                    items.push(elem);
                };

                this.setState = function(item){
                    var element = _.find(items, function(elem){return elem.attr('ms-link') === item;});
                    if (element) {
                        element.addClass("selected");
                    }
                };

                this.toggleSelected = function(event) {
                    var item = event.data.label;
                    $scope.$apply(
                        function() {
                            if (item !== $scope.selectedItem) {
                                $scope.selectedItem = item;
                            } else if (!$scope.radio) {
                                $scope.selectedItem = 'none';
                            }
                        }
                    );
                };

                $attrs.$observe('selectedItem', function(){
                    self.removeState();
                    self.setState($scope.selectedItem);
                });

                init();
            }]
        };
    }]);
/* jshint  quotmark: false, unused: false */
/* globals $, _, window */
'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive("msLink", [function() {
        return {
            restrict: "A",
            require: "^msLinkGroup",
            link: function(scope, element, attrs, ctrl) {
                var setState = function(){
                    ctrl.removeState();
                    element.addClass("selected");
                },
                init = function(){
                     ctrl.register(element);

                    if(ctrl.selectedItem === attrs.msLink){
                        setState();
                    }

                    element.on('click', {label: attrs.msLink}, ctrl.toggleSelected);
                    element.on('click', {}, setState);
                };

               init();
            }
        };
    }]);
'use strict';

/**
 * @ngdoc directive
 * @name ThreeSixtyOneView.directives:msTristatesCheckbox
 * @description
 * # ms-treeview-checkbox
 */

angular.module('ThreeSixtyOneView.directives')
    .directive('msTristatesCheckbox', function() {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                var childList = attrs.childList,
                    property = attrs.property;

                // Bind the onChange event to update children
                element.bind('change', function() {
                    scope.$apply(function() {
                        var isChecked = element.prop('checked');

                        // Set each child's selected property to the checkbox's checked property
                        angular.forEach(scope.$eval(childList), function(child) {
                            if (child.required !== true) {
                                child[property] = isChecked;
                            }
                        });
                    });
                });

                // Watch the children for changes
                scope.$watch(childList, function(newValue) {
                    var hasChecked = false,
                        hasUnchecked = false;

                    // Loop through the children
                    angular.forEach(newValue, function(child) {
                        if (child[property]) {
                            hasChecked = true;
                        } else {
                            hasUnchecked = true;
                        }
                    });

                    // Determine which state to put the checkbox in
                    if (hasChecked && hasUnchecked) {
                        element.prop('checked', false);
                        element.prop('indeterminate', true);
                        if (modelCtrl) {
                            modelCtrl.$setViewValue(true);
                        }
                    } else {
                        element.prop('checked', hasChecked);
                        element.prop('indeterminate', false);
                        if (modelCtrl) {
                            modelCtrl.$setViewValue(hasChecked);
                        }
                    }
                }, true);
            }
        };
    });

 /*jshint -W069 */
'use strict';

angular.module('ThreeSixtyOneView.directives')
  .directive('singleClick', ["$parse", "$timeout", function ($parse, $timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
          var fn = $parse(attr['singleClick']),
          delay = 200, clicks = 0, timer = null;
          element.on('click', function (event) {
            clicks++;  //count clicks
            if(clicks === 1) {
              timer = $timeout(function() {
                scope.$apply(function () {
                    fn(scope, { $event: event });
                });
                clicks = 0;             //after action performed, reset counter
              }, delay);
              } else {
                $timeout.cancel(timer);    //prevent single-click action
                clicks = 0;             //after action performed, reset counter
              }
          });
        }
    };
  }]);

/* jshint  quotmark: false, unused: false */
/* globals $, _, window */
'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive('sortingOptions', ["SortAndFilterService", function(SortAndFilterService) {
        return {
            restrict: 'AE',
            replace: true,
            scope: true,
            require: "^sorter",
            link: function($scope, $element, $attrs, ctrl) {
                $scope.label = $attrs.label;
                $scope.value = $attrs.value;
                $scope.id = $attrs.msid;
                $scope.reverse = false;
                $scope.SortAndFilterService = SortAndFilterService;

                $scope.sort = function(evt, which) {
                    if (evt) {
                        evt.stopPropagation();
                        evt.preventDefault();
                    }
                    if (which === $scope.SortAndFilterService.getOrderBy()) {
                        $scope.reverse = !$scope.reverse;
                    } else {
                        ctrl.setOrderBy(which, $scope.id, false);
                    }
                    ctrl.setReverse($scope.reverse, true);
                };
            },
            templateUrl: 'views/directives/sorting_options.tpl.html'
        };
    }]);
/* jshint  quotmark: false, unused: false */
/* globals $, _, window */
'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive('sortableColumns', [function() {
        return {
            templateUrl: 'views/directives/sortable_columns.tpl.html',
            restrict: "AE",
            replace: true,
            scope: {
                item: '=',
                displayBy: '=',
                test: '='
            }
        };
    }]);
/* jshint  quotmark: false, unused: false */
/* globals $, _, window */
'use strict';

angular.module('ThreeSixtyOneView.directives')
    .directive('sorter', ["SortAndFilterService", "DropdownService", function(SortAndFilterService, DropdownService) {
        return {
            restrict: "AE",
            controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {

                $scope.reverse = false;
                $scope.orderBy = $attrs.orderby;
                this.setOrderBy = function(which, id, filter) {
                    SortAndFilterService.setFilter("orderBy", which, filter);
                    DropdownService.setActive(id);
                };
                this.setReverse = function(reverse, filter) {
                    SortAndFilterService.setFilter("reverse", reverse, filter);
                };
            }]
        };
    }]);
'use strict';

angular.module('ThreeSixtyOneView.directives').directive("tabsControl", ["$rootScope", "EVENTS", function($rootScope, EVENTS){
        return {
            restrict: "A",
            controller: function(){
                this.tabs = [];

                this.register = function(item){
                    this.tabs.push(item);
                };

                this.closeAll = function(){
                    _.each(this.tabs, function(tab) {
                        $(tab.target).addClass('hidden');
                        $(tab.element).removeClass('active');
                    });
                    $rootScope.$broadcast(EVENTS.tabClosed);
                };
            }
        };
    }])
    .directive("expandCollapseControl", [function() {
        return {
            restrict: "A",
            require: "^tabsControl",
            link: function(scope, element, attrs, ctrl) {
                var target = attrs.expandCollapseControl, disabled = false;
                ctrl.register({element: element, target: target});

                element.on('click', function() {
                    var active = true;

                    if (!disabled){
                        if (!$(target).hasClass('hidden')){
                            active = false;
                        }
                        ctrl.closeAll();
                        if(active){
                            $(target).removeClass('hidden');
                            $(element).addClass('active');
                        }
                    }
                });

                attrs.$observe("expandCollapseControlDisabled", function(){
                    disabled = attrs.expandCollapseControlDisabled === "false" || typeof attrs.expandCollapseControlDisabled  === "undefined" ? false : true;
                });
            }
        };
    }])
    .directive("collapseControl", [function() {
        return {
            restrict: "A",
            require: "^?tabsControl",
            link: function(scope, element, attrs, ctrl) {
                element.on('click', function(){
                    ctrl.closeAll();
                });
            }
        };
    }]);
'use strict';

angular.module('ThreeSixtyOneView.directives')
	.directive('validator', function () {
	return {
		require: 'ngModel',
		restrict: 'A',
		scope: {
			comparisonModel: "&validator",
			errorType: "="
		},
		link: function postLink(scope, element, attrs, ctrl) {
	
			var validate = function(viewValue) {
					if(!viewValue || !scope.comparisonModel){

						// It's valid because we have nothing to compare against
						ctrl.$setValidity(scope.errorType, true);
						return;
					}

					ctrl.$setValidity(scope.errorType, scope.comparisonModel()(viewValue));
					return viewValue;
				};

			scope.errorType = scope.errorType || "validationError";

			ctrl.$parsers.unshift(validate);
			ctrl.$formatters.push(validate);

			attrs.$observe(scope.errorType, function(){
				// Whenever the comparison model changes we'll re-validate
				return validate(ctrl.$viewValue);
			});

		}
	};
});


'use strict';

angular.module('ThreeSixtyOneView.directives')
.directive('virtualRepeat', ['$compile', '$timeout', function($compile, $timeout) {
	return {
		restrict: 'AE',
		transclude: true,
		template: '<div style="position:relative;"><ng-transclude></ng-transclude></div>',
		link: function(scope, element, attrs) {
			var itemHeight = 0,
				viewportHeight = 0,
				scrollTop = 0,
				scrolling = false,
				callbackDelay = 75,
				displayBuffer = 50,
				list = [],
				multiLevel = false,
				setMultiLevel = angular.noop,
				heightWatch = angular.noop,
				init = function() {

					heightWatch = scope.$watch(function() {
						if(itemHeight === 0 && element.height() > 0) {
							viewportHeight = element.parent().height();
							itemHeight = element.height();
							setHeight(itemHeight, list.length);
							updateDOM();
						}
					});

					// watch the list for any changes
					scope.$watch(attrs.virtualRepeat, function(newValue) {
						if(multiLevel) {
							scope.virtualRepeat = newValue;
						} else {
							list = newValue;
							element.parent().scrollTop(0);

							if(list[0].members.length > 0) {
								scope[attrs.multiLevel](true);
								multiLevel = true;
								element.parent().off('scroll');
								element.height(0);
								heightWatch();
								scope.virtualRepeat = list;
							} else {
								if(itemHeight === 0) {
									findElementHeight();
									setScrollEvent();
								} else {
									scrollTop = 0;
									setHeight(itemHeight, list.length);
									updateDOM();
								}
							}
						}
					});
				},
			// find height of a single item
			findElementHeight = function() {
				scope.virtualRepeat = list.slice(0, 1);
			},
			// set height of the element based on single element height and number of items
			setHeight = function(itemHeight, numItems) {
				element.height(itemHeight * numItems);
			},
			// update the DOM (after scroll or list change)
			updateDOM = function() {
				scrolling = false;
				scrollTop = element.parent().scrollTop();
				var startItem = Math.floor(scrollTop/itemHeight);
				scope.virtualRepeat = list.slice(startItem, startItem + displayBuffer);
				$compile('<div style="position:absolute;top:'+scrollTop+'px"><member ng-repeat="member in virtualRepeat" member="member" filters="addedFilter" category="{label: selectedFilter.dimension.label}"  expanded="expanded" expandall="filterSearch" updater="categorizeValuesCount(index, addedFilters)" dimensionindex="selectedDimensionIndex"></member></div>')(scope, function(cloned) {
					element.children().eq(0).replaceWith(cloned);
				});
			},
			// set up the scroll event listener
			setScrollEvent = function() {
				var scrollerTimeout;

				element.parent().scroll(function() {
					if(!scrolling) {
						scrolling = true;
					} else {
						$timeout.cancel(scrollerTimeout);
					}
					scrollerTimeout = $timeout(updateDOM, callbackDelay);
				});
			};

			init();
		}
	};
}]);
'use strict';

/**
* @ngdoc directive
* @name ThreeSixtyOneView.directives:svg_icon
* @description
* # svg-icon
*/
angular.module('ThreeSixtyOneView.directives')
.directive('svgIcon', [function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: function(element, attrs) {
            console.log(attrs['type']);
            return 'images/svgs/' + attrs['type'] + '.svg';
        }
    };
}]);
/*jshint  quotmark: false, unused: false */
/* global _ */
'use strict';

angular.module('ThreeSixtyOneView.filters')
	.filter("filterProjects", ['$filter', function($filter) {
		return function(input, term) {
			console.info(term);
			var results = [],
				regExp;

			if(term) {
				regExp = new RegExp(term.toLowerCase(), "g");
			} else {
				return input;
			}

			_.each(input, function(project) {
				if (project.name && regExp) {
					if (regExp.test(project.name.toLowerCase())) {
						results.push(project);
					} else {
						var matchedScenarios = _.filter(project.data, function(scenario) {
							return regExp.test(scenario.name.toLowerCase());
						});
						if(matchedScenarios.length > 0) {
						    results.push(project);
						}
					}
				}
			});
			return results;
		};
	}])
	.filter('isFavorite', ["FavoritesService", function(FavoritesService) {
		return function(input) {
			var results = [];
			if (FavoritesService.getFavorites().length > 0) {
				_.each(input, function(e, i, a) {
					if (FavoritesService.isFavorite(e.uuid)) {
						results.push(e);
					}
				});
			}
			return results;
		};
	}])
	.filter('camelCase', [function() {
		return function(input) {
			if (typeof input === "string") {
				return input.toLowerCase().replace(/ (.)/g, function(match, group1) {
					return group1.toUpperCase();
				});
			}
			return input;
		};
	}])
	.filter('dateRange', [function() {
		var dayInMillisec = 86400000;
		return function(input, db, p) {
			var results = [],
				prop = p || "lastModified",
				daysBack = parseInt(db, 10),
				now = Date.now(),
				threshold = new Date(now - (dayInMillisec * daysBack));

			if (daysBack === 0) {
				return input;
			}

			for (var i = 0, limit = input.length; i < limit; i++) {

				if (new Date(input[i][prop]) > threshold) {
					results.push(input[i]);
				}
			}

			return results;
		};
	}])
	.filter('capitalize', [function() {
		return function(input) {
			if (typeof input === "string") {
				return input.substring(0, 1).toUpperCase() + input.substring(1);
			}
			return input;
		};
	}])
	.filter('unCamelCase', [function() {
		return function(input) {
			if (typeof input === "string") {
				return input.replace(/([a-z\d])([A-Z\d])/g, '$1 $2');
			}
			return input;
		};
	}])
	.filter('normalize', [function() {
		return function(input) {
			if (typeof input === "string") {
				return input.replace(/[\s\W]/g, '').toLowerCase();
			}
			return input;
		};
	}])
	.filter('timeago', [function() {
		//time: the time
		//local: compared to what time? default: now
		//raw: wheter you want in a format of '5 minutes ago', or '5 minutes'
		return function(time, local, raw) {
			if (!time) {
				return 'never';
			}

			if (!local) {
				(local = Date.now());
			}

			if (angular.isDate(time)) {
				time = time.getTime();
			} else if (typeof time === 'string') {
				time = new Date(time).getTime();
			}

			if (angular.isDate(local)) {
				local = local.getTime();
			} else if (typeof local === 'string') {
				local = new Date(local).getTime();
			}

			if (typeof time !== 'number' || typeof local !== 'number') {
				return;
			}

			var
				offset = Math.abs((local - time) / 1000),
				span = [],
				MINUTE = 60,
				HOUR = 3600,
				DAY = 86400,
				WEEK = 604800,
				MONTH = 2629744,
				YEAR = 31556926,
				DECADE = 315569260;

			if (offset <= MINUTE) {
				span = ['', raw ? 'now' : 'less than a minute'];
			} else if (offset < (MINUTE * 60)) {
				span = [Math.round(Math.abs(offset / MINUTE)), 'min'];
			} else if (offset < (HOUR * 24)) {
				span = [Math.round(Math.abs(offset / HOUR)), 'hr'];
			} else if (offset < (DAY * 7)) {
				span = [Math.round(Math.abs(offset / DAY)), 'day'];
			} else if (offset < (WEEK * 52)) {
				span = [Math.round(Math.abs(offset / WEEK)), 'week'];
			} else if (offset < (YEAR * 10)) {
				span = [Math.round(Math.abs(offset / YEAR)), 'year'];
			} else if (offset < (DECADE * 100)) {
				span = [Math.round(Math.abs(offset / DECADE)), 'decade'];
			} else {
				span = ['', 'a long time'];
			}

			span[1] += (span[0] === 0 || span[0] > 1) ? 's' : '';
			span = span.join(' ');

			if (raw === true) {
				return span;
			}
			return (time <= local) ? span + ' ago' : 'in ' + span;
		};
	}]).filter('nrFormat', [function() {
		return function(number) {
			var abs;
			if (number !== undefined) {
				abs = Math.abs(number);
				if (abs >= Math.pow(10, 12)) {
					number = (number / Math.pow(10, 12)).toFixed(1) + "T";
				} else if (abs < Math.pow(10, 12) && abs >= Math.pow(10, 9)) {
					number = (number / Math.pow(10, 9)).toFixed(1) + "B";
				} else if (abs < Math.pow(10, 9) && abs >= Math.pow(10, 6)) {
					number = (number / Math.pow(10, 6)).toFixed(1) + "M";
				} else if (abs < Math.pow(10, 6) && abs >= Math.pow(10, 3)) {
					number = (number / Math.pow(10, 3)).toFixed(1) + "K";
				} else if (abs < Math.pow(10, 3) && abs > 0) {
					number = number.toFixed(1);
				} else {
					number = number;
				}
				return number;
			}
		};
	}]).filter('percentage', ['$window', function ($window) {
		return function (input, decimals, suffix) {
			decimals = angular.isNumber(decimals) ? decimals : 2;
			suffix = suffix || '%';
			if ($window.isNaN(input) || input === '') {
				return '';
			}
			return Math.round(input * Math.pow(10, decimals + 2))/Math.pow(10, decimals) + suffix;
		};
	}]);
'use strict';

angular.module('ThreeSixtyOneView.services')
    .factory("DropdownService", [function() {
        var active; //ID of currently active 

        return {
            getActive: function() {
                return active;
            },
            setActive: function(which) {
                active = which;
            },
            isActive: function (which){
                return active === which;
            }
        };
    }]);
'use strict';

angular.module('ThreeSixtyOneView.services')
    .service('DialogService', ["dialogs", function(dialogs) {
        this.create = function() {
            dialogs.create('views/modal/simple_input.tpl.html', 'ProjectCreateCtrl', {}, {
                windowClass: 'lightbox form-lightbox',
                backdrop: 'static'
            });
        };

        this.trayCopy = function(item){
            dialogs.create('views/modal/simple_input.tpl.html', 'ScenarioCopyCtrl', item, {
                windowClass: 'lightbox form-lightbox',
                backdrop: 'static'
            });
        };

        this.openCreateScenario = function(_project_, _scenarios_) {
            dialogs.create('views/modal/scenario_create.tpl.html','ScenarioCreateCtrl',{
                project: _project_,
                scenarios: _scenarios_
            },{size:'md', windowClass: 'lightbox form-lightbox', backdrop: 'static'});
        };

        this.openLightbox = function(templateAddress, controllerName, sharedObjects, options) {
            return dialogs.create(templateAddress, controllerName, sharedObjects, {size: options.windowSize, windowClass: options.windowClass + ' lightbox', backdrop: 'static'});
        };

        this.noop = function(header, msg){
            dialogs.notify(header,msg);
        };

        this.notify = function(header, msg){
            dialogs.notify(header,msg);
        };

        this.filtersModal = function(dimension, addedFilters, viewData, dimensions, callback) {
            var dialog = this.openLightbox('views/modal/filter_selection.tpl.html', 'FilterSelectionCtrl', {
                dimension: dimension || {},
                addedFilters: addedFilters || {},
                viewData: viewData || {},
                dimensions: dimensions || {},
                callback: callback || function(){}
            }, {
                windowSize: 'lg',
                windowClass: 'filters-modal'
            });

            dialog.result.then(function(data) {
                callback.call(null, data);
            });
        };

    }]);
'use strict';

/**
 * @ngdoc service
 * @name ThreeSixtyOneView.DimensionService
 * @description
 * # DimensionService
 * Service in the ThreeSixtyOneView.
 */
 angular.module('ThreeSixtyOneView.services')
    .service('DimensionService', ["$rootScope", "ManageTemplatesService", "EVENTS",
        function DimensionService($rootScope, ManageTemplatesService, EVENTS) {

        var allDimensions = {};

        this.getDimensions = function(templateId) {
            if (!_.has(allDimensions, templateId)) {
                ManageTemplatesService.buildDimensionsTree(templateId).then(function(dimensions) {
                    allDimensions[templateId] = dimensions;
                    $rootScope.$broadcast(EVENTS.dimensionsIsLoaded, allDimensions[templateId]);
                    return allDimensions[templateId];
                });
            } else {
                $rootScope.$broadcast(EVENTS.dimensionsIsLoaded, allDimensions[templateId]);
                return allDimensions[templateId];
            }
        };

        this.getSelectedDimensions = function(dimensions, schema) {
            var tmpDimensions = [];
            _.each(schema, function(_dimension, _dimensionIndex) {
                var dimension = false;
                if(_dimension.isSelected) {
                    dimension = {
                        id: _dimension.id,
                        label: _dimension.label,
                        members: []
                    };
                    _.each(_dimension.members, function(_member, _memberIndex) {
                        if(_member.isSelected) {
                            dimension.members.push(dimensions[_dimensionIndex].members[_memberIndex]);
                        }
                    });
                    tmpDimensions.push(dimension);
                }
            });
            return tmpDimensions;
        };

        this.getSelectedDimensionsLabels = function(dimensions, categorizedValues, type) {
            var maxMembers = 2,
                dimensionLabelList = [];
            _.each(dimensions, function(dimension, index) {
                var membersLabel = '',
                    categorizedValue = categorizedValues[index];
                if (dimension.isSelected) {
                    if (type === 'kpi') {
                        dimensionLabelList.push(dimension.label);
                    } else {
                        if (categorizedValue.selected < categorizedValue.total) {
                            if (categorizedValue.label.length < maxMembers) {
                                membersLabel = '(' + categorizedValue.label.join(', ') + ')';
                            } else {
                                membersLabel = '(' + categorizedValue.label.slice(0, maxMembers).join(', ') + '...)';
                            }
                        } else {
                            membersLabel = '';
                        }
                        dimensionLabelList.push(dimension.label + membersLabel);
                    }
                }
            });
            return dimensionLabelList.join(', ');
        };

}]);

'use strict';

angular.module('ThreeSixtyOneView.services')
  .service('ErrorService', ["$rootScope", "dialogs", "EVENTS", "CONFIG", function ErrorService($rootScope, dialogs, EVENTS, CONFIG) {

  	//TODO: move this to a separate config file
	var errors = {
		"isNotUnique": "The name you have chosen already exists. Please chose another.",
		"minlength": "The name you have choosen is too short. Please choose a name which is at least " + CONFIG.application.inputRestrictions.minimumCharacterLimit + " characters in length.",
		"maxlength": "The name you have choosen is too long. Please choose a name which is shorter than " + CONFIG.application.inputRestrictions.maximumCharacterLimit + " characters.",
		"parse": "This field requires a value.",
		"pattern": "The name can not contain the following characters: " + CONFIG.application.inputRestrictions.characterRestrictions

	}

	function error(title, msg){
		dialogs.error(title, msg);
	}

	this.getError = function(errorObj){	
		var type = Object.keys(errorObj)[0];
		if (!type || !errors[type]) return;
		return errors[type];
	}

	$rootScope.$on(EVENTS.serverError, function(event, data){
		error("ERROR: server error " + data.status.toString(), "The request to " + data.config.url + " responsed with an error " + data.status.toString());
	});

	$rootScope.$on(EVENTS.error, function(event, data){
		error(data.title, data.msg);
	});


	$rootScope.$on(EVENTS.noDataReceived, function(event, data){error("ERROR: Data issues", data.msg);});

  }]);

'use strict';

angular.module('ThreeSixtyOneView.services')
	.service('GotoService', ["$state", function Goto($state) {

	this.scenarioEdit = function (projectId, scenarioId, scenarioElementId){
		$state.go("Scenario.edit", {"projectId": projectId, "scenarioId": scenarioId, "scenarioElementId": scenarioElementId});
	};

	this.scenarioCalculate = function (projectId, scenarioId){
		$state.go("Scenario.calculate", {"projectId": projectId, "scenarioId": scenarioId});
	};

	this.dashboard = function(projectId){
		$state.go("Dashboard", {"projectId": projectId});
	};

	this.projects = function(){
		$state.go("ProjectManager");
	};

	this.scenarioCreate = function(projectId){
		$state.go("ScenarioCreate", {"projectId": projectId});
	};

	this.baseScenario = function(projectId, scenarioId){
		$state.go("Scenario.edit", {"projectId": projectId, "scenarioId": scenarioId});
	};

	this.createRecommendation = function(){
		$state.go("CreateRecommendation");
	};

	this.createRecommendationChooseBaseScenario = function(){
		$state.go("CreateRecommendation.base");
	};

	this.createRecommendationAssumptions = function(){
		$state.go("CreateRecommendation.assumptions");
	}
}]);
/* global _ */
/* jshint unused:false */
"use strict";

angular.module("ThreeSixtyOneView.services")
	.service("Model", ["$timeout", "$rootScope", "EVENTS", function($timeout, $rootScope, EVENTS) {
		var Model = function(model) {
			angular.extend(this, model);
		};

		Model.prototype = {
			$futureData: null,
			data: [],
			get: function(params, additionalPath) {
				this.unwrap(this.resource.get(params, this.config, additionalPath));
				return this.$futureData;
			},
			create: function (data){
				console.info ("The create method has not been overwritten");
			},
			unwrap: function(futureData) {
				var self = this, data;
				self.data = [];
				this.$futureData = futureData;
				this.$futureData.then(function(_data_) {
					data = Array.prototype.slice.call(_data_);
					$timeout(function() {
						_.extend(self.data, data);
					});
				});
			},
			/*
			Translate a collection by passing in a reference object
			- any attributes not in the reference object will not be in the output object
			translateObj({“id”: ”uuid”}, {uuid: 12345, description: "foobar"} ) returns {id: 12345}
			translateObj({“id”: ”uuid”, "description": description}, {uuid: 12345, description: "foobar"} ) returns {id: 12345, description: "foobar"}
			translateObj({auditInfo: { createdBy: { name: “fred}}}, {“createdBy” : ”auditInfo.createdBy.name"}) returns {createdBy :” fred”}
			translateObj({createdBy: ”fred”}, {“auditInfo.createdBy.name” : ”createdBy"}) returns {auditInfo: { createdBy: { name: “fred}}}
			*/
			translateObj: function(data, translator){
				var result = {}, self = this,
					t; // attribute value
				_.each(translator, function(k,v){
					// k is what you get
					// v is what you want
					if(v.indexOf(".") > -1 && data[k]){
						_.extend(result, self.makeObjs(v, data[k]));
					}else{
						t = data[k];
						if (typeof t !== "undefined") {
							result[v] = t;
						} else if (typeof k === "string" && k.indexOf(".") > -1){
							try{
								/* jshint ignore:start */
								result[v] = eval("data." + k);
								/* jshint ignore:end */
							} catch(e){
								console.info (k + " does not exist");
							}
						}
					}
				});
				return result;
			},
			/*
			Make an object from a string and assign it a value
			makeObjs("a.b.c", "foobar") returns {a: {b: {c: "foobar"}}}
			*/
			makeObjs: function(stingObj, _value_){
				var objectPattern = stingObj,
					value = _value_,
					newObj,
					list = [];

				objectPattern.replace(/(\w+)/g, function (objectName) {
				  list.push(objectName);
				});

				list.reverse();

				newObj = _.reduce(list, function (memo, v) {
				  var obj = {};
				  obj[v] = memo;
				  return obj;
				}, value);

				return newObj;
			},
			translateRequest: function(request, requestTranslator){
				if (request && requestTranslator) {
					return JSON.stringify(this.translateObj(request, requestTranslator));
				}
				return JSON.stringify(request);
			},
			translateResponse: function (response, responseTranslator){
				var results, data;

				try {
					data = JSON.parse(response);
				}
				catch(e){
					$rootScope.$broadcast(EVENTS.noDataReceived, {msg:"data will not parse to json"});
					return;
				}

				if (data && responseTranslator) {

					if (_.isArray(data)){
						results = [];
						_.each(data, function(e,i,a){
							results.push(this.translateObj(e, responseTranslator));
						}, this);
					} else if (_.isObject(data)){
						return this.translateObj(data, responseTranslator);
					}

					return results;
				} else {
					return data;
				}
			},
			makeConfig: function(which, responseTranslator, requestTranslator){
				return {
					transformResponse: function(data){ return which.translateResponse(data, responseTranslator); },
					transformRequest: function(data){ return which.translateRequest(data, requestTranslator);}
				};
			},
			setConfig: function(_config_){
				this.config = _config_;
			}
		};

		return function(){
			return Model;
		};
	}]);

'use strict';

/**
 * @ngdoc service
 * @name ThreeSixtyOneView.PivotMetaService
 * @description
 * # PivotMetaService
 * Service in the ThreeSixtyOneView.
 */
 angular.module('ThreeSixtyOneView.services')
 .service('PivotMetaService', ['MetaDataService', 'ManageAnalysisViewsService', function PivotMetaService(MetaDataService, ManageAnalysisViewsService) {
	var self = this,
		findNAMembers = function(dimension) {
			var output = [];

			if(dimension.members.length > 0) {
				_.each(dimension.members, function(member) {
					if(member.members.length > 0 && member.na) {
						output.push(member);
					}
					output = output.concat(findNAMembers(member));
				});
			} else {
				if(dimension.na) {
					output.push(dimension);
				}
			}

			return output;
		},
		findSelectedFilters = function(_member, _dimension, _add) {
			var add, output = {};
			add = _add || (_dimension.label === _member.label);

			_.each(_dimension.members, function(member) {
				output = angular.extend(output, findSelectedFilters(_member, member, add));
			});

			if(_dimension.members.length === 0 && add) {
				output[_dimension.id + ',' + _dimension.label] = true;
			}

			return output;
		},
		getDefaultViewColumn = function(dimensions) {
			var timeDimension = _.find(dimensions, function(dimension) {
				return dimension.type === 'TimeDimension';
			});
			if(!timeDimension) {
				timeDimension = _.find(dimensions, function(dimension) {
					return dimension.type === 'StandardDimension';
				});
			}

			return {
				dimension: {id:timeDimension.dimensionId
				},
				hierarchy: {
					id: -1
				},
				level: {
					id: timeDimension.members[0].levelId,
					label: timeDimension.members[0].label
				}
			};
		},
		getDefaultViewRow = function(dimensions) {
			var measureDimension = _.find(dimensions, function(dimension) {
				return dimension.type === 'MeasureDimension';
			});
			if(!measureDimension) {
				measureDimension = dimensions[0];
				if(dimensions[0].type === 'TimeDimension') {
					measureDimension = dimensions[1];
				}
			}

			return {
				dimension: {
					id: measureDimension.dimensionId
				},
				hierarchy: {
					id: -1
				},
				level: {
					id: measureDimension.members[0].levelId,
					label: measureDimension.members[0].label
				}
			};
		};

	// create the temporary filter object from the view data
	this.getAddedFilters = function(filters, dimensions) {
		var currentDimension,
			addedFilters = {},
			NAMembers = [];

		_.each(filters, function(filter) {
			addedFilters[filter.scope.dimension.label] = {};
			addedFilters[filter.scope.dimension.label].scope = filter.scope;

			currentDimension = _.find(dimensions, function(dimension) {
				return dimension.id === filter.scope.dimension.id;
			});

			if(filter.value.specification.type === 'All') {
				angular.extend(addedFilters[filter.scope.dimension.label], findSelectedFilters(filter.scope.level, currentDimension, false));
			} else {
				_.each(filter.value.specification.members, function(member) {
					angular.extend(addedFilters[filter.scope.dimension.label], findSelectedFilters(member, currentDimension, false));
				});
			}

			NAMembers = findNAMembers(currentDimension.members[0]);
			_.each(NAMembers, function(NAMember) {
				if(NAMember.members.length === 0) {
					angular.extend(addedFilters[filter.scope.dimension.label], findSelectedFilters(NAMember, NAMember, true));
				}
			});
		});

		return addedFilters;
	};

	this.addAllFilters = function(dimensions) {
		var addedFilters = {},
			NAMembers = [];

		_.each(dimensions, function(dimension) {
			addedFilters[dimension.label] = {};
			
			addedFilters[dimension.label].scope = {
				dimension: {
					id: dimension.id,
					name: dimension.name,
					label: dimension.label
				},
				hierarchy: {
					id: -1
				},
				level: {
					id: dimension.members[0].id,
					name: dimension.members[0].name,
					label: dimension.members[0].label
				}
			};

			angular.extend(addedFilters[dimension.label], findSelectedFilters(dimension, dimension, false));

			NAMembers = findNAMembers(dimension.members[0]);
			_.each(NAMembers, function(NAMember) {
				if(NAMember.members.length === 0) {
					angular.extend(addedFilters[dimension.label], findSelectedFilters(NAMember, NAMember, true));
				}
			});
		});

		return addedFilters;
	};

	// aggregate filter values based on categories
	this.getCategorizeValues = function(dimension, items, attributeIndex) {
		var i, result;

		var countValues = function(category) {
			var output = {
				label: [],
				id: [],
				selected: 0,
				total: 0
			};
			var j, tempResult;

			if(category.members.length > 0) {
				for(j = 0; j < category.members.length; j++) {
					tempResult = countValues(category.members[j]);

					if(!tempResult) {
						return false;
					} else if(tempResult.selected > 0 && tempResult.selected !== tempResult.total) {
						return false;
					} else if(tempResult.selected === tempResult.total && tempResult.total > 0) {
						output.label.push(category.members[j].label);
						output.id.push(category.members[j].id);
						output.selected++;
					}

					// does not increase total for NA members
					if(tempResult.total > 0) {
						output.total++;
					}
				}

			} else {
				if(category.na) {
					// return both selected and total as zero if category is NA
					// this way they will be eliminated from the counting
					return output;
				}
				if(items[category.id + ',' + category.label]) {
					output.selected = 1;
					output.label.push(category.label);
					output.id.push(category.id);
				}
				output.total = 1;
			}

			return output;
		};

		if(typeof attributeIndex !== 'undefined') {
			return countValues(dimension.members[attributeIndex]);
		}

		for(i = 0; i < dimension.members.length; i++) {
			result = countValues(dimension.members[i]);

			if(!_.isUndefined(result) && result.selected !== result.total) {
				return result;
			}
		}

		return result;
	};

	// generate a flat list of all the members for the purpose of generating filters list
	this.generateMembersList = function(tree) {
		var membersList = [];

		var flattenTree = function(branch, _dimensionId, _hierarchyId, _levelId) {
			var hierarchyId, levelId, output = {};

			hierarchyId = _hierarchyId || branch.hierarchyId || null;
			levelId = _levelId || branch.levelId || null;

			output[branch.id + ',' + branch.label] = {
				id: branch.id,
				dimensionId: _dimensionId,
				hierarchyId: hierarchyId,
				levelId: levelId,
				name: branch.name,
				label: branch.label
			};

			_.each(branch.members, function(_member) {
				angular.extend(output, flattenTree(_member, _dimensionId, hierarchyId, levelId));
			});

			return output;
		};

		_.each(tree, function(_branch) {
			membersList[_branch.dimensionId] = flattenTree(_branch, _branch.dimensionId, null, null);
		});

		return membersList;
	};

	this.generateCategorizeValueStructure = function(addedFilters, dimensions, viewData) {
		if(!_.isEmpty(viewData)) {
			var categorizedValue = [];
			_.each(dimensions, function(dimension, index) {
				categorizedValue[index] = self.getCategorizeValues(dimension, addedFilters[dimension.label]);
			});
			return categorizedValue;
		}
	};

	this.formEmptyView = function(dimensions, cubeMeta) {
		var newColumn = getDefaultViewColumn(dimensions),
			newRow = getDefaultViewRow(dimensions),
			columns = [],
			rows = [],
			newView = {
				name: 'Default ' + cubeMeta.label + ' view',
				isDefault: true,
				isDraft: false,
				columns: columns,
				rows: rows,
				filters: []
			};
		newView.columns.push(newColumn);
		newView.rows.push(newRow);

		_.each(dimensions, function(dimension) {
			newView.filters.push({
				scope: {
					dimension: {id: dimension.id, label: dimension.label},
					hierarchy: {id: dimension.members[0].hierarchyId},
					level: {id: dimension.members[0].levelId, label: dimension.members[0].label}
				},
				value: {
					specification: {type: 'All'}
				}
			});
			// for time filter, only have the current year selected
			if(dimension.label === 'TIME') {
				var currentYear =_.find(dimension.members[0].members, function(year) {
					return year.label.indexOf(new Date().getFullYear()) > -1;
				});
				newView.filters[newView.filters.length-1].value.specification = {
					type: 'Absolute',
					members: [{
						id: currentYear.id,
						label: currentYear.label
					}]
				};
			}
		});

		return newView;
	};

	// create an empty view with no rows and columns and ALL for filters
	this.createEmptyView = function(dimensions, cubeMeta, spendViewId, isDraft) {
		var newView = self.formEmptyView(dimensions, cubeMeta);

		if(typeof isDraft !== 'undefined') {
			newView.isDraft = isDraft;
		}

		return ManageAnalysisViewsService.createView(newView, cubeMeta.id, spendViewId).then(function(view) {
			return view;
		});
	};

	this.updateView = function(cubeId, view) {
        // filter ids should be set to zero before update
        _.each(view.filters, function(filter) {
            filter.id = 0;
        });
        return ManageAnalysisViewsService.updateView(view, cubeId).then(function(response) {
            return response;
        });
    };

	// find the default (or draft if exists) view from views list
	this.findDefaultView = function(list) {
		var viewId = list[0].id,
			draftView = false;

		// check for draft views
		_.each(list, function(item) {
			// if(item.name.substring(0, 8) === 'Draft - ') {
			if(item.isDraft) {
				viewId = item.id;
				draftView = true;
			} else if(!draftView && item.isDefault) {
				viewId = item.id;
			}
		});

		return viewId;
	};

	// initialize the dimensions, views list, and the default view
	this.initModel = function(cubeMeta) {
		return MetaDataService.buildDimensionsTree(cubeMeta.id).then(function(dimensions) {
			return  ManageAnalysisViewsService.getViewsList(cubeMeta.id).then(function(list) {
				list = _.sortBy(list, function(item){return item.auditInfo.createdOn;}).reverse();
				if(list.length < 1) { // if no items in the list create an empty view
					return self.createEmptyView(dimensions, cubeMeta, false).then(function(view) {
						list.unshift(view);
						return {viewsList: list, viewData: view, dimensions: dimensions};
					});
				} else { // if there are views in the list, load the default/draft view
					var viewId = self.findDefaultView(list);

					return ManageAnalysisViewsService.getView(viewId, cubeMeta.id).then(function(view) {
						var result = {viewsList: list, viewData: view, dimensions: dimensions};
						return result;
					});
				}
			});
		});
	};

	this.setUpAddedLevels = function(colAndRow) {
		var added = {};

		_.each(colAndRow, function(item) {
			added[item.level.label] = true;
		});

		return added;
	};

	this.updateFilters = function(dimensions, addedFilters, membersList, viewFilters) { // update view filters based on the user selections
		var filters = [], self = this, NAMembers, NAMember;

		_.each(dimensions, function(dimension, dimensionIndex) {
			var dimensionId = dimension.id,
				values = self.getCategorizeValues(dimension, addedFilters[dimension.label]),
				level = _.findWhere(dimension.members, {levelId: membersList[dimensionId][values.id[0] + ',' + values.label[0]].levelId}),
				newFilter = {
					id: viewFilters[dimensionIndex].id,
					value: {
						specification: {}
					},
					scope: {
						dimension: {
							id: dimension.id,
							name: dimension.name,
							label: dimension.label
						},
						hierarchy: {
							id: -1
						},
						level: {
							id: level.id,
							name: level.name,
							label: level.label
						}
					}
				};

			NAMembers = findNAMembers(dimension.members[0]);

			if(values.selected === values.total) {
				newFilter.value.specification.type = 'All';
				newFilter.scope.level.id = dimension.members[0].id;
			} else {
				newFilter.value.specification.type = 'Absolute';
				newFilter.value.specification.members = [];
				_.each(values.label, function(item, index) {
					newFilter.value.specification.members.push({
						id: membersList[dimensionId][values.id[index] + ',' + item].id,
						name: membersList[dimensionId][values.id[index] + ',' + item].name,
						label: membersList[dimensionId][values.id[index] + ',' + item].label
					});
				});

				// manually add NA members, if available
				if(NAMembers.length > 0) {
					NAMember = _.find(NAMembers, function(member) {
						return membersList[dimensionId][member.id + ',' + member.label].levelId === newFilter.scope.level.id;
					});
					newFilter.value.specification.members.push({
						id: NAMember.id,
						name: NAMember.name,
						label: NAMember.label
					});
				}
			}

			filters.push(newFilter);
		});

		return filters;
	};

	this.determineTimeDisability = function(dimensions, added) {
		var timeDimensionId = 0,
			timeDisabled = false,
			TimeDimension;

		_.each(dimensions, function(dimension) {
			if(dimension.type === 'TimeDimension') {
				timeDimensionId = dimension.id;
				TimeDimension = dimension;
			}
		});

		_.each(TimeDimension.members, function(member) {
			if(added[member.label]) {
				timeDisabled = true;
			}
		});

		return timeDisabled;
	};
}]);

'use strict';

/**
 * @ngdoc service
 * @name ThreeSixtyOneView.PivotMetaService
 * @description
 * # PivotMetaService
 * Service in the ThreeSixtyOneView.
 */
angular.module('ThreeSixtyOneView.services')
.service('PivotViewService', [function PivotViewService() {
	this.deleteItem = function(viewData, added, index, element, callbacks) {
		added[viewData[element][index].level.label] = false;
		viewData[element].splice(index, 1);

		_.each(callbacks, function(callback) {
			callback.call(null, added);
		});
	};

	this.addItem = function(viewData, added, item, element, callbacks) {
		var newItem = {dimension:{id:item.dimensionId},hierarchy:{id:-1},level:{id:item.levelId, label:item.label}};
		viewData[element].push(newItem);
		added[item.label] = true;

		_.each(callbacks, function(callback) {
			callback.call(null, added);
		});
	};

	this.replaceItem = function(viewData, added, selected, priorLabel, element, callbacks) {
		var match, newItem, index;
		added[priorLabel] = false;
		added[selected.label] = true;

		match = _.find(viewData[element], function(item) { return item.level.label === priorLabel; });
		if (match) {
			newItem = {dimension:{id:selected.dimensionId},hierarchy:{id:-1},level:{id:selected.levelId, label:selected.label}};
			index = _.indexOf(viewData[element], match);
			viewData[element].splice(index, 1, newItem);
		}

		_.each(callbacks, function(callback) {
			callback.call(null, added);
		});
	};
}]);

/* global angular, _ */
'use strict';

angular.module('ThreeSixtyOneView.services').factory("Resource", ["$http", "$q", "$rootScope", "EVENTS", function($http, $q, $rootScope, EVENTS) {
		function Resource(http, q, path) {
			this._http = http;
			this._path = this._basePath = path;
			this._q = q;
			var self = this,
			getPath = function (params, additionalPath){
				var path = additionalPath ? this._basePath + "/" +  additionalPath : this._basePath;
				path = replaceParams(params, path);
				return path;
			}, replaceParams = function(map, string){
				var url = string;
				_.each(map, function(e,i){
					// i is regex
					// e is replacement value
					var regExp = new RegExp(":" + i);
					url = url.replace(regExp, e);
				});
				// remove unreplaced tokens
				url = url.replace(/\/:[^\/]*/gi,"");
				return url;
			}, action = function(method, params, _config_, additionalPath, data) {
				var deferred = self._q.defer(), config = _config_ || {};

				if(method === 'POST' || method === 'PUT') {
					if(typeof data === 'undefined') {
						deferred.reject('I need an item template');
						return deferred.promise;
					}
					config.data = data;
				} else if(method === 'DELETE') {
					if(typeof data === 'undefined') {
						deferred.reject('I need a query with an id');
						return deferred.promise;
					}
					_.extend(config, data);
				}

				config.method = method;
				config.url = getPath.call(self, params, additionalPath);

				self._http(config)
					.success(deferred.resolve)
					.error(function(data, status, headers, config){
						$rootScope.$broadcast(EVENTS.serverError, {data:data, status:status, headers:headers, config: config});
						deferred.reject(arguments);
					});

				return deferred.promise;
			};

			this.getPath = getPath;

			this.setPath = function (_path_){
				this._path = this._basePath + "/" +  _path_;
			};

			this.get = function(params, _config_, additionalPath){
				return action('GET', params, _config_, additionalPath);
			};

			this.post = function(data, _config_, params, additionalPath) {
				return action('POST', params, _config_, additionalPath, data);
			};

			//Alias for now
			this.create = this.post;

			this.put = function(data, _config_, params, additionalPath) {
				return action('PUT', params, _config_, additionalPath, data);
			};

			this.delete = function(query, _config_, params, additionalPath) {
				return action('DELETE', params, _config_, additionalPath, query);
			};
		}

		return function (path) {
			return new Resource ($http, $q, path);
		};
	}]);
/* global _ */

'use strict';

angular.module('ThreeSixtyOneView.services')
    .service('SortAndFilterService', ["$filter", "$rootScope", "filterFilter", "EVENTS", function($filter, $rootScope, filterFilter, EVENTS) {
        var sorters = {}, // <ms-dropdown> instances
            filterBy = {}, // <ms-dropdown> instances filter selection
            orderBy = "", // <ms-dropdown> instances orderby selection
            reverse = false, // <ms-dropdown> instances reverse selection
            activeFilters = {}, // filters (from filter include)
            selected = {
                'label': 'default'
            }, // selected filter (use for display label)
            searchText = "", // search input text value
            filters = [], // additional filters
            data = {}, // holds all data
            display = {}, // holds filtered data
            set = { // object mapping
                "activeFilter": function(toWhat) {
                    setActiveFilter(toWhat);
                },
                "reverse": function(toWhat) {
                    this.setReverse(toWhat);
                },
                "filterBy": function(toWhat) {
                    this.setFilterBy(toWhat);
                },
                "orderBy": function(toWhat) {
                    this.setOrderBy(toWhat);
                },
                "reset": function() {
                    resetFilterBy();
                },
                "filterPipeline": function(toWhat) {
                    resetActiveFilters();
                    setSelected(toWhat);
                    addToPipline(toWhat);
                }
            },
            getFilter = function(filter) {
                return function(data) {
                    return $filter(filter)(data);
                };
            },
            addToPipline = function(which) {
                var filter = getFilter(which.filter);
                filters.push(filter);
            },
            clearPipeline = function() {
                filters = [];
            },
            filterPipline = function(data) {
                return (_.reduce(filters, function(memo, num) {
                    return num(memo);
                }, data));
            },
            resetFilterBy = function() {
                filterBy = {};
            },

            setActiveFilters = function(value) {
                activeFilters = value;
            },

            resetActiveFilters = function() {
                activeFilters = {};
            },
            setSelected = function(value) {
                selected = value;
            },
            setActiveFilter = function(item) {
                clearPipeline();

                if (item) {
                    setSelected(item);
                    setActiveFilters(item.filter);
                } else {
                    resetActiveFilters();
                }

                resetFilterBy();
            },
            self = this;
            display = {};

        this.setSorter = function(id, sorter) {
            sorters[id] = sorter;
        };

        this.getSorter = function(id) {
            return sorters[id];
        };

        this.setOrderBy = function(which) {
            orderBy = which;
        };

        this.getOrderBy = function() {
            return orderBy;
        };

        this.isActive = function(which){
            return this.getOrderBy() === which;
        };

        this.setReverse = function(which) {
            reverse = which;
        };

        this.getReverse = function() {
            return reverse;
        };

        this.setFilterBy = function(obj) {
            filterBy = obj;
        };

        this.getFilterBy = function() {
            return filterBy;
        };

        this.hasFilterBy = function(){
            return !_.isEmpty(filterBy) ? true : false;
        };

        this.getActiveFilters = function() {
            return activeFilters;
        };

        this.getSearchText = function() {
            return this.searchText;
        };

        this.setSearchText = function(value) {
            this.searchText = searchText = value;
        };

        this.resetSearchText = function() {
            this.searchText = searchText = "";
        };

        this.getSelected = function() {
            return selected;
        };

        this.getSelectedLabel = function() {
            return selected.label;
        };

        this.getCount = function() {
            try{
                return display.length;
            }catch(e){
                console.info("No data");
            }
        };

        this.getData = function() {
            return display;
        };

        this.searchText = searchText;

        this.setFilter = function(which, toWhat, filter) {
            set [which].call(this, toWhat);

            if (filter) {
                this.filter();
            }
        };

        this.init = function(config) {
            data = config.data;
            display = angular.copy(data);
            this.setFilter("orderBy", config.orderBy, false);
            this.setFilter("reverse", config.reverse, false);
            this.setFilter("activeFilter", config.filter, true);

            $rootScope.$on(EVENTS.updateProjects, function(event, response) {
                $rootScope.$apply(function(){
                    data = response.data;
                    self.filter();
                });
            });
        };

        this.filter = function() {
            var activeFilters = this.getActiveFilters(),
                filterBy = this.getFilterBy(),
                searchText = this.getSearchText(),
                temp = data;
            temp = filterFilter(temp, activeFilters);
            temp = filterFilter(temp, filterBy);
            temp = filterFilter(temp, {
                name: searchText
            });
            temp = $filter('orderBy')(temp, this.getOrderBy(), this.getReverse());
            temp = filterPipline(temp);

            display = temp;
            $rootScope.$broadcast(EVENTS.filter);
        };
    }]);
"use strict";

angular.module('ThreeSixtyOneView.services').service("ServerService",['SERVER', '$location', function(SERVER, $location) {
	var cache = {}, server;

	this.get = function(instance){
		server = $location.search().server;

		if (server === "reset"){
			this.clearCache();
		} else if (instance && cache[instance]){
			return cache[instance];
		} else if (server){
			console.info("caching new server");
			cache[instance] = server;
			return server;
		}

		return SERVER[instance];
	};

	this.clearCache = function(){
		cache = {};
	};
}]);
'use strict';

angular.module('ThreeSixtyOneView.services')
    .service('ScenarioStatesService', ["$rootScope", "$interval", "AnalyticCalculationsService", "CONFIG", "EVENTS", function ($rootScope, $interval, AnalyticCalculationsService, CONFIG, EVENTS) {

        var statesArray = [],
            inprogressArray = [],
            bradcastTimer = {},
            scenarioStates = CONFIG.application.models.ScenarioAnalytics.states,
            getScenarioState = function(currentStateObj){
                var state;
                if (currentStateObj.completed === true){
                    if (currentStateObj.name === scenarioStates.FAILED.message){
                        state = scenarioStates.FAILED;
                    } else if (currentStateObj.name === scenarioStates.SUCCESS.message){
                        state = scenarioStates.SUCCESS;
                    }
                } else if (currentStateObj.name === scenarioStates.NOT_CALCULATED.message){
                    state = scenarioStates.NOT_CALCULATED;
                } else {
                    state = scenarioStates.IN_PROGRESS;
                }
                return state;
            },
            setScenarioState = function(myScenario){
                _.extend(myScenario.currentState, getScenarioState(myScenario.currentState));
                return myScenario;
            },
            getAllScenariosStates = function(myScenarioArray) {
                return AnalyticCalculationsService.getAllStatesById(myScenarioArray).then(function(response) {
                    var myStatesArray = [];
                    _.each(response, function(v, i) {
                        var statesObject = {};
                        statesObject = setScenarioState(v);
                        statesObject.scenarioId = myScenarioArray[i];
                        myStatesArray.push(statesObject);
                    });
                    return myStatesArray;
                });
            },
            getAllInprogressStates = function(myStatesArray) {
                return _.filter(myStatesArray, function(v) {
                    return v.currentState.message === scenarioStates.IN_PROGRESS.message;
                });
            },
            startBroadcastScenariosStates = function(myInprogressArray) {
                $rootScope.$broadcast(EVENTS.broadcastStates, myInprogressArray);
            },
            stopBroadcastScenarioStates = function() {
                $interval.cancel(bradcastTimer);
                bradcastTimer = null;
            };

        this.getScenarioState = getScenarioState;
        this.stopPull = stopBroadcastScenarioStates;
        this.getAllScenariosStates = getAllScenariosStates;

        this.startPull = function(myScenarioArray) {
            statesArray = [];
            getAllScenariosStates(myScenarioArray).then(function(response) {
                statesArray = response;
                inprogressArray = getAllInprogressStates(statesArray);
                startBroadcastScenariosStates(statesArray);
                if (!_.isEmpty(inprogressArray)) {
                    stopBroadcastScenarioStates();
                    bradcastTimer = $interval(function(){
                        statesArray = [];
                        getAllScenariosStates(_.pluck(inprogressArray, 'scenarioId')).then(function(response) {
                            statesArray = response;
                            inprogressArray = getAllInprogressStates(statesArray);
                            if(!_.isEmpty(_.difference(statesArray, inprogressArray))) {
                                startBroadcastScenariosStates(_.difference(statesArray, inprogressArray));
                            } else {
                                if (_.isEmpty(inprogressArray)) {
                                    stopBroadcastScenarioStates();
                                } else {
                                    startBroadcastScenariosStates(inprogressArray);
                                }
                            }
                        });
                    }, CONFIG.view.ScenarioCalculate.timerInterval);
                }
            });
        };

        $rootScope.$on('$locationChangeSuccess', function() {
            stopBroadcastScenarioStates();
        });

    }]);
'use strict';

angular.module('ThreeSixtyOneView.services')
    .factory('AnalyticCalculationsModel', ["$location", "Resource", "CONFIG", "ServerService", "$q", "$http", function AnalyticCalculationsModel($location, Resource, CONFIG, ServerService, $q, $http) {

        var resource = new Resource(ServerService.get($location.host()) + CONFIG.application.api.scenarioAnalytics),
            transformResponse = function(data) {
                if(!_.has(data, 'errorMessage')) {
                    angular.forEach(data.runningStates, function(value, index) {
                        value.id = index + 1;
                        value.name = value.name.trim();
                        value.name = value.label.trim();
                    });

                    data.currentState.name = data.currentState.name.trim();
                    data.currentState.label = data.currentState.label.trim();
                }
                return data;
            };

        return {
            config: {
                transformResponse: function(data){ return transformResponse(JSON.parse(data));},
                transformRequest: function(data){ return JSON.stringify(data);}
            },
            resource: resource,
            data: [],

            get: function(params, _config_, additionalPath){
                var deferred = $q.defer(), config = _config_ || this.config,
                    path = this.resource.getPath(params, additionalPath);

                $http
                    .get(path, config)
                    .success(deferred.resolve)
                    .error(function(){
                        deferred.resolve({id: params.id, currentState: {completed: false, name: "not_calculated", label: "not calculated", state: "not_calculated"}});
                        return deferred.promise;
                    });

                return deferred.promise;
            },

            post: function(data, _config_, params, additionalPath) {
                var deferred = $q.defer(), config = _config_ || {},
                    path = this.resource.getPath(params, additionalPath);

                if (typeof data === 'undefined') {
                    deferred.reject('I need an item template');
                    return deferred.promise;
                }

                $http
                    .post(path, data, config)
                    .success(deferred.resolve)
                    .error(function(data, status){
                        deferred.resolve({currentState: {completed: status, label: "?"}});
                        return deferred.promise;
                    });

                return deferred.promise;
            }

        };

    }]);

'use strict';

angular.module('ThreeSixtyOneView.services')
	.service('AnalyticCalculationsService', ["Model", "AnalyticCalculationsModel", "$q", "CONFIG", function (Model, AnalyticCalculationsModel, $q, CONFIG) {
		var MyScenarioCalculate,
			myCalculate,
			self = this,
			scenarioStates = CONFIG.application.models.ScenarioAnalytics.states;

		MyScenarioCalculate = new Model();
		angular.extend(this, MyScenarioCalculate.prototype);
		myCalculate = new MyScenarioCalculate(AnalyticCalculationsModel);
		angular.extend(this, myCalculate);

		this.isInProgress = function(state){
			return state === scenarioStates.IN_PROGRESS.message;
		};

		this.isFailed = function(state){
			return state === scenarioStates.FAILED.message;
		};

		this.isNotCalculated = function(state){
			return state === scenarioStates.NOT_CALCULATED.message;
		};

		this.isSuccess = function(state){
			return state === scenarioStates.SUCCESS.message;
		};

		this.get = function(id){
			return myCalculate.get({"id": id}, this.config).then(function(response){
				return response;
			});
		};

		this.post = function(id){
			return myCalculate.post({}, {}, {id: id}).then(function(response){
				return response;
			});
		};

		this.startCalculation = function(state, id){
			if (state.currentState.name !== scenarioStates.FAILED.message){
				return this.post(id).then(function(response){
					return response;
				});
			}
		};

		this.getAllStatesById = function(myScenarioArray){
			var promises = [];

			_.each(myScenarioArray, function(v){
				promises.push(self.get(v));
			});

			return $q.all(promises).then(function(response){
				return response;
			});
		};

	}]);

'use strict';

angular.module('ThreeSixtyOneView.services')
.factory('ExportResourceModel', ["$location", "Resource", "CONFIG", "ServerService", function ($location, Resource, CONFIG, ServerService) {
	var resource = new Resource(ServerService.get($location.host())  + CONFIG.application.api.exportResource);

	return {
		resource: resource,
		config: {}
	};
}]);
'use strict';

angular.module('ThreeSixtyOneView.services')
.service('ExportResourceService', ["Model", "ExportResourceModel", function (Model, ExportResourceModel) {
	var MyExportModel, myView, self = this;

	MyExportModel = new Model();
	angular.extend(this, MyExportModel.prototype);
	myView = new MyExportModel(ExportResourceModel);
	angular.extend(this, myView);

	this.requestExport = function(elementId, analysisView) {
		var additionalPath = '';
		return this.resource.post(analysisView, this.config, {elementId: elementId}, additionalPath).then(function (response) {
			return response;
		});
	};

	this.checkStatus = function(elementId) {
		var additionalPath = 'status';
		return this.resource.get({elementId: elementId}, this.config, additionalPath).then(function(response) {
			return response;
		});
	};

	this.downloadFile = function(elementId) {
		var additionalPath = 'download';
		return this.resource.get({elementId: elementId}, this.config, additionalPath).then(function() {
			return self.config.url;
		});
	};
}]);
/* global angular, _ */
/* jshint unused:false */
'use strict';

angular.module('ThreeSixtyOneView.services').factory('FavoritesModel', ["$timeout", "$location", "Resource", "CONFIG", "ServerService", function($timeout, $location, Resource, CONFIG, ServerService){
        var resource = new Resource(ServerService.get($location.host())  + CONFIG.application.api.favorites),
        transformResponse = function(_data_){
            if (_data_){
                var data = mapIt(JSON.parse(_data_), "id", "uuid");
                return data ? _.pluck(data, 'uuid') : "";
            }
            return _data_;
        },
        mapIt = function(arr, oldValue, newValue){
            return _.map(arr, function(k,v,l){
                var obj = {};
                if (k[oldValue]) {
                    obj[newValue] = k[oldValue].toString();
                } else {
                    obj[newValue] = k[newValue].toString();
                }
                return obj;
            });
        };

        return {
            resource: resource,
            config: {
                transformResponse: function(data){ return transformResponse(data);},
                transformRequest: function(data){ return JSON.stringify(data);}
            },
            setAsFavorite: function(id, type, item) {
                var params = {};
                params[type === "project" ? "uuid" : "id"] = id;
                if (type !== "project"){
                    params.type = item.type;
                }
                this.resource.post(params, this.config, {}, type).then(function(response){
                    return response;
                });
            },
            unFavorite: function(id, type){
                var params = {}, obj;
                params[type === "project" ? "uuid" : "id"] = id;
                obj = {"params": params};

                this.resource.delete(obj, this.config, {}, type).then(function(response){
                    return response;
                });
            },
            get: function(type){
                this.unwrap(this.resource.get("", this.config, type));
                 console.info(this.data);
                return this.$futureData;
            },
            getFavoritesScenarios: function(projectId){
                this.unwrap(this.resource.get({id: projectId}, this.config, "project/:id/scenario"));
                return this.$futureData;
            }
        };
}]);

/* global angular, _ */
 /*jshint -W055 */
 
'use strict';

angular.module('ThreeSixtyOneView.services')
    .service('FavoritesService', ["$rootScope", "FavoritesModel", "Model", function($rootScope, FavoritesModel, Model) {
        var model, favs;

        model = new Model();
        angular.extend(this, model.prototype);
        favs = new model(FavoritesModel);
        angular.extend(this, favs);

        //this.data = [];

        this.removeFavorite = function(itemID) {
            if (_.indexOf(this.data, itemID) > -1) {
                this.data.splice(_.indexOf(this.data, itemID), 1);
            }
        };

        this.addFavorite = function(itemID) {
            this.data.push(itemID);
        };

        this.isFavorite = function(_itemID_) {
            var itemID = _itemID_.toString(),
                index = _.indexOf(this.data, itemID);
            return index > -1 ? true : false;
        };

        this.toggleFavorite = function(id, type, item) {
            var itemID = id.toString();
            if (this.isFavorite(itemID)) {
                this.removeFavorite(itemID, type);
                this.unFavorite(itemID, type);
            } else {
                this.addFavorite(itemID);
                this.setAsFavorite(itemID, type, item);
            }
        };

        this.getFavorites = function() {
            return this.data;
        };

    }]);
'use strict';

angular.module('ThreeSixtyOneView.services')
.factory('ImportResourceModel', ["$location", "Resource", "CONFIG", "ServerService", function ($location, Resource, CONFIG, ServerService) {
	var resource = new Resource(ServerService.get($location.host())  + CONFIG.application.api.importResource);

	return {
		resource: resource,
		config: {}
	};
}]);

'use strict';

angular.module('ThreeSixtyOneView.services')
.service('ImportResourceService', ["Model", "ImportResourceModel", function (Model, ImportResourceModel) {
	var MyImportModel, myView;

	MyImportModel = new Model();
	angular.extend(this, MyImportModel.prototype);
	myView = new MyImportModel(ImportResourceModel);
	angular.extend(this, myView);

	this.uploadFile = function(elementId, file){
		var additionalPath = 'upload',
			formData = new FormData();
		formData.append('file', file);

		return this.resource.post(formData, { transformRequest: angular.identity, headers: {'Content-Type': undefined} }, {elementId: elementId}, additionalPath).then(function (response) {
			return response;
		});
	};

	this.checkStatus = function(elementId) {
		var additionalPath = 'status';
		return this.resource.get({elementId: elementId}, this.config, additionalPath).then(function(response) {
			return response;
		});
	};
}]);
'use strict';

angular.module('ThreeSixtyOneView.services')
	.factory('ManageAnalysisViewsModel', ["$location", "Resource", "CONFIG", "ServerService", "$q", "$http", function ManageAnalysisViewsModel($location, Resource, CONFIG, ServerService, $q, $http) {

		var resource = new Resource(ServerService.get($location.host())  + CONFIG.application.api.pivotview);

		return {
			resource: resource,
			config: {},
			data: [],
            get: function(params, _config_, additionalPath) {
                var deferred = $q.defer(), config = _config_ || {},
                    path = this.resource.getPath(params, additionalPath);

                $http
                    .get(path, config)
                    .success(deferred.resolve)
                    .error(function(data, status) {
                        deferred.resolve({'id': null, error: {code: status, message: data}});
                        return deferred.promise;
                    });

                return deferred.promise;
            }
		};
	}]);

'use strict';

angular.module('ThreeSixtyOneView.services')
  .service('ManageAnalysisViewsService', ["Model", "ManageAnalysisViewsModel", function ManageAnalysisViewsService(Model, ManageAnalysisViewsModel) {
		var MyPivotviewModel, mypivotview, self = this,
			// view and filter ids should be null when creating a new view
			resetView = function(newView) {
				newView.id = null;
				_.each(newView.filters, function(filter) {
					filter.id = null;
				});
				return newView;
			};

		MyPivotviewModel = new Model();
		angular.extend(this, MyPivotviewModel.prototype);
		mypivotview = new MyPivotviewModel(ManageAnalysisViewsModel);
		angular.extend(this, mypivotview);

		//this.setConfig(this.makeConfig(this, this.responseTranslator, this.requestTranslator));

		this.getViewsList = function(cubeId) {
			return this.resource.get({cubeId: cubeId}, this.config, '').then(function (response) {
				return response;
			});
		};

		this.getView = function(viewId, cubeId) {
			return this.resource.get({viewId: viewId, cubeId: cubeId}, this.config, '').then(function (response) {
				// make the view default
				response.isDefault = true;
				self.updateView(response, cubeId);
				return response;
			});
		};

		this.getViewRelatedBy = function(viewId, cubeId) {
			return this.get({cubeId: cubeId}, {params: {relatedByView: viewId}}).then(function (response) {
				return response;
			});
		};

		this.createView = function(newView, cubeId, relatedByView) {
			var config = {};
			if(!!relatedByView) {
				config.params = {
					relatedByView: relatedByView
				};
			}

			newView.isDefault = true;

			return this.resource.post(resetView(newView), config, {cubeId: cubeId}).then(function (response) {
				return response;
			});
		};

		this.updateView = function(modifiedView, cubeId) {
			return this.resource.put(modifiedView, this.config, {viewId: modifiedView.id, cubeId: cubeId}, '').then(function (response) {
				return response;
			});
		};

		this.renameView = function(viewId, cubeId, view) {
			return this.resource.put({name: view.name}, this.config, {viewId: viewId, cubeId: cubeId}, 'name').then(function (response) {
				view.isDraft = false;
				self.updateView(view, cubeId);
				return response;
			});
		};

		this.deleteView = function(viewId, cubeId) {
			return this.resource.delete('', this.config, {viewId: viewId, cubeId: cubeId}, '').then(function (response) {
				return response;
			});
		};

		this.defaultView = function(cubeId, viewId, isDefault) {
			return self.getView(viewId, cubeId).then(function(view) {
				view.isDefault = isDefault;
				return self.updateView(view, cubeId);
			});
		};

		this.deleteAllDrafts = function(cubeId) {
			return self.getViewsList(cubeId).then(function(views) {
				views.forEach(function(view) {
					if(view.isDraft) {
						return self.deleteView(view.id, cubeId);
					}
				});
				return;
			});
		};
}]);
'use strict';

angular.module('ThreeSixtyOneView.services')
  .factory('ManageScenariosModel', ["$location", "Resource", "CONFIG", "ServerService", function ($location, Resource, CONFIG, ServerService) {
     var resource = new Resource(ServerService.get($location.host()) + CONFIG.application.api.scenarioElement),
    responseTranslator = CONFIG.application.models.ScenarioElement.responseTranslator,
    requestTranslator = CONFIG.application.models.ScenarioElement.requestTranslator,
    config = {};

    // surface data for unit tests
    this.resource = resource;
    this.config = config;

    return {
        responseTranslator: responseTranslator,
        requestTranslator: requestTranslator,
        resource: resource
    };
  }]);

'use strict';

angular.module('ThreeSixtyOneView.services')
  .service('ManageScenariosService', ["Model", "ManageScenariosModel", function (Model, ManageScenariosModel) {
	var MyScenarioElement, myElements;

		MyScenarioElement = new Model();
		angular.extend(this, MyScenarioElement.prototype);
		myElements = new MyScenarioElement(ManageScenariosModel);
		angular.extend(this, myElements);

		//this.setConfig(this.makeConfig(this, this.responseTranslator, this.requestTranslator));

		this.get = function(scenarioId) {
			var additionalPath = "analysis-element";
			return this.resource.get({"id": scenarioId}, this.config, additionalPath).then(function(response) {
				return response;
			});
		};

		this.getAnalysisElementByScenarioAndCube = function(scenarioId, cubeId) {
			var additionalPath = "cube/:cubeId/analysis-element";
			return this.resource.get({"id": scenarioId, "cubeId": cubeId}, {}, additionalPath).then(function(response) {
				return response;
			});
		};

		this.getAnalysisElementByCubeName = function(scenarioId, cubeName) {
			var additionalPath = 'analysis-element',
				config = {
					params: {
						cubeName: cubeName
					}
				};
			return this.resource.get({'id': scenarioId}, config, additionalPath).then(function(response){
				return response;
			});
		};

		this.replaceAnalysisElementForCube = function(scenarioId, cubeId, analysisElementId) {
			var additionalPath = "cube/:cubeId/analysis-element";
			return this.resource.put({'id': analysisElementId}, {}, {id: scenarioId, cubeId: cubeId}, additionalPath).then(function (response) {
				return response;
			});
		};

		this.copyAndReplaceAnalysisElementForCube = function(scenarioId, cubeId, sourceElementId, analysisElement) {
			var additionalPath = 'cube/:cubeId/analysis-element',
				config = {
					params: {
						source: sourceElementId
					}
				};
			return this.resource.post(analysisElement, config, {id: scenarioId, cubeId: cubeId}, additionalPath).then(function (response) {
				return response;
			});
		};

		this.getBase = function(type) {
			var additionalPath = 'base',
				config = {
					params: {
						type: type
					}
				};
			
			return this.resource.get({}, config, additionalPath).then(function(response) {
				return response;
			});
		};

		this.getModelingPeriod = function(timeId) {
			var additionalPath = 'modelling-period',
				config = {
					params: {
						granularity: timeId
					}
				};

			return this.resource.get({}, config, additionalPath).then(function(response) {
				return response;
			});
		};
  }]);

'use strict';

angular.module('ThreeSixtyOneView.services')
.factory('ManageTemplatesModel', ['$location', 'Resource', 'CONFIG', 'ServerService', function ($location, Resource, CONFIG, ServerService) {
	var resource = new Resource(ServerService.get($location.host())  + CONFIG.application.api.template),
		formDimensions = function(_dimensions) {
			var dimensions = [];
			_.each(_dimensions, function(_dimension) {
				dimensions.push({
					id: _dimension.id,
					dimensionId: _dimension.id,
					name: _dimension.name,
					label: _dimension.label,
					type: _dimension.type,
					aggregatable: typeof _dimension.aggregatable !== 'undefined' ? _dimension.aggregatable : null,
					members: []
				});
			});

			return dimensions;
		},
		formHierarchies = function(dimensions, dimensionIndex, hierarchy) {
			_.each(hierarchy.levels, function(level) {
				dimensions[dimensionIndex].members.push({
					dimensionId: dimensions[dimensionIndex].id,
					hierarchyId: hierarchy.id,
					hierarchyName: hierarchy.name,
					hierarchyLabel: hierarchy.label,
					levelId: level.id,
					id: level.id,
					name: level.name,
					label: level.label,
					leafLevel: false,
					members: []
				});
			});

			return dimensions;
		};

	return {
		resource: resource,
		config: {},
		dimensions: [],
		kpis: [],
		formDimensions: formDimensions,
		formHierarchies: formHierarchies
	};
}]);

'use strict';

angular.module('ThreeSixtyOneView.services')
.service('ManageTemplatesService', ['$q', 'Model', 'ManageTemplatesModel', function ($q, Model, ManageTemplatesModel) {
	var MyManageTemplatesModel, mymanagetemplatesdata, self = this,
		resetView = function(newView) {
			newView.id = null;
			_.each(newView.filters, function(filter) {
				filter.id = null;
			});
			return newView;
		};

	MyManageTemplatesModel = new Model();
	angular.extend(this, MyManageTemplatesModel.prototype);
	mymanagetemplatesdata = new MyManageTemplatesModel(ManageTemplatesModel);
	angular.extend(this, mymanagetemplatesdata);

	this.getAll = function(type) {
		var config = {
			params: {}
		};
		if(!!type) {
			config.params.type = type;
		}

		return this.resource.get({}, config, '').then(function(response) {
			return response;
		});
	};

	this.get = function(templateId, extended) {
		var config = {
			params: {
				extended: true
			}
		};
		if(typeof extended !== 'undefined') {
			config.params.extended = extended;
		}

		return this.resource.get({templateId: templateId}, config, '').then(function(response) {
			if(response.dimensions) {
				self.dimensions = self.formDimensions(response.dimensions);
			}
			if(response.kpis) {
				self.kpis = response.kpis;
			}
			return response;
		});
	};

	this.create = function(template) {
		return this.resource.post(template, {}, {}, '').then(function(response) {
			return response;
		});
	};

	this.update = function(template, commit) {
		var config = {
			params: {}
		};
		if(commit === true) {
			config.params.commit = true;
		}
		
		return this.resource.put(template, config, {templateId: template.id}, '').then(function(response) {
			return response;
		});
	};

	this.delete = function(templateId) {
		return this.resource.delete('', {}, {templateId: templateId}, '').then(function(response) {
			self.dimensions = [];
			self.kpis = [];
			return response;
		});
	};

	this.getHierarchy = function(templateId, dimensionId) {
		var additionalPath = 'dimension/:dimensionId/hierarchy';
		return this.resource.get({templateId: templateId, dimensionId: dimensionId}, {}, additionalPath).then(function(response) {
			return response;
		});
	};

	this.getMembers = function(templateId, dimensionId, hierarchyId, levelId) {
		var additionalPath = 'dimension/:dimensionId/hierarchy/:hierarchyId/level/:levelId/members',
			config = {
				params: {
					children: true
				}
			};
		return this.resource.get({templateId: templateId, dimensionId: dimensionId, hierarchyId: hierarchyId, levelId: levelId}, config, additionalPath).then(function(response) {
			return response;
		});
	};

	this.getDimensions = function() {
		return self.dimensions;
	};

	this.getKpis = function() {
		return self.kpis;
	};

	this.buildHierarchies = function(templateId) {
		var promises = [];

		_.each(self.dimensions, function(dimension) {
			promises.push(self.getHierarchy(templateId, dimension.id));
		});

		return $q.all(promises).then(function(responses) {
			_.each(responses, function(response, index) {
				_.each(response, function(hierarchy) {
					self.formHierarchies(self.dimensions, index, hierarchy);
				});
			});

			return self.dimensions;
		});
	};

	this.buildDimensionsTree = function(templateId) {
		var promises = [],
			count = 0;

		return self.buildHierarchies(templateId).then(function() {
			_.each(self.dimensions, function(dimension) {
				_.each(dimension.members, function(level) {
					promises.push(self.getMembers(templateId, level.dimensionId, level.hierarchyId, level.id));
				});
			});

			return $q.all(promises).then(function(responses) {
				_.each(self.dimensions, function(dimension) {
					_.each(dimension.members, function(level) {
						level.members = responses[count++].members;
					});
				});
				return self.dimensions;
			});
		});
	};

	this.createView = function(templateId, newView) {
		var additionalPath = 'views';
		newView.isDefault = true;

		return this.resource.post(resetView(newView), {}, {templateId: templateId}, additionalPath).then(function (response) {
			return response;
		});
	};

	this.getTemplateCubeByName = function(templateId, cubeName) {
		var additionalPath = 'cube/id',
			config = {
				params: {
					cubeName: cubeName
				}
			};
		return this.resource.get({templateId: templateId}, config, additionalPath).then(function(response) {
			return response;
		});
	};

	this.getTemplateCubesByType = function(templateId, cubeType) {
		// cubeType could be: Standard, Spend, Outcome
		var additionalPath = 'cube/ids',
			config = {
				params: {
					type: cubeType
				}
			};
		return this.resource.get({templateId: templateId}, config, additionalPath).then(function(response) {
			return response;
		});
	};

	this.getAllKpis = function(templateId) {
		var additionalPath = 'kpis';

		return this.resource.get({templateId: templateId}, {}, additionalPath).then(function(kpis) {
			return kpis
		});
	};
}]);

'use strict';

angular.module('ThreeSixtyOneView.services')
  .factory('MetaDataModel', ["$location", "Resource", "CONFIG", "ServerService", function MetaDataModel($location, Resource, CONFIG, ServerService) {
	var resource = new Resource(ServerService.get($location.host())  + CONFIG.application.api.cube),
	transformResponse = function(data) {
		var i, j, k, leafNode, newMember, dimensions = [], response = JSON.parse(data);
		
		if (response) {
			for(i = 0; i < response.dimensions.length; i++) {

				leafNode = false;
				dimensions[i] = {
					dimensionId: response.dimensions[i].id,
					id: response.dimensions[i].id,
					name: response.dimensions[i].name,
					label: response.dimensions[i].label,
					type: response.dimensions[i].type,
					aggregatable: typeof response.dimensions[i].aggregatable === 'undefined' ? null : response.dimensions[i].aggregatable,
					members: []
				};

				for(j = 0; j < response.dimensions[i].hierarchies.length; j++) {
					for(k = 0; k < response.dimensions[i].hierarchies[j].levels.length; k++) {
						newMember = {
							dimensionId: response.dimensions[i].id,
							hierarchyId: response.dimensions[i].hierarchies[j].id,
							hierarchyName: response.dimensions[i].hierarchies[j].name,
							hierarchyLabel: response.dimensions[i].hierarchies[j].label,
							levelId: response.dimensions[i].hierarchies[j].levels[k].id,
							id: response.dimensions[i].hierarchies[j].levels[k].id,
							name: response.dimensions[i].hierarchies[j].levels[k].name,
							label: response.dimensions[i].hierarchies[j].levels[k].label,
							leafLevel: false,
							members: []
						};
						
						if(k === response.dimensions[i].hierarchies[j].levels.length - 1) {
							if(!leafNode) {
								newMember.leafLevel = true;
								dimensions[i].members.push(newMember);
								leafNode = true;
							} else if(leafNode && response.dimensions[i].type === 'TimeDimension') {
								newMember.leafLevel = true;
								dimensions[i].members.push(newMember);
							}
						} else {
							if(!leafNode) {
								dimensions[i].members.push(newMember);
							} else {
								dimensions[i].members.splice(dimensions[i].members.length - 1, 0, newMember);
							}
						}
					}
				}
			}
			return dimensions;
		}
		return data;
	};

	return {
		resource: resource,
		metaConfig: {
			transformResponse: function(data) { return transformResponse(data); }
			//,transformRequest: function(data){ return JSON.stringify(data);}
		}
	};
}]);

'use strict';

angular.module('ThreeSixtyOneView.services')
.service('MetaDataService', ["$q", "Model", "MetaDataModel", function MetaDataService($q, Model, MetaDataModel) {
	var MyMetaDataModel, mymetadata, self = this;

	MyMetaDataModel = new Model();
	angular.extend(this, MyMetaDataModel.prototype);
	mymetadata = new MyMetaDataModel(MetaDataModel);
	angular.extend(this, mymetadata);

	//this.setConfig(this.makeConfig(this, this.responseTranslator, this.requestTranslator));

	this.getMeta = function(cubeId){
		var additionalPath = 'meta';
		return this.resource.get({id:cubeId}, this.metaConfig, additionalPath).then(function(response){
			return response;
		});
	};

	this.getLevelMembers = function(cubeId, dimensionId, hierarchyId, levelId, children) {
		var additionalPath =  'dimension/:dimensionId/hierarchy/:hierarchyId/level/:levelId/members',
			config = {
			params: {
					children: children
				}
			};

		return this.resource.get({id: cubeId, dimensionId:dimensionId, hierarchyId:hierarchyId, levelId:levelId}, config, additionalPath).then(function(response) {
			return response;
		});
	};

	this.buildDimensionsTree = function(cubeId) {
		return self.getMeta(cubeId).then(function(dimensions) {
			var count = 0, promises = [];

			_.each(dimensions, function(_dimension) {
				_.each(_dimension.members, function(_member) {
					promises.push(self.getLevelMembers(cubeId, _dimension.id, _member.hierarchyId, _member.levelId, true));
				});
			});

			return $q.all(promises).then(function(response) {
				_.each(dimensions, function(_dimension) {
					_.each(_dimension.members, function(_member) {
						_member.members = response[count++].members;
					});
				});

				return dimensions;
			});
		});
	};

	this.getCubeAnalysisElements = function(cubeId) {
		var additionalPath = 'analysis-element';
		return this.resource.get({id:cubeId}, {}, additionalPath).then(function(response){
			return response;
		});
	};

	this.getCubes = function(type, templateId, replaceable, globals, editable) {
		var config = {};
		config.params = {
			prediction: type,
			globals: typeof globals !== 'undefined' ? globals : false,
			editable: typeof editable !== 'undefined' ? editable : true
		};

		if(typeof templateId !== 'undefined') {
			config.params.templateId = templateId;
		}

		if(typeof replaceable !== 'undefined') {
			config.params.replaceable = replaceable;
		}

		return self.resource.get({}, config, '').then(function(cubes) {
			return cubes;
		});
	};
}]);

'use strict';

angular.module('ThreeSixtyOneView.services')
  .factory('PivotModel', ["$location", "Resource", "CONFIG", "ServerService", function ($location, Resource, CONFIG, ServerService) {
	var resource = new Resource(ServerService.get($location.host())  + CONFIG.application.api.pivotdata),
		pivotTable,
		// contains styling and formatting information
		helperObject,
		columnIndex,
		getNumberOfRows = function(response) {
			var output = !!response[0][0].key.value.coordinates.rowAddresses ? response[0][0].key.value.coordinates.rowAddresses.length : 1;
			return output;
		},
		getNumberOfColumns = function(response) {
			var output = !!response[0][0].key.value.coordinates.columnAddresses ? response[0][0].key.value.coordinates.columnAddresses.length : 1;
			return output;
		},
		getRowElements = function(row) {
			return row.key.value.coordinates.rowAddresses;
		},
		getColumnElements = function(column) {
			return column.key.value.coordinates.columnAddresses;
		},
		getElementLabel = function(element) {
			return element.cellValue.specification.members[0].label;
		},
		initializeTransformOutputs = function(numRows, numCols) {
			var i, j;
			pivotTable = [];
			helperObject = [];
			for(i = 0; i < numCols; i++) {
				pivotTable[i] = {};
				helperObject[i] = {};
				for(j = 0; j < numRows; j++) {
					pivotTable[i][j] = '';
				}
			}
		},
		formPivotTable = function(tree, numCols, columnLabels) {
			if(angular.isArray(tree)) {
				_.each(tree, function(value, index) {
					pivotTable[index + numCols][columnIndex] = value.value;
					helperObject[index + numCols][columnIndex] = value.format;
				});
				_.each(columnLabels, function(columnLabel, index) {
					pivotTable[index] = pivotTable[index] || {};
					pivotTable[index][columnIndex] = columnLabel;
					helperObject[index] = helperObject[index] || {};
				});
				columnIndex++;
			} else if(angular.isObject(tree)) {
				_.each(tree, function(branch, columnLabel) {
					var newLabels = _.values(columnLabels);
					newLabels.push(columnLabel);
					formPivotTable(branch, numCols, newLabels);
				});
			}
		},
		transformResponse = function(data) {
			if(data === '') {
				return data;
			}

			var response = JSON.parse(data);
			
			if(response.length > 0) {
				var tableTree = {},
					// number of selected dimensions in columns
					numCols = getNumberOfColumns(response),
					// number of selected dimensions in rows
					numRows = getNumberOfRows(response);

				// columns index start from row headers, e.g., if there are two row headers, first column is at index 2
				columnIndex = numRows;

				initializeTransformOutputs(numRows, numCols);

				_.each(response, function(row, rowIndex) {
					pivotTable[rowIndex + numCols] = {};
					helperObject[rowIndex + numCols] = {};
					_.each(getRowElements(row[0]), function(rowElement, rowElementIndex) {
						pivotTable[rowIndex + numCols][rowElementIndex] = getElementLabel(rowElement);
						pivotTable[numCols - 1][rowElementIndex] = rowElement.scope.level.label;
					});
					_.each(row, function(column) {
						if(!getColumnElements(column)) {
							if(!!tableTree.Values) {
								tableTree.Values.push({value: column.value.value, format: column.format});
							} else {
								tableTree.Values = [{value: column.value.value, format: column.format}];
							}
						} else {
							var branch = [];
							_.each(getColumnElements(column), function(columnElement, columnIndex) {
								var columnLabel = getElementLabel(columnElement);

								if(columnIndex === 0 && numCols > 1) {
									tableTree[columnLabel] = branch[columnIndex] = tableTree[columnLabel] || {};
								} else if(columnIndex === 0) {
									tableTree[columnLabel] = branch[columnIndex] = tableTree[columnLabel] || [];
									branch[columnIndex][rowIndex] = {value: column.value.value, format: column.format};
								} else if(columnIndex === numCols - 1) {
									branch[columnIndex - 1][columnLabel] = branch[columnIndex] = branch[columnIndex - 1][columnLabel] || [];
									branch[columnIndex][rowIndex] = {value: column.value.value, format: column.format};
								} else {
									branch[columnIndex - 1][columnLabel] = branch[columnIndex] = branch[columnIndex - 1][columnLabel] || {};
								}
							});
						}
					});
				});

				formPivotTable(tableTree, numCols, []);

				return {formatted: pivotTable, original: response, helperObject: helperObject};
			}

			return response;
		};

	return {
		resource: resource,
		pivotConfig: {
			transformResponse: function(data) { return transformResponse(data); }
		}
	};
}]);

'use strict';

angular.module('ThreeSixtyOneView.services')
  .service('PivotService', ["Model", "PivotModel", function (Model, PivotModel) {
		var MyPivotDataModel, mypivotdata;

		MyPivotDataModel = new Model();
		angular.extend(this, MyPivotDataModel.prototype);
		mypivotdata = new MyPivotDataModel(PivotModel);
		angular.extend(this, mypivotdata);

		//this.setConfig(this.makeConfig(this, this.responseTranslator, this.requestTranslator));

		this.getSlice = function(elementId, viewId) {
			var additionalPath = 'slice';
			return this.resource.get({elementId: elementId, viewId: viewId}, this.pivotConfig, additionalPath).then(function (response) {
				return response;
			});
		};

		this.updateCell = function(elementId, viewId, cellData) {
			var additionalPath = 'updateCell';
			return this.resource.post(cellData, this.config, {elementId: elementId, viewId: viewId}, additionalPath).then(function (response) {
				return response;
			});
		};

}]);
/* global angular, _ */
/* jshint unused: false */

'use strict';

angular.module('ThreeSixtyOneView.services').factory('ProjectsModel', ["$timeout", "$rootScope", "$location", "Resource", "CONFIG", "ServerService", "EVENTS", "Model", function($timeout, $rootScope, $location, Resource, CONFIG, ServerService, EVENTS, Model){

    var resource = new Resource(ServerService.get($location.host()) + CONFIG.application.api.projects);
    // responseTranslator = CONFIG.application.models.ProjectsModel.responseTranslator,
    // requestTranslator = CONFIG.application.models.ProjectsModel.requestTranslator;


    return {
        // responseTranslator: responseTranslator,
        // requestTranslator: requestTranslator,
        resource: resource,
        data: [],
        masterProject: undefined,
        // used for the rename functions
        get: function () {
            var self = this;
            return resource.get().then(function(response) {
                self.data = response;
                return response;
            });
        },
        put : function(_data_){
            var self = this;
            return resource.put(_data_, this.config).then(function(response){
                var index = _.indexOf(self.data, _.findWhere(self.data, {id: response.id}));
                self.data.splice(index, 1, response);
                $timeout(function(){
                    $rootScope.$broadcast(EVENTS.updateProjects, {
                        data: self.data,
                        item: response,
                        original: _data_
                    });
                });
                return response;
            });
        },
        create: function(_data_) {
            var self = this;
            return resource.create(_data_, this.config).then(function(response) {
                self.data.push(response);
                $timeout(function() {
                    $rootScope.$broadcast(EVENTS.updateProjects, {
                        data: self.data,
                        item: response,
                        original: _data_
                    });
                });
                return response;
            });
        }
    };
}]);

/* global _ */

'use strict';

angular.module('ThreeSixtyOneView.services')
	.service('ProjectsService',  ["$rootScope", "ProjectsModel", "Model", "EVENTS", function ($rootScope, ProjectsModel, Model, EVENTS) {
		var MyProjectModel, myprojects, self = this,
			findMasterProject = function(projects) {
				return _.find(projects, function(project) {return project.isMaster});
			};

		MyProjectModel = new Model();
		angular.extend(this, MyProjectModel.prototype);
		myprojects = new MyProjectModel(ProjectsModel);
		angular.extend(this, myprojects);

		// this.setConfig(this.makeConfig(this, this.responseTranslator, this.requestTranslator));

		this.getProjectItemById = function(_id_){
			if (this.data.length === 0){
				return this.get().then(function(data){
					self.data = data;
					return self.getProjectItemById(_id_);
				});
				
			}
			var item = _.findWhere(this.data, {uuid:_id_});
			if (item) {
				return item;
			} else {
				console.info("The project id " + _id_ + " was NOT found!");
			}
		};

		this.getProjects = function(){
			return this.data;
		};

		this.rename = function(data){
			var obj = (_.pick(data, 'name', 'description', 'uuid'));
			if (typeof obj.description === "undefined"){
				obj.description = "";
			}
			this.put(obj);
		};

		this.getProjectIdByScenarioId = function(scenarioId){
			var params = {params: {scenarioId: scenarioId}};
			return this.resource.get({}, params).then(function(response){
				return response[0];
			});
		};

		this.getMasterProject = function() {
			if(self.data.length < 1) {
				return this.get().then(function(projects) {
					self.masterProject = findMasterProject(projects);
					return self.masterProject;
				});
			} else {
				var deferred = self.resource._q.defer();
				if(!self.masterProject) {
					self.masterProject = findMasterProject(self.data);
					deferred.resolve(self.masterProject);
					return deferred.promise;
				} else {
					deferred.resolve(self.masterProject);
					return deferred.promise;
				}
			}
		};

		$rootScope.$on(EVENTS.renameProject, function($event, data){
			self.rename(data);
		});

  }]);

'use strict';

angular.module('ThreeSixtyOneView.services')
  .factory('ReportsModel', ["$location", "Resource", "CONFIG", "ServerService", function ReportsModel($location, Resource, CONFIG, ServerService) {
	var resource = new Resource(ServerService.get($location.host())  + CONFIG.application.api.reports),
		transformResponse = function(data) {
			var reportTree = [];

			_.each(data.cells, function(cell, cellIndex) {
				_.each(cell, function(row) {
					if(!!row[0].key.value.coordinates.measure) {
						reportTree[cellIndex] = reportTree[cellIndex] || {};
						reportTree[cellIndex][row[0].key.value.coordinates.measure.label] = reportTree[cellIndex][row[0].key.value.coordinates.measure.label] || {};
						reportTree[cellIndex][row[0].key.value.coordinates.measure.label].value = row[0].value.value;
						reportTree[cellIndex][row[0].key.value.coordinates.measure.label].currency = row[0].format.currency;
					} else {
						_.each(row[0].key.value.coordinates.rowAddresses[0].cellValue.specification.members, function(member) {
							reportTree[cellIndex] = reportTree[cellIndex] || {};
							reportTree[cellIndex][member.label] = reportTree[cellIndex][member.label] || {};
							reportTree[cellIndex][member.label].value = row[0].value.value;
							reportTree[cellIndex][member.label].currency = row[0].format.currency;
						});
					}
				});
			});

			return reportTree;
		};

	return {
        config: {
            transformResponse: function(data){ return transformResponse(JSON.parse(data));},
            transformRequest: function(data){ return JSON.stringify(data);}
        },
		resource: resource
	};
}]);

'use strict';

angular.module('ThreeSixtyOneView.services')
  .service('ReportsService', ["Model", "ReportsModel", function ImportService(Model, ReportsModel) {
        var MyReportsModel, myReports;

        MyReportsModel = new Model();
        angular.extend(this, MyReportsModel.prototype);
        myReports = new MyReportsModel(ReportsModel);
        angular.extend(this, myReports);

        this.getSummary = function(elementId, viewId){
            return this.resource.get({elementId: elementId, viewId: viewId}, this.config, '').then(function(response){
                return response;
            });
        };
}]);

/* global angular, _ */
/* jshint unused: false */

'use strict';

angular.module('ThreeSixtyOneView.services').factory('ScenarioModel', ["$location", "$rootScope", "$timeout", "Resource", "CONFIG", "ServerService", "EVENTS", function($location, $rootScope, $timeout, Resource, CONFIG, ServerService, EVENTS){
    var resource = new Resource(ServerService.get($location.host()) + CONFIG.application.api.scenarios),
    responseTranslator = CONFIG.application.models.ScenarioModel.responseTranslator,
    requestTranslator = CONFIG.application.models.ScenarioModel.requestTranslator,
    config = {};

    // surface data for unit tests
    this.resource = resource;
    this.config = config;

    return {
        responseTranslator: responseTranslator,
        requestTranslator: requestTranslator,
        resource: resource,
        planOfRecordCreating: false,
        data: [],
        create: function(projectUuid, scenario){
            var self = this;
            if(scenario.isPlanOfRecord) {
                this.planOfRecordCreating = true;
            }
            return resource.create(scenario, this.config, {id: projectUuid}).then(function(response){
                if(scenario.isPlanOfRecord) {
                    self.planOfRecordCreating = false;
                }
                return response;
            });
        },
        put: function(scenario, params, additionalPath){
            var self = this;
            return resource.put(scenario, this.config, params, additionalPath).then(function(response){
                var index = _.indexOf(self.data, _.findWhere(self.data, {id: response.id}));
                self.data.splice(index, 1, response);
                $timeout(function(){
                    $rootScope.$broadcast(EVENTS.updateProjects, {
                        data: self.data,
                        item: response,
                        original: scenario
                    });
                });
            });
        }
    };
}]);


/* global _ */
/*jshint unused:false */

'use strict';

angular.module('ThreeSixtyOneView.services')
	.service('ScenarioService', ["$q", "$rootScope", "ScenarioModel", "ProjectsService", "CONFIG", "EVENTS", "Model", function ($q, $rootScope, ScenarioModel, ProjectsService, CONFIG, EVENTS, Model) {
		var MyScenarioModel, myScenarios, self = this;

		MyScenarioModel = new Model();
        angular.extend(this, MyScenarioModel.prototype);
        myScenarios = new MyScenarioModel(ScenarioModel);
        angular.extend(this, myScenarios);

        this.setConfig(this.makeConfig(this, this.responseTranslator, this.requestTranslator));

		this.myScenarios = myScenarios;

		this.get = function (projectId){
			return this.resource.get({"id": projectId}, this.config).then(function(response){
				self.data = response;
				return response;
			});
		};

		this.find = function(scenarios, id){
			return _.find(scenarios, function(scenario) {
				return scenario.id === parseInt(id, 10);
			});
		};

		this.rename = function(scenario, projectId){
			var additionalPath = "name";
			return this.put(scenario, {id: projectId}, additionalPath).then(function(response){
				return response;
			});
		};

		this.edit = function(scenario, projectId){
			var additionalPath = "description";
			return this.put(scenario, {id: projectId}, additionalPath).then(function(response){
				return response;
			});
		};

		this.getProjectIdByScenarioId = function(scenarioId){
			return ProjectsService.getProjectIdByScenarioId(scenarioId).then(function(response){
				return response;
			});
		};

		this.getAll = function(){
			var projects = ProjectsService.getProjects(),
			promises = [],
			ids = [],
			results = [];

			angular.forEach(projects, function(v,k,o){
				ids.push(_.pick(v, 'uuid', 'name', 'isMaster'));
			});

			angular.forEach(ids, function(v,k,o){
				promises.push({name: v.name, isMaster: v.isMaster, promise: this.get(v.uuid)});
			}, this);

			return $q.all(_.pluck(promises, "promise")).then(function(response){
				angular.forEach(response, function(v,k,o){
					if (v.length){
						results.push({name:promises[k].name, isMaster: promises[k].isMaster, data: v});
					}
				});
				return results;
			});
		};

		this.isPlanOfRecordCreating = function() {
			return this.planOfRecordCreating;
		};

		this.setModelingTime = function(projectId, scenario) {
			var additionalPath = 'modellingTime';
			return this.resource.post(scenario, {}, {id: projectId}, additionalPath).then(function(response) {
				return response;
			});
		};

	}]);

angular.module('ThreeSixtyOneView').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/directives/add_dimension_button.tpl.html',
    "<div class=\" draggable-item dimension-add-button dropdown\">\n" +
    "\t<div class=\"add-label clickable dropdown-toggle\"><icon type=\"plus-square\"></icon>Add</div>\n" +
    "\t<div ng-include src=\"'views/includes/dimensions_pop_menu.tpl.html'\" class=\"dropdown-menu\"></div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/dimension_filter.tpl.html',
    "<div class=\"filter-category clickable\" ng-click=\"callAction(dimension)\">\n" +
    "\t<span title=\"{{getFormattedLabels(categorizedValues.label)}}\">\n" +
    "\t\t<div class=\"filter-label\">\n" +
    "\t\t\t{{dimension.label}}\n" +
    "\t\t\t<span class=\"filter-stats\">({{categorizedValues.selected}}/{{categorizedValues.total}}):</span>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"filter-values text-holder\" ng-show=\"allValuesSelected(categorizedValues)\">\n" +
    "\t\t\t{{getFormattedLabels(categorizedValues.label)}}\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"filter-values text-holder\" ng-hide=\"allValuesSelected(categorizedValues)\">\n" +
    "\t\t\tAll\n" +
    "\t\t</div>\n" +
    "\t</span>\n" +
    "</div>\n"
  );


  $templateCache.put('views/directives/dimension_filter_list.tpl.html',
    "<div class=\"filter-category-list clickable\" ng-click=\"callAction(dimension)\">\n" +
    "\t<span title=\"{{getFormattedLabels(categorizedValues.label)}}\">\n" +
    "\t\t<div class=\"filter-label\">\n" +
    "\t\t\t{{dimension.label}}\n" +
    "\t\t\t<span class=\"filter-stats\">({{categorizedValues.selected}}/{{categorizedValues.total}}):</span>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"filter-values text-holder\" ng-show=\"allValuesSelected(categorizedValues)\">\n" +
    "\t\t\t{{getFormattedLabels(categorizedValues.label)}}\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"filter-values text-holder\" ng-hide=\"allValuesSelected(categorizedValues)\">\n" +
    "\t\t\tAll\n" +
    "\t\t</div>\n" +
    "\t</span>\n" +
    "</div>\n"
  );


  $templateCache.put('views/directives/draggable_dimension.tpl.html',
    "<div class=\"draggable-item dropdown\" data-as-sortable-item ng-class=\"{locked: !!lockedDimensions[item.level.label]}\">\n" +
    "\t<div data-as-sortable-item-handle>\n" +
    "\t\t<span class=\"drag-handle\" title=\"Reorder\"><icon type=\"reorder\"></icon></span>\n" +
    "\t\t<span class=\"dropdown-toggle clickable dimension-label\" ng-click=\"clickedItem = item.level.label\">{{item.level.label}}</span>\n" +
    "\t\t<span ng-hide=\"!!lockedDimensions[item.level.label]\" class=\"action-icon clickable\" title=\"Remove\" ng-click=\"delete($index)\"><icon type=\"remove\"></icon></span>\n" +
    "\t\t<span ng-show=\"!!lockedDimensions[item.level.label]\" class=\"action-icon\" title=\"This dimension cannot be removed, because a filter has been applied.\"><icon type=\"lock\"></icon></span>\n" +
    "\t</div>\n" +
    "\t<div ng-if=\"!lockedDimensions[item.level.label]\" ng-include src=\"'views/includes/dimensions_pop_menu.tpl.html'\" class=\"dropdown-menu\"></div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/inline_description.tpl.html',
    "<form class=\"inlineDescription\" name=\"form\" data-ms-id=\"inlineDescription\">\n" +
    "\t<ng-transclude></ng-transclude>\n" +
    "\t<div>\n" +
    "\t\t<span class=\"controls\" ng-show=\"isActive\">\n" +
    "\t\t\t<button class=\"submit btn btn-default btn-xs\" ng-click=\"submit(item)\" ng-disabled=\"(form.$dirty && form.$invalid) || form.$pristine\"><icon type=\"check\"></icon></button>&nbsp;\n" +
    "\t\t\t<button class=\"cancel btn btn-default btn-xs\" ng-click=\"cancel()\"><icon type=\"times\"></icon></button>\n" +
    "\t\t</span>\n" +
    "\t\t<span class='action' ng-click=\"action()\" ng-hide=\"isActive\"><icon type=\"pencil\" cname=\"icon\"></icon></span>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div class=\"noEdit\" ng-hide=\"isActive\">\n" +
    "\t\t<div ng-class=\"{'description':item.description, 'noDescription': !item.description}\" ng-show=\"!isActive\">{{item.description}}</div>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div class=\"edit\" ng-show=\"isActive\">\n" +
    "\t\t<textarea ng-maxlength=\"256\" ng-model=\"item.description\" ng-class=\"{'active': isActive}\" class=\"description inputTarget\"></textarea>\n" +
    "\t</div>\n" +
    "</form>"
  );


  $templateCache.put('views/directives/inline_rename.tpl.html',
    "<form class=\"inlineRename\" name=\"form\" novalidate role=\"form\" data-ms-id='inlineRename'>\n" +
    "\t<span ng-transclude></span>\n" +
    "\n" +
    "\t<span class=\"noEdit\" ng-hide=\"isActive\" ng-click=\"action()\">\n" +
    "\t\t<span class=\"title\">{{item.name}}</span>&nbsp;\n" +
    "\t\t<span class=\"action\"><icon type=\"pencil\" cname=\"icon\"></icon></span>\n" +
    "\t</span>\n" +
    "\n" +
    "    <span class=\"edit\" ng-show=\"isActive\">\n" +
    "    \t<!-- validator -->\n" +
    "    \t<input ng-if=\"comparisonModel\" type=\"text\" class=\"title\" ng-model=\"item.name\" required ng-maxlength=\"256\" validator=\"comparisonModel\" error-type=\"foo\" ng-minlength=\"2\" ng-pattern='inputRestrictions.characterRestrictions' tabindex=\"1\"/>\n" +
    "\n" +
    "    \t<!-- no vaildator -->\n" +
    "    \t<input ng-if=\"!comparisonModel\" type=\"text\" class=\"title\" ng-model=\"item.name\" required ng-maxlength=\"256\" ng-minlength=\"2\" ng-pattern='inputRestrictions.characterRestrictions' tabindex=\"1\"/>\n" +
    "\n" +
    "    \t<button class=\"submit btn btn-default btn-sm\" ng-click=\"submit(item)\" ng-disabled=\"(form.$dirty && form.$invalid) || form.$pristine\"><icon type=\"check\"></icon></button>&nbsp;\n" +
    "    \t<button class=\"cancel btn btn-default btn-sm\" ng-click=\"cancel()\"><icon type=\"times\"></icon></button>\n" +
    "    </span>\n" +
    "</form>"
  );


  $templateCache.put('views/directives/member.tpl.html',
    "<div class=\"list-subcategory\" ng-class=\"{'list-item': !hasMembers()}\">\n" +
    "\t<span class=\"expand-handle clickable\" ng-if=\"hasMembers()\" ng-click=\"toggleCollapse()\">\n" +
    "\t\t<icon type=\"caret-right\" cname=\"{{setToggleStyle(member)}}\"></icon>\n" +
    "\t</span> \n" +
    "\t<label class=\"clickable\" ng-class=\"{'all-selected': isAllSelected(member)}\" ng-click=\"toggleMember(member)\">\n" +
    "\t\t<span ng-switch=\"determineStyle(member)\">\n" +
    "\t\t\t<span ng-switch-when=\"ALL_SELECTED\"> <!-- all selected -->\n" +
    "\t\t\t\t<icon type=\"check-square\"></icon>\n" +
    "\t\t\t</span>\n" +
    "\t\t\t<span ng-switch-when=\"NOT_SELECTED\"> <!-- not selected -->\n" +
    "\t\t\t\t<icon type=\"square-o\"></icon>\n" +
    "\t\t\t</span>\n" +
    "\t\t\t<span ng-switch-default> <!-- indeterminent -->\n" +
    "\t\t\t\t<icon type=\"minus-square\"></icon>\n" +
    "\t\t\t</span> \n" +
    "\t\t</span>\n" +
    "\t\t<span>{{member.label}}</span> \n" +
    "\t\t<span ng-if=\"hasMembers()\">({{outputSelectedOverTotal(member)}})</span>\n" +
    "\t</label>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/ms_dropdown.tpl.html',
    "<div class=\"ms-dropdown\" id=\"{{id}}\">\n" +
    "\t<h6 class=\"ms-label\" ng-class=\"{active: DropdownService.isActive(id)}\" data-ms-id=\"{{id}}\">\n" +
    "\t\t<span ng-click=\"select(selectedItem)\" class=\"status select\">{{selectedItem.label}}</span>&nbsp;\n" +
    "\t\t<span class=\"toggle\" ng-click=\"toggle()\" data-ms-id=\"column_2SortOptions\"><icon type=\"caret-down\"></icon></span>\n" +
    "\t</h6>\n" +
    "\t<ul class=\"ms-select-list dropdownshadow hide\">\n" +
    "\t\t<li class=\"list-label\">Sort Order</li>\n" +
    "\t\t<ul>\n" +
    "\t\t\t<li class=\"ms-item selectSort\" ng-class=\"{disabled:reverse}\" ng-click=\"select(selectedItem)\" data-ms-id=\"descending\"><icon type=\"check\" cname=\"ms-ok\"></icon>Descending</li>\n" +
    "\t\t\t<li class=\"ms-item selectSort\" ng-class=\"{disabled:!reverse}\" ng-click=\"select(selectedItem)\" data-ms-id=\"ascending\"><icon type=\"check\" cname=\"ms-ok\"></icon>Ascending</li>\n" +
    "\t\t</ul>\n" +
    "\t\t<li class=\"list-label\">Switch  Column</li>\n" +
    "\t\t<ul>\n" +
    "\t\t\t<li class=\"ms-item selectSort\" ng-repeat=\"item in items\" ng-class=\"{disabled:item.label === selectedItem.label}\" ng-click=\"selectSort(item)\" data-ms-id=\"{{item.label}}\"><icon type=\"check\" cname=\"ms-ok\"></icon>{{item.label}}</li>\n" +
    "\t\t</ul>\n" +
    "\t</ul>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/ms_filter_input.tpl.html',
    "<div class=\"input-holder\">\n" +
    "\t<icon type=\"filter\"></icon>\n" +
    "\t<input type=\"text\" class=\"search-input\" ng-model=\"SortAndFilterService.searchText\" ng-change=\"SortAndFilterService.filter()\" placeholder=\"Filter List\" ng-maxlength=\"1000\" />&nbsp;\n" +
    "</div>"
  );


  $templateCache.put('views/directives/ms_kpi_dimension_card.tpl.html',
    "<div class=\"dimensionCard kpiDimensionCard\">\n" +
    "    <div class=\"dimensionCheckbox\">\n" +
    "        <div class=\"parent-checkbox ms-checkbox no-select\">\n" +
    "            <label>\n" +
    "                <input type=\"checkbox\" ms-tristates-checkbox child-list=\"allDimensionsData\" property=\"isSelected\" ng-model=\"allDimensionsData.isSelected\"><i></i><span>KPIs</span>\n" +
    "            </label>\n" +
    "        </div>\n" +
    "        <div class=\"row no-margin\">\n" +
    "            <div ng-repeat=\"item in allDimensionsData | orderBy:id\">\n" +
    "                <div class=\"clearfix\" ng-if=\"$index % 3 == 0\"></div>\n" +
    "                <div class=\"col-md-4 children-checkbox ms-checkbox no-select\" ng-class=\"{'disabled': item.required}\">\n" +
    "                    <icon type=\"lock\" class=\"pull-left ms-checkbox-lock\" ng-if=\"item.required\"></icon>\n" +
    "                    <label>\n" +
    "                        <input type=\"checkbox\" ng-model=\"item.isSelected\" ng-disabled=\"item.required\"><i></i><span class=\"capitalized\">{{item.label}}</span>\n" +
    "                    </label>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/ms_standard_dimension_card.tpl.html',
    "<div class=\"dimensionCard standardDimensionCard\" ng-class=\"{fixedHeight: templateType !== 'Action'}\">\n" +
    "    <div class=\"dimensionCheckbox\">\n" +
    "        <div class=\"parent-checkbox ms-checkbox no-select\" ng-class=\"{'disabled': isMeasure(dimensionSchema)}\">\n" +
    "            <icon type=\"lock\" class=\"pull-left ms-checkbox-lock\" ng-if=\"isMeasure(dimensionSchema)\"></icon>\n" +
    "            <label>\n" +
    "                <input type=\"checkbox\" ms-tristates-checkbox child-list=\"dimensionSchema.members\" property=\"isSelected\" ng-model=\"dimensionSchema.isSelected\" ng-disabled=\"isMeasure(dimensionSchema)\"><i></i><span class=\"capitalized\">{{dimensionSchema.label}}</span>\n" +
    "            </label>\n" +
    "        </div>\n" +
    "        <div class=\"children-checkbox ms-checkbox no-select\" ng-repeat=\"item in dimensionSchema.members\" ng-if=\"templateType !== 'Action'\" ng-class=\"{'disabled': isEmpty(item, dimensionSchema)}\">\n" +
    "            <icon type=\"lock\" class=\"pull-left ms-checkbox-lock\" ng-if=\"isEmpty(item, dimensionSchema)\"></icon>\n" +
    "            <label>\n" +
    "                <input type=\"checkbox\" ng-model=\"item.isSelected\" ng-disabled=\"isEmpty(item, dimensionSchema)\"><i></i><span class=\"capitalized\">{{item.label}}</span>\n" +
    "            </label>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"dimensionFilter hide-overflow\" ng-if=\"dimensionSchema.isSelected\">\n" +
    "        <span title=\"{{getFormattedLabel(categorizedData)}}\" ng-click=\"filtersModal(dimensionData)\">\n" +
    "            <icon type=\"filter\"></icon>\n" +
    "            <span>{{getFormattedLabel(categorizedData)}}</span>\n" +
    "        </span>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/ng-performance.tpl.html',
    "<div>\n" +
    "  <style>\n" +
    "    #perfStats {\n" +
    "      position: fixed;\n" +
    "      right: 0;\n" +
    "      bottom: 15px;\n" +
    "      z-index: 100000;\n" +
    "      background-color: rgba(250, 249, 244, 0.97);\n" +
    "      border: 3px solid #843376;\n" +
    "      border-right: none;\n" +
    "      border-radius: 5px 0 0 5px;\n" +
    "      box-shadow: 0 1px 4px black;\n" +
    "      padding: 0 15px 15px;\n" +
    "      font-size: 0.65em;\n" +
    "    }\n" +
    "    #perfStats h3 {\n" +
    "      margin-bottom: 0;\n" +
    "    }\n" +
    "    #perfStats td:last-child {\n" +
    "      text-align: right;\n" +
    "    }\n" +
    "  </style>\n" +
    "  <div id=\"perfStats\">\n" +
    "    <div id=\"perfStatsPanel\">\n" +
    "      <h3>ANGULAR STATS</h3>\n" +
    "      <table class=\"table table-condensed\">\n" +
    "        <tbody>\n" +
    "        <tr>\n" +
    "          <td>Total Scopes:</td>\n" +
    "          <td><span id=\"scopes\">-</span></td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "          <td>Total Watchers:</td>\n" +
    "          <td><span id=\"watchers\">-</span></td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "          <td>Dirty Checks:</td>\n" +
    "          <td><span id=\"dirty-checks\">-</span></td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "          <td>Digest Cycles:</td>\n" +
    "          <td><span id=\"digest-cycles\">-</span></td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "          <td>Digest Cycle (last):</td>\n" +
    "          <td>\n" +
    "            <span id=\"digest-ms\">-</span> ms<br>\n" +
    "            <span id=\"digest-fps\">-</span> FPS\n" +
    "          </td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "          <td>Digest Cycle (avg):</td>\n" +
    "          <td>\n" +
    "            <span id=\"avg-digest-ms\">-</span> ms<br>\n" +
    "            <span id=\"avg-digest-fps\">-</span> FPS\n" +
    "          </td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "          <td>Digest Cycle (max):</td>\n" +
    "          <td>\n" +
    "            <span id=\"max-digest-ms\">-</span> ms<br>\n" +
    "            <span id=\"max-digest-fps\">-</span> FPS\n" +
    "          </td>\n" +
    "        </tr>\n" +
    "        </tbody>\n" +
    "      </table>\n" +
    "\n" +
    "      <h3>PAGELOAD STATS</h3>\n" +
    "      <table class=\"table table-condensed\">\n" +
    "        <tbody>\n" +
    "        <tr>\n" +
    "          <td>Head Load:</td>\n" +
    "          <td><span id=\"head-load\">-</span> ms</td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "          <td>Body Load:</td>\n" +
    "          <td><span id=\"body-load\">-</span> ms</td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "          <td>Footer Load:</td>\n" +
    "          <td><span id=\"footer-load\">-</span> ms</td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "          <td>Vendor Script Load:</td>\n" +
    "          <td><span id=\"vendor-load\">-</span> ms</td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "          <td>App Load:</td>\n" +
    "          <td><span id=\"app-load\">-</span> ms</td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "          <td>Metrics Load:</td>\n" +
    "          <td><span id=\"metrics-load\">-</span> ms</td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "          <td>Time To End-of-Page:</td>\n" +
    "          <td><span id=\"time-to-eop\">-</span> ms</td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "          <td>Time To Angular:</td>\n" +
    "          <td><span id=\"time-to-ng\">-</span> ms</td>\n" +
    "        </tr>\n" +
    "        </tbody>\n" +
    "      </table>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "\n"
  );


  $templateCache.put('views/directives/scenario_templates_navigation.tpl.html',
    "<div class=\"scenarioTemplatesNavigation\">\n" +
    "\t<div class=\"col-md-3 left-column\">\n" +
    "\t\t<div class=\"product-banner {{templateType.label}}\">\n" +
    "\t\t\t<div class=\"ms-logo\"></div>\n" +
    "\t\t\t&nbsp;{{templateType.label}}\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"template-steps-header\">\n" +
    "\t\t\tCreate a Scenario Template\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"template-steps\">\n" +
    "\t\t\t<ul>\n" +
    "\t\t\t\t<li ng-repeat=\"view in views\">\n" +
    "\t\t\t\t\t<span class=\"currentView\" ng-if=\"isCurrentView($index)\">\n" +
    "\t\t\t\t\t\t<span class=\"icon-stack\">\n" +
    "\t\t\t\t\t\t\t<icon type=\"circle\"></icon>\n" +
    "\t\t\t\t\t\t\t<icon type=\"circle-o\"></icon>\n" +
    "\t\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t\t&nbsp;{{view.label}}\n" +
    "\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t<span ng-if=\"!isCurrentView($index)\">\n" +
    "\t\t\t\t\t\t<icon ng-if=\"$index > currentViewIndex\" type=\"circle-o\"></icon>\n" +
    "\t\t\t\t\t\t<icon ng-if=\"$index < currentViewIndex\" type=\"circle\"></icon>\n" +
    "\t\t\t\t\t\t&nbsp;{{view.label}}\n" +
    "\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t<div ng-if=\"!view.buttonLabel\" class=\"pipe-line\">|</div>\n" +
    "\t\t\t\t</li>\n" +
    "\t\t\t</ul>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"col-md-9 right-column\">\n" +
    "\t\t<div class=\"content-container\" ng-transclude></div>\n" +
    "\t\t<div class=\"button-container\">\n" +
    "\t\t\t<ms-button type=\"cancel\" label=\"Cancel\" action=\"dismiss()\"></ms-button>\n" +
    "\t\t\t<span class=\"right\">\n" +
    "\t\t\t\t<ms-button type=\"cancel\" label=\"Back\" action=\"backward()\" ng-disabled=\"isDisabled()\"></ms-button>\n" +
    "\t\t\t\t&nbsp;\n" +
    "\t\t\t\t<ms-button type=\"submit\" label=\"{{label}}\" action=\"forward()\" ng-disabled=\"isDisabled(DIRECTION)\"></ms-button>\n" +
    "\t\t\t\t<span ng-show=\"!dimensionsIsLoaded\" class=\"loaderHolder\">\n" +
    "\t\t\t\t\t<span class=\"loading\"></span>Loading Dimensions\n" +
    "\t\t\t\t</span>\n" +
    "\t\t\t</span>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/sortable_columns.tpl.html',
    "<div ng-switch on=\"displayBy\" class=\"text-holder\"> \n" +
    "\t<span ng-switch-when=\"Last Modified\">\n" +
    "\t\t<span ng-if=\"!test\">{{::item.auditInfo.lastUpdatedOn | timeago}}</span>\n" +
    "\t\t<span ng-if=\"test\">{{::item.auditInfo.lastUpdatedOn}}</span>\n" +
    "\t</span> \n" +
    "\t<span ng-switch-when=\"Modified By\">{{::item.auditInfo.lastUpdatedBy.name}}</span> \n" +
    "\t<span ng-switch-when=\"Type\">{{::item.template.type}}</span> \n" +
    "\t<span ng-switch-when=\"Creator\">{{::item.auditInfo.createdBy.name}}</span> \n" +
    "\t<span ng-switch-when=\"Created Date\">\n" +
    "\t\t<span ng-if=\"!test\">{{::item.auditInfo.createdOn | date: 'longDate'}}</span>\n" +
    "\t\t<span ng-if=\"test\">{{::item.auditInfo.createdOn}}</span>\n" +
    "\t</span> \n" +
    "\t<span ng-switch-default>FAIL</span> \n" +
    "</div>"
  );


  $templateCache.put('views/directives/sorting_options.tpl.html',
    "<div data-ms-id=\"{{id}}\" class=\"{{label | normalize}} heading\" ng-class=\"{'active': SortAndFilterService.isActive(value)}\">\n" +
    "\t<a ng-click=\"sort($event, value)\" ng-bind=\"label\"></a>&nbsp;\n" +
    "</div> "
  );


  $templateCache.put('views/modal/filter_selection.tpl.html',
    "<div data-ms-id=\"filterModal\">\n" +
    "\t<div class=\"header\">\n" +
    "\t\t<h4 class=\"title\">Filters</h4>\n" +
    "\t</div>\n" +
    "\t<div class=\"body\">\n" +
    "\t\t<div class=\"side-menu\">\n" +
    "\t\t\t<div class=\"menu-item clickable\" ng-repeat=\"dimension in getDimensions()\" ng-click=\"chooseFilter(dimension, $index, false)\" ng-class=\"{active: dimension.label == selectedFilter.dimension.label}\">\n" +
    "\t\t\t\t<div>{{dimension.label}}\n" +
    "\t\t\t\t\t<span>({{categorizedValue[$index].selected}}/{{categorizedValue[$index].total}})</span>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div ng-show=\"allFiltersSelected(categorizedValue[$index])\" class=\"values text-holder\" tooltip-placement=\"bottom\" tooltip=\"{{getValuesList(categorizedValue[$index])}}\">{{getValuesList(categorizedValue[$index])}}</div>\n" +
    "\t\t\t\t<div ng-hide=\"allFiltersSelected(categorizedValue[$index])\" class=\"values text-holder\" tooltip-placement=\"bottom\" tooltip=\"{{getValuesList(categorizedValue[$index])}}\">All</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"content\">\n" +
    "\t\t\t<div class=\"alert\" role=\"alert\" ng-class=\"{transparent: !noFilterSelected}\">\n" +
    "\t\t\t\t<div>\n" +
    "\t\t\t\t\t<icon type=\"warning\"></icon>Please select at least one item from the following filter<span ng-if=\"emptyFiltersList.length > 1\">s</span>\n" +
    "\t\t\t\t\t: <span ng-repeat=\"missing in getEmptyFiltersList()\">\n" +
    "\t\t\t\t\t\t<span class=\"underline clickable\" ng-click=\"chooseFilterByName(missing)\">{{missing}}</span>\n" +
    "\t\t\t\t\t\t<span ng-if=\"!$last\">, </span>\n" +
    "\t\t\t\t\t</span>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"main-content\">\n" +
    "\t\t\t\t<div class=\"toolbar\">\n" +
    "\t\t\t\t\t<div class=\"dropdown-box\">\n" +
    "\t\t\t\t\t\t<div class=\"dropdown\">\n" +
    "\t\t\t\t\t\t\t<div class=\"dropdown-toggle\" ng-class=\"{disabled: isDimensionSignleMembered(selectedFilter.dimension), clickable: !isDimensionSignleMembered(selectedFilter.dimension)}\">\n" +
    "\t\t\t\t\t\t\t\t{{selectedFilter.level.label}}<icon ng-if=\"selectedFilter.dimension.members.length > 1\" type=\"caret-down\"></icon>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"dropdown-menu clickable\" ms-link-group radio=\"true\" selected-item=\"{{selectedFilter.level.label}}\">\n" +
    "\t\t\t\t\t\t\t\t<div ng-repeat=\"item in selectedFilter.dimension.members\" class=\"menu-item\" ms-link=\"{{item.label}}\" ng-click=\"chooseFilter(selectedFilter.dimension, selectedDimensionIndex, $index)\">\n" +
    "\t\t\t\t\t\t\t\t\t{{item.label}}\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"search-box\" ng-show=\"selectedFilter.level\">\n" +
    "\t\t\t\t\t\t<icon type=\"filter\"></icon>\n" +
    "\t\t\t\t\t\t<input type=\"text\" placeholder=\"Filter List\" ng-model=\"filterSearch.label\" ng-keyup=\"searchFilters(selectedFilter.level, filterSearch)\">\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"selection-tools\">\n" +
    "\t\t\t\t\t<div class=\"dropdown\">\n" +
    "\t\t\t\t\t\t<div class=\"static-button clickable\" ng-hide=\"filterCount.total === 0\">\n" +
    "\t\t\t\t\t\t\t<div class=\"selection-toggle\" ng-show=\"filterCount.selected === 0\" ng-click=\"selectFilters(selectedFilter.dimension.label, true, true);\"><icon type=\"square-o\"></icon></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"selection-toggle blue\" ng-show=\"filterCount.selected === filterCount.total\" ng-click=\"selectFilters(selectedFilter.dimension.label, true, false);\"><icon type=\"check-square\"></icon></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"selection-toggle blue\" ng-show=\"filterCount.selected % filterCount.total > 0.01\" ng-click=\"selectFilters(selectedFilter.dimension.label, true, true);\"><icon type=\"minus-square\"></icon></div>\n" +
    "\t\t\t\t\t\t\t<div class=\"dropdown-toggle\"><icon type=\"caret-down\"></icon></div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"dropdown-menu\">\n" +
    "\t\t\t\t\t\t\t<div class=\"menu-item\" ng-click=\"selectFilters(selectedFilter.dimension.label, true, true);\">Select All Visible</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"menu-item\" ng-click=\"selectFilters(selectedFilter.dimension.label, true, false);\">Deselect All Visible</div>\n" +
    "\t\t\t\t\t\t\t<div class=\"menu-item\" ng-click=\"selectFilters(selectedFilter.dimension.label, false, false);\">Deselect All Not Visible</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"stat\" ng-hide=\"filterCount.total === 0\">\n" +
    "\t\t\t\t\t\t({{filterCount.selected}}/{{filterCount.total}})\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"list-box\" style=\"position: relative;\">\n" +
    "\t\t\t\t\t<div class=\"list\" ng-if=\"searchResults.members && multiLevelList()\">\n" +
    "\t\t\t\t\t\t<member ng-repeat=\"member in searchResults.members | orderBy:'label'\" member=\"member\" filters=\"addedFilter\" category=\"{label: selectedFilter.dimension.label}\"  expanded=\"expanded\" expandall=\"filterSearch\" updater=\"categorizeValuesCount(index, addedFilters)\" dimensionindex=\"selectedDimensionIndex\"></member>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"list\" ng-if=\"searchResults.members && !multiLevelList()\" virtual-repeat=\"searchResults.members\" multi-level=\"multiLevelList\">\n" +
    "\t\t\t\t\t\t<member ng-repeat=\"member in virtualRepeat\" member=\"member\" filters=\"addedFilter\" category=\"{label: selectedFilter.dimension.label}\"  expanded=\"expanded\" expandall=\"filterSearch\" updater=\"categorizeValuesCount(index, addedFilters)\" dimensionindex=\"selectedDimensionIndex\"></member>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"action-buttons\">\n" +
    "\t\t\t\t<ms-button type=\"cancel\" action=\"cancel()\" label=\"Cancel\" data-dismiss=\"modal\"></ms-button>\n" +
    "\t\t\t\t<ms-button type=\"submit\" action=\"submit()\" label=\"Apply\" data-dismiss=\"modal\" ng-disabled=\"noFilterSelected\"></ms-button>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modal/ms_list_lightbox.tpl.html',
    "<div data-ms-id=\"{{testHandleName}}\">\n" +
    "\t<div class=\"header\">\n" +
    "\t\t<h4 class=\"title\">{{title}}</h4>\n" +
    "\t\t<h3 class=\"subtitle\">{{subtitle}}</h3>\n" +
    "\t</div>\n" +
    "\t<div class=\"body\">\n" +
    "\t\t<div class=\"content\">\n" +
    "\t\t\t<div class=\"main-content\">\n" +
    "\t\t\t\t<div class=\"toolbar\">\n" +
    "\t\t\t\t\t<div class=\"dropdown-box\" ng-hide=\"isDropdownHidden\">\n" +
    "\t\t\t\t\t\t<div class=\"dropdown ng-hide\">\n" +
    "\t\t\t\t\t\t\t<div class=\"dropdown-toggle clickable\">{{elementTypeItems[currentElementType]}}<icon type=\"caret-down\"></icon></div>\n" +
    "\t\t\t\t\t\t\t<ul class=\"dropdown-menu\" ms-link-group selected-item=\"{{selectedScenarioElement.id}}\" radio=\"true\">\n" +
    "\t\t\t\t\t\t\t\t<li ng-repeat=\"item in elementTypeItems\" ng-click=\"changeElementType($index)\" class=\"menu-item\" ms-link=\"{{$index}}\">{{item}}</li>\n" +
    "\t\t\t\t\t\t\t</ul>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"search-box\" ng-hide=\"isSearchHidden\">\n" +
    "\t\t\t\t\t\t<icon type=\"search\"></icon>\n" +
    "\t\t\t\t\t\t<input type=\"text\" ng-model=\"searchTerm.name\" placeholder=\"Search\">\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"list-box\">\n" +
    "\t\t\t\t\t<div ng-repeat=\"item in getList() | filter:searchTerm | orderBy:'auditInfo[lastUpdatedOn]':true\" class=\"item clickable\" ng-class=\"{'selected': item.id === currentItem.id}\" ng-click=\"currentItem.id = item.id\">\n" +
    "\t\t\t\t\t\t<div class=\"item-name text-holder\">\n" +
    "\t\t\t\t\t\t\t<icon type=\"circle-o\" cname=\"circle\"></icon><icon type=\"dot-circle-o\" cname=\"dot-circle\"></icon>{{item.name}}\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"item-meta\">\n" +
    "\t\t\t\t\t\t\t<span ng-if=\"e2e\" class=\"item-date\">{{item.auditInfo[dateProperty]}}</span>\n" +
    "\t\t\t\t\t\t\t<span ng-if=\"!e2e\" class=\"item-date\">{{item.auditInfo[dateProperty] | timeago}}</span>\n" +
    "\t\t\t\t\t\t\t<span class=\"item-owner\">{{item.auditInfo[ownerProperty].name}}</span>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div class=\"item-description\">{{item.description}}</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div ng-hide=\"isListLoaded\" class=\"status-message\"><icon type=\"refresh\" class=\"fa-spin\"></icon>Loading data ...</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"action-buttons\">\n" +
    "\t\t\t<ms-button type=\"cancel\" action=\"cancel()\" label=\"{{cancelButtonLabel}}\" data-dismiss=\"modal\"></ms-button>\n" +
    "\t\t\t<ms-button type=\"submit\" action=\"submit()\" label=\"{{submitButtonLabel}}\" data-dismiss=\"modal\"></ms-button>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modal/scenario_analysis_element_copy.tpl.html',
    "<div data-ms-id=\"analysisElementCopy\">\n" +
    "\t<div class=\"header\">\n" +
    "\t\t<h4 class=\"title\">{{selectedScenarioElement.cubeMeta.label}}</h4>\n" +
    "\t\t<h3 class=\"subtitle\">Copy &amp; Replace</h3>\n" +
    "\t</div>\n" +
    "\t<div class=\"body\">\n" +
    "\t\t<div class=\"content\">\n" +
    "\t\t\t<form name=\"elementCopy\" class=\"main-content\" novalidate>\n" +
    "\t\t\t\t<div class=\"name\">\n" +
    "\t\t\t\t\t<label>Name:\n" +
    "\t\t\t\t\t\t<input type=\"text\" name=\"elementName\" placeholder=\"Enter Name\" ng-model=\"newElement.name\" required>\n" +
    "\t\t\t\t\t</label>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"description\">\n" +
    "\t\t\t\t\t<label>Description:\n" +
    "\t\t\t\t\t\t<input type=\"text\" name=\"elementDescription\" placeholder=\"Enter Description\" ng-model=\"newElement.description\" required>\n" +
    "\t\t\t\t\t</label>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</form>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"action-buttons\">\n" +
    "\t\t\t<ms-button type=\"cancel\" action=\"cancel()\" label=\"Cancel\" data-dismiss=\"modal\"></ms-button>\n" +
    "\t\t\t<ms-button type=\"submit\" action=\"submit()\" label=\"Replace\" data-dismiss=\"modal\" ng-disabled=\"elementCopy.$invalid\"></ms-button>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modal/scenario_create.tpl.html',
    "<div data-ms-id=\"scenarioCreateModal\">\n" +
    "\t<div class=\"header\">\n" +
    "\t\t<h4 class=\"title\">Create a Scenario</h4>\n" +
    "\t</div>\n" +
    "\t<div class=\"body\">\n" +
    "\t\t<div class=\"content\">\n" +
    "\t\t\t<form class=\"main-content scenario-create\" name=\"ScenarioCreate\" id=\"ScenarioCreate\" novalidate>\n" +
    "\t\t\t\t<div class=\"inputGroup\" ng-show=\"showFields\">\n" +
    "\t\t\t\t\t<label>Enter Scenario Name\n" +
    "\t\t\t\t\t\t<input type=\"text\" focus placeholder=\"Enter Scenario Name\" required ng-maxlength=\"256\" ng-minlength=\"2\" ng-pattern='inputRestrictions.characterRestrictions' validator=\"isScenarioTitleUnique\" error-type=\"'isNotUnique'\" ng-model=\"scenario.name\" data-ms-id=\"ScenarioCreate.inputName\"/>\n" +
    "\t\t\t\t\t\t<div class=\"alert alert-danger\" role=\"alert\" ng-if=\"ScenarioCreate.$invalid && ScenarioCreate.$dirty\">\n" +
    "\t\t\t\t\t\t\t{{getError(ScenarioCreate.$error)}}\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</label>\n" +
    "\t\t\t\t\t<label>Enter Description (Optional)\n" +
    "\t\t\t\t\t\t<input class=\"description\" type=\"text\" placeholder=\"Enter Scenario description (optional)\" ng-model=\"scenario.description\" ng-maxlength=\"1024\" data-ms-id=\"ScenarioCreate.inputDescription\">\n" +
    "\t\t\t\t\t</label>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div class=\"baseGroup\">\n" +
    "\t\t\t\t\t<label for=\"baseScenario\" ng-click=\"showBaseScenario()\" data-ms-id=\"ScenarioCreate.inputBaseScenario\">Base Scenario\n" +
    "\t\t\t\t\t\t<input type=\"text\" class=\"clickable\" id=\"baseScenario\" ng-model=\"scenario.referenceScenario.name\" readonly>\n" +
    "\t\t\t\t\t\t<icon type=\"folder-open-o\" cname=\"open\"></icon>\n" +
    "\t\t\t\t\t</label>\n" +
    "\n" +
    "\t\t\t\t\t<!-- Begin hidden group -->\n" +
    "\t\t\t\t\t<div class=\"radios\" ng-show=\"!showFields\">\n" +
    "\t\t\t\t\t\t<div class='search-box'>\n" +
    "\t\t\t\t\t\t\t<icon type=\"search\"></icon>\n" +
    "\t\t\t\t\t\t\t<input type=\"text\" id=\"search\" placeholder=\"Search by Name\" ng-model=\"searchText\"/>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t\t<accordion close-others=\"false\">\n" +
    "\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t<accordion-group ng-repeat=\"project in scenarioList | filterProjects: searchText\" is-open=\"project.open\">\n" +
    "\t\t\t\t\t\t\t\t<accordion-heading>{{::project.name}}</accordion-heading>\n" +
    "\t\t\t\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"row\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-1\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t&nbsp;\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-6\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<span><strong>Name</strong></span>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-5\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<span><strong>Type</strong></span>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t<div ng-repeat=\"scenario in getScenarios(project, searchText)\">\n" +
    "\t\t\t\t\t\t\t\t\t<div class=\"row\" ng-click=\"setScenario(scenario)\">\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-1\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<span ng-show=\"showRow(scenario)\"><icon type=\"check-circle\" cname=\"ok-sign\"></icon></span>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-6\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<span class=\"clickable\" data-ms-id=\"scenario-title\">{{::scenario.name}}</span>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t\t<div class=\"col-md-5\">\n" +
    "\t\t\t\t\t\t\t\t\t\t\t<span class=\"clickable\" data-ms-id=\"scenario-type\">{{::scenario.type}}</span>\n" +
    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</accordion-group>\n" +
    "\t\t\t\t\t\t</accordion>\n" +
    "\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<!-- End hidden group -->\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</form>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"action-buttons\" ng-show=\"showFields\">\n" +
    "\t\t\t<ms-button type=\"cancel\" action=\"close()\" label=\"Cancel\" data-ms-id=\"ScenarioCreate.cancel\"></ms-button>\n" +
    "\t\t\t<ms-button type=\"submit\" action=\"submit(scenario)\" label=\"Continue\" ng-disabled=\"ScenarioCreate.$invalid || ScenarioCreate.$pristine || !scenarioList\" data-ms-id=\"ScenarioCreate.submit\"></ms-button>\n" +
    "\t\t\t<span ng-show=\"loadingScenarios\" class=\"loaderHolder\">\n" +
    "\t\t\t\t<span class=\"loading\"></span>Loading scenarios\n" +
    "\t\t\t</span>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"action-buttons\" ng-hide=\"showFields\">\n" +
    "\t\t\t<ms-button type=\"cancel\" action=\"cancel()\" label=\"Cancel\" data-ms-id=\"ScenarioCreate.cancelBaseScenario\"></ms-button>\n" +
    "\t\t\t<ms-button type=\"submit\" action=\"confirm()\" label=\"Select\" data-ms-id=\"ScenarioCreate.confirmBaseScenario\"></ms-button>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modal/scenario_templates.tpl.html',
    "<div class=\"scenarioTemplates row\">\n" +
    "\t<flipbook workflow={{CONFIG.view.ScenarioTemplates.workflow}} type=\"{{templateType.label}}\" template-url=\"views/directives/scenario_templates_navigation.tpl.html\" basePath=\"views/includes/scenario_templates\" submit-callback=\"submit\" cancel-callback=\"cancel\" enable-next=\"{{enableNext}}\">\n" +
    "\t\t\t<ng-include src=\"url\"></ng-include>\n" +
    "\t</flipbook>\n" +
    "</div>\n"
  );


  $templateCache.put('views/modal/select_module.tpl.html',
    "<div class=\"scenarioTemplates light-box\" data-ms-id=\"simpleModal\">\n" +
    "\t<div class=\"header\">\n" +
    "\t\tHello!\n" +
    "\t</div>\n" +
    "\t<div class=\"body\">\n" +
    "\t\t<div class=\"content\">\n" +
    "\t\t\tWhat type of Scenario Template would you like to create?\n" +
    "\t\t</div>\n" +
    "\t\t<form>\n" +
    "\t\t\t<ul class=\"type-buttons\">\n" +
    "\t\t\t\t<li class=\"ms-{{module.name}}\" ng-repeat=\"module in modules\" ng-click=\"select(module)\">\n" +
    "\t\t\t\t\t<input type=\"radio\" id=\"radio{{$index}}\" name=\"selectModule\" />\n" +
    "\t\t\t\t\t<label class=\"animated fadeIn\" for=\"radio{{$index}}\">\n" +
    "\t\t\t\t\t\t{{module.label}}\n" +
    "\t\t\t\t\t</label>\n" +
    "\t\t\t\t</li>\n" +
    "\t\t\t</ul>\n" +
    "\t\t</form>\n" +
    "\t\t<div class=\"form-buttons\">\n" +
    "\t\t\t<ms-button type=\"cancel\" action=\"close($event)\" label=\"Cancel\"></ms-button>\n" +
    "\t\t\t<ms-button type=\"submit\" action=\"submit()\" label=\"START\" data-ms-id=\"modalSubmit\" ng-disabled=\"!isModuleSelected()\"></ms-button>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('views/modal/simple_input.tpl.html',
    "<div data-ms-id=\"simpleModal\">\n" +
    "\t<div class=\"header\">\n" +
    "\t\t<h4 class=\"title\">{{modalProperties.title}}</h4>\n" +
    "\t</div>\n" +
    "\t<div class=\"body\" ui-keypress=\"{13: 'submit(item.name, $event)'}\">\n" +
    "\t\t<div class=\"content\">\n" +
    "\t\t\t<form class=\"main-content\" name=\"nameDialog\" novalidate role=\"form\">\n" +
    "\t\t\t\t<div class=\"form-group input-group-lg\" ng-class=\"{'has-error': nameDialog.$invalid}\">\n" +
    "\t\t\t\t\t<label class=\"control-label\" for=\"inputField\">{{modalProperties.field}}:\n" +
    "\t\t\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"inputField\" ng-model=\"item.name\" focus required ng-maxlength=\"256\" ng-minlength=\"2\" ng-pattern='inputRestrictions.characterRestrictions' validator=\"validator\" error-type=\"errorType\"/>\n" +
    "\t\t\t\t\t</label>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"alert alert-danger\" role=\"alert\" ng-if=\"nameDialog.$invalid && nameDialog.$dirty\">\n" +
    "\t\t\t\t\t{{getError(nameDialog.$error)}}\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</form>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"action-buttons\">\n" +
    "\t\t\t<ms-button type=\"cancel\" action=\"close($event)\" label=\"Cancel\"></ms-button>\n" +
    "\t\t\t<ms-button type=\"submit\" action=\"submit(item.name)\" label=\"{{modalProperties.button}}\" ui-keypress=\"{13: 'submit(item.name, $event)'}\" data-ms-id=\"modalSubmit\" ng-disabled=\"nameDialog.$invalid\"></ms-button>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );

}]);

'use strict';

/**
 * @ngdoc function
 * @name threeSixtOneViewApp.controller:CreaterecommendationCtrl
 * @description
 * # CreaterecommendationCtrl
 * Controller of the threeSixtOneViewApp
 */
angular.module('ThreeSixtyOneView')
.controller('CreateRecommendationCtrl', ['$scope', '$stateParams', '$q', 'EVENTS', 'ScenarioService', 'ProjectsService', 'ManageTemplatesService', 'MetaDataService', 'ManageAnalysisViewsService', 'GotoService',
function ($scope, $stateParams, $q, EVENTS, ScenarioService, ProjectsService, ManageTemplatesService, MetaDataService, ManageAnalysisViewsService, GotoService) {
	var baseScenario,
		masterProject,
		spendCubeId,
		spendDimensions,
		spendView,
		outcomeCubeId,
		outcomeDimensions,
		outcomeSpecificDimensions,
		isSpendCubeLoaded = false,
		isOutcomeCubeLoaded = false,
		drawerSource,

		init = function init() {
			$scope.newRecommendation = {
					name: '',
					description: '',
					goal: {}
				};
			$scope.timeDimension = {};
			$scope.spendDimensions = [];
			$scope.kpis = [];

			// get all scenario for the base scenario functionality
			if(ProjectsService.getProjects().length === 0) {
				ProjectsService.get().then(function() {
					getAllScenarios();
				});
			} else {
				getAllScenarios();
			}
		},
		getAllScenarios = function getAllScenarios() {
			ScenarioService.getAll().then(function(projects) {
				masterProject = getMasterProject(projects);
				baseScenario = masterProject.data[masterProject.data.length  - 1];
				getSpendCube(baseScenario.template.id);
				getOutcomeCube(baseScenario.template.id);
			});
		},
		getMasterProject = function getMasterProject(projects) {
			return _.findWhere(projects, {'isMaster': true});
		},
		getSpendCube = function getSpendCube(templateId) {
			isSpendCubeLoaded = false;

			ManageTemplatesService.getTemplateCubesByType(templateId, 'Spend').then(function(_spendCubeId) {
				spendCubeId = _spendCubeId[0];
				MetaDataService.buildDimensionsTree(_spendCubeId[0]).then(function(_spendDimensions) {
					spendDimensions = _spendDimensions;
					formSpendDimensions(_spendDimensions);

					// kpis list should be formed after both spend and kpi cubes are loaded
					isSpendCubeLoaded = true;
					if(isOutcomeCubeLoaded) {
						formKpiDimensions(outcomeDimensions);
					}
				});
			});
		},
		getOutcomeCube = function getOutcomeCube(templateId) {
			var promises = [];

			isOutcomeCubeLoaded = false;

			// get list of KPIs and their required property
			promises.push(ManageTemplatesService.getAllKpis(templateId));

			ManageTemplatesService.getTemplateCubesByType(templateId, 'Outcome').then(function(_outcomeCubeId) {
				outcomeCubeId = _outcomeCubeId[0];
				promises.push(MetaDataService.buildDimensionsTree(_outcomeCubeId[0]));

				$q.all(promises).then(function(responses) {
					$scope.kpis = responses[0];

					outcomeDimensions = responses[1];

					// kpis list should be formed after both spend and kpi cubes are loaded
					isOutcomeCubeLoaded = true;
					if(isSpendCubeLoaded) {
						formKpiDimensions(outcomeDimensions);
					}
				});

			});
		},
		formSpendDimensions = function formSpendDimensions(_spendDimensions) {
			_spendDimensions.forEach(function(dimension) {
				if(dimension.type === 'TimeDimension') {
					$scope.timeDimension = dimension;
				} else {
					$scope.spendDimensions.push(dimension);
				}
			});

			$scope.$broadcast(EVENTS.dimensionsReady, _spendDimensions);
		},
		formKpiDimensions = function formKpiDimensions(_outcomeDimensions) {
			var spendDimensionIds = _.pluck(spendDimensions, 'id'),
				requiredKpis;

			outcomeSpecificDimensions = [];
			// filter out time, measure, and common standard dimensions with spend cube
			outcomeDimensions.forEach(function(dimension) {
				if(dimension.type === 'StandardDimension' && spendDimensionIds.indexOf(dimension.id) < 0) {
					outcomeSpecificDimensions.push(dimension);
				}
			});

			requiredKpis = $scope.kpis.filter(function(kpi) {
				return kpi.required;
			});

			if(requiredKpis.length > 0) {
				// select one of the required kpis by default
				$scope.newRecommendation.goal.id = requiredKpis[0].id;
				$scope.newRecommendation.goal.name = requiredKpis[0].name;
				$scope.newRecommendation.goal.label = requiredKpis[0].label;
			} else {
				// select the first kpi by default
				$scope.newRecommendation.goal.id = $scope.kpis[0].id;
				$scope.newRecommendation.goal.name = $scope.kpis[0].name;
				$scope.newRecommendation.goal.label = $scope.kpis[0].label;
			}

			$scope.$broadcast(EVENTS.outcomeDimensionsReady, outcomeCubeId, outcomeDimensions, outcomeSpecificDimensions);
		};

	$scope.getBaseScenario = function() {
		return baseScenario;
	};

	$scope.getSpendCubeId = function() {
		return spendCubeId;
	};

	$scope.getOutcomeCubeId = function() {
		return outcomeCubeId;
	};

	$scope.setSpendView = function(view) {
		spendView = view;
	};

	var drawerContent;
	$scope.animation = {slideIn:false}

	$scope.openDrawer = function(which){
		// open drawer
		if (!drawerContent || drawerContent === which || !$scope.animation.slideIn){
			$scope.animation.slideIn = !$scope.animation.slideIn;
		}

		drawerContent = which;

		switch(which){
			case "base": $scope.openCreateRecommendationChooseBaseScenario();break;
			case "assumptions": $scope.openCreateRecommendationAssumptions();break;
			default: $scope.animation.slideIn = !$scope.animation.slideIn
		}
	}

	$scope.openCreateRecommendationChooseBaseScenario = function(){
		GotoService.createRecommendationChooseBaseScenario();
	};

	$scope.openCreateRecommendationAssumptions = function(){
		GotoService.createRecommendationAssumptions();
	};

	$scope.cancel = function() {
		// delete the temporary spend view created
		if(spendView) {
			ManageAnalysisViewsService.deleteView(spendView.id, spendCubeId);
		}

		GotoService.dashboard($stateParams.projectId);
	};

	init();
}]);

'use strict';

/**
 * @ngdoc function
 * @name threeSixtOneViewApp.controller:CreaterecommendationCtrl
 * @description
 * # CreaterecommendationCtrl
 * Controller of the threeSixtOneViewApp
 */
angular.module('ThreeSixtyOneView')
.controller('CreateRecommendationSelectCtrl', ['$scope', '$rootScope', '$q', 'EVENTS', 'PivotMetaService', 'DialogService', 'ManageScenariosService', 'ManageAnalysisViewsService', 'ReportsService',
function ($scope, $rootScope, $q, EVENTS, PivotMetaService, DialogService, ManageScenariosService, ManageAnalysisViewsService, ReportsService) {
	var baseScenario,
		spendCubeId,
		spendDimensions,
		spendElement,
		spendDefaultView,

		init = function init() {
			$scope.totalBudget = 0;
			$scope.viewData = {};
		},
		deleteSpendView = function deleteSpendView(viewId, spendCubeId, spendDimensions) {
			return ManageAnalysisViewsService.deleteView(viewId, spendCubeId).then(function() {
				$scope.viewData = {};
				return setUpSpendView(spendDimensions, spendCubeId);
			});
		},
		setUpSpendView = function setUpSpendView(spendDimensions, spendCubeId) {
			ManageAnalysisViewsService.deleteAllDrafts(spendCubeId);
			return PivotMetaService.createEmptyView(spendDimensions, {id: spendCubeId, label: 'Recommendation ' + Date.now()}, undefined, true).then(function(view) {
				// created view should not be the default view
				view.isDefault = false;
				ManageAnalysisViewsService.defaultView(spendCubeId, view.id, false);

				$scope.viewData = view;

				// set the view in the parent controller for removal upon cancellation of the create recommendation workflow
				$scope.setSpendView(view);

				$scope.addedFilters = PivotMetaService.getAddedFilters($scope.viewData.filters, spendDimensions);
				$scope.membersList = PivotMetaService.generateMembersList(spendDimensions);
				$scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, spendDimensions, $scope.viewData);

				// broadcast the spend view to kpi (define) controller to create the related by view there
				$rootScope.$broadcast(EVENTS.spendViewCreated, view);
				return view;
			});
		},
		getAnalysisElement = function getAnalysisElement(baseScenario, spendCubeId) {
			return ManageScenariosService.getAnalysisElementByScenarioAndCube(baseScenario.id, spendCubeId).then(function(analysisElement) {
				spendElement = analysisElement;
				return spendElement;
			});
		},
		getTotalSpend = function getTotalSpend(baseScenario, spendCubeId, spendDimensions) {
			var promises = [];

			promises.push(getAnalysisElement(baseScenario, spendCubeId));
			// if viewData.id exists, first remove the old view and then create a new one (in case base scenario is changed)
			if($scope.viewData.id) {
				promises.push(deleteSpendView($scope.viewData.id, spendCubeId, spendDimensions));
			} else {
				promises.push(setUpSpendView(spendDimensions, spendCubeId));
			}

			$q.all(promises).then(function(responses) {
				updateTotalSpend(responses[0].id, responses[1].id);
			});
		},
		updateTotalSpend = function updateTotalSpend(analysisElementId, spendViewId) {
			ReportsService.getSummary(analysisElementId, spendViewId).then(function(spendSummary) {
				$scope.totalBudget = spendSummary[0].Spend ? spendSummary[0].Spend.value : spendSummary[0].SPEND.value;
			});
		};
	$scope.getSpendDimensions = function() {
		return spendDimensions;
	};

	$scope.filtersModal = function(category) {
		var filtersModalCallback = function(newFilterData) {
			$scope.addedFilters = newFilterData;
			$scope.viewData.filters = PivotMetaService.updateFilters(spendDimensions, newFilterData, $scope.membersList, $scope.viewData.filters);
			$scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure(newFilterData, spendDimensions, $scope.viewData);
			PivotMetaService.updateView(spendCubeId, $scope.viewData).then(function(view) {
				updateTotalSpend(spendElement.id, $scope.viewData.id);
			});
		};

		DialogService.filtersModal(category, $scope.addedFilters, $scope.viewData.rows.concat($scope.viewData.columns), $scope.spendDimensions, filtersModalCallback);
	};

	$scope.$on(EVENTS.dimensionsReady, function(event, dimensions) {
		spendDimensions = dimensions;
		baseScenario = $scope.getBaseScenario(),
		spendCubeId = $scope.getSpendCubeId();

		getTotalSpend(baseScenario, spendCubeId, dimensions);
	});

	init();
}]);

'use strict';

/**
 * @ngdoc function
 * @name threeSixtOneViewApp.controller:CreaterecommendationCtrl
 * @description
 * # CreaterecommendationCtrl
 * Controller of the threeSixtOneViewApp
 */
angular.module('ThreeSixtyOneView')
.controller('CreateRecommendationDefineCtrl', ['$scope', 'EVENTS', 'DialogService', 'ManageAnalysisViewsService', 'PivotMetaService',
function ($scope, EVENTS, DialogService, ManageAnalysisViewsService, PivotMetaService) {
	var spendView,
		outcomeCubeId,
		outcomeDimensions,
		outcomeSpecificDimensions,
		outcomeView,
		membersList,
		isSpendViewLoaded = false,
		isOutcomeDimensionsLoaded = false,
		init = function init() {
			$scope.categorizedValue = [];
		},
		createOutcomeView = function createOutcomeView(_spendView, _outcomeCubeId, _outcomeDimensions) {
			PivotMetaService.createEmptyView(_outcomeDimensions, {id: _outcomeCubeId, label: 'Recommendation ' + Date.now()}, _spendView.id).then(function(_outcomeView) {
				outcomeView = _outcomeView;

				$scope.addedFilters = PivotMetaService.getAddedFilters(_outcomeView.filters, _outcomeDimensions);
				membersList = PivotMetaService.generateMembersList(_outcomeDimensions);
				$scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure($scope.addedFilters, _outcomeDimensions, _outcomeView);
			});
		};

	$scope.selectKpi = function(kpi) {
		$scope.newRecommendation.goal.id = kpi.id;
		$scope.newRecommendation.goal.name = kpi.name;
		$scope.newRecommendation.goal.label = kpi.label;
	};

	$scope.getOutcomeDimensions = function() {
		return outcomeDimensions;
	};

	$scope.isOutcomeDimensionVisible = function(dimension) {
		if(!outcomeSpecificDimensions) {
			return false;
		}
		return outcomeSpecificDimensions.map(function(_dimension) {return _dimension.id}).indexOf(dimension.id) > -1;
	};

	$scope.filtersModal = function(category) {
		var filtersModalCallback = function(newFilterData) {
			$scope.addedFilters = newFilterData;
			outcomeView.filters = PivotMetaService.updateFilters(outcomeDimensions, newFilterData, membersList, outcomeView.filters);
			$scope.categorizedValue = PivotMetaService.generateCategorizeValueStructure(newFilterData, outcomeDimensions, outcomeView);
		};

		DialogService.filtersModal(category, $scope.addedFilters, outcomeView.rows.concat(outcomeView.columns), outcomeSpecificDimensions, filtersModalCallback);
	};

	$scope.$on(EVENTS.outcomeDimensionsReady, function(event, _outcomeCubeId, _outcomeDimensions, _outcomeSpecificDimensions) {
		// only for strategy scenarios
		if($scope.getBaseScenario().template.type !== 'Strategy') {
			return;
		}

		outcomeCubeId = _outcomeCubeId;
		outcomeDimensions = _outcomeDimensions;
		outcomeSpecificDimensions = _outcomeSpecificDimensions;

		isOutcomeDimensionsLoaded = true;
		if(isSpendViewLoaded) {
			createOutcomeView(spendView, _outcomeCubeId, _outcomeDimensions);
		}
	});

	$scope.$on(EVENTS.spendViewCreated, function(event, _spendView) {
		// only for strategy scenarios
		if($scope.getBaseScenario().template.type !== 'Strategy') {
			return;
		}

		// get the spend view created in the select controller
		spendView = _spendView;

		isSpendViewLoaded = true;
		if(isOutcomeDimensionsLoaded) {
			createOutcomeView(_spendView, outcomeCubeId, outcomeDimensions);
		}
	});

	init();
}]);