var pool = require("../../db/connection");
var bcrypt = require("bcrypt");
var SALT_ROUNDS = 10;

// find by username
exports.findByUsername = function(username) {
  return query("SELECT * FROM users WHERE username = $1", [ username ])
    .then(function(users) {
      return users[0];
    })
    .catch(function(err) {
      console.log("Error finding user by username", err);
    });
};

//find by email
exports.findByEmail = function(email) {
  return query("SELECT * FROM users WHERE email = $1", [ email ])
    .then(function(users) {
      return users[0];
    })
    .catch(function(err) {
      console.log("Error finding user by username", err);
    });
};

// find by id
exports.findById = function(id) {
  return query("SELECT * FROM users WHERE id = $1", [ id ])
    .then(function(users) {
      return users[0];
    })
    .catch(function(err) {
      console.log("Error finding user by id", err);
    });
};


exports.findAndComparePassword = function(username, password) {
  return exports.findByUsername(username).then(function(user) {
    return bcrypt
      .compare(password, user.password)
      .then(function(match) {
        return { match: match, user: user };
      })
      .catch(function(err) {
        return false;
      });
  });
};

exports.create = function(username, password , first_name, last_name, email, linkedin, bio, emailcred) {
  return bcrypt
    .hash(password, SALT_ROUNDS)
    .then(function(hash) {
      return query(
        "INSERT INTO users (username, password, first_name, last_name, email, linkedin, bio, emailcred) VALUES ($1, $2 , $3, $4, $5, $6, $7, $8) RETURNING *",
        [ username, hash, first_name, last_name, email, linkedin, bio, emailcred ]
      ).then(function(users) {
        return users[0];
      });
    })
    .catch(function(err) {
      console.log("Error creating user", err);
    });
};

exports.update = function(id,username, password , first_name, last_name, email, linkedin, bio, emailcred) {
  return bcrypt
    .hash(password, SALT_ROUNDS)
    .then(function(hash) {
      console.log('in exports.update user:', id);
      return query(
        "UPDATE users set username = $2, password =$3, first_name=$4, last_name=$5, email=$6, linkedin=$7, bio=$8, emailcred=$9 where id=$1 RETURNING *",
        [ id, username, hash, first_name, last_name, email, linkedin, bio, emailcred]
      ).then(function(users) {
        return users[0];
      });
    })
    .catch(function(err) {
      console.log("Error updating user", err);
    });
};


function query(sqlString, data) {
  return new Promise(function(resolve, reject) {
    pool.connect(function(err, client, done) {
      try {
        if (err) {
          return reject(err);
        }

        client.query(sqlString, data, function(err, result) {
          if (err) {
            return reject(err);
          }

          resolve(result.rows);
        });
      } finally {
        done();
      }
    });
  });
}
