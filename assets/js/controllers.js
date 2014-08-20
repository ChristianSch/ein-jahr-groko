'use strict';


angular.module('einJahrGroKo.controllers', [])
    .controller('MainCtrl', ['$scope', '$window', 'appTitle',
        function($scope, $window, appTitle) {
            $window.document.title = appTitle;
        }
    ])
    .controller('RandomQuoteCtrl', ['$scope', '$log', 'RandomQuoteService',
        function($scope, $log, RandomQuoteService) {
            RandomQuoteService.getRandQuote().then(function(res) {
                var data = res.data;

                $scope.quote = {
                    'title': data.title,
                    'author': data.author,
                    'text': data.quote,
                    /* jshint camelcase:false */
                    'source': data.quote_src
                };

            }, function(res) {
                $log.error('status ' + res.status + ' returned');
            });
        }
    ]);
