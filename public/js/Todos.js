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
        return $http(_req);
    };

    factory.loginAccount = function(_req){
        return $http(_req);
    };

    return factory;
}])

.controller('mainController', ['$scope', function ($s) {
    $s.mainTest = "Todo Main Page";
}])

.controller('homeController', ['$scope', 'todoFactory', function ($s, todoFactory) {

    /***
     * @desc: Log out account
     */
    $s.logout = function(){
        var req = {
            method:'DELETE',
            url:'/user/login',
            headers:{
                'Content-Type': 'application/json',
                'Auth': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbiI6IlUyRnNkR1ZrWDErc1hVZkJ2dk80OHlTNjFLcWJRcVJJZG05VTg2MmhGK2h3a0gyN3dJaExKK0k2YWh4Q2JEKzZEeWJjT0IzaG51REtqYnRqTlNLQmF3PT0iLCJpYXQiOjE0NjY3MDA0ODF9.mKUEXQoeBLzHgzgPhWdfNLeVaZI7hTA4Jy6rYe7VrSU'
            },
            data:{
                
            }
        };

        var formSubmit = todoFactory.loginAccount(req);

        formSubmit.then(function(_res){
            //on success
            console.log(_res);
            if (_res.status == '204'){
                console.log('Log out successfully');
            }
        }, function(_res){
            // on error
            console.log(_res);
            if (_res.status == '401'){
                console.log('Wrong token');
            } else {
                console.log('Something went horribly wrong');
            }
        });
    };
}])

.controller('loginController', ['$scope', '$location', 'todoFactory', function ($s, $l, todoFactory) {
    console.log('Entering login controller');

    /***
     * @desc: Log in account
     * @parm: email, password
     * @return: 
     */
    $s.login = function(_req){
        var req = {
            method:'POST',
            url:'/user/login',
            headers:{
                'Content-Type': 'application/json'
            },
            data:{
                email: _req.email,
                password: _req.password
            }
        };

        var formSubmit = todoFactory.loginAccount(req);

        formSubmit.then(function(_res){
            //on success
            console.log(_res);
            console.log(JSON.stringify(_res));
            console.log(_res.data.Auth);
            var accountHeader = Request
        }, function(_res){
            // on error
            console.log('$http failed');
            console.log(_res);
            console.log(_res.data.errors[0].message);
            
            var errorMessage = capitalizeFirstLetter(_res.data.errors[0].message);
            errors.innerHTML = errors.innerHTML + errorMessage +'!';
        });

    };

    // todoFactory.test1();
}])

.controller('registerController', ['$scope', '$location','todoFactory', function ($s, $l, todoFactory) {
    var errors = document.getElementById('error-messages');
    $s.test = "Register Account";
    $s.registerSuccess = false;
    $s.loading = false;

    $s.register = function(_info){
        $s.loading = true;
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
            $s.loading = false;
            $s.registerSuccess = true;

            console.log(_res);
        }, function(_res){
            $s.loading = false;
            $s.registerSuccess = false;

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

