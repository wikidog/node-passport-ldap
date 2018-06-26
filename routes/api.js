const fs = require('fs'); // Node file system module
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

// middleware that is specific to this router
router.use(auth.ensureAuthenticated);

// routes
//
router.get('/me', (req, res) => {
  res.json({ sAMAccountName: req.user.sAMAccountName });
});

router.get('/private', (req, res) => {
  res.send({ message: 'secret code 123456' });
});

module.exports = router;

// module.exports = app => {
//   app.get('/api/current_user', auth.authStatus, (req, res) => {
//     res.send(req.user);
//   });

//   app.get('/api/logout', (req, res) => {
//     req.logout(); // this function is provided by Passport
//     res.redirect('/');
//   });

//   app.get('/', (req, res) => {
//     res.send({ message: 'secret code 123456' });
//   });

//   app.get('/api/me', auth.ensureAuthenticated, (req, res) => {
//     res.json(req.user);
//   });
// };
