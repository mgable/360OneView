 _ = require('./bower_components/underscore/underscore');

 var data = {
     status: "success",
     totalItemsReturned: 10,
     data: [{
         index: 1,
         fileType: "Cost Assumptions",
         icon: "costassumptions",
         id: "a01e14a5-d3d6-467f-e820-023c58c916c8",
         title: "2015 Q3 Marketing Plan_0_0",
         modifiedBy: "Al Green",
         lastModified_display: "1 week ago",
         masterSet: false,
         search: [
             ""
         ]
     }, {
         index: 2,
         fileType: "Cost Assumptions",
         icon: "costassumptions",
         id: "90f3796c-88ab-472c-f320-95e73ef5de2c",
         title: "Hit Target - with exceptions_0_1",
         modifiedBy: "Erik Lee",
         lastModified_display: "14 weeks ago",
         masterSet: true,
         search: [
             "",
             "Master Set"
         ]
     }, {
         index: 3,
         fileType: "Pricing",
         icon: "pricing",
         id: "900dbfda-5815-4b25-9cc2-9643dd426370",
         title: "Hit Target - Master_0_2",
         modifiedBy: "Barney Rubble",
         lastModified_display: "4 weeks ago",
         masterSet: false,
         search: [
             "",
             "Non-Marketing Factors"
         ]
     }, {
         index: 4,
         fileType: "Cost Assumptions",
         icon: "costassumptions",
         id: "153fd3c4-35c2-4296-cac8-0d74c9197826",
         title: "2014 Q2 Mareting Plan_0_3",
         modifiedBy: "Bob Belcher",
         lastModified_display: "20 weeks ago",
         masterSet: true,
         search: [
             "",
             "Master Set"
         ]
     }, {
         index: 5,
         fileType: "Cost Assumptions",
         icon: "costassumptions",
         id: "9ec70ae7-8702-4a96-a18f-2cdfed02edb9",
         title: "Marketing Playbook_0_4",
         modifiedBy: "Erik Lee",
         lastModified_display: "14 weeks ago",
         masterSet: true,
         search: [
             "",
             "Master Set"
         ]
     }, {
         index: 6,
         fileType: "Labor Costs",
         icon: "laborcosts",
         id: "623633f4-42c0-4915-872c-805d759907be",
         title: "Fred's Stuff_0_5",
         modifiedBy: "Carl Sagan",
         lastModified_display: "15 weeks ago",
         masterSet: false,
         search: [
             "",
             "Non-Marketing Factors"
         ]
     }, {
         index: 7,
         fileType: "Competition",
         icon: "competition",
         id: "4bf94431-3c9b-47f5-b325-9de407e08ed5",
         title: "Carl's Econ Variable Simulation 1_0_6",
         modifiedBy: "Fred Flintstone",
         lastModified_display: "13 weeks ago",
         masterSet: false,
         search: [
             "",
             "Non-Marketing Factors"
         ]
     }, {
         index: 8,
         fileType: "Labor Costs",
         icon: "laborcosts",
         id: "6d715240-d115-469f-a5c3-9b9d45ad9352",
         title: "Bad Economic Variables 2015 March_0_7",
         modifiedBy: "Al Green",
         lastModified_display: "17 weeks ago",
         masterSet: false,
         search: [
             "",
             "Non-Marketing Factors"
         ]
     }, {
         index: 9,
         fileType: "Cost Assumptions",
         icon: "costassumptions",
         id: "dedab3df-c4a0-4e3e-b214-46ed9d33ccc1",
         title: "All assumptions 2015_0_8",
         modifiedBy: "Erik Lee",
         lastModified_display: "3 weeks ago",
         masterSet: false,
         search: [
             ""
         ]
     }, {
         index: 10,
         fileType: "Cost Assumptions",
         icon: "costassumptions",
         id: "3098cf9a-3b01-4a5c-9aa9-7657c9821059",
         title: "Good Econ 2015_0_9",
         modifiedBy: "Fred Flintstone",
         lastModified_display: "7 weeks ago",
         masterSet: false,
         search: [
             ""
         ]
     }]
 }

     function fileTypeCounts(data) {
         return data.reduce(function(pv, cv, i, arr) {
             (cv.fileType in pv) ? pv[cv.fileType]++ : pv[cv.fileType] = 1;
             // if (!_.isEmpty(cv.search)) {
             //     (cv.search in pv) ? pv[cv.search]++ : pv[cv.search] = 1;
             // }	


             return pv;
         });
     }

 var results = {};

 _.each(data.data, function(e, i, l) {
     if (e.fileType in results) {
         results[e.fileType]++
     } else {
         results[e.fileType] = 1
     }
 });

 console.info(results);