var db = require('../db');

module.exports.viewSnippets = async (req, res) => {
         
    let type = req.query.type;
    let title = type + `.title`
    let description = type + `.description`
    let last_update = type + `.last_update`
    let upvotes = type + `.upvotes`
    let flagged = type + `.flagged`
    let code_snippet = type + `.code_snippet`
    let str = type.slice(0,-1) + '_id';
    let str_id = type + `.` + str

   
    async function viewSnippetInfo(){

    // get data that matches the unique id
    
    let sql = `SELECT ${title}, users.username, ${description}, ${last_update}, ${upvotes}, ${flagged}, ${code_snippet}
              FROM ${type}
              INNER JOIN  users ON ${str_id}=users.user_id
              WHERE ${str_id}=?` ;  
    
        
      
    
        return new Promise(function(resolve,reject){
            db.all(sql , [req.query.id], function(err,rows){
            if(err){return reject(err);}
            resolve(rows);
            
            });
        });
  }

  try{
    let snippetResults = await viewSnippetInfo();

    let formattedSnippetResults = snippetResults.map(result => {
        return Object.values(result)
      })
    
    
    res.render("viewcode", {
      title: "Code Snippets",
      user: req.user,
      dbsnippetresults: formattedSnippetResults
    
    });
    }catch (error) {
        console.log(error);
          res.render("index", {
            user: req.user,
            title:"Site Title",
            message:"DB ERROR",
            results:[]
          });
      }
}




