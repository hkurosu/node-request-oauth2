function OAuth2(options) {
    this.options = options || {};
    this.authConfig = options.authConfig;
    this.accessToken = null;
}
OAuth2.prototype.requestAccessToken = function (req, successCallback, errorCallback) {
    var self = this;
    var client = require('request');
    client.debug = self.options.debug || false;
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
    if (req.grant_type) {
        //
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
