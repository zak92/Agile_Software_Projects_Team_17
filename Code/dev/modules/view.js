var db = require('../db');

module.exports.viewLang = async (req, res) => {
    console.log(req.path)
    let langtype = req.path.slice(1,)
    async function languages(){
        
        let sql = `SELECT users.username, tbl_1.fk_user_id, tbl_1.language, tbl_1.title, tbl_1.description, tbl_1.code_snippet, tbl_1.tags, tbl_1.upvotes,  tbl_1.language_id, tbl_1.comments FROM languages tbl_1 INNER JOIN users ON fk_user_id = users.user_id WHERE language = "${langtype}" `;

        if(req.user){

          //sql_sub1 : This table is to select records related to the currently logged in user.
          let sql_sub1 = `SELECT vote_id, post_id FROM vote WHERE post_type = 'languages' AND user_id = ${req.user.id}`;

          //sql : table "tbl_2" in "sql" LEFT JOIN table "tbl_3" in "sql_sub1"
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
    
    let tagsArray = this.ProcessTags(languageResults);
    let paginationArray = this.Pagination(formattedLanguageResults,req);

    res.render("list", {
    title: "Languages",
    subtitle: langtype,
    user: req.user,
    dbresults: paginationArray[3],
    tags: tagsArray,
    totalpages: paginationArray[0],
    currentpage: paginationArray[1],
    itemlimit: paginationArray[2]
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

          //sql_sub1 : This table is to select records related to the currently logged in user.
          let sql_sub1 = `SELECT vote_id, post_id FROM vote WHERE post_type = 'tools' AND user_id = ${req.user.id}`;

          //sql : table "tbl_2" in "sql" LEFT JOIN table "tbl_3" in "sql_sub1"
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
    let tagsArray = this.ProcessTags(results);
    let paginationArray = this.Pagination(formattedToolsResults,req);
    
    res.render("list", {
    title: 'Tools',
    subtitle: false,
    user: req.user,
    dbresults: paginationArray[3],
    tags: tagsArray,
    totalpages: paginationArray[0],
    currentpage: paginationArray[1],
    itemlimit: paginationArray[2]
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
          
          //sql_sub1 : This table is to select records related to the currently logged in user.
          let sql_sub1 = `SELECT vote_id, post_id FROM vote WHERE post_type = 'frameworks' AND user_id = ${req.user.id}`;

          //sql : table "tbl_2" in "sql" LEFT JOIN table "tbl_3" in "sql_sub1"
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
    console.log(formattedFrameworksResults);
    let tagsArray = this.ProcessTags(results);
    let paginationArray = this.Pagination(formattedFrameworksResults,req);

    res.render("list", {
    title: 'Frameworks',
    subtitle: false,
    user: req.user,
    dbresults: paginationArray[3],
    tags: tagsArray,
    totalpages: paginationArray[0],
    currentpage: paginationArray[1],
    itemlimit: paginationArray[2]
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

module.exports.ProcessTags = (results)=>{

  //Initialize a blank string
  let tagstr = '';

  //Traverse the results and insert the tags value into tagstr
  results.forEach(result => {
    tagstr = tagstr + result.tags + ', ';
  });
  //'CLI, Commands, CLI, Commands, CLI, Commands, CLI, Commands, CLI, Commands, CLI, Commands, CLI, Commands, CLI, Commands, '
  
  //Split string
  let strArray = tagstr.split(', ');
  //['CLI', 'Commands', 'CLI', 'Commands','CLI', 'Commands','CLI', 'Commands','CLI', 'Commands','CLI', 'Commands','CLI', 'Commands','CLI', 'Commands', '']
  console.log(strArray);
  //Delete the last element in the array
  strArray.pop();
  //['CLI', 'Commands', 'CLI', 'Commands','CLI', 'Commands','CLI', 'Commands','CLI', 'Commands','CLI', 'Commands','CLI', 'Commands','CLI', 'Commands']

  //Use the dictionary to de-duplicate the array of strArray
  let n = {'':true};//Predefine empty fields
  let r=[];

  for(var i= 0; i<strArray.length;i++){
      if(!n[strArray[i]]){
        n[strArray[i]] = true;
        r.push(strArray[i]);
      }
  }
  //[ 'CLI', 'Commands' ]

  return r;

}

module.exports.Pagination = (results,req) => {

  let currentpage = 1;
  let itemlimit = 5;
  let totalpages = 1;

  if(results.length <= 0) {
    return [totalpages, currentpage, itemlimit, []];
  }

  if(req.query.currentpage){
    currentpage = parseInt(req.query.currentpage);
  }

  if(req.query.itemlimit){
    itemlimit = parseInt(req.query.itemlimit);
  }

  totalpages = results.length / itemlimit;

  if(results.length % itemlimit != 0 ){

    totalpages = Math.floor(totalpages)+1;

  }

  let data_pos_start = (currentpage - 1) * itemlimit;
  let data_pos_end = currentpage * itemlimit;
  let data_slice = results.slice(data_pos_start,data_pos_end);

  return [totalpages, currentpage, itemlimit, data_slice];
}