const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { query } = require('express');
const mailer = require('nodemailer')
var transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nermine.belarbi@esprit.tn',
        pass: 'nermine1998!!'
    }
})

router.post('/signup',(req, res, next) => {
    db.query(
      `SELECT * FROM admin WHERE email = ${db.escape(
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
                `INSERT INTO admin (id, email, password) VALUES ('${id}', ${db.escape(
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
    `SELECT * FROM admin WHERE email = ${db.escape(req.body.email)};`,
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

router.post('/ForgotPass',(request,response)=> {
  var post_data = request.body;
  var mailC=post_data.email;
  var token1= uuid.v4();
var pwd = bcrypt.hashSync(token1, 10);

db.query('select * from admin where email=?', [mailC], function (error, result, fields) {

      if (result && result.length) {
        
          db.query('UPDATE admin SET `password`=?  WHERE `email`=?',[pwd,mailC],function (err,rows,fields){
              if (err)console.log(err);
              else console.log('done');
              // res.redirect('/login/');
          })

      }
      var mailOptions={
          from: 'nermine.belarbi@esprit.com',
          to: mailC,
          subject : ' Forget Passsword',
          text: 'votre nouveau mdp est :'+token1,
      };
      transporter.sendMail(mailOptions,function (error,info) {
          if (error){console.log(error)}
          else console.log('email envoyé ');

      });
  })
});


router.post('/changepass',(request,response)=> {
  var post_data = request.body;
  var mailC = post_data.email;
  var pwd1 = post_data.pwd;
var pwd = bcrypt.hashSync(pwd1, 10);

db.query('select * from admin where email=?', [mailC], function (error, result, fields) {

      if (result && result.length) {
        
          db.query('UPDATE admin SET `password`=?  WHERE `email`=?',[pwd,mailC],function (err,rows,fields){
              if (err)console.log(err);
              else console.log('done');
              // res.redirect('/login/');
          })

      }
 
  })
});

  module.exports = router;