var data = {}, _ = require('underscore'),
    date = require('datejs');

data.makeData = function() {

    var descriptions = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam dignissim a nisi non blandit. Nam gravida elit vel leo scelerisque, a semper magna blandit. Phasellus et sapien metus. Maecenas sit amet nisl eros. Nam id vehicula eros. Morbi sapien neque, dictum eget lacus quis, congue posuere velit.', 'Cras auctor tellus ut massa convallis, vitae blandit nisi feugiat. Fusce venenatis purus id tempor semper. Quisque posuere in ipsum vel ullamcorper. Morbi a congue magna. Ut vel eleifend tortor. Suspendisse volutpat diam risus, sed ultrices tellus congue nec.', 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nam adipiscing nulla sit amet nunc vehicula pellentesque', 'Nullam lobortis placerat massa eu fermentum. Proin interdum ipsum eu urna malesuada tincidunt. Morbi velit enim, faucibus quis neque sed, aliquet vestibulum mi.', 'Pellentesque eleifend, turpis rutrum ornare lacinia, sem purus commodo arcu, eget condimentum lorem nisi quis eros. Proin bibendum, purus ut tempus cursus, enim urna sodales lacus, at volutpat erat mauris in massa. Phasellus commodo risus vitae risus volutpat tempus.', 'Nunc sagittis erat non odio sollicitudin varius. Integer sem ante, tincidunt id sapien a, faucibus auctor nisi. Praesent quis mattis enim, sed porttitor neque.', 'Duis vel turpis nisl. Suspendisse semper feugiat quam, ut commodo arcu pulvinar id. Donec quis turpis sed lacus blandit pretium in eu nunc.', 'Nam dapibus metus orci, eu porttitor felis facilisis at.', 'Praesent cursus', 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.'],
        titles = ['Carl\'s Econ Variable Simulation 1', '2015 Q3 Marketing Plan', 'Bad Economic Variables 2015 March', 'Hit Target - Master', 'All assumptions 2015', 'Marketing Playbook', '2014 Q2 Mareting Plan', 'Hit Target - with exceptions', 'Fred\'s Stuff', 'Good Econ 2015'],
        scenarioTitles = ['Carl\'s Econ Variable Simulation 1', 'Al\'s AIB 2Q 2015 ', 'Al\'s Simulate 2Q 2015', 'Ann\'s AIB Q1 2015 TV ONLY v3', 'Ann\'s Allocate 3Q', 'Bob’s Simulate 4Q 2014', 'Brent\'s Simulate 3Q', 'Dan\'s Digital Hit Target', 'Erik\'s Cut Budget 2Q 2015 TV and Radio', 'Francis\' Max Profit for Q4 2014'],

        fileTypes = [
            "Cost Assumptions", {
                'Non-Marketing Factors': [
                    'Economy',
                    'Labor Cost',
                    'Competition',
                    'Brand Awardness',
                    'Pricing'
                ]
            }
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
            var objs = [],
                indexer = 1;
            for (var i = 0, ilimit = 3; i < ilimit; i++) {
                for (var x = 0, limit = titles.length; x < limit; x++) {
                    var obj = {}, type = pick(fileTypes);
                    obj.index = indexer++;
                    obj.type = typeof type === "object" ? makeFileType(type) : type;
                    obj.icon = obj.type.replace(/\s/g, "").toLowerCase();
                    obj.id = generateUUID();
                    obj.title = titles[x] + "_" + i + "_" + x;
                    //obj.description = descriptions[x];
                    //obj.createdBy = pick(modifiedBy);
                    //obj.createdDate = lastModified(180);
                    obj.modifiedBy = pick(modifiedBy);
                    obj.owner = pick(modifiedBy);
                    obj.lastModified = lastModified(180);
                    obj.lastModified_display = timeAgo(obj.lastModified);
                    //obj.scenarios = makeScenarios();
                    obj.defaultScenariosElements = trueThenFalse(indexer);
                    //obj.imported = trueFalse();
                    obj.search = _.flatten(makeSearch(obj, type));
                    objs.push(obj);
                }
            }
            return objs
        },

        trueThenFalse = function(index) {
            return (index < 6) ? true : false;
        },

        timeAgo = function(time, local, raw) {

            if (!time) return "never";

            if (!local) {
                (local = Date.now())
            }

            if (isDate(time)) {
                time = time.getTime();
            } else if (typeof time === "string") {
                time = new Date(time).getTime();
            }

            if (isDate(local)) {
                local = local.getTime();
            } else if (typeof local === "string") {
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

            if (offset <= MINUTE) span = ['', raw ? 'now' : 'less than a minute'];
            else if (offset < (MINUTE * 60)) span = [Math.round(Math.abs(offset / MINUTE)), 'min'];
            else if (offset < (HOUR * 24)) span = [Math.round(Math.abs(offset / HOUR)), 'hr'];
            else if (offset < (DAY * 7)) span = [Math.round(Math.abs(offset / DAY)), 'day'];
            else if (offset < (WEEK * 52)) span = [Math.round(Math.abs(offset / WEEK)), 'week'];
            else if (offset < (YEAR * 10)) span = [Math.round(Math.abs(offset / YEAR)), 'year'];
            else if (offset < (DECADE * 100)) span = [Math.round(Math.abs(offset / DECADE)), 'decade'];
            else span = ['', 'a long time'];

            span[1] += (span[0] === 0 || span[0] > 1) ? 's' : '';
            span = span.join(' ');

            if (raw === true) {
                return span;
            }
            return (time <= local) ? span + ' ago' : 'in ' + span;
        },

        isDate = function(d) {
            if (Object.prototype.toString.call(d) === "[object Date]") {
                // it is a date
                if (isNaN(d.getTime())) { // d.valueOf() could also work
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        }

    makeSearch = function(obj, type) {
        var results = [""]
        if (obj.defaultScenariosElements) {
            results.push('Default Scenarios Elements')
        }
        if (typeof type === "object") {
            results.push(makeSearchType(type));
        }
        return results;
    },

    trueFalse = function() {
        return !!Math.floor(Math.random() * 2);
    },


    makeScenarios = function() {
        var objs = [];
        for (var x = 0, limit = scenarioTitles.length; x < limit; x++) {
            var obj = {}, fileType = pick(fileTypes);
            obj.title = scenarioTitles[x];
            obj.lastModified = lastModified(7);
            obj.modifiedBy = pick(modifiedBy);
            obj.fileType = typeof fileType === "object" ? makeFileType(fileType) : fileType;
            obj.icon = obj.fileType.replace(/\s/g, "").toLowerCase();
            objs.push(obj);
        }
        return objs;
    },

    makeFileType = function(which) {
        var val, result = {};
        for (var prop in which) {
            val = pick(which[prop]);
        }
        //return val;
        result[prop] = val;
        return val;
    },

    makeFileTypeObj = function(which) {
        var val, result = {};
        for (var prop in which) {
            val = pick(which[prop]);
        }

        result[prop] = val;
        return result;
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
        "data": newData(),
        "makeScenarios": makeScenarios
    };
};

module.exports = data;