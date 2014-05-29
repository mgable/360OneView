var data = {};

data.makeData = function() {

    var descriptions = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam dignissim a nisi non blandit. Nam gravida elit vel leo scelerisque, a semper magna blandit. Phasellus et sapien metus. Maecenas sit amet nisl eros. Nam id vehicula eros. Morbi sapien neque, dictum eget lacus quis, congue posuere velit.', 'Cras auctor tellus ut massa convallis, vitae blandit nisi feugiat. Fusce venenatis purus id tempor semper. Quisque posuere in ipsum vel ullamcorper. Morbi a congue magna. Ut vel eleifend tortor. Suspendisse volutpat diam risus, sed ultrices tellus congue nec.', 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nam adipiscing nulla sit amet nunc vehicula pellentesque', 'Nullam lobortis placerat massa eu fermentum. Proin interdum ipsum eu urna malesuada tincidunt. Morbi velit enim, faucibus quis neque sed, aliquet vestibulum mi.', 'Pellentesque eleifend, turpis rutrum ornare lacinia, sem purus commodo arcu, eget condimentum lorem nisi quis eros. Proin bibendum, purus ut tempus cursus, enim urna sodales lacus, at volutpat erat mauris in massa. Phasellus commodo risus vitae risus volutpat tempus.', 'Nunc sagittis erat non odio sollicitudin varius. Integer sem ante, tincidunt id sapien a, faucibus auctor nisi. Praesent quis mattis enim, sed porttitor neque.', 'Duis vel turpis nisl. Suspendisse semper feugiat quam, ut commodo arcu pulvinar id. Donec quis turpis sed lacus blandit pretium in eu nunc.', 'Nam dapibus metus orci, eu porttitor felis facilisis at.', 'Praesent cursus', 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.'],
        titles = ['Carl\'s Econ Variable Simulation 1', '2015 Q3 Marketing Plan', 'Bad Economic Variables 2015 March', 'Hit Target - Master', 'All assumptions 2015', 'Marketing Playbook', '2014 Q2 Mareting Plan', 'Hit Target - with exceptions', 'Fred\'s Stuff', 'Good Econ 2015'],
        scenarioTitles = ['Carl\'s Econ Variable Simulation 1', 'Al\'s AIB 2Q 2015 ', 'Al\'s Simulate 2Q 2015', 'Ann\'s AIB Q1 2015 TV ONLY v3', 'Ann\'s Allocate 3Q', 'Bob’s Simulate 4Q 2014', 'Brent\'s Simulate 3Q', 'Dan\'s Digital Hit Target', 'Erik\'s Cut Budget 2Q 2015 TV and Radio', 'Francis\' Max Profit for Q4 2014'],

        fileTypes = [
            'Media Plans', {
                'Constraints': [
                    'Hard Constraints',
                    'Soft Constraints'
                ]
            },
            "Cost Assumptions", {
                'Environmental Factors': [
                    'Economic Variables',
                    'Marketing Factors',
                    'Competitive Spend',
                    'Brand Awardness',
                    'Pricing',
                    'Product Factors'
                ]
            },
            'Objectives',
            'Scenarios',
            'Playbook',
            'Decision Books'
        ],

        masterSet = false,

        modifiedBy = [
            'Carl Sagan',
            'Al Green',
            'Ann Kross',
            'Bob Belcher',
            'Dan Cox',
            'Erik Lee',
            'Fred Flintstone',
            'Barney Rubble'
        ],

        lastModified = function makeRandomDate(daysBack) {
            var dayInMillisec = 86400000,
                now = Date.now(),
                daysAgo = Math.round(Math.random() * daysBack);
            return new Date(now - (dayInMillisec * daysAgo));
        },

        newData = function() {
            var objs = [];
            for (var x = 0, limit = titles.length; x < limit; x++) {
                var obj = {}, fileType = pick(fileTypes);
                obj.id = generateUUID();
                obj.title = titles[x];
            obj.description = descriptions[x];
            obj.createdBy = pick(modifiedBy);
            obj.createdDate = lastModified(180);
            obj.fileType = typeof fileType === "object" ? makeFileType(fileType) : fileType;
            obj.search = typeof fileType === "object" ? makeSearchType(fileType) : '';
            obj.modifiedBy = pick(modifiedBy);
            obj.lastModified = lastModified(180);
            obj.scenarios = makeScenarios();
            obj.masterSet = masterSet;
                objs.push(obj);
            }
            return objs
        },

        makeScenarios = function() {
            var objs = [];
            for (var x = 0, limit = scenarioTitles.length; x < limit; x++) {
                var obj = {}, fileType = pick(fileTypes);
                obj.title = scenarioTitles[x];
                obj.lastModified = lastModified(7);
                obj.modifiedBy = pick(modifiedBy);
                obj.fileType = typeof fileType === "object" ? makeFileType(fileType) : fileType;
                objs.push(obj);
            }
            return objs;
        },

        makeFileType = function(which) {
            var obj;
            for (var prop in which) {
                obj = pick(which[prop]);
            }
            return obj;
        },

        makeSearchType = function(which) {
            var obj;
            for (var prop in which) {
                obj = prop;
            }
            return obj;
        },

        shuffle = function(arry) {
            var results = [];
            while (arry.length > 0) {
                results.push(arry.splice(Math.floor(Math.random() * arry.length), 1).join());
            }
            return results;
        },


        pick = function(array) {
            return array[Math.floor(Math.random() * array.length)];
        },

        generateUUID = function() {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
            });
            return uuid;
        },

        objs = [],
        titles = shuffle(titles),

        descriptions = shuffle(descriptions);

    return {
        "data": newData()
    };
};

module.exports = data;