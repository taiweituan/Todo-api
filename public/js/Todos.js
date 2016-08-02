// "use strict";

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
    $r.when('/logout', {
        title: "Todos Home",
        templateUrl: 'pages/logout.html',
        reloadOnSearch: false,
    });
    $r.when('/test', {
        title: "Todos Home",
        templateUrl: 'pages/test.html',
        reloadOnSearch: false,
    });
    $r.when('/todo', {
        title: "Todos Home",
        templateUrl: 'pages/todo.html',
        reloadOnSearch: true,
        resolve:{
            
        }
    });
    // $r.when('/logout',{
    //     resolve:{
    //         todoFactory.logOutAccount()
    //     }
    // });
    $r.otherwise({
        redirectTo:'pages/home.html',
        reloadOnSearch: false,
    });
}])

.run(function($rootScope, $location, $route, todoFactory){
    $rootScope.$on('$locationChangeStart', function(event, next, current){
        var nextRoute = $route.routes[$location.path()];
        console.log(nextRoute);
        if (nextRoute && nextRoute.originalPath == "/todo" && todoFactory.isLoggedIn() == false){
            alert("You must log in first!");
            event.preventDefault();
        }
    });
})

.factory("todoFactory", ['$http', '$q','$cookies','$location', '$timeout', function($http, $q, $c, $l, $t){
    var factory = {};

    // change location using $location
    factory.changeLocation = function(_location){
        console.log('changing location');
        $t(function(){
            $l.path(_location);
        }, 1000);
    };

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

    // get the to-do list
    factory.getTodoList = function(){
        var req = {
            method:'GET',
            url:'/todos',
            headers:{
                'Content-Type': 'application/json',
                'Auth': this.getToken
            },
            data:{
            }
        };

        return $http(req);
    };
    
    // add reminder to the to-do list
    factory.addTodoList = function(_todo){
        var req = {
            method:'POST',
            url:'/todos',
            headers:{
                'Content-Type': 'application/json',
                'Auth': this.getToken
            },
            data:{
                "description": _todo.description,
                "completed": _todo.completed
            }
        };
        return $http(req);
    };

    factory.updateTodoList = function(_todo){
        console.log(_todo);
        var req = {
            method:'PUT',
            url:'/todos/'+ _todo.id,
            headers:{
                'Content-Type': 'application/json',
                'Auth': this.getToken
            },
            data:{
                "description": _todo.description,
                "completed": _todo.completed
            }
        };
        return $http(req);
    };


    return factory;
}])

.controller('mainController', ['$scope','$location','todoFactory', function ($s, $l, todoFactory) {
    
    var menuList = [
    {
        name: 'Home',
        link: '#/'
    }, {
        name: 'Login',
        link: '#/login'
    }, {
        name: 'Register',
        link: '#/register'
    }
    // , {
    //     name: 'Test',
    //     link: '#/test'
    // },{
    //     name: 'View',
    //     link: '#/view'
    // }
    ];
    
    var loggedInMenuList = [
    // {
    //     name: 'Home',
    //     link: '#/'
    // },
    {
        name:'Todo',
        link: '#/todo'
    },{
        name: 'Logout',
        link: '#/logout'
    }
    // ,{
    //     name: 'View',
    //     link: '#/view'
    // },{
    //     name: 'Test',
    //     link: '#/test'
    // }
    ];

    $s.logout = function(){
        console.log('logout');
        todoFactory.logOutAccount();
    };

    $s.$on('$locationChangeSuccess', function(){
        if (!todoFactory.isLoggedIn()){
            $s.menuList = menuList;
        } else {
            $s.menuList = loggedInMenuList;
        }
    });
    
}])

.controller('viewController', ['$scope', 'todoFactory', function ($s, todoFactory) {
    console.log($s);
    /***
     * @desc: Log out account
     */
    $s.logout = function(){
        var formSubmit = todoFactory.logOutAccount();
        var resultMessage = document.getElementById("result-message");
        formSubmit.then(function(_res){
            //on success
            resultMessage.style.color = "green";
            resultMessage.innerHTML = "Successfully Logged Out!";

        }, function(_res){
            // on error
            console.log(_res);
            if (_res.status == '401'){
                console.log('Wrong token');
            } else {
                resultMessage.style.color = "red";
                resultMessage.innerHTML = "Authentication failed!";
            }
        });

        // clear token inside cookie
        todoFactory.clearToken(); 
        todoFactory.changeLocation('/login');

    };
}])

.controller('loginController', ['$scope', 'todoFactory', function ($s, todoFactory) {
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
            // on success
            console.log(_res);
            
            todoFactory.setToken(_res.data.token);
            console.log('Factory token: ' + todoFactory.getToken());
            
            todoFactory.setToken(_res.data.token);
            message.style.color = "green";
            message.innerHTML = 'Log In was Successful!';

            // jump to todo page 
            todoFactory.changeLocation('/todo');

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

.controller('registerController', ['$scope','todoFactory', function ($s, todoFactory) {
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

.controller('testController', ['$scope','todoFactory', function ($s, todoFactory) {
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
        formSubmit.then(function(_res){
            alert('Logout Successful!');
        }, function(_res){
            alert('Logout Failed!');
        });

    };

    $s.getCookie = function (){
        var token = $c.get('token');
        console.log(token);
    };

    $s.setCookie = function (){
        $c.put('token', 'myBearerToken');
    };

    $s.changeLocation = function(){
        todoFactory.changeLocation('/login');
    };
}])

// Todo List page controller
.controller('todoController', ['$scope','todoFactory', function ($s, todoFactory) {
    listInit();
    $s.isEditing = false;
    $s.sortType = 'description';

    // execute these upon entering controller, which is refresh
    // the to-do list
    angular.element(document).ready(function(){
        var isLoggedIn = todoFactory.isLoggedIn();
        if (isLoggedIn === true){
            getTodoList();
        }
    });
    
    $s.addTodo = function(todo){
        // add todo
        console.log(todo);
        var addTodoList = todoFactory.addTodoList(todo);
        addTodoList.then(function(_data){
            console.log(_data);
            console.log('todo added!');
            getTodoList();    
            
            // clear input fields
            $s.todo = {
                "description": "",
                "completed" : false
            };
        });
    };

    $s.getTodoList = function(){
        getTodoList();
    };

    $s.setTodo = function(){
        $s.isEditing = !$s.isEditing;
    };

    // submit update todo
    // arg: Array of Objects
    $s.submitSetTodo = function(_todo){
        _todo.forEach(function(todo) {
            todoFactory.updateTodoList(todo).then(function(_data){
                console.log('updating');
            });
        }, this);
    };

    // initialize todo input fields
    function listInit (){
        $s.todo = {
            "description": "",
            "completed" : false
        };
    }

    // refresh the todo list
    function getTodoList(){
        var getTodoList = todoFactory.getTodoList();
        getTodoList.then(function(_data){
            $s.todos = _data.data;
        });
    }
}])

// Home controller
.controller('homeController', ['$scope','todoFactory', function ($s, todoFactory) {
    console.log('homecontroller');
}])


.controller('logoutController', ['$scope','todoFactory', function ($s, todoFactory) {
    console.log('logoutController');
    
    var formSubmit = todoFactory.logOutAccount();
    var resultMessage = document.getElementById("result-message");
    formSubmit.then(function(_res){
        //on success
        resultMessage.style.color = "green";
        resultMessage.innerHTML = "Successfully Logged Out!";

    }, function(_res){
        // on error
        console.log(_res);
        if (_res.status == '401'){
            console.log('Wrong token');
        } else {
            resultMessage.style.color = "red";
            resultMessage.innerHTML = "Authentication failed!";
        }
    });

    // clear token inside cookie
    todoFactory.clearToken(); 
    todoFactory.changeLocation('/login');

}]);




// Capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
