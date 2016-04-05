var Sequelize = require("sequelize");
var env = process.env.NODE_ENV || 'developmen';
var sequelize;

if (env === 'production'){
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres'
    });
} else {
    sequelize = new Sequelize(undefined, undefined, undefined,{
        'dialect': 'sqlite',
        'storage': __dirname + '/data/dev-todo-spi.sqlite'
    });
}

var db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Imports a model defined in another file
db.todo = sequelize.import(__dirname + '/models/todo.js'); 
db.user = sequelize.import(__dirname + '/models/user.js');
module.exports = db;
