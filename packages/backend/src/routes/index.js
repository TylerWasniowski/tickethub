import express from 'express';
import mongodb from 'mongodb';

const router = express.Router();

const url = 'mongodbdb://localhost:27017/tickethub';

// TODO: Add to frontend
// router.get('/account',function (req, res, next) {
//   res.render('account', {name : req.session.name, username : req.session.username, email : req.session.email, success : req.session.success,})
// })

// TODO: Move to it's own account routes file
router.post('/account/submit', (req, res, next) => {
  const item = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  req.session.name = item.name;
  req.session.email = item.email;
  req.session.password = item.password;

  console.log(item);

  mongodb.connect(
    url,
    (err, db) => {
      const dbo = db.db('tickethub');
      dbo
        .collection('user-data')
        .updateOne(
          { username: req.session.username },
          { $set: item },
          (dbErr, result) => {
            if (dbErr) throw dbErr;
            console.log('Item updated');
            db.close();
          }
        );
    }
  );

  res.redirect('/account');
});

// TODO: Move to other route file
router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.redirect('login');
});

export default router;
