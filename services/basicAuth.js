const basicAuth = require('basic-auth');

const credentialsLookup = req => {
  const user = basicAuth(req);
  if (user) {
    console.log('>>>> basic username:', user.name);
    console.log('>>>> basic password:', user.pass);
    if (user.name != process.env.API_USERNAME) {
      return {};
    }
  }
  return user;
};

module.exports = credentialsLookup;
