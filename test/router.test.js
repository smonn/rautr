describe("Router", function () {
    describe("add", function () {
        var originalTimeout;

        beforeEach(function() {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        });

        afterEach(function() {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });

        it("should add action to route 'hello'", function (done) {
            var router = new Router();
            router.add("#/hello", function () {
                router.dispose();
                done();
            }, function () {
                done.fail("should not call exit function");
            });
            router.set("#/hello");
        });

        it("should call exit function", function (done) {
            var router = new Router();
            router.add("#/foo", null, function () {
                router.dispose();
                done();
            });
            router.set("#/foo");

            setTimeout(function () {
                router.set("#/bar");
            }, 500);
        });
    });
});
