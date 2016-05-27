/**
 * Created by HKU1 on 5/26/2016.
 */

function OAuth2(options) {
    this.options = options || {};
    this.authConfig = options.authConfig;
    this.request = options.request;
    this.accessToken = null;
};

OAuth2.prototype.login = function() {
    var self = this;
    var request = require('request');
    request.debug = true;
    function assign(body) {
        self.accessToken = body;
        self.accessToken.expiration = Date.now() + body.expires_in * 1000;
    };
    request(
        {
            uri: self.authConfig.login_endpoint,
            method: 'POST',
            json: {
                client_id: self.request.client_id,
                username: self.request.username,
                password: self.request.password
            },
            strictSSL: false
        },
        function(error, response, body) {
            if (error) {
                console.log(error);
            } else if (response.statusCode == 200) {
                assign(body);
            } else {
                console.log(response);
            }
        }
    ).on('complete', function() {
        console.log('accessToken: ' + JSON.stringify(self.accessToken));
    });
};

OAuth2.prototype.bearerToken = function() {
    var self = this;
    if (!self.accessToken || self.accessToken.expiration < Date.now()) {
        self.login();
    }
    return self.accessToken ? self.accessToken.access_token : null;
};

var authConfig = {
    token_endpoint: 'https://localhost:8443/foundation/hub/oauth/token',
    authorization_endpoint: 'https://localhost:8443/foundation/hub/oauth/authorize',
    login_endpoint: 'https://localhost:8443/foundation/hub/api/v1/security/login'
};
var req = {
    client_id: 'hubRegistrar',
    username: 'lois', 
    password: 'lois'
};

var oauth2 = new OAuth2({authConfig: authConfig, request: req});
var accessToken = oauth2.bearerToken();
console.log('result = ' + JSON.stringify(accessToken, true, 2));
// var resp = client.get('http://localhost:8080/foundation/hub/api/v1/users.json').auth(null, null, true, function() {oauth2.bearerToken();});
// console.log(resp);
