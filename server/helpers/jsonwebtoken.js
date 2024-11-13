const jsonwebtoken = require("jsonwebtoken");

const secret_key = process.env.JSONWEBTOKEN_SECRET;
const signToken = (payload) => {
    return jsonwebtoken.sign(payload, secret_key);
};

const verifyToken = (token) => {
    return jsonwebtoken.verify(token, secret_key);
};

module.exports = {
    signToken,
    verifyToken,
};