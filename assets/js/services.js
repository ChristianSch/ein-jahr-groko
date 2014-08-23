'use strict';


angular.module('einJahrGroKo.services', [])
    .factory('DataService', ['$q', '$http', 'dataSourceUrl',
        function($q, $http, dataSourceUrl) {
            /**
             * This is the data provider for all controllers etc. that depends
             * on the data. The first time the service is used the data gets
             * retrieved and cached. All next calls use the cached data.
             * A promise is returned in either case. So no matter what,
             * DataService.getData().then() is mandatory.
             */

            /**
             * Retrieve data from server and return promise
             * @return {Object} promise that resolves data on success and
             * rejects on failure with returned status (wrapped in a message)
             */
            function getData() {
                var defer = $q.defer();

                // first time ever called: retrieve data and hand over to promise
                // after finishing the retrieval
                $http.get(dataSourceUrl, {
                    'cached': true,
                    'headers': {
                        'Accept-Encoding': 'gzip'
                    }
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

            // API for this service
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

        // API for this service
        return {
            getRandomNumber: getRandomNumber
        };
    })
    .factory('QuoteService', ['$http', '$q', 'RandomNumberService', 'DataService', 'QuoteHistoryService',
        function($http, $q, RandomNumberService, DataService, QuoteHistoryService) {
            /**
             * Calculate size of returned data
             * @param  {Object} data
             * @return {Integer} size of data
             */
            function getDataSize(data) {
                var size = 0,
                    key = null;

                for (key in data) {
                    // only count attributes (not functions)
                    if (data.hasOwnProperty(key)) {
                        size++;
                    }
                }

                return size;
            }

            /**
             * Remove <p> and </p> from text
             * @param  {String} text to strip p tags from
             * @return {String}      stripped text
             */
            function stripParTag(text) {
                return text.replace('<p>', '').replace('</p>', '');
            }

            /**
             * Convert markdown to html
             *
             * @discussion If the quote was already converted the `isHtml`
             * attribute is `true` and will be returned immediately. Otherwise
             * the quote will beconverted and marked the same way.
             *
             * @param  {Object} quote to convert
             * @return {Object}       converted quote
             */
            function toHtml(quote) {
                if (quote.isHtml) {
                    return quote;
                } else {
                    var converter = new Markdown.Converter();

                    return {
                        'author': quote.author,
                        'title': quote.title,
                        'text': stripParTag(converter.makeHtml(quote.quote)),
                        /* jshint camelcase:false */
                        'source': stripParTag(converter.makeHtml(quote.quote_src)),
                        'isHtml': true,
                        'id': quote.id
                    };
                }
            }

            /**
             * Get quote. There are three possibilities on what quote will be
             * returned. This depends on the QuoteHistoryService status and
             * whether or not `id` is null
             *
             * 1.  `id` is set: return quote with given id if possible.
             *     Note: Promise rejects if quote with id was not found
             *
             * 2.  `id` is null and QuoteHistoryService's head is at the latest
             *     quote: random quote will be returned and added to the history
             *
             * 3.  `id` is null and QuoteHistoryService's head is not the latest
             *     quote: return next quote in history (the one following the
             *     now-head). The head will be moved to the quote
             *
             * @see     QuoteHistoryService
             * @param   {Integer}   `id` of quote or null for random quote or
             * next in history
             * @return  {Object}    Promise that resolves quote or rejects with
             * error message
             */
            function getQuote(id) {
                var defer = $q.defer();

                DataService.getData().then(function(data) { // jshint unused:false
                    /*  
                        please note that when rej and res are set, rej has a
                        higher precedence and the promise rejects with `rej`
                     */
                    var res = null,
                        rej = null;

                    if (id) {
                        // return specific quote
                        var key;

                        for (key in data) {
                            if (data.hasOwnProperty(key) && data[key].id == id) {
                                // convert markdown to html
                                res = toHtml(data[key]);
                                break;
                            }
                        }

                        // add quote to history
                        if (res) {
                            QuoteHistoryService.addObjectToHistory(res);
                        }

                        rej = res ? null : 'no quote with id ' + id;
                    } else {
                        /*  
                            return random quote or next in history
                            if history is at head, null will be returned. thus
                            a random quote will be resolved
                        */
                        res = QuoteHistoryService.getNext();

                        if (!res) {
                            var dataSize = getDataSize(data);
                            var randID = RandomNumberService.getRandomNumber(0,
                                dataSize - 1);
                            // convert markdown to html
                            res = toHtml(data[randID]);
                            QuoteHistoryService.addObjectToHistory(res);
                        }
                    }

                    if (rej) {
                        defer.reject(rej);
                    } else {
                        defer.resolve(res);
                    }

                }, function(rej) {
                    defer.reject(rej);
                });

                return defer.promise;
            }

            // API for this service
            return {
                getQuote: getQuote
            };
        }
    ])
    .factory('QuoteHistoryService', ['$location',
        function($location) {
            var history = [];
            var histPntr = -1;

            /**
             * Check if there are previous quotes
             * @return {Boolean}
             */
            function hasPrevious() {
                return (histPntr > 0) ? true : false;
            }

            /**
             * Add quote to history anbd change browser location accordingly
             * @param {[type]} id  of quote
             * @param {[type]} obj quote
             */
            function addObjectToHistory(obj) {
                history.push(obj);
                histPntr++;

                // set hash in the browsers location bar
                $location.hash(obj.id);
            }

            /**
             * Get predecessor of the current head quote
             * @return {Object} quote or null if there is no predecessor
             */
            function getPrevious() {
                window.history.back();

                if (histPntr > 0) {
                    histPntr--;

                    return history[histPntr];
                }

                return null; // no more items in history
            }

            /**
             * Get successor of current quote
             * @return {Object} quote or null if there is no successor
             */
            function getNext() {
                var out;

                if (histPntr < (history.length - 1)) {
                    // return successor of current quote
                    histPntr++;
                    out = history[histPntr];

                    // set hash in the browser location
                    if (out) {
                        $location.hash(out.id);
                    }
                } else {
                    // end of history already reached, no new quotes
                    out = null;
                }

                return out;
            }

            // API for this service
            return {
                addObjectToHistory: addObjectToHistory,
                getNext: getNext,
                getPrevious: getPrevious,
                hasPrevious: hasPrevious
            };
        }
    ]);
