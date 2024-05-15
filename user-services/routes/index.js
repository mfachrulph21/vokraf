const {
  bearerAuthenticator,
  basicAuthenticator,
} = require("../middleware/authenticator");
const userServices = require("../services/user-services");
const api = require("express").Router();

api.post("/user/register", basicAuthenticator, userServices.createUser);
api.post("/user/login", basicAuthenticator, userServices.loginUser);
api.get("/user", basicAuthenticator, userServices.getAllUser);

api.use(bearerAuthenticator);
api.get("/user/summary-task", userServices.getUserTicketSummary);
api.get("/user/bi-week-performance", userServices.getUserBiWeekPerformance);

module.exports = api;