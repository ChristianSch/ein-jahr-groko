'use strict';


angular.module('einJahrGroKo.directives', [])
    .directive('ejgQuote', function() {
        return {
            'restrict': 'E',
            'controller': 'EjgQuoteCtrl',
            'templateUrl': 'assets/template/ejgQuote.html',
            'link': function(scope, element, attrs, ejgQuoteCtrl) {
                ejgQuoteCtrl.init(element);
            }
        };
    });
