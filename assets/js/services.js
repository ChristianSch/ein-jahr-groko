'use strict';


angular.module('einJahrGroKo.services', [])
    .factory('DataService', ['$q', '$http', 'dataSourceUrl',
        function($q, $http, dataSourceUrl) {
            /**
             * This is the data provider for all controllers etc. that depends
             * on the data. The first time the service is used the data gets
             * retrieved and cached. All next calls use the cached data.
             * A promise is returned in either case. So no matter what,
             * DataService.getData().then() is mandatory. The difference is that
             * the first call will be much faster than the following ones.
             *
             * The data is wrapped by an object indicating wether the data is
             * cached or not:
             *
             *  {
             *      'cached': {Boolean},
             *      'data': {Object}
             *  }
             */
            function getData() {
                var defer = $q.defer();

                // first time ever called: retrieve data and hand over to promise
                // after finishing the retrieval
                $http.get(dataSourceUrl, {
                    'cached': true,
                    'headers': { 'Accept-Encoding': 'gzip' }
                })
                    .success(function(data) {
                        // hand data over to the promise
                        defer.resolve(data);
                    })
                    .error(function(data, status) {
                        defer.reject('status ' + status + ' returned');
                    });

                return defer.promise;
            }

            return {
                getData: getData
            };
        }
    ])
    .factory('RandomNumberService', function() {
        /**
         * Return random integer between min and max (both inclusive)
         * @param  {int} min minimal value
         * @param  {int} max maximal value
         * @return {int}     random int from `[min, max]`
         */
        function getRandomNumber(min, max) {
            return Math.floor(((Math.random() * (max - min) + 1) + min) + 1);
        }

        return {
            getRandomNumber: getRandomNumber
        };
    })
    .factory('RandomQuoteService', ['$http', '$q', 'RandomNumberService', 'DataService',
        function($http, $q, RandomIDService, DataService) {
            function getDataSize(data) {
                var size = 0,
                    key = null;

                for (key in data) {
                    // don’t inspect eventual functions
                    if (data.hasOwnProperty(key)) {
                        size++;
                    }
                }

                return size;
            }

            function getRandQuote() {
                var defer = $q.defer();

                DataService.getData().then(function(data) {
                    var dataSize = getDataSize(data);
                    var randIndex = RandomIDService.getRandomNumber(0, dataSize);

                    defer.resolve(data[randIndex]);
                }, function(res) {
                    defer.reject(res);
                });

                return defer.promise;
            }

            return {
                getRandQuote: getRandQuote
            };
        }
    ]);
