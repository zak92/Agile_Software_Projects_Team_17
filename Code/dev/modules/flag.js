var db = require('../db');


module.exports.flagSnippet = async (req, res) => {
    
 
    let type = req.params.type;
    let str = type.slice(0,-1) + '_id';
    let str_id = type + `.` + str
    

   
    async function flagSnippetInfo(){
    
     let sql = `UPDATE ${type} SET flagged=1 WHERE ${str_id}=?` ;
      
    
        return new Promise(function(resolve,reject){
            db.all(sql , [req.params.id], function(err,rows){
            if(err){return reject(err);}
            resolve(rows);
            console.log(rows)
            
            });
        });
  }
  
  try{

    if(req.user){
     await flagSnippetInfo();
     res.redirect('back');
  
    } else{
      res.send(`Please login`);
    }
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




