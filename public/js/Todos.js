angular.module('mainApp', [
    'ui.bootstrap',
    'ngRoute',

])

.config(['$routeProvider', function ($r) {
    // ng-route
    $r.when('/', {
        title: "Todos Home",
        templateUrl: 'pages/home.html',
        reloadOnSearch: false,
    });
}])

.controller('mainController', ['$scope', function ($s) {
    $s.mainTest = "Hello Main World!";
}])

.controller('homeController', ['$scope', function ($s) {
    $s.test = "Hello Home World!";
}]);
