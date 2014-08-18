'use strict';


angular.module('myApp.services', []).
factory('RandomIDService', function() {
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
    }).
    factory('RandomQuoteService', ['$http', '$q', 'RandomIDService', 'dataBaseUri',
        function($http, $q, RandomIDService, dataBaseUri) {
            function getRandQuote() {
                var lowestID = 0;
                var highestID = 1173; // FIXME: shouldn't be hardcoded
                var randID = RandomIDService.getRandID(lowestID, highestID);
                var regURL = dataBaseUri + 'item/' + randID;

                // return promise returned by $http service
                return $http({
                    'method': 'GET',
                    'url': regURL
                });
            }

            return {
                getRandQuote: getRandQuote
            };
        }
    ]);
