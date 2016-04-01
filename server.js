var express = require("express");
var bodyParser = require("body-parser");

var app = express();
var PORT = process.env.PORT || 8080;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res){
    res.send('To do API root');
});

// GET /todos
app.get('/todos', function(req, res){
    res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
    var todoID = parseInt(req.params.id, 10);
    var matched;
    
    todos.forEach(function(data){
       if(todoID === data.id){
           matched = data;
       }
    });
    
    if(matched){
        res.json(matched);
    } else {
        res.status(404).send();
    }
});

// POST /todos
app.post('/todos', function(req, res){
    var body = req.body;
    body.id = todoNextId++;
    // todoNextId++;
    
    todos.push(body);
    
    console.log('description: ' + body.description);
    console.log('todos: ' + todos[body.id-1].description);
    res.json(body);
});

app.listen(PORT, function(){
    console.log('expresss listiening on port: ' + PORT);
});