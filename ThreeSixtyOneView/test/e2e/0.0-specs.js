var hasClass = function (element, cls) {
		    return element.getAttribute('class').then(function (classes) {
		        return classes.split(' ').indexOf(cls) !== -1;
		    });
		}, 
		dropdown = "//span[@data-ms-id='toggle_column_1']",
		nameField = "//a[@data-ms-id='name-field']",
		nameLabel = "//div[@data-ms-id='name-label']",
		column_1 = "//span[@data-ms-id='select_column_1']",
		column_1Label = "//h6[@data-ms-id='label_column_1']",
		createdBy = "//li[@data-ms-id='Created Date']",
		ascending = "//li[@data-ms-id='ascending']",
		descending = "//li[@data-ms-id='descending']",
		breadcrumb = "ol.breadcrumb li",
		filterMenu = ".app .ProjectManager .display-actions .filter-holder .title",
		filterFavorites = '.filterDropdown li:last-child',
		filterAll = '.filterDropdown li:first-child',
		countHolder = '//span[@data-ms-id="dataCount"]',
		masterProject = '.master a.favorite',
		titleInTray = "form[data-ms-id='inlineRename'] span.title", 
		ascendingButton = element(by.xpath(ascending)),
		descendingButton = element(by.xpath(descending)),
		dropdownButton = element(by.xpath(dropdown)),
		nameButton = element(by.xpath(nameField)),
		nameLabelField = element(by.xpath(nameLabel)),
		column_1Button = element(by.xpath(column_1)),
		createdByButton = element(by.xpath(createdBy)),
		column_1LabelField = element(by.xpath(column_1Label)),
		breadcrumbField = element(by.css(breadcrumb));