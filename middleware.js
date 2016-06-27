var cryptojs = require("crypto-js");
module.exports = function(db){
    return {
        requireAuthentication:function(req,res,next){
            var token = req.get('Auth') || '';
            
            // look for token in database
            db.token.findOne({
                where:{
                    tokenHash: cryptojs.MD5(token).toString()
                }
            }).then(function(tokenInstance){
                
                if (!tokenInstance){
                    return res.status(403).send({ 
                        success: false, 
                        message: 'No token provided.' 
                    });
                }
                
                req.token = tokenInstance;
                return db.user.findByToken(token);
            }).then(function(user){
                req.user = user;
                next();
            }).catch(function(){
                res.status(401).send();
            });
            
            // db.user.findByToken(token).then(function(user){
            //     req.user = user;
            //     next();
            // }, function(){
            //     res.status(401).send();
            // });
        }
    };
};