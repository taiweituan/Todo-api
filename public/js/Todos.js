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
    $r.otherwise({
        redirectTo:'pages/home.html',
        reloadOnSearch: false,
    });
}])

.factory("todoFactory", ['$http', '$q', function($http, $q){
    var factory = {};

    factory.registerAccount = function(_req){
        console.log('at factory');
        return $http(_req);
    };

    factory.test1 = function (){
        console.log('factory test1');
    };
    factory.test2 = function (){
        console.log('factory test2');
    };
    return factory;
}])

.controller('mainController', ['$scope', function ($s) {
    $s.mainTest = "Todo Main Page";
}])

.controller('loginController', ['$scope', '$location', function ($scope, $location) {
    console.log('Entering login controller');

    $scope.loginInfo = {
        inputEmail: '',
        inputPassword: ''
    };

    $scope.login = function(loginInfo){
        console.log(loginInfo.inputEmail);
        $location.path('/login');
    };

    // todoFactory.test1();
}])

.controller('homeController', ['$scope', 'todoFactory', function ($s, todoFactory) {
    todoFactory.test1();
}])

.controller('registerController', ['$scope', '$location','todoFactory', function ($s, $l, todoFactory) {
    var errors = document.getElementById('error-messages');
    $s.test = "Register Account";

    $s.register = function(_info){
        // console.log(_info);
        //empty the error message board
        errors.innerHTML = '';
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
        var formSubmit = todoFactory.registerAccount(req); 

        formSubmit.then(function(_res){
            console.log(_res);
        }, function(_res){
            console.log('$http failed');
            console.log(JSON.stringify(_res));
            console.log(_res.data.errors[0].message);
            
            var errorMessage = capitalizeFirstLetter(_res.data.errors[0].message);
            errors.innerHTML = errors.innerHTML + errorMessage +'!';
        });
    };
}]);


// Capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

