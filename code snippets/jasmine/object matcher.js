beforeEach(function() {
    this.addMatchers({
        toInclude: function(expected) {
            var failed;
            //console.info(expected.hasOwnProperty(i) && !this.actual.hasOwnProperty(i));
            for (var i in expected) {
                if (expected.hasOwnProperty(i) && !this.actual.hasOwnProperty(i)) {
                    failed = [i, expected[i]];
                    break;
                }
            }

            if (undefined !== failed) {
                this.message = function() {
                    return 'Failed asserting that array includes element "' + failed[0] + ' => ' + failed[1] + '"';
                };
                return false;
            }

            return true;
        }
    });
});