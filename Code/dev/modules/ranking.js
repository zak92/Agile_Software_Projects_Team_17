var db = require('../db');
var Ranking = require('../modules/ranking');
  

module.exports.ranking = async (req, res) => {

    try{
        let RankingResults = await Ranking.mainranking();
        //Initialize
        let currentpage = 1;
        let itemlimit = 5;
        let totalpages = 1;

        let formattedRankingResults = RankingResults.map(result => {
            return Object.values(result);
        })

        if(formattedRankingResults.length <= 0) {
            res.render("ranking",{
              user: req.user,
              title: "User Rankings",
              message: "No data",
              results: [],
              totalpages: totalpages,
              currentpage: currentpage,
              itemlimit: itemlimit
            });
            return;
        }
        
        if(req.query.currentpage){
            currentpage = parseInt(req.query.currentpage);
        }
    
        if(req.query.itemlimit){
            itemlimit = parseInt(req.query.itemlimit);
        }

        totalpages = formattedRankingResults.length / itemlimit;

        if(formattedRankingResults.length % itemlimit != 0 ){

            totalpages = Math.floor(totalpages)+1;
      
        }

        let data_pos_start = (currentpage - 1) * itemlimit;
        let data_pos_end = currentpage * itemlimit;
        let data_slice = formattedRankingResults.slice(data_pos_start,data_pos_end);

        res.render("ranking", {
            user: req.user,
            title: "User Rankings",
            message: false,
            results: data_slice,
            totalpages: totalpages,
            currentpage: currentpage,
            itemlimit: itemlimit
          });

    }

    catch (error){
        console.log(error);
        res.render("ranking",{
            user: req.user,
            title: "User Rankings",
            message: "DB ERROR",
            results: [],
            totalpages: totalpages,
            currentpage: currentpage,
            itemlimit: itemlimit
          });
    }
     
}

//This function is used to return Ranking data
/*
Parameters: 
"isLimit"--(Optional,Default:False)
"numLimit"--(Optional,Default:5)
*/
module.exports.mainranking = async(isLimit=false,numLimit)=>{
    
    if(!numLimit){numLimit = 5;}

    if(!isLimit){
        //AllRecords : This table combines all the records in "languages", "tools", and "frameworks"
        let AllRecords = `SELECT * FROM frameworks UNION ALL SELECT * FROM tools UNION ALL SELECT * FROM languages`;

        //UpvoteRecords : This table is to count the records in "AllRecords".
        //Header: "fk_user_id","upvotes","contribution"
        let UpvoteRecords = `SELECT fk_user_id , SUM(upvotes) AS upvotes, COUNT(*) AS contribution FROM (${AllRecords}) AS records GROUP BY fk_user_id`;

        //AllUpvoteRecords : This table is a supplement to "UpvoteRecords" (add all users from the table "users").And calculate the score
        //
        //Header: "username","contribution","upvotes", "score"
        let AllUpvoteRecords = `SELECT username, IFNULL(contribution, 0) AS contribution, IFNULL(upvotes, 0) AS upvotes, IFNULL(ROUND(upvotes*0.5 + contribution*0.5,0), 0) AS score FROM users LEFT JOIN (${UpvoteRecords}) AS total ON user_id = fk_user_id ORDER BY score DESC`;

        //FinalRecords : This table sorts "AllUpvoteRecords" according to the size of "Score"
        //Header:"rank", "username","contribution","upvotes", "score"
        let FinalRecords = `SELECT RANK() OVER( ORDER BY a.score DESC) AS rank, a.* FROM (${AllUpvoteRecords}) AS a`;

        return new Promise(function(resolve,reject){
            db.all(FinalRecords,function(err,rows){
                if(err){return reject(err);}
                resolve(rows);
            });
        });

    }else{
        
        //AllRecords : This table combines all the records in "languages", "tools", and "frameworks"
        let AllRecords = `SELECT * FROM frameworks UNION ALL SELECT * FROM tools UNION ALL SELECT * FROM languages`;

        //UpvoteRecords : This table is to count the records in "AllRecords".
        //Header: "fk_user_id","upvotes","contribution"
        let UpvoteRecords = `SELECT fk_user_id , SUM(upvotes) AS upvotes, COUNT(*) AS contribution FROM (${AllRecords}) AS records GROUP BY fk_user_id`;

        //AllUpvoteRecords : This table is a supplement to "UpvoteRecords" (add all users from the table "users").And calculate the score.
        //
        //Header: "username","contribution","upvotes", "score"
        let AllUpvoteRecords = `SELECT username, IFNULL(contribution, 0) AS contribution, IFNULL(upvotes, 0) AS upvotes, IFNULL(ROUND(upvotes*0.5 + contribution*0.5,0), 0) AS score FROM users LEFT JOIN (${UpvoteRecords}) AS total ON user_id = fk_user_id ORDER BY score DESC`;

        //FinalRecords : This table sorts "AllUpvoteRecords" according to the size of "Score". And limit the number of output entries.
        //Header:"rank", "username","contribution","upvotes", "score"
        let FinalRecords = `SELECT RANK() OVER( ORDER BY a.score DESC) AS rank, a.* FROM (${AllUpvoteRecords}) AS a LIMIT ${numLimit}`;

        return new Promise(function(resolve,reject){
            db.all(FinalRecords,function(err,rows){
                if(err){return reject(err);}
                resolve(rows);
            });
        });

    } 
}