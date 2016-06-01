function OAuth2(options) {
    this.options = options || {};
    this.authConfig = options.authConfig;
    this.accessToken = null;
    this.debug = options.debug;
}

OAuth2.prototype.requestAccessToken = function (tokenRequest, successCallback, errorCallback) {
    var self = this;
    if (self.accessToken && self.accessToken.expiration > Date.now()) {
        successCallback(self.accessToken); 
    }
    var client = require('request');
    client.debug = self.debug || false;
    function requestCallback(error, response, body) {
        if (error) {
            errorCallback(error);
        } else if (response.statusCode == 200) {
            self.assignAccessToken(body);
            successCallback(self.accessToken);
        } else {
            errorCallback(new Error(body.error_description || 'Unknown Error'));
        }
    }
    var requestOpts = { method: 'POST', strictSSL: false };
    if (tokenRequest.response_type) {
        requestOpts.uri = self.authConfig.authorization_endpoint;
        requestOpts.method = 'GET';
        requestOpts.qs = tokenRequest;
    else if (tokenRequest.grant_type) {
        // call token service
        requestOpts.uri = self.authConfig.token_endpoint;
        requestOpts.auth(tokenRequest.client_id, tokenRequest.client_secret);
        delete tokenRequest.client_id;
        delete tokenRequest.client_secret;
        requestOpts.form = tokenRequest;
    } else {
        // rest-login
        requestOpts.uri = self.authConfig.login_endpoint;
        requestOpts.json = tokenRequest;
    }
    client(requestOpts, requestCallback);
};

OAuth2.prototype.assignAccessToken = function (resp) {
    var self = this;
    self.accessToken = resp;
    self.accessToken.expiration = Date.now() + resp.expires_in * 1000;
};

module.exports.OAuth2 = OAuth2;
