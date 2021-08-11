var db = require('../db');
var reputation = require('../modules/reputation');
  

module.exports.upvote = async (req, res) => {

    try{
        //Check login status
        if(req.user){
            let post_type = req.query.post_type;
            let post_id = req.query.post_id;
            let user_id = req.user.id;

            let VoteExist = await reputation.CheckVote(post_type, post_id, user_id);

            if(VoteExist){
                res.redirect(`/`);
            }else{
                await reputation.InsertRecord(post_type, post_id, user_id);
                await reputation.ModifyVote(post_type, post_id);
                
                if(req.query.subtitle){
                    console.log(req.query.subtitle);
                    res.redirect(`/${req.query.subtitle}`);
                }else{
                    res.redirect(`/${post_type}`);
                }
            }
            
        }else{
            throw new Error('Logged out');
        }

    }

    catch(error){
        console.log(error);
        res.redirect(`/`);
    }

    
};

module.exports.InsertRecord = (post_type, post_id, user_id) =>{


    return new Promise(function(resolve,reject){
        let sql = 'INSERT INTO vote(post_type, post_id, user_id) VALUES(?, ?, ?)';

        db.run(sql,[post_type, post_id, user_id], function(err){

            if(err){return reject(err);}

        });
        resolve();
    });
};

module.exports.ModifyVote = (post_type, post_id) =>{


    return new Promise(function(resolve,reject){
        
        let str = post_type.slice(0,-1) + '_id';
        let sql = `UPDATE ${post_type} SET upvotes = IFNULL(NULL,0)+1 WHERE ${str} = ${post_id}`;
        console.log(sql);
        db.run(sql, function(err){

            if(err){return reject(err);}

        });
        resolve();
    });
};

module.exports.CheckVote = (post_type, post_id, user_id) =>{

    return new Promise(function(resolve,reject){
        let sql = `SELECT vote_id FROM vote WHERE post_type = '${post_type}' AND post_id = ${post_id} AND user_id = ${user_id}`;
        db.get(sql,function(err, row){
            if(err){return reject(err);}
            if(row){
                resolve(true);
            }else{
                resolve(false);
            }
        });
        
    });
};