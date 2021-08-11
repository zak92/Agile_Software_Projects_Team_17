var db = require('../db');

module.exports.viewLang = async (req, res) => {

    let langtype = req.path.slice(1,)
    async function languages(){
        
        let sql = `SELECT users.username, tbl_1.fk_user_id, tbl_1.language, tbl_1.title, tbl_1.description, tbl_1.code_snippet, tbl_1.tags, tbl_1.upvotes,  tbl_1.language_id FROM languages tbl_1 INNER JOIN users ON fk_user_id = users.user_id WHERE language = "${langtype}" `;

        if(req.user){
          let sql_sub1 = `SELECT vote_id, post_id FROM vote WHERE post_type = 'languages' AND user_id = ${req.user.id}`;
          sql = `SELECT tbl_2.* ,tbl_3.vote_id FROM (${sql}) AS tbl_2 LEFT JOIN (${sql_sub1}) AS tbl_3 ON tbl_2.language_id = tbl_3.post_id`;
        }

        return new Promise(function(resolve,reject){
            db.all(sql, function(err,rows){
            if(err){return reject(err);}
            resolve(rows);
            });
        });
  }

  try{
    let languageResults = await languages();

    let formattedLanguageResults = languageResults.map(result => {
        return Object.values(result)
      })
    
    res.render("list", {
    title: "Languages",
    subtitle: langtype,
    user: req.user,
    dbresults: formattedLanguageResults,
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

module.exports.viewTools = async (req, res) => {

    async function tools(){
        
        let sql = `SELECT users.username, tbl_1.fk_user_id, tbl_1.tool, tbl_1.title, tbl_1.description, tbl_1.code_snippet, tbl_1.tags, tbl_1.upvotes, tbl_1.tool_id  FROM tools tbl_1 INNER JOIN users ON fk_user_id = users.user_id `;
        if(req.user){
          let sql_sub1 = `SELECT vote_id, post_id FROM vote WHERE post_type = 'tools' AND user_id = ${req.user.id}`;
          sql = `SELECT tbl_2.* ,tbl_3.vote_id FROM (${sql}) AS tbl_2 LEFT JOIN (${sql_sub1}) AS tbl_3 ON tbl_2.tool_id = tbl_3.post_id`;
        }

        return new Promise(function(resolve,reject){
            db.all(sql, function(err,rows){
            if(err){return reject(err);}
            resolve(rows);
            });
        });
  }

  try{
    let results = await tools();
    console.log(results)
    let formattedToolsResults = results.map(result => {
        return Object.values(result)
      })
    
    res.render("list", {
    title: 'Tools',
    subtitle: false,
    user: req.user,
    dbresults: formattedToolsResults,
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

module.exports.viewFrameworks = async (req, res) => {

    async function frameworks(){
        
        let sql = `SELECT users.username, tbl_1.fk_user_id, tbl_1.framework, tbl_1.title, tbl_1.description, tbl_1.code_snippet, tbl_1.tags, tbl_1.upvotes, tbl_1.framework_id  FROM frameworks tbl_1 INNER JOIN users ON fk_user_id = users.user_id `;
        //users.username, frameworks.fk_user_id, frameworks.framework, frameworks.title 

        if(req.user){
          let sql_sub1 = `SELECT vote_id, post_id FROM vote WHERE post_type = 'frameworks' AND user_id = ${req.user.id}`;
          sql = `SELECT tbl_2.* ,tbl_3.vote_id FROM (${sql}) AS tbl_2 LEFT JOIN (${sql_sub1}) AS tbl_3 ON tbl_2.framework_id = tbl_3.post_id`;
        }

        return new Promise(function(resolve,reject){
            db.all(sql, function(err,rows){
            if(err){return reject(err);}
            resolve(rows);
            });
        });
  }

  try{
    let results = await frameworks();
    console.log(results)
    let formattedFrameworksResults = results.map(result => {
        return Object.values(result)
      })
      console.log(formattedFrameworksResults)
    res.render("list", {
    title: 'Frameworks',
    subtitle: false,
    user: req.user,
    dbresults: formattedFrameworksResults,
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