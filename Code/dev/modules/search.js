var db = require('../db');
  
// Probably not the best way, but this main method synchronously searches multiple tables in the database and then returns 
// the results. The use of async/await is to get sqlite3 to be synchronous instead of asynchronous.
module.exports.search = async (req, res, searchTerm) => {

    async function languages(searchTerm){
      let language = `language LIKE '%${searchTerm}%'`
      let title = `title LIKE '%${searchTerm}%'`
      let description = `description LIKE '%${searchTerm}%'`
      let tags = `tags LIKE '%${searchTerm}%'`
    
      let sql = `SELECT * FROM languages WHERE ${language} OR ${title} OR ${description} OR ${tags}  ORDER BY language`;
    
      return new Promise(function(resolve,reject){
          db.all(sql, function(err,rows){
            if(err){return reject(err);}
            resolve(rows);
          });
      });
    }

    async function frameworks(searchTerm){
      let framework = `framework LIKE '%${searchTerm}%'`
      let title = `title LIKE '%${searchTerm}%'`
      let description = `description LIKE '%${searchTerm}%'`
      let tags = `tags LIKE '%${searchTerm}%'`
    
      let sql = `SELECT * FROM frameworks WHERE ${framework} OR ${title} OR ${description} OR ${tags}  ORDER BY framework`;
    
      return new Promise(function(resolve,reject){
          db.all(sql, function(err,rows){
            if(err){return reject(err);}
            resolve(rows);
          });
      });
    }

    async function tools(searchTerm){
      let framework = `tool LIKE '%${searchTerm}%'`
      let title = `title LIKE '%${searchTerm}%'`
      let description = `description LIKE '%${searchTerm}%'`
      let tags = `tags LIKE '%${searchTerm}%'`
    
      let sql = `SELECT * FROM tools WHERE ${framework} OR ${title} OR ${description} OR ${tags}  ORDER BY tool`;
    
      return new Promise(function(resolve,reject){
          db.all(sql, function(err,rows){
            if(err){return reject(err);}
            resolve(rows);
          });
      });
    }

    try {
      let languageResults = await languages(searchTerm);
      let frameworksResults = await frameworks(searchTerm);
      let toolsResults = await tools(searchTerm);
      
      let formattedLanguageResults = languageResults.map(result => {
        return Object.values(result)
      })

      let formattedFrameworksResults = frameworksResults.map(result => {
        return Object.values(result)
      })

      let formattedToolsResults = toolsResults.map(result => {
        return Object.values(result)
      })

      res.render("search", {
        title: "Search",
        message: false,
        languages: formattedLanguageResults,
        frameworks: formattedFrameworksResults,
        tools: formattedToolsResults,
        user: req.user
      });

    } catch (error) {
      console.log(error);
        res.render("index", {
          user: req.user,
          title:"Site Title",
          message:"DB ERROR",
          results:[]
        });
    }

}