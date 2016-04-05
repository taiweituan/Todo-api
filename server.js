var express = require("express");
var bodyParser = require("body-parser");
var _ = require("underscore");
var db = require("./db.js")

var app = express();
var PORT = process.env.PORT || 8080;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('To do API root');
});

// GET /todos?completed=true&q=house
app.get('/todos', function(req, res) {
    var query = req.query;
    var where = {};

    db.sequelize.sync().then(function() {
        if (query.hasOwnProperty('completed') && query.completed === 'true') {
            where.completed = true;
        }
        else if (query.hasOwnProperty('completed') && query.filteredTodos === 'false') {
            where.completed = false;
        }

        if (query.hasOwnProperty('q') && query.q.length > 0) {
            where.description = {
                $like: '%' + query.q + '%'
            };
        }

        db.todo.findAll({
            where: where
        }).then(function(todo) {
            return res.json(todo);
        });
    }).catch(function(e) {
        console.log(e);
        return res.status(500).send();
    });
});

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
    var todoID = parseInt(req.params.id, 10);

    db.sequelize.sync().then(function() {
        db.todo.findById(todoID).then(function(todo) {
            if (todo) {
                console.log(todo.toJSON());
                res.json(todo.toJSON());
            }
            else {
                console.log('todo not found');
                return res.status(404).send();
            }
        });
    });
});


// POST /todos
app.post('/todos', function(req, res) {
    var body = _.pick(req.body, 'description', 'completed');

    // validation
    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
        return res.status(400).send();
    }

    // construct database
    db.todo.create(body).then(function(todos) {
        if (todos) {
            res.json(todos.toJSON());
            console.log(todos.toJSON());
        }
        else {
            console.log('no todo found');
        }
    }).catch(function(e) {
        console.log(e);
        res.status(400).json(e);
    });
});

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
    // var body = req.body;
    var where = {};
    var todoID = parseInt(req.params.id, 10);
    where.id = todoID;
    
    db.todo.destroy({where:where}).then(function(todo) {
        if (todo) {
            console.log(todo.toJSON());
            res.json(todo.toJSON());
        }
        else {
            console.log('todo not found');
            return res.status(404).send();
        }
    }).catch(function(e) {
        return res.status(400).json(e);
    });

    // var matchedTodo = _.findWhere(todos, {
    //     id: todoID
    // });
    // if (!matchedTodo) {
    //     res.status(404).json({
    //         "error": "no todo found"
    //     });
    // }
    // else {
    //     todos = _.without(todos, matchedTodo);
    //     res.json(todos);
    // }
});

// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
    var todoID = parseInt(req.params.id, 10);
    var body = _.pick(req.body, 'description', 'completed');
    var attributes = {};
   
    if (body.hasOwnProperty('completed')) {
        attributes.completed = body.completed;
    }
   
    if (body.hasOwnProperty('description')) {
        attributes.description = body.description;
    }
   
    db.todo.findById(todoID).then(function(todo) {
        if (todo){
            console.log(todo);
            return todo.update(attributes);
        } else{
            return res.status(404).send();
        }
    }, function(){
        res.status(500).send();
    }).then(function(todo){
        console.log(todo);
        res.json(todo.toJSON());
    }, function(e){
        res.status(500).json(e);
    }).catch(function(e) {
        console.log(e);
    });
});

db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
        console.log('expresss listiening on port: ' + PORT);
    });
});