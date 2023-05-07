const crypto = require('crypto');

exports.hashPassword = function (password) {
    return crypto.createHash('sha512').update(password).digest('hex');
};

exports.compareHash = function (plaintext, hashed) {
    return hashed === exports.hashPassword(plaintext);
};

exports.generateSessionToken = function () {
    return crypto.randomBytes(16).toString('hex');
};
