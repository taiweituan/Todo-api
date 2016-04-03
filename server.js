var express = require("express");
var bodyParser = require("body-parser");
var _ = require("underscore");
var db = require("./db.js")

var app = express();
var PORT = process.env.PORT || 8080;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res){
    res.send('To do API root');
});

// GET /todos?completed=true&q=house
app.get('/todos', function(req, res){
    var queryParams = req.query;
    var filteredTodos = todos;
    
    if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
        filteredTodos = _.where(filteredTodos, {completed: true});
    } else if(queryParams.hasOwnProperty('completed') && queryParams.filteredTodos === 'false'){
        filteredTodos = _.where(filteredTodos, {completed: false});
    }
    
    if(queryParams.hasOwnProperty('q') && queryParams.q.length >0){
        filteredTodos = _.filter(filteredTodos, function(todo){
            return todo.description.indexOf(queryParams.q.toLowerCase()) > -1;
        });
    }
    res.json(filteredTodos);
});

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
    var todoID = parseInt(req.params.id, 10);
    
    db.sequelize.sync().then(function() {
        db.todo.findById(todoID).then(function(todo){
            if(todo){
                console.log(todo.toJSON());
                res.json(todo.toJSON());
            } else {
                return res.status(404).send();
                console.log('todo not found');
            }
        });
    });
    
    // var matchedTodo = _.findWhere(todos, {
    //     id: todoID
    // });
    // if(matchedTodo){
    //     res.json(matchedTodo);
    // } else {
    //     res.status(404).send();
    // }
});


// POST /todos
app.post('/todos', function(req, res){
    var body = _.pick(req.body, 'description', 'completed');
    
    // validation
    if (!_.isBoolean(body.completed)||!_.isString(body.description)|| body.description.trim().length === 0){
        return res.status(400).send();
    }
    
    // construct database
    db.todo.create(body).then(function (todos) {
        if (todos){
            res.json(todos.toJSON());
            console.log(todos.toJSON());
        } else {
            console.log('no todo found');
        }
    }).catch (function(e){
        console.log(e);
        res.status(400).json(e);
    });
    
    
    
    // if (!_.isBoolean(body.completed)||!_.isString(body.description)|| body.description.trim().length === 0){
    //     return res.status(400).send();
    // }
    
    // body.description = body.description.trim();
    // body.id = todoNextId++;

    // todos.push(body);
    // res.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res){
    // var body = req.body;
    var todoID = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoID});
    console.log(req.params.id);
    
    if (!matchedTodo){
        res.status(404).json({"error": "no todo found"});
    } else {
        todos = _.without(todos, matchedTodo);
        res.json(todos);
    }
});

// PUT /todos/:id
app.put('/todos/:id', function(req,res){
    var todoID = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoID});
    var body = _.pick(req.body, 'description', 'completed');
    
    var validAttributes = {
        
    };
    
    if (!matchedTodo){
        return res.status(404).send();
    }
    
    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
        validAttributes.completed = body.completed;
    } else if ( body.hasOwnProperty('completed')){
        return res.status(400).send();
    }
    
    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length >0){
        validAttributes.description = body.description;
    } else if(body.hasOwnProperty('description')){
        return res.status(400).send();
    } 
    // body.hasOwnProperty('completed')
    
    _.extend(matchedTodo, validAttributes);
    res.json(matchedTodo);
    
});


db.sequelize.sync().then(function(){
    app.listen(PORT, function(){
        console.log('expresss listiening on port: ' + PORT);
    });
});
