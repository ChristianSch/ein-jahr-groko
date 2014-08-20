'use strict';


angular.module('einJahrGroKo.filters', [])
    .filter('trustHtml', ['$sce',
        function($sce) {
            /**
             * Filter to use html tags
             *
             * @discussion Do not use with user input as it could be unsafe.
             */
            return function(text) {
                return $sce.trustAsHtml(text);
            };
        }
    ])
    .filter('getHtmlLink', function() {
        /**
         * [description]
         *
         * @discussion
         *     example:
         *         [CDU Regierungsprogramm 2013-2017](http://….pdf) S. 46
         *
         *     returns:
         *     <a href="http://….pdf" title="CDU Regierungsprogramm 2013-2017">
         *         CDU Wahlprogramm
         *     </a>
         *
         * @param  {[type]} link [description]
         * @return {[type]}      [description]
         */
        return function(link) {
            var reTitle = new RegExp(/\[([^\)]+)\]/),
                reUrl = new RegExp(/\(([^\)]+)\)/),
                reRest = new RegExp(/\)([^\)]+)/);

            var title = reTitle.test(link) ? reTitle.exec(link)[1].trim() : null,
                url = reUrl.test(link) ? reUrl.exec(link)[1] : null,
                rest = reRest.test(link) ? reRest.exec(link)[1].trim() : null;

            // console.log('title: ' + title);
            // console.log('url: ' + url);
            // console.log('rest: ' + rest);

            return '<a href="' + url + '" title="' + title + '">' + title + '</a> ' + rest;
        };
    });
