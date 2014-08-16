'use strict';


angular.module('myApp.services', [])
    .factory('RandomIDService', function() {
        /**
         * Return random integer between min and max (both inclusive)
         * @param  {int} min minimal value
         * @param  {int} max maximal value
         * @return {int}     random int from `[min, max]`
         */
        function getRandID(min, max) {
            return Math.floor(((Math.random() * (max - min) + 1) + min) + 1);
        }

        return {
            getRandID: getRandID
        };
    })
    .factory('RandomQuoteService', ['$http', '$q', 'RandomIDService', 'dataBaseUri',
        function($http, $q, RandomIDService, dataBaseUri) {
            function getRandQuote() {
                var defer = $q.defer;
                var lowestID = 0;
                var highestID = 1173; // FIXME: shouldn't be hardcoded
                var randID = RandomIDService.getRandID(lowestID, highestID);

                $http({
                    'method': 'GET',
                    'url': dataBaseUri + 'item/' + randID
                }).
                success(function(data, status, headers, config) { // jshint unused:false
                    console.log(data);
                    return {};
                }).
                error(function(data, status, headers, config) { // jshint unused:false
                    console.log('returned status ' + status);
                    return {};
                });

                return defer.promise;
            }

            return {
                getRandQuote: getRandQuote
            };
        }
    ]);
