var db = require("../db");
var crypto = require('crypto');

module.exports.viewAccount = (req, res) => {
  
    db.get('SELECT rowid AS id, username, name, email, is_admin FROM users WHERE rowid = ?', [ req.user.id ], function(err, row) {
      //if (err) { return next(err); }
    
      // TODO: Handle undefined row.
    
      var user = {
        id: row.id.toString(),
        username: row.username,
        displayName: row.name,
        email: row.email,
        is_admin: row.is_admin
      };
      res.render('profile', { user: user });
    });
  }

  module.exports.add = (req, res, next) => {
    //check if username already exist in the system
    db.get('SELECT * FROM Users WHERE username = ? LIMIT 1', [ req.body.username], function(err, row, next) {
      if (err) { return next(err); }
      if(row){ 
        return res.render('signup', {user: req.user, message: 'Username already exist' });
      }else {
        var salt = crypto.randomBytes(16);
        crypto.pbkdf2(req.body.password, salt, 10000, 32, 'sha256', function(err, hashedPassword) {
          if (err) { return next(err); }
          
          db.run('INSERT INTO users (username, hashed_password, salt, name, email, is_admin) VALUES (?, ?, ?, ?, ?, ? )', [
            req.body.username,
            hashedPassword,
            salt,
            req.body.name,
            req.body.email,
            req.body.is_admin
          ], function(err) {
            if (err) { return next(err); }
            
            var user = {
              id: this.lastID.toString(),
              username: req.body.username,
              displayName: req.body.name
            };
            req.login(user, function(err) {
              if (err) { return next(err); }
              res.redirect('/');
            });
          });
        });
      }
    });

  }