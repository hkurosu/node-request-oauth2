function OAuth2(options) {
    this.options = options || {};
    this.authConfig = options.authConfig;
    this.accessToken = null;
    this.debug = options.debug;
}

OAuth2.prototype.requestAccessToken = function (req, successCallback, errorCallback) {
    var self = this;
    var client = require('request');
    client.debug = self.debug || false;
    function requestCallback(error, response, body) {
        if (error) {
            errorCallback(error);
        } else if (response.statusCode == 200) {
            self.acquireAccessToken(body);
            successCallback(self.accessToken);
        } else {
            errorCallback(new Error(body.error_description || 'Unknown Error'));
        }
    }
    var requestOpts = { method: 'POST', strictSSL: false };
    if (req.response_type) {
        requestOpts.uri = self.authConfig.authorization_endpoint;
        requestOpts.method = 'GET';
        requestOpts.qs = req;
    else if (req.grant_type) {
        // call token service
        requestOpts.uri = self.authConfig.token_endpoint;
        requestOpts.auth(req.client_id, req.client_secret);
        delete req.client_id;
        delete req.client_secret;
        requestOpts.form = req;
    } else {
        // rest-login
        requestOpts.uri = self.authConfig.login_endpoint;
        requestOpts.json = req;
    }
    client(requestOpts, requestCallback);
};

OAuth2.prototype.acquireAccessToken = function (resp) {
    var self = this;
    self.accessToken = resp;
    self.accessToken.expiration = Date.now() + resp.expires_in * 1000;
};

module.exports.OAuth2 = OAuth2;
