var Auth = require('request/lib/auth.js').Auth;
var util = require('util');

function OAuth2() {
  Auth.call(this);
}

util.inherits(OAuth2, Auth);

module.exports = OAuth2;
