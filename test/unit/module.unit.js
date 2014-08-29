describe("Testing Modules", function() {
    describe("App Module:", function() {

        var module;
        before(function() {
            module = angular.module("einJahrGroKo");
        });

        it("should be registered", function() {
            expect(module).not.to.equal(null);
        });

        describe("Dependencies:", function() {

            var deps;
            var hasModule = function(m) {
                return deps.indexOf(m) >= 0;
            };

            before(function() {
                deps = module.value('einJahrGroKo').requires;
            });

            it("should have einJahrGroKo.controllers as a dependency", function() {
                expect(hasModule('einJahrGroKo.controllers')).to.equal(true);
            });

            it("should have einJahrGroKo.directives as a dependency", function() {
                expect(hasModule('einJahrGroKo.directives')).to.equal(true);
            });

            it("should have einJahrGroKo.filters as a dependency", function() {
                expect(hasModule('einJahrGroKo.filters')).to.equal(true);
            });

            it("should have einJahrGroKo.services as a dependency", function() {
                expect(hasModule('einJahrGroKo.services')).to.equal(true);
            });

            it("should have einJahrGroKo.values as a dependency", function() {
                expect(hasModule('einJahrGroKo.values')).to.equal(true);
            });
        });
    });
});