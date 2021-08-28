var db = require('../db');

module.exports.insertComment = (req, res) => {
    let comments = req.body.comment;
    let type = req.body.type;
    let title = req.body.title;
    let usr = req.query.id;
    let username = req.body.username;
    let description = req.body.description;
    let last_update  = req.body.last_update;
    let code_snippet = req.body.code_snippet ;
    let snippet_comments = req.body.snippet_comments;
    let data = [comments, title,usr];
    console.log(description, username, last_update, code_snippet,snippet_comments )

    sqltest =`UPDATE ${type} SET comments =? 
    WHERE title =? AND fk_user_id =?`;
    sql =` SELECT * FROM ${type} WHERE title=?`;

    db.serialize(function() {
      db.run(sqltest,data,function(err,rows) {
          if (err) {
            return console.error(err.message);
          }
          console.log(`Row(s) updated: ${this.changes}`);
        });

      db.all(sql,title, function(err, rows) {
        if (err) {
            console.error(err);
            } else {

              let commentResults = rows.map(result => {
                return Object.values(result)
              });
;             console.log(commentResults.language_id);

              res.render("partials/comments", {
                user: usr,
                title:title,
                username: req.body.username,
                description : req.body.description,
                last_update :req.body.last_update,
                code_snippet: req.body.code_snippet,
                snippet_comments: req.body.snippet_comments,
               
                comments: comments,
                type:type,
                // user: user,
                // updated:updated,
                // description: description,
                // snippet :snippet,
              });
            }
                
              // else{res.render("login", {
              // });}

            
        });

    });

}  
    
