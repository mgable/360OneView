'use strict';

/**
* @ngdoc function
* @name threeSixtOneViewApp
* @description
* Template data for pivot table and builder
*/
angular.module('ThreeSixtyOneView').factory('pbData', function () {
	return {
		viewsList: [
			{name: 'Joe\'s View',id: '1'},
			{name: 'Fiesta 2015',id: '2'},
			{name: 'Region by nameplate 2013',id: '3'},
			{name: 'Behrooz\'s View',id: '4'}
		],
		itemsList: [
			{
				label: 'Touchpoint',
				members: [
					{
						label: 'National/Local Spend',
						members: [
							{
								label: 'National',
								members: [
									{
										label: 'National Magazine Brand',
										members: []
									},{
										label: 'National Magazine Nameplate',
										members: []
									},{
										label: 'National Newspaper Brand',
										members: []
									},{
										label: 'National Newspaper Nameplate',
										members: []
									},{
										label: 'National TV Cable Brand',
										members: []
									},{
										label: 'National TV Cable Nameplate',
										members: []
									},{
										label: 'National TV Network Brand',
										members: []
									},{
										label: 'National TV Network Nameplate',
										members: []
									}
								]
							},{
								label: 'Local',
								members: [
									{
										label: 'Local Newspaper Brand',
										members: []
									},{
										label: 'Local Online Display Brand',
										members: []
									},{
										label: 'Local OOH Brand',
										members: []
									},{
										label: 'Local Paid Search Brand',
										members: []
									},{
										label: 'Local Radio Brand',
										members: []
									},{
										label: 'Local Sponsorship Brand',
										members: []
									},{
										label: 'Local TV Brand',
										members: []
									},{
										label: 'Local Newspaper Nameplate',
										members: []
									},{
										label: 'Local Online Display Nameplate',
										members: []
									},{
										label: 'Local OOH Nameplate',
										members: []
									},{
										label: 'Local Radio Nameplate',
										members: []
									},{
										label: 'Local TV Nameplate',
										members: []
									}
								]
							}
						]
					},{
						label: 'Brand/Nameplate Spend',
						members: [
							{
								label: 'Brand',
								members: [
									{
										label: 'National Magazine Brand',
										members: []
									},{
										label: 'Local Newspaper Brand',
										members: []
									},{
										label: 'National Newspaper Brand',
										members: []
									},{
										label: 'Local Online Display Brand',
										members: []
									},{
										label: 'Local OOH Brand',
										members: []
									},{
										label: 'Local Paid Search Brand',
										members: []
									},{
										label: 'Local Radio Brand',
										members: []
									},{
										label: 'Local Sponsorship Brand',
										members: []
									},{
										label: 'National TV Cable Brand',
										members: []
									},{
										label: 'Local TV Brand',
										members: []
									},{
										label: 'National TV Network Brand',
										members: []
									}
								]
							},{
								label: 'Nameplate',
								members: [
									{
										label: 'National Magazine Nameplate',
										members: []
									},{
										label: 'National Newspaper Nameplate',
										members: []
									},{
										label: 'National TV Cable Nameplate',
										members: []
									},{
										label: 'National TV Network Nameplate',
										members: []
									},{
										label: 'Local Newspaper Nameplate',
										members: []
									},{
										label: 'Local Online Display Nameplate',
										members: []
									},{
										label: 'Local OOH Nameplate',
										members: []
									},{
										label: 'Local Radio Nameplate',
										members: []
									},{
										label: 'Local TV Nameplate',
										members: []
									}
								]
							}
						]
					},{
						label: 'Channel',
						members: [
							{
								label: 'Magazine', members: [
									{
										label: 'National Magazine Brand',
										members: []
									},{
										label: 'National Magazine Nameplate',
										members: []
									}
								]
							},{
								label: 'Newspaper',
								members: [
									{
										label: 'Local Newspaper Brand',
										members: []
									},{
										label: 'National Newspaper Brand',
										members: []
									},{
										label: 'National Newspaper Nameplate',
										members: []
									},{
										label: 'Local Newspaper Nameplate',
										members: []
									}
								]
							},{
								label: 'Online',
								members: [
									{
										label: 'Local Online Display Brand',
										members: []
									},{
										label: 'Local Online Display Nameplate',
										members: []
									}
								]
							},{
								label: 'OOH',
								members: [
									{
										label: 'Local OOH Brand',
										members: []
									},{
										label: 'Local OOH Nameplate',
										members: []
									}
								]
							},{
								label: 'Paid',
								members: [
									{
										label: 'Local Paid Search Brand',
										members: []
									}
								]
							},{
								label: 'Radio',
								members: [
									{
										label: 'Local Radio Brand',
										members: []
									},{
										label: 'Local Radio Nameplate',
										members: []
									}
								]
							},{
								label: 'Sponsorship',
								members: [
									{
										label: 'Local Sponsorship Brand',
										members: []
									}
								]
							},{
								label: 'TV',
								members: [
									{
										label: 'National TV Cable Brand',
										members: []
									},{
										label: 'National TV Cable Nameplate',
										members: []
									},{
										label: 'Local TV Brand',
										members: []
									},{
										label: 'National TV Network Brand',
										members: []
									},{
										label: 'National TV Network Nameplate',
										members: []
									},{
										label: 'Local TV Nameplate',
										members: []
									}
								]
							}
						]
					},{
						label: 'Leaf Touchpoints',
						members: [
							{
								label: 'National Magazine Brand',
								members: []
							},{
								label: 'National Magazine Nameplate',
								members: []
							},{
								label: 'Local Newspaper Brand',
								members: []
							},{
								label: 'National Newspaper Brand',
								members: []
							},{
								label: 'National Newspaper Nameplate',
								members: []
							},{
								label: 'Local Online Display Brand',
								members: []
							},{
								label: 'Local OOH Brand',
								members: []
							},{
								label: 'Local Paid Search Brand',
								members: []
							},{
								label: 'Local Radio Brand',
								members: []
							},{
								label: 'Local Sponsorship Brand',
								members: []
							},{
								label: 'National TV Cable Brand',
								members: []
							},{
								label: 'National TV Cable Nameplate',
								members: []
							},{
								label: 'Local TV Brand',
								members: []
							},{
								label: 'National TV Network Brand',
								members: []
							},{
								label: 'National TV Network Nameplate',
								members: []
							},{
								label: 'Local Newspaper Nameplate',
								members: []
							},{
								label: 'Local Online Display Nameplate',
								members: []
							},{
								label: 'Local OOH Nameplate',
								members: []
							},{
								label: 'Local Radio Nameplate',
								members: []
							},{
								label: 'Local TV Nameplate',
								members: []
							}
						]
					}
				]
			},{
				label: 'Nameplate',
				members: [
					{
						label: 'Nameplate Groups',
						members: [
							{
								label: 'Car',
								members: [
									{
										label: 'Focus',
										members: []
									},{
										label: 'Taurus',
										members: []
									},{
										label: 'Mustang',
										members: []
									},{
										label: 'Fiesta',
										members: []
									},{
										label: 'Fusion',
										members: []
									}
								]
							},{
								label: 'Truck',
								members: [
									{
										label: 'F-Series',
										members: []
									},{
										label: 'E-Series',
										members: []
									},{
										label: 'Transit',
										members: []
									}
								]
							},{
								label: 'Utility',
								members: [
									{
										label:'Escape',
										members: []
									},{
										label:'Expedition',
										members: []
									},{
										label:'Explorer',
										members: []
									},{
										label:'Edge',
										members: []
									},{
										label:'Flex',
										members: []
									}
								]
							},{
								label: 'Brand',
								members: [
									{
										label: 'Brand',
										members: []
									}
								]
							}
						]
					},{
						label: 'Nameplates',
						members: [
							{
								label: 'Focus',
								members: []
							},{
								label: 'Taurus',
								members: []
							},{
								label: 'Mustang',
								members: []
							},{
								label: 'Fiesta',
								members: []
							},{
								label: 'Fusion',
								members: []
							},{
								label: 'F-Series',
								members: []
							},{
								label: 'E-Series',
								members: []
							},{
								label: 'Transit',
								members: []
							},{
								label: 'Escape',
								members: []
							},{
								label: 'Expedition',
								members: []
							},{
								label: 'Explorer',
								members: []
							},{
								label: 'Edge',
								members: []
							},{
								label: 'Flex',
								members: []
							},{
								label: 'Brand',
								members: []
							}
						]
					}
				]
			},{
				label: 'Region',
				members: [
					{
						label: 'Region',
						members: [
							{
								label: 'Southeast',
								members: [
									{
										label: 'Atlanta',
										members: []
									},{
										label: 'Miami',
										members: []
									},{
										label: 'Charlotte',
										members: []
									},{
										label: 'Orlando',
										members: []
									}
								]
							},{
								label: 'West',
								members: [
									{
										label: 'Denver',
										members: []
									},{
										label: 'Los Angeles',
										members: []
									},{
										label: 'Seattle',
										members: []
									},{
										label: 'Phoenix',
										members: []
									},{
										label: 'San Francisco',
										members: []
									}
								]
							},{
								label: 'Central',
								members: [
									{
										label: 'Kansas City',
										members: []
									},{
										label: 'Memphis',
										members: []
									},{
										label: 'Houston',
										members: []
									},{
										label: 'Dallas',
										members: []
									}
								]
							},{
								label: 'Great Lakes',
								members: [
									{
										label: 'Chicago',
										members: []
									},{
										label: 'Pittsburgh',
										members: []
									},{
										label: 'Cincinnati',
										members: []
									},{
										label: 'Detroit',
										members: []
									},{
										label: 'Twin Cities',
										members: []
									}
								]
							},{
								label: 'Northeast',
								members: [
									{
										label: 'Washington',
										members: []
									},{
										label: 'New York',
										members: []
									},{
										label: 'Boston',
										members: []
									},{
										label: 'Philadelphia',
										members: []
									}
								]
							},{
								label: 'National',
								members: [
									{
										label: 'National',
										members: []
									}
								]
							}
						]
					},{
						label: 'City',
						members: [
							{
								label: 'Atlanta',
								members: []
							},{
								label: 'Miami',
								members: []
							},{
								label: 'Charlotte',
								members: []
							},{
								label: 'Orlando',
								members: []
							},{
								label: 'Denver',
								members: []
							},{
								label: 'Los Angeles',
								members: []
							},{
								label: 'Seattle',
								members: []
							},{
								label: 'Phoenix',
								members: []
							},{
								label: 'San Francisco',
								members: []
							},{
								label: 'Kansas City',
								members: []
							},{
								label: 'Memphis',
								members: []
							},{
								label: 'Houston',
								members: []
							},{
								label: 'Dallas',
								members: []
							},{
								label: 'Chicago',
								members: []
							},{
								label: 'Pittsburgh',
								members: []
							},{
								label: 'Cincinnati',
								members: []
							},{
								label: 'Detroit',
								members: []
							},{
								label: 'Twin Cities',
								members: []
							},{
								label: 'Washington',
								members: []
							},{
								label: 'New York',
								members: []
							},{
								label: 'Boston',
								members: []
							},{
								label: 'Philadelphia',
								members: []
							},{
								label: 'National',
								members: []
							}
						]
					}
				]
			},{
				label: 'Time',
				members: [
					{
						label: 'Years',
						members: [
							{
								label: '2013',
								members: [
									{
										label: 'Q1 2013',
										members: [
											{
												label: 'January 2013',
												members: []
											},{
												label: 'February 2013',
												members: []
											},{
												label: 'March 2013',
												members: []
											}
										]
									},{
										label: 'Q2 2013',
										members: [
											{
												label: 'April 2013',
												members: []
											},{
												label: 'May 2013',
												members: []
											},{
												label: 'June 2013',
												members: []
											}
										]
									},{
										label: 'Q3 2013',
										members: [
											{
												label: 'July 2013',
												members: []
											},{
												label: 'August 2013',
												members: []
											},{
												label: 'September 2013',
												members: []
											}
										]
									},{
										label: 'Q4 2013',
										members: [
											{
												label: 'October 2013',
												members: []
											},{
												label: 'November 2013',
												members: []
											},{
												label: 'December 2013',
												members: []
											}
										]
									}
								]
							},{
								label: '2014',
								members: [
									{
										label: 'Q1 2014',
										members: [
											{
												label: 'January 2014',
												members: []
											},{
												label: 'February 2014',
												members: []
											},{
												label: 'March 2014',
												members: []
											}
										]
									},{
										label: 'Q2 2014',
										members: [
											{
												label: 'April 2014',
												members: []
											},{
												label: 'May 2014',
												members: []
											},{
												label: 'June 2014',
												members: []
											}
										]
									},{
										label: 'Q3 2014',
										members: [
											{
												label: 'July 2014',
												members: []
											},{
												label: 'August 2014',
												members: []
											},{
												label: 'September 2014',
												members: []
											}
										]
									},{
										label: 'Q4 2014',
										members: [
											{
												label: 'October 2014',
												members: []
											},{
												label: 'November 2014',
												members: []
											},{
												label: 'December 2014',
												members: []
											}
										]
									}
								]
							}
						]
					},{
						label: 'Quarters',
						members: [
							{
								label: 'Q1 2013',
								members: [
									{
										label: 'January 2013',
										members: []
									},{
										label: 'February 2013',
										members: []
									},{
										label: 'March 2013',
										members: []
									}
								]
							},{
								label: 'Q2 2013',
								members: [
									{
										label: 'April 2013',
										members: []
									},{
										label: 'May 2013',
										members: []
									},{
										label: 'June 2013',
										members: []
									}
								]
							},{
								label: 'Q3 2013',
								members: [
									{
										label: 'July 2013',
										members: []
									},{
										label: 'August 2013',
										members: []
									},{
										label: 'September 2013',
										members: []
									}
								]
							},{
								label: 'Q4 2013',
								members: [
									{
										label: 'October 2013',
										members: []
									},{
										label: 'November 2013',
										members: []
									},{
										label: 'December 2013',
										members: []
									}
								]
							},{
								label: 'Q1 2014',
								members: [
									{
										label: 'January 2014',
										members: []
									},{
										label: 'February 2014',
										members: []
									},{
										label: 'March 2014',
										members: []
									}
								]
							},{
								label: 'Q2 2014',
								members: [
									{
										label: 'April 2014',
										members: []
									},{
										label: 'May 2014',
										members: []
									},{
										label: 'June 2014',
										members: []
									}
								]
							},{
								label: 'Q3 2014',
								members: [
									{
										label: 'July 2014',
										members: []
									},{
										label: 'August 2014',
										members: []
									},{
										label: 'September 2014',
										members: []
									}
								]
							},{
								label: 'Q4 2014',
								members: [
									{
										label: 'October 2014',
										members: []
									},{
										label: 'November 2014',
										members: []
									},{
										label: 'December 2014',
										members: []
									}
								]
							}
						]
					},{
						label: 'Months',
						members: [
							{
								label: 'January 2013',
								members: []
							},{
								label: 'February 2013',
								members: []
							},{
								label: 'March 2013',
								members: []
							},{
								label: 'April 2013',
								members: []
							},{
								label: 'May 2013',
								members: []
							},{
								label: 'June 2013',
								members: []
							},{
								label: 'July 2013',
								members: []
							},{
								label: 'August 2013',
								members: []
							},{
								label: 'September 2013',
								members: []
							},{
								label: 'October 2013',
								members: []
							},{
								label: 'November 2013',
								members: []
							},{
								label: 'December 2013',
								members: []
							},{
								label: 'January 2014',
								members: []
							},{
								label: 'February 2014',
								members: []
							},{
								label: 'March 2014',
								members: []
							},{
								label: 'April 2014',
								members: []
							},{
								label: 'May 2014',
								members: []
							},{
								label: 'June 2014',
								members: []
							},{
								label: 'July 2014',
								members: []
							},{
								label: 'August 2014',
								members: []
							},{
								label: 'September 2014',
								members: []
							},{
								label: 'October 2014',
								members: []
							},{
								label: 'November 2014',
								members: []
							},{
								label: 'December 2014',
								members: []
							}
						]
					}
				]
			}
		],
		viewData: {
			id: '4',
			name: 'Behrooz\'s View',
			columns: [{category: 'Nameplate', name: 'Nameplate Groups'}, {category: 'Touchpoint', name: 'Channel'}],
			rows: [{category: 'Time', name: 'Years'}, {category: 'Region', name: 'City'}],
			filters: [
				{name: 'Touchpoint', items: ['National Magazine Brand','National Magazine Nameplate','Local Newspaper Brand','National Newspaper Brand','National Newspaper Nameplate','Local Online Display Brand','Local OOH Brand','Local Paid Search Brand','Local Radio Brand','Local Sponsorship Brand','National TV Cable Brand','National TV Cable Nameplate','Local TV Brand','National TV Network Brand','National TV Network Nameplate','Local Newspaper Nameplate','Local Online Display Nameplate','Local OOH Nameplate','Local Radio Nameplate','Local TV Nameplate']},
				{name: 'Nameplate', items: ['Focus','Taurus','Mustang','Fiesta','Fusion','F-Series','E-Series','Transit','Escape','Expedition','Explorer','Edge','Flex','Brand']},
				{name: 'Region', items: ['Atlanta','Miami','Charlotte','Orlando','Denver','Los Angeles','Seattle','Phoenix','San Francisco','Kansas City','Memphis','Houston','Dallas','Chicago','Pittsburgh','Cincinnati','Detroit','Twin Cities','Washington','New York','Boston','Philadelphia','National']},
				{name: 'Time', items: ['February 2013', 'March 2013', 'April 2013', 'May 2013', 'June 2013', 'July 2013', 'August 2013', 'September 2013', 'October 2013', 'November 2013', 'December 2013','January 2014', 'February 2014', 'March 2014', 'April 2014', 'May 2014', 'June 2014', 'July 2014', 'August 2014', 'September 2014', 'October 2014', 'November 2014', 'December 2014']},
				{name: 'KPI', items: []}
				]
			}
	};
}).factory('ptData', function() {
    return {
        "data": [{
            "0": "",
            "1": "",
            "2": "Car",
            "3": "Car",
            "4": "Car",
            "5": "Car",
            "6": "Car",
            "7": "Car",
            "8": "Car",
            "9": "Car",
            "10": "Truck",
            "11": "Truck",
            "12": "Truck",
            "13": "Truck",
            "14": "Truck",
            "15": "Truck",
            "16": "Truck",
            "17": "Truck",
            "18": "Utility",
            "19": "Utility",
            "20": "Utility",
            "21": "Utility",
            "22": "Utility",
            "23": "Utility",
            "24": "Utility",
            "25": "Utility",
            "26": "Brand",
            "27": "Brand",
            "28": "Brand",
            "29": "Brand",
            "30": "Brand",
            "31": "Brand",
            "32": "Brand",
            "33": "Brand"
        }, {
            "0": "Years",
            "1": "City",
            "2": "Magazine",
            "3": "Newspaper",
            "4": "Online",
            "5": "OOH",
            "6": "Paid",
            "7": "Radio",
            "8": "Sponsorship",
            "9": "TV",
            "10": "Magazine",
            "11": "Newspaper",
            "12": "Online",
            "13": "OOH",
            "14": "Paid",
            "15": "Radio",
            "16": "Sponsorship",
            "17": "TV",
            "18": "Magazine",
            "19": "Newspaper",
            "20": "Online",
            "21": "OOH",
            "22": "Paid",
            "23": "Radio",
            "24": "Sponsorship",
            "25": "TV",
            "26": "Magazine",
            "27": "Newspaper",
            "28": "Online",
            "29": "OOH",
            "30": "Paid",
            "31": "Radio",
            "32": "Sponsorship",
            "33": "TV"
        }, {
            "0": "2013",
            "1": "Atlanta"
        }, {
            "0": "2013",
            "1": "Miami"
        }, {
            "0": "2013",
            "1": "Charlotte"
        }, {
            "0": "2013",
            "1": "Orlando"
        }, {
            "0": "2013",
            "1": "Denver"
        }, {
            "0": "2013",
            "1": "Los Angeles"
        }, {
            "0": "2013",
            "1": "Seattle"
        }, {
            "0": "2013",
            "1": "Phoenix"
        }, {
            "0": "2013",
            "1": "San Francisco"
        }, {
            "0": "2013",
            "1": "Kansas City"
        }, {
            "0": "2013",
            "1": "Memphis"
        }, {
            "0": "2013",
            "1": "Houston"
        }, {
            "0": "2013",
            "1": "Dallas"
        }, {
            "0": "2013",
            "1": "Chicago"
        }, {
            "0": "2013",
            "1": "Pittsburgh"
        }, {
            "0": "2013",
            "1": "Cincinnati"
        }, {
            "0": "2013",
            "1": "Detroit"
        }, {
            "0": "2013",
            "1": "Twin Cities"
        }, {
            "0": "2013",
            "1": "Washington"
        }, {
            "0": "2013",
            "1": "New York"
        }, {
            "0": "2013",
            "1": "Boston"
        }, {
            "0": "2013",
            "1": "Philadelphia"
        }, {
            "0": "2013",
            "1": "National"
        }, {
            "0": "2014",
            "1": "Atlanta"
        }, {
            "0": "2014",
            "1": "Miami"
        }, {
            "0": "2014",
            "1": "Charlotte"
        }, {
            "0": "2014",
            "1": "Orlando"
        }, {
            "0": "2014",
            "1": "Denver"
        }, {
            "0": "2014",
            "1": "Los Angeles"
        }, {
            "0": "2014",
            "1": "Seattle"
        }, {
            "0": "2014",
            "1": "Phoenix"
        }, {
            "0": "2014",
            "1": "San Francisco"
        }, {
            "0": "2014",
            "1": "Kansas City"
        }, {
            "0": "2014",
            "1": "Memphis"
        }, {
            "0": "2014",
            "1": "Houston"
        }, {
            "0": "2014",
            "1": "Dallas"
        }, {
            "0": "2014",
            "1": "Chicago"
        }, {
            "0": "2014",
            "1": "Pittsburgh"
        }, {
            "0": "2014",
            "1": "Cincinnati"
        }, {
            "0": "2014",
            "1": "Detroit"
        }, {
            "0": "2014",
            "1": "Twin Cities"
        }, {
            "0": "2014",
            "1": "Washington"
        }, {
            "0": "2014",
            "1": "New York"
        }, {
            "0": "2014",
            "1": "Boston"
        }, {
            "0": "2014",
            "1": "Philadelphia"
        }, {
            "0": "2014",
            "1": "National"
        }]
    };
});
