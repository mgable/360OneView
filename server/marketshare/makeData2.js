var data = {},
    _ = require('underscore'),
    date = require('datejs');

data.createData = function() {

    var titles = ['Carl\'s Econ Variable Simulation 1', '2015 Q3 Marketing Plan', 'Bad Economic Variables 2015 March', 'Hit Target - Master', 'All assumptions 2015', 'Marketing Playbook', '2014 Q2 Mareting Plan', 'Hit Target - with exceptions', 'Fred\'s Stuff', 'Good Econ 2015'],
        scenarioTitles = ['Carl\'s Econ Variable Simulation 1', 'Al\'s AIB 2Q 2015 ', 'Al\'s Simulate 2Q 2015', 'Ann\'s AIB Q1 2015 TV ONLY v3', 'Ann\'s Allocate 3Q', 'Bob’s Simulate 4Q 2014', 'Brent\'s Simulate 3Q', 'Dan\'s Digital Hit Target', 'Erik\'s Cut Budget 2Q 2015 TV and Radio', 'Francis\' Max Profit for Q4 2014'],
        descriptions = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam dignissim a nisi non blandit. Nam gravida elit vel leo scelerisque, a semper magna blandit. Phasellus et sapien metus. Maecenas sit amet nisl eros. Nam id vehicula eros. Morbi sapien neque, dictum eget lacus quis, congue posuere velit.', 'Cras auctor tellus ut massa convallis, vitae blandit nisi feugiat. Fusce venenatis purus id tempor semper. Quisque posuere in ipsum vel ullamcorper. Morbi a congue magna. Ut vel eleifend tortor. Suspendisse volutpat diam risus, sed ultrices tellus congue nec.', 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nam adipiscing nulla sit amet nunc vehicula pellentesque', 'Nullam lobortis placerat massa eu fermentum. Proin interdum ipsum eu urna malesuada tincidunt. Morbi velit enim, faucibus quis neque sed, aliquet vestibulum mi.', 'Pellentesque eleifend, turpis rutrum ornare lacinia, sem purus commodo arcu, eget condimentum lorem nisi quis eros. Proin bibendum, purus ut tempus cursus, enim urna sodales lacus, at volutpat erat mauris in massa. Phasellus commodo risus vitae risus volutpat tempus.', 'Nunc sagittis erat non odio sollicitudin varius. Integer sem ante, tincidunt id sapien a, faucibus auctor nisi. Praesent quis mattis enim, sed porttitor neque.', 'Duis vel turpis nisl. Suspendisse semper feugiat quam, ut commodo arcu pulvinar id. Donec quis turpis sed lacus blandit pretium in eu nunc.', 'Nam dapibus metus orci, eu porttitor felis facilisis at.', 'Praesent cursus', 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.'],


        fileTypes = [
            'Cost Assumptions',
            'Economy',
            'Labor Cost',
            'Competition',
            'Pricing'
        ],

        defaults = false,

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

        objs = [],

        indexer,

        lastModified = function makeRandomDate(daysBack) {
            var dayInMillisec = 86400000,
                now = Date.now(),
                daysAgo = Math.round(Math.random() * daysBack);
            return new Date(now - (dayInMillisec * daysAgo));
        },

        create = function(obj) {
            var result = {};
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    try {
                        result[prop] = eval(obj[prop]);
                    } catch (e) {
                        console.info(e)
                    }
                }
            }
            return result;
        },

        parse = function(obj) {
            var result = {};
            indexer = 0;
            result = create(obj.meta);
            result.data = [];

            if (obj.data && obj.data.count) {
                for (i = 0, limit = obj.data.count; i < limit; i++) {
                    result.data.push(create(obj.data.obj));
                }
                if (obj.data.inital) {
                    for (var i = 0, limit = obj.data.inital.length; i < limit; i++) {
                        var currentObj = result.data[i],
                            replaces = obj.data.inital[i];

                        for (prop in replaces) {
                            if (prop in currentObj) {
                                currentObj[prop] = replaces[prop]
                            }
                        }

                    }
                }

                return result;
            } else {
                return false;
            }

        },
        trueThenFalse = function(index) {
            return (index <= 4) ? true : false;

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
        },

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

        makeAccess = function() {
            return trueFalse() ? "view only" : "Everyone can edit";
        },
        makeScenarios = function(limit) {
            var objs = [],
                total = Math.floor(Math.random() * limit);
            for (var x = 0; x < total; x++) {
                var obj = {};
                // fileType = pick(fileTypes);
                obj.title = scenarioTitles[x % scenarioTitles.length];
                obj.lastModified = lastModified(7);
                obj.modifiedBy = pick(modifiedBy);
                //obj.fileType = typeof fileType === "object" ? makeFileType(fileType) : fileType;
                //obj.icon = obj.fileType.replace(/\s/g, "").toLowerCase();
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

        pick = function(arry) {
            return arry[Math.floor(Math.random() * arry.length)];
        },

        returnInOrder = function(arry, index, limit) {
            return arry[(index % limit)];
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

        titles = shuffle(titles);

    return {
        "parse": parse,
        // "makeScenarios": makeScenarios,
        "timeAgo": timeAgo
    };
};

module.exports = data;