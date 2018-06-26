//
// index.js is the Main starting point of the application
//

// load dotenv as early as possible
require('dotenv').config();

// console.log('env:', process.env);

//
const express = require('express');
const createError = require('http-errors');
//const bodyParser = require('body-parser'); // use the built-in express.json
const morgan = require('morgan');
// const cookieSession = require('cookie-session');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport');
// const cors = require('cors');

const apiRouter = require('./routes/api');
const userRouter = require('./routes/user');
const homeRouter = require('./routes/home');

// Passport configuration first
//
require('./services/passport');

// configure Express
//
const app = express();

app.use(morgan('combined'));
//
// allow CORS requests
//
// app.use(cors());
//
// body-parser: parse request bodies, available under the req.body property
//              json({type: '*/*'}) - parse as JSON for any request
//app.use(bodyParser.json({ type: '*/*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//
// Session
//
// First: we have to let cookie middleware decrypt the cookie, if user
//        sends us a cookie (cookie is encrypted).
// app.use(
//   cookieSession({
//     name: process.env.COOKIE_NAME,
//     maxAge: 12 * 60 * 60 * 1000, // 12 hours
//     keys: [process.env.COOKIE_KEY], // cookie is encrypted
//     // proxy: true,
//   })
// );
app.use(
  session({
    store: new FileStore(),
    name: process.env.COOKIE_NAME,
    secret: process.env.COOKIE_KEY, // cookie is encrypted
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1 * 60 * 60 * 1000, // 1 hour
    },
    // proxy: true,
  })
);
// this is required to initialize Passport
app.use(passport.initialize());
// Second: tell Passport to use cookie and create session
app.use(passport.session());

// ---------------------------------------------------------------------

// App routes
//
// require('./routes/auth')(app);
app.use('/api', apiRouter);
app.use('/user', userRouter);
app.use('/', homeRouter);

// catch 404 and forward to error handler
//   404 responses are not the result of an error,
//   so the error-handler middleware will not capture them
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler middleware - catch all the errors here
app.use((err, req, res, next) => {
  console.log('*** error handling middleware ***', err);
  res.status(422).send({ error: err.message });
});

// ---------------------------------------------------------------------

// Server Setup
const port = process.env.PORT || 5000;
// const server = http.createServer(app);
// server.listen(port);
// console.log(`Server running at http://localhost:${port}/`);
app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}/`)
);
