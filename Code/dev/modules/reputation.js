var db = require('../db');
var reputation = require('../modules/reputation');
  

module.exports.upvote = async (req, res) => {

    try{
        //Check login status
        if(req.user){

            let post_type = req.query.post_type;
            let post_id = req.query.post_id;
            let user_id = req.user.id;

            //Prevent users from using the get method to vote maliciously, so need to check the table "vote".
            let VoteExist = await reputation.CheckVote(post_type, post_id, user_id);

            //If VoteExist is true, the same record exists in the database.
            if(VoteExist){
                res.redirect(`/`);
            }else{
                //Insert a record into the table "vote"
                await reputation.InsertRecord(post_type, post_id, user_id);
                //Update the "upvotes" of the target table
                await reputation.ModifyVote(post_type, post_id);
                
                //Determine whether the current page has "subtitle" (to determine whether it is of the "languages" type)
                if(req.query.subtitle == 'false'){

                    res.redirect(`/${post_type}`);

                }else{
          
                    res.redirect(`/${req.query.subtitle}`);
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

        //Insert an upvote record into the table "vote".
        let sql = `INSERT INTO vote(post_type, post_id, user_id) VALUES(?, ?, ?)`;
        db.run(sql, [post_type, post_id, user_id], function(err){

            if(err){return reject(err);}

        });
        resolve();
    });
};

module.exports.ModifyVote = (post_type, post_id) =>{


    return new Promise(function(resolve,reject){
        
        //etc..."frameworks" ---->> "framework_id"
        //etc..."tools" ---->> "tool_id"
        //etc..."languages" ---->> "language_id"
        let str = post_type.slice(0,-1) + '_id';

        //Upvote + 1
        let sql = `UPDATE ${post_type} SET upvotes = upvotes + 1 WHERE ${str} = ${post_id}`;

        db.run(sql, function(err){

            if(err){return reject(err);}

        });
        resolve();
    });
};

module.exports.CheckVote = (post_type, post_id, user_id) =>{

    return new Promise(function(resolve,reject){

        //Check whether the same record exists in the "vote" table
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

module.exports.upvote_ajax = async (req, res) => {

    try{
        //Check login status
        if(req.user){

            let post_type = req.body.type;
            let post_id = req.body.id;
            let user_id = req.user.id;

            //Prevent users from using the get method to vote maliciously, so need to check the table "vote".
            let VoteExist = await reputation.CheckVote(post_type, post_id, user_id);

            //If VoteExist is true, the same record exists in the database.
            if(VoteExist){
                res.send(`fail`);
            }else{
                //Insert a record into the table "vote"
                await reputation.InsertRecord(post_type, post_id, user_id);
                //Update the "upvotes" of the target table
                await reputation.ModifyVote(post_type, post_id);
                
                res.send('success');
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

module.exports.CheckVote_ajax = async(req,res) => {

    try{
        //Check login status
        if(req.user){

            let post_type = req.body.type;
            let post_id = req.body.id;
            let user_id = req.user.id;

            //Prevent users from using the get method to vote maliciously, so need to check the table "vote".
            let VoteExist = await reputation.CheckVote(post_type, post_id, user_id);

            //If VoteExist is true, the same record exists in the database.
            if(VoteExist){
                res.send('VoteExisted');
            }else{
            
                res.send('NotExist');
            }
            
        }else{
            res.send('LoggedOut');
        }

    }

    catch(error){
        console.log(error);
        res.redirect(`/`);
    }
}