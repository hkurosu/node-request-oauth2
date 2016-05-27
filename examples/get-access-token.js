/**
 * Created by HKU1 on 5/26/2016.
 */

var OAuth2 = require('../lib/oauth2.js').OAuth2;

var authConfig = {
    token_endpoint: 'https://localhost:8443/foundation/hub/oauth/token',
    authorization_endpoint: 'https://localhost:8443/foundation/hub/oauth/authorize',
    login_endpoint: 'https://localhost:8443/foundation/hub/api/v1/security/login'
};
var loginRequest = {
    client_id: 'hubRegistrar',
    username: 'lois', 
    password: 'lois'
};

var oauth2 = new OAuth2({authConfig: authConfig});
oauth2.debug = true;
oauth2.requestAccessToken(
    loginRequest,
    function(accessToken) {
        console.log('result = ' + JSON.stringify(accessToken, true, 2));
    },
    function(err) {
        console.log(err);
    }
);

// var resp = client.get('http://localhost:8080/foundation/hub/api/v1/users.json').auth(null, null, true, function() {oauth2.bearerToken();});
// console.log(resp);
