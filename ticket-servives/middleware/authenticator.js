const { verifyTokenToPayload } = require("../libs/json-web-token");
require("dotenv").config();

function basicAuthenticator(req, res, next) {
  let basicAuthHeader = req.headers.authorization;
  if (basicAuthHeader && basicAuthHeader.startsWith("Basic ")) {
    basicAuthHeader = basicAuthHeader.replace("Basic", "");
    if (basicAuthHeader === process.env.BASIC_TOKEN) {
      next();
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  }
}

function bearerAuthenticator(req, res, next) {
  let bearerAuthHeader = req.headers.authorization;
  if (bearerAuthHeader && bearerAuthHeader.startsWith("Bearer ")) {
    bearerAuthHeader = bearerAuthHeader.replace("Bearer ", "");
    let isValidPayload = verifyTokenToPayload(
      bearerAuthHeader,
      process.env.JWTSECRETKEY
    );
    if (!isValidPayload) {
      res.status(401).json({ error: "Unauthorized" });
    }
    req.user = isValidPayload;
    delete req.user.iat;
    next();
  }
}

module.exports = {
  basicAuthenticator,
  bearerAuthenticator,
};
