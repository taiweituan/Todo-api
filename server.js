var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;

app.get('/', function(req, res){
    res.send('To do API root');
});

app.listen(PORT, function(){
    console.log('expresss listiening on port: ' + PORT);
});