var express = require("express");
var bodyParser = require("body-parser");
var _ = require("underscore");
var db = require("./db.js");
var bcrypt = require("bcrypt");
var middleware = require("./middleware.js")(db);

var app = express();
var PORT = process.env.PORT || 8081;
var todos = [];
var todoNextId = 1;

// parse application/json
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.send('To do API root');
});

// GET /todos?completed=true&q=house
app.get('/todos', middleware.requireAuthentication, function(req, res) {
    var query = req.query;
    var where = {
        userId: req.user.get('id')
    };

    db.sequelize.sync().then(function() {
        if (query.hasOwnProperty('completed') && query.completed === 'true') {
            where.completed = true;
        } else if (query.hasOwnProperty('completed') && query.filteredTodos === 'false') {
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
app.get('/todos/:id', middleware.requireAuthentication, function(req, res) {
    var todoID = parseInt(req.params.id, 10);

    db.sequelize.sync().then(function() {
        db.todo.findOne({
            where: {
                id: todoID,
                userId: req.user.get('id')
            }
        }).then(function(todo) {
            if (todo) {
                console.log(todo.toJSON());
                res.json(todo.toJSON());
            } else {
                console.log('todo not found');
                return res.status(404).send();
            }
        });
    });
});


// POST /todos
app.post('/todos', middleware.requireAuthentication, function(req, res) {
    var body = _.pick(req.body, 'description', 'completed');

    // validation
    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
        return res.status(400).send();
    }

    // construct database
    db.todo.create(body).then(function(todos) {
        if (todos) {
            // res.json(todos.toJSON());
            console.log(todos.toJSON());
            req.user.addTodo(todos).then(function() {
                // the todos result is different from database
                // thus, reload is needed
                return todos.reload();
            }).then(function(todo) {
                res.json(todos.toJSON());
            });
        } else {
            console.log('no todo found');
        }
    }).catch(function(e) {
        res.status(400).json(e);
    });
});

// DELETE /todos/:id
app.delete('/todos/:id', middleware.requireAuthentication, function(req, res) {
    // var body = req.body;
    var where = {};
    var todoID = parseInt(req.params.id, 10);
    where.id = todoID;

    db.todo.destroy({
        where: where
    }).then(function(todo) {
        if (todo) {
            console.log(todo.toJSON());
            res.json(todo.toJSON());
        } else {
            console.log('todo not found');
            return res.status(404).send();
        }
    }).catch(function(e) {
        return res.status(400).json(e);
    });
});

// PUT /todos/:id
app.put('/todos/:id', middleware.requireAuthentication, function(req, res) {
    var todoID = parseInt(req.params.id, 10);
    var body = _.pick(req.body, 'description', 'completed');
    var attributes = {};

    if (body.hasOwnProperty('completed')) {
        attributes.completed = body.completed;
    }

    if (body.hasOwnProperty('description')) {
        attributes.description = body.description;
    }

    db.todo.findOne({
        where: {
            id: todoID,
            userID: req.user.get('id')
        }
    }).then(function(todo) {
        if (todo) {
            console.log('updating todo');
            return todo.update(attributes);
        } else {
            console.log('151, something went wrong');
            return res.status(404).send();
        }
    }, function() {
        res.status(500).send();
        throw new Error('Failed to update database');
    }).then(function(todo) {
        console.log('success');
        // res.json(todo.toJSON());
    }, function(e) {
        res.status(500).json(e);
        throw new Error('Failed to return the message.');
    }).catch(function(e) {
        console.log('ERROR: ' + e);
    });
});

// @desc: register account?
// POST /user
app.post('/user', function(req, res) {
    var body = _.pick(req.body, 'email', 'password');
    db.user.create(body).then(function(user) {
        if (user) {
            res.json(user.toJSON());
            console.log(user.toJSON());
        } else {
            console.log('no user found');
        }
    }).catch(function(e) {
        console.log(e);
        res.status(400).json(e);
    });
});

// @desc: log in to account
// POST /user/login
app.post('/user/login', function(req, res) {
    var body = _.pick(req.body, 'email', 'password');
    var userInstance;

    db.user.authenticate(body).then(function(user) {
        var token = user.generateToken('authentication');
        userInstance = user;
        return db.token.create({
            token: token
        });

    }).then(function(tokenInstance) {
        console.log('Generating token:')
        console.log(tokenInstance.get('token'));

        // res.header('Auth', tokenInstance.get('token')).json(userInstance.toPublicJSON());
        res.json({
            success: true,
            token: tokenInstance.get('token')
        });
    }).catch(function() {
        res.status(401).send();
    });
});

// @desc: log out the account
// DELETE /user/login (Logout)
app.delete('/user/login', middleware.requireAuthentication, function(req, res) {
    // check if token exists
    if (req.token) {
        req.token.destroy().then(function() {
            res.status(204).send();
        }).catch(function() {
            // 500 = server error 
            res.status(500).send();
        });
    } else {
        res.status(500).send();
    }
});

db.sequelize.sync({
    force: false
}).then(function() {
    app.listen(PORT, function() {
        console.log('expresss listiening on port: ' + PORT);
    });
});