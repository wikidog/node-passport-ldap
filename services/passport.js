const passport = require('passport');
const LdapStrategy = require('passport-ldapauth');

const basicAuth = require('./basicAuth');

// 'user' is the user object
// serialize user and put it in the cookie
passport.serializeUser((user, done) => {
  console.log('user: ', user.sAMAccountName);
  done(null, user.sAMAccountName);
});

// after deserializeUser, we will have "req.user"
passport.deserializeUser((id, done) => {
  done(null, { sAMAccountName: id });
});

passport.use(
  new LdapStrategy({
    server: {
      url: `ldaps://${process.env.AD_SERVER}`,
      bindDN: process.env.AD_BINDCN,
      bindCredentials: process.env.AD_BINDCREDENTIALS,
      searchBase: process.env.AD_SEARCHBASE,
      searchFilter: '(sAMAccountName={{username}})',
      tlsOptions: {
        requestCert: true,
        rejectUnauthorized: false,
      },
    },
    credentialsLookup: basicAuth,
  })
);
