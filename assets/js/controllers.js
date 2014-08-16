'use strict';


angular.module('myApp.controllers', [])
    .controller('MainCtrl', ['$scope', '$window', 'appTitle',
        function($scope, $window, appTitle) {
            $window.document.title = appTitle;
        }
    ]);
