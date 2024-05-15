require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./routes");
const app = express();
const db = require("./databases/db");
const port = process.env.PORT;
const rabbitmq = require("./rabbit/rabbit-mq");

rabbitmq.connectRabbitMQ();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

app.listen(port, () => {
  console.log(`Ticket services vokraf running on port : ${port}`);
});

module.exports = app;
