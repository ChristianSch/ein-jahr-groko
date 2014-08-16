'use strict';


angular.module('myApp.controllers', [])
    .controller('MainCtrl', ['$scope', '$window', 'appTitle',
        function($scope, $window, appTitle) {
            $window.document.title = appTitle;
        }
    ])
    .controller('RandomQuoteCtrl', ['$scope', 'RandomQuoteService',
        function($scope, RandomQuoteService) {
            RandomQuoteService.getRandQuote(); //.then();
            $scope.quote = {
                'title': 'Foo Bar!',
                'author': 'George Washington',
                'text': 'Donec ullamcorper nulla non metus auctor fringilla. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam quis risus eget urna mollis ornare vel eu leo.',
                'source': 'google.de'
            };
        }
    ]);
