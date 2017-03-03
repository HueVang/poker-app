var router = require('express').Router();
var pg = require('pg');
var config = {database: 'upsilon_aces'};
var pool = new pg.Pool(config);


router.get('/otheruser', function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('SELECT * FROM users WHERE username = $1',
      [req.body.username], function(err, result){
        done();
        if (err){
          console.log('Error querying DB', err);
          res.sendStatus(500);
          }else{
            console.log('Got info from DB', result.rows)
            res.send(result.rows);
          }
        });
    }
  });
});



module.exports = router;
