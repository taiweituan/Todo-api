﻿// "use strict";

angular.module('mainApp', [
    'ui.bootstrap',
    'ngRoute',
    'ngCookies'
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
     $r.when('/view', {
        title: "Todos Home",
        templateUrl: 'pages/view.html',
        reloadOnSearch: false,
    });
    $r.otherwise({
        redirectTo:'pages/home.html',
        reloadOnSearch: false,
    });
}])

.factory("todoFactory", ['$http', '$q','$cookies', function($http, $q, $c){
    var factory = {};

    // check if client is already logged in
    factory.isLoggedIn = function (){
        return (typeof this.getToken() !== 'undefined');
    };

    // set token into cookie
    factory.setToken = function(_token){
        $c.put('token', _token);
    };

    // get token from cookie
    factory.getToken = function (){
        return $c.get('token');;
    };

    // clear token from the cookie
    factory.clearToken = function (){
        $c.remove('token');
    };

    // register account
    factory.registerAccount = function(_parm){
        var req = {
            method:'POST',
            url:'/user',
            headers:{
                'Content-Type': 'application/json'
            },
            data:{
                email: _parm.email,
                password: _parm.password
            }
        };
        return $http(req);
    };

    // log in account
    factory.logInAccount = function(_parm){
        var req = {
            method:'POST',
            url:'/user/login',
            headers:{
                'Content-Type': 'application/json',
            },
            data:{
                email: _parm.email,
                password: _parm.password
            }
        };
        return $http(req);
    };

    // log out account
    factory.logOutAccount = function(){
        var req = {
            method:'DELETE',
            url:'/user/login',
            headers:{
                'Content-Type': 'application/json',
                'Auth': this.getToken
            },
            data:{
            }
        };

        return $http(req);
    };
    
    return factory;
}])

.controller('mainController', ['$scope', function ($s) {
    var menuList = [{
        name: 'Home',
        link: '#/'
    }, {
        name: 'Login',
        link: '#/login'
    }, {
        name: 'Register',
        link: '#/register'
    }, {
        name: 'View',
        link: '#/view'
    }];
    
    $s.menuList = menuList;
}])

.controller('homeController', ['$scope', 'todoFactory', function ($s, todoFactory) {

    /***
     * @desc: Log out account
     */
    $s.logout = function(){
        var formSubmit = todoFactory.logOutAccount();
        formSubmit.then(function(_res){
            //on success
            console.log(_res);
            // remove token from cookie
            todoFactory.clearToken();
            alert('Successfully Logged Out!');
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
        var message = document.getElementById('message'); 
        message.style.color = "red";
        if (todoFactory.isLoggedIn()){
            message.innerHTML = 'You already logged in!';
            return;
        }


        var formSubmit = todoFactory.logInAccount(_req);
        formSubmit.then(function(_res){
            //on success
            console.log(_res);
            
            todoFactory.setToken(_res.data.token);
            console.log('Factory token: ' + todoFactory.getToken());
            
            todoFactory.setToken(_res.data.token);
            message.style.color = "green";
            message.innerHTML = 'Log In was Successful!';
        }, function(e){
            // on error
            console.log(e);
            if(e.status == 401){
                message.innerHTML = 'Account & Password Not Found!';
            }
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
        
        var formSubmit = todoFactory.registerAccount(_info); 
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
}])

.controller('testController', ['$scope', '$location','todoFactory','$cookies', function ($s, $l, todoFactory,$c) {
    $s.getTest = function(){
        console.log(todoFactory.getToken());
    };
    $s.setTest = function(_parm){
        todoFactory.setToken(_parm);
    };

    $s.logout = function(){
        var req = {
            method:'DELETE',
            url:'/user/login',
            headers:{
                'Content-Type': 'application/json',
                'Auth': todoFactory.getToken()
            }
        };

        var formSubmit = todoFactory.registerAccount(req); 
        formSubmit.then()

    };

    $s.getCookie = function (){
        var token = $c.get('token');
        console.log(token);
    };

    $s.setCookie = function (){
        $c.put('token', 'myBearerToken');

    };
}]);

// Capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
