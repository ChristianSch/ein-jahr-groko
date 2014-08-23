'use strict';


angular.module('einJahrGroKo', [
    'ui.bootstrap',
    'einJahrGroKo.filters',
    'einJahrGroKo.services',
    'einJahrGroKo.controllers',
    'einJahrGroKo.values',
    'einJahrGroKo.directives'
])
    .config(function($locationProvider) {
        $locationProvider.html5Mode(true);
    });
