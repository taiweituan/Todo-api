// "use strict";

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
    $r.when('/login', {
        title: "Todos Home",
        templateUrl: 'pages/login.html',
        reloadOnSearch: false,
    });
    $r.when('/register', {
        title: "Todos Home",
        templateUrl: 'pages/register.html',
        reloadOnSearch: false,
    });
}])

.controller('mainController', ['$scope', function ($s) {
    $s.mainTest = "Todo Main Page";
}])

.controller('homeController', ['$scope', '$location', function ($s, $l) {
    $s.test = "Main Page";
    $s.loginInfo = {
        inputEmail: '',
        inputPassword: ''
    };

    $s.login = function(loginInfo){
        console.log(loginInfo.inputEmail);
        $l.path('/login');
    };
}])

.controller('loginController', ['$scope', '$location', function ($s, $l) {
    $s.test = "Log In";

}])

.controller('registerController', ['$scope', '$location','$http', function ($s, $l, $http) {
    $s.test = "Register Account";

    $s.register = function(_info){
        
        console.log(_info);

        var req = {
            method:'POST',
            url:'/user',
            headers:{
                'Content-Type': 'application/json'
            },
            data:{
                email: _info.email,
                password: _info.password
            }
        };

        $http(req).then(function(_res){
            console.log(_res);
        }, function(_res){
            cosnole.log('$http failed');
            console.log(_res);
        });
    };
}]);

