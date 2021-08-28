var db = require('../db');

module.exports.insertLang = (req, res) => {

    if(req.body.category == 'language'){
    sqltest = `INSERT INTO languages (fk_user_id, language, title, description, code_snippet, tags, upvotes, flagged, last_update,comments) VALUES (?,?,?,?,?,?,?,?,?,?)`;
    let id = req.user.id;
    let lang = req.body.type;
    let title = req.body.title;
    let description = req.body.description;
    let code = req.body.code_snippet;
    let tag = req.body.tags;
    let CURRENT_TIMESTAMP = new Date();
    let data = [id, lang, title,description, code,tag,'0', '0', CURRENT_TIMESTAMP,'No Comments Yet']
    
    
    db.serialize(function() {
        var stmt = db.prepare(sqltest);
        stmt.run(data);
        stmt.finalize();
        console.log(stmt);
        db.each("SELECT * FROM languages", function(err, row) {
            if (err) {
                console.error(err);
                } else {
                    console.log(row);
                }
            });

        res.render("viewaddedcode", {
            title: title,
            subtitle: lang,
            user: req.user.username,
            description: description,
            code_snippet: code
            });
        });
    }
}


module.exports.insertTools = (req, res) => {
    if(req.body.category == 'tool'){
    let id = req.user.id;
    let tool = req.body.type;
    let title = req.body.title;
    let description = req.body.description;
    let code = req.body.code_snippet;
    let tag = req.body.tags;
    let CURRENT_TIMESTAMP = new Date();
    let data = [id, tool, title,description, code,tag,'0', '0', CURRENT_TIMESTAMP,'No Comments Yet']

    sqltest = `INSERT INTO tools (fk_user_id, tool, title, description, code_snippet, tags, upvotes, flagged, last_update,comments) VALUES (?,?,?,?,?,?,?,?,?,?)`;

    db.serialize(function() {
        var stmt = db.prepare(sqltest);
        stmt.run(data);
        stmt.finalize();
        console.log(stmt);
        db.each("SELECT * FROM tools", function(err, row) {
            if (err) {
                console.error(err);
                } else {
                    console.log(row);
                }
            });
        res.render("viewaddedcode", {
            title: title,
            subtitle: lang,
            user: req.user.username,
            description: description,
            code_snippet: code
                });
        });
    }

}

module.exports.insertFrameworks =  (req, res) => {
    if(req.body.category == 'framework'){
    let id = req.user.id;
    let framework = req.body.type;
    let title = req.body.title;
    let description = req.body.description;
    let code = req.body.code_snippet;
    let tag = req.body.tags;
    let CURRENT_TIMESTAMP = new Date();
    let data = [id, framework, title,description, code,tag,'0', '0', CURRENT_TIMESTAMP,'No Comments Yet']

    sqltest = `INSERT INTO frameworks(fk_user_id, framework, title, description, code_snippet, tags, upvotes, flagged, last_update,comments) VALUES (?,?,?,?,?,?,?,?,?,?)`;

    db.serialize(function() {
        var stmt = db.prepare(sqltest);
        stmt.run(data);
        stmt.finalize();
        console.log(stmt);
        db.each("SELECT * FROM frameworks", function(err, row) {
            if (err) {
                console.error(err);
                } else {
                    console.log(row);
                }
            });
        res.render("viewaddedcode", {
            title: title,
            subtitle: framework,
            user: req.user.username,
            description: description,
            code_snippet: code
            });
    });
}

}



