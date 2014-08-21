'use strict';


angular.module('einJahrGroKo.controllers', [])
    .controller('MainCtrl', ['$scope', '$window', 'appTitle',
        function($scope, $window, appTitle) {
            $window.document.title = appTitle;
        }
    ])
    .controller('EjgQuoteCtrl', ['$scope', '$attrs', '$log', 'RandomQuoteService',
        function($scope, $attrs, $log, RandomQuoteService) {
            this.init = function(element) { // jshint unused:false
                var converter = new Markdown.Converter();
                var quote = null;

                RandomQuoteService.getRandQuote().then(function(res) {
                    // FIXME: markdown parser that does not enclose all
                    // converted markdown in paragraph tags by default
                    quote = {
                        'author': res.author,
                        'title': res.title,
                        // the paragraph tags need to be stripped because the content is already
                        // enclosed by a paragraph
                        'text': converter.makeHtml(res.quote).replace('<p>', '').replace('</p>', ''),
                        // the paragraph tags need to be stripped because <cite> may only contain
                        // other phrasing content (and <p> is not one of them)
                        // @see http://www.w3.org/TR/html-markup/cite.html#cite
                        /* jshint camelcase:false */
                        'source': converter.makeHtml(res.quote_src).replace('<p>', '').replace('</p>', '')
                    };

                    $scope.quote = quote;

                }, function(res) {
                    $log.error(res);
                });
            };
        }
    ]);
