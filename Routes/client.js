const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { query } = require('express');


router.post('/signupclient',(req, res, next) => {
    db.query(
      `SELECT * FROM client WHERE email = ${db.escape(
        req.body.email
      )};`,
      (err, result) => {
        if (result.length) {
          return res.status(409).send({
            msg: 'This email is already in use!'
          });
        } else {
          // email is available
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).send({
                msg: err
              });
            } else {
id = uuid.v4();
const ide = {
 id
}
              // has hashed pw => add to database
              db.query(
                `INSERT INTO client (id, email, password) VALUES ('${id}', ${db.escape(
                  req.body.email
                )}, ${db.escape(hash)})`
                , function(error, results){
                  if ( error ){
                      res.status(400).send('Error in database operation');
                  } else {
                    res.send(ide);
                  }
                 } );
            }
          });
        }
      }
    );
  });





router.post('/login', (req, res, next) => {
  db.query(
    `SELECT * FROM client WHERE email = ${db.escape(req.body.email)};`,
    (err, result) => {
      // user does not exists
      if (err) {
        throw err;
        return res.status(400).send({
          msg: err
        });
      }

      if (!result.length) {
        return res.status(401).send({
          msg: 'email or password is incorrect!'
        });
      }

      // check password
      bcrypt.compare(
        req.body.password,
        result[0]['password'],
        (bErr, bResult) => {
          // wrong password
          if (bErr) {
            throw bErr;
            return res.status(401).send({
              msg: 'email or password is incorrect!'
            });
          }

          if (bResult) {
            const token = jwt.sign({
                email: result[0].email,
                userId: result[0].id
              },
              'SECRETKEY', {
                expiresIn: '7d'
              }
            );

        
            return res.status(200).send({
              msg: 'Logged in!',
              token,
              user: result[0]
            });
          }
          return res.status(401).send({
            msg: 'email or password is incorrect!'
          });
        }
      );
    }
  );
});


  module.exports = router;