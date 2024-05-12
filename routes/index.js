const userServices = require("../services/user-services");
const api = require("express").Router();

api.post("/user", userServices.createUser);
api.get("/user/ticket-summary", userServices.getUserTicketSummary);
api.get("/user/weekend-performance", userServices.getUserPerformance);

module.exports = api;
