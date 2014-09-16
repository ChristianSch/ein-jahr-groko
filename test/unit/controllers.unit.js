'use strict';


describe('Unit: Controllers', function() {
    beforeEach(module('einJahrGroKo'));

    describe('Controller: MainCtrl', function() {
        it('should be available', inject(function($controller) {
            var mainCtrl = $controller('MainCtrl', {
                $scope: {}
            });

            expect(mainCtrl).to.be.defined;
        }));
    });

    describe('Controller: EjgQuoteCtrl', function() {
        it('should be available', inject(function($controller) {
            var ejgQuoteCtrl = $controller('EjgQuoteCtrl', {
                $scope: {},
                $element: {},
                $attrs: { $attrs: {} },
            });

            expect(ejgQuoteCtrl).to.be.defined;
        }));
    });
});