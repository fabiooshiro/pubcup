var pubcup = angular.module('pubcupApp', [
  'ngRoute'
]);

pubcup.controller('ACtrl', function ($scope, $http) {

});

pubcup.controller('BCtrl', function ($scope, $http) {
  
});

pubcup.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/a', {
        templateUrl: 'partials/a.html',
        controller: 'ACtrl'
      }).
      when('/b', {
        templateUrl: 'partials/b.html',
        controller: 'BCtrl'
      }).
      otherwise({
        redirectTo: '/a'
      });
  }]);
