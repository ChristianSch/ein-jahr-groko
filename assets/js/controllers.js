'use strict';


angular.module('einJahrGroKo.controllers', [])
    .controller('MainCtrl', ['$scope', '$window', 'appTitle',
        function($scope, $window, appTitle) {
            $window.document.title = appTitle;
        }
    ])
    .controller('EjgQuoteCtrl', ['$scope', '$attrs', '$log', '$location', 'QuoteService', 'QuoteHistoryService',
        function($scope, $attrs, $log, $location, QuoteService, QuoteHistoryService) {
            /**
             * Initialize controller
             *
             * @param  {Object} element DOM element
             */
            this.init = function(element) { // jshint unused:false
                var hash = $location.hash();
                if (!hash) {
                    $scope.setQuote();
                } else {
                    $scope.setQuote(hash);
                }
            };

            /**
             * If no id is given either the next quote in history is shown
             * or if there are nor more quotes in history a random one is shown.
             *
             * @param {[type]} id [description]
             */
            $scope.setQuote = function(id) {
                QuoteService.getQuote(id).then(function(res) {
                    $scope.quote = res;

                    // de-/enable `previous` button
                    $scope.disablePrev = QuoteHistoryService.hasPrevious() ? false : true;

                }, function(rej) {
                    $log.error(rej);
                });
            };

            /**
             * Set previous quote if there is one in the history
             */
            $scope.previousQuote = function() {
                var prevQuote = QuoteHistoryService.getPrevious();

                if (prevQuote) {
                    $scope.quote = prevQuote;
                }

                // de-/enable `previous` button
                $scope.disablePrev = QuoteHistoryService.hasPrevious() ? false : true;
            };
        }
    ]);
