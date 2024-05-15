require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./routes");
const app = express();
const db = require("./databases/db");
const rabbitmq = require("./rabbit/rabbit-mq");
const dbRepository = require("./databases/repositories");
const port = process.env.PORT;

rabbitmq.connectRabbitMQ().then(async () => {
  let channel = rabbitmq.getChannel();
  await channel.assertQueue("CREATED_TICKET");
  await channel.assertQueue("TICKET_TITLE_UPDATE");
  await channel.assertQueue("TICKET_DESC_UPDATE");
  await channel.assertQueue("TICKET_POINT_UPDATE");
  await channel.assertQueue("TICKET_STATUS_UPDATE");
  await channel.assertQueue("TICKET_ASSIGNED_UPDATE");

  channel.consume("CREATED_TICKET", (message) => {
    if (message !== null) {
      let data = JSON.parse(message.content);

      dbRepository.getUserById(data.creator_id).then(async (result) => {
        let dataUser = JSON.parse(result);
        let history = {
          date: data.date,
          title: "Ticket Created",
          user: dataUser.name,
          ticket_id: data.ticket_id,
        };

        await dbRepository.ticketCreatedHistory(history);
        channel.ack(message);
      });
    }
  });

  channel.consume("TICKET_TITLE_UPDATE", (message) => {
    if (message !== null) {
      let data = JSON.parse(message.content);

      dbRepository.getUserById(data.creator_id).then(async (result) => {
        let dataUser = JSON.parse(result);

        let history = {
          date: data.date,
          title: `Title updated to ${data.title} by ${dataUser.name}`,
          user: dataUser.name,
          ticket_id: data.ticket_id,
        };

        await dbRepository.ticketCreatedHistory(history);
        channel.ack(message);
      });
    }
  });

  channel.consume("TICKET_DESC_UPDATE", (message) => {
    if (message !== null) {
      let data = JSON.parse(message.content);

      dbRepository.getUserById(data.creator_id).then(async (result) => {
        let dataUser = JSON.parse(result);
        let history = {
          date: data.date,
          title: `Description updated to ${data.description} by ${dataUser.name}`,
          user: dataUser.name,
          ticket_id: data.ticket_id,
        };

        await dbRepository.ticketCreatedHistory(history);
        channel.ack(message);
      });
    }
  });

  channel.consume("TICKET_POINT_UPDATE", (message) => {
    if (message !== null) {
      let data = JSON.parse(message.content);

      dbRepository.getUserById(data.creator_id).then(async (result) => {
        let dataUser = JSON.parse(result);
        let history = {
          date: data.date,
          title: `${dataUser.name} change task point to ${data.point}`,
          user: dataUser.name,
          ticket_id: data.ticket_id,
        };

        await dbRepository.ticketCreatedHistory(history);
        channel.ack(message);
      });
    }
  });

  channel.consume("TICKET_STATUS_UPDATE", (message) => {
    if (message !== null) {
      let data = JSON.parse(message.content);

      dbRepository.getUserById(data.creator_id).then(async (result) => {
        let dataUser = JSON.parse(result);
        let history = {
          date: data.date,
          title: `${dataUser.name} change status to ${data.status}`,
          user: dataUser.name,
          ticket_id: data.ticket_id,
        };

        await dbRepository.ticketCreatedHistory(history);
        channel.ack(message);
      });
    }
  });

  channel.consume("TICKET_ASSIGNED_UPDATE", (message) => {
    if (message !== null) {
      let data = JSON.parse(message.content);

      dbRepository.getUserById(data.creator_id).then(async (result) => {
        let dataUser = JSON.parse(result);

        dbRepository.getUserById(data.assigned_id).then(async (assignee) => {
          let dataAssignee = JSON.parse(assignee);

          let history = {
            date: data.date,
            title: `${dataUser.name} change assigness to ${dataAssignee.name}`,
            user: dataUser.name,
            ticket_id: data.ticket_id,
          };

          await dbRepository.ticketCreatedHistory(history);
          channel.ack(message);
        });
      });
    }
  });
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

app.listen(port, () => {
  console.log(`User services vokraf running on port : ${port}`);
});

module.exports = app;
