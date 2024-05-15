const { bearerAuthenticator } = require("../middleware/authenticator");
const ticketServices = require("../services/ticket-services");
const api = require("express").Router();

api.use(bearerAuthenticator);
api.post("/ticket", ticketServices.createTicket);
api.get("/ticket", ticketServices.getAllTicket);
api.get("/ticket/:ticketId", ticketServices.getTicketDetail);
api.put("/ticket/:ticketId", ticketServices.editTicket);

module.exports = api;
