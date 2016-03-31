var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;
var todos = [{
    id: 1,
    description: 'Meet mom for lunch',
    completed: false
},{
    id: 2,
    description: 'go to market',
    completed: false
},{
    id:3 ,
    description:'go cat',
    completed: true
}];

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


app.listen(PORT, function(){
    console.log('expresss listiening on port: ' + PORT);
});