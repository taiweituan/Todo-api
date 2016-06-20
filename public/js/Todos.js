angular.module('mainApp', [
    'ui.bootstrap',
    'ngRoute',

])

//.config(['$mdThemingProvider', '$routeProvider', function ($mdThemingProvider, $routeProvider) {
 
//}])

.controller('mainController', ['$scope', function ($s) {
    $s.test = "Hello World!";
}]);
