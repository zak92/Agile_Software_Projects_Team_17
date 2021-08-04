var db = require('../db');
var Ranking = require('../modules/ranking');
  

module.exports.ranking = async (req, res) => {

    try{
        let RankingResults = await Ranking.mainranking();
        //Initialize
        let currentpage = 1;
        let itemlimit = 5;
        let totalpage = 1;

        let formattedRankingResults = RankingResults.map(result => {
            return Object.values(result);
        })

        if(formattedRankingResults.length <= 0) {
            res.render("ranking",{
              user: req.user,
              title: "User Rankings",
              message: "No data",
              results: [],
              totalpage: totalpage,
              currentpage: currentpage,
              itemlimit: itemlimit
            });
            return;
        }
        
        if(req.query.currentpage){
            currentpage = req.query.currentpage;
        }
    
        if(req.query.itemlimit){
            itemlimit = req.query.itemlimit;
        }

        totalpage = formattedRankingResults.length / itemlimit;

        if(formattedRankingResults.length % itemlimit != 0 ){

            totalpage = Math.floor(totalpage)+1;
      
        }

        let data_pos_start = (currentpage - 1) * itemlimit;
        let data_pos_end = currentpage * itemlimit;
        let data_slice = formattedRankingResults.slice(data_pos_start,data_pos_end);

        res.render("ranking", {
            user: req.user,
            title: "User Rankings",
            message: false,
            results: data_slice,
            totalpage: totalpage,
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
            totalpage: totalpage,
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
        let sql1 = 'SELECT RANK() OVER( ORDER BY a.score DESC) AS rank, a.* FROM (SELECT username, IFNULL(contribution, 0), IFNULL(upvotes, 0), IFNULL(ROUND(upvotes*0.5 + contribution*0.5,0), 0) AS score FROM users LEFT JOIN (SELECT fk_user_id , SUM(upvotes) AS upvotes, COUNT(*) AS contribution FROM (SELECT * FROM frameworks UNION ALL SELECT * FROM tools UNION ALL SELECT * FROM languages) AS records GROUP BY fk_user_id) AS total ON user_id = fk_user_id ORDER BY score DESC) AS a'
    
        return new Promise(function(resolve,reject){
            db.all(sql1,function(err,rows){
                if(err){return reject(err);}
                resolve(rows);
            });
        });

    }else{
        let sql1 = 'SELECT RANK() OVER( ORDER BY a.score DESC) AS rank, a.* FROM (SELECT username, IFNULL(contribution, 0), IFNULL(upvotes, 0), IFNULL(ROUND(upvotes*0.5 + contribution*0.5,0), 0) AS score FROM users LEFT JOIN (SELECT fk_user_id , SUM(upvotes) AS upvotes, COUNT(*) AS contribution FROM (SELECT * FROM frameworks UNION ALL SELECT * FROM tools UNION ALL SELECT * FROM languages) AS records GROUP BY fk_user_id) AS total ON user_id = fk_user_id ORDER BY score DESC) AS a LIMIT (?)'
    
        return new Promise(function(resolve,reject){
            db.all(sql1,[numLimit],function(err,rows){
                if(err){return reject(err);}
                resolve(rows);
            });
        });

    } 
}