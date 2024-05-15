const { decrypt, encrypt } = require("../../user-services/libs/crypto");
const dbRepository = require("../databases/repositories");
const formatDate = require("../libs/format-date");
const {
  notNullValidator,
  isNumericValidator,
} = require("../libs/input-validator");
const rabbitMq = require("../rabbit/rabbit-mq");

async function createTicket(req, res) {
  let { title, description, point, status, userId } = req.body;

  if (
    !notNullValidator(title) ||
    !notNullValidator(status) ||
    !notNullValidator(userId) ||
    !isNumericValidator(point) ||
    !notNullValidator(description)
  ) {
    return res.status(400).json({ error: "Something wrong with your input" });
  }

  let savedData = {
    title,
    description,
    point,
    status,
    user_id: Number(decrypt(userId)),
  };

  dbRepository
    .saveTicket(savedData)
    .then(async (data) => {
      let response = JSON.parse(data);

      let message = {
        ticket_id: response.id,
        title: response.title,
        description: response.description,
        creator_id: req.user.id,
        assigned_id: response.user_id,
        date: formatDate(response.created_at),
      };

      const channel = rabbitMq.getChannel();
      await channel.assertQueue("CREATED_TICKET");
      await channel.sendToQueue(
        "CREATED_TICKET",
        Buffer.from(JSON.stringify(message))
      );

      res.status(201).json({ data: response });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
}

function getAllTicket(req, res) {
  dbRepository
    .getTickets()
    .then((data) => {
      let response = JSON.parse(data);

      response.forEach((ticket) => {
        ticket.User.id = encrypt(`${ticket.User.id}`);
      });

      res.status(200).json({ data: response });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
}

function editTicket(req, res) {
  let { title, description, point, status, userId } = req.body;
  let { ticketId } = req.params;

  if (
    !notNullValidator(title) ||
    !notNullValidator(status) ||
    !notNullValidator(userId) ||
    !isNumericValidator(point) ||
    !notNullValidator(description)
  ) {
    return res.status(400).json({ error: "Something wrong with your input" });
  }

  dbRepository
    .getTicketById(ticketId)
    .then(async (data) => {
      let response = JSON.parse(data);
      const channel = rabbitMq.getChannel();

      let message = {
        ticket_id: response.id,
        title: response.title,
        description: response.description,
        creator_id: req.user.id,
        assigned_id: response.user_id,
        point: response.point,
        status: response.status,
        date: formatDate(new Date()),
      };

      if (title !== response.title) {
        message.title = title;

        await channel.assertQueue("TICKET_TITLE_UPDATE");
        await channel.sendToQueue(
          "TICKET_TITLE_UPDATE",
          Buffer.from(JSON.stringify(message))
        );
      }

      if (description !== response.description) {
        message.description = description;

        await channel.assertQueue("TICKET_DESC_UPDATE");
        await channel.sendToQueue(
          "TICKET_DESC_UPDATE",
          Buffer.from(JSON.stringify(message))
        );
      }

      if (point !== response.point) {
        message.point = point;

        await channel.assertQueue("TICKET_POINT_UPDATE");
        await channel.sendToQueue(
          "TICKET_POINT_UPDATE",
          Buffer.from(JSON.stringify(message))
        );
      }

      if (status !== response.status) {
        message.status = status;

        await channel.assertQueue("TICKET_STATUS_UPDATE");
        await channel.sendToQueue(
          "TICKET_STATUS_UPDATE",
          Buffer.from(JSON.stringify(message))
        );
      }

      if (+decrypt(userId) !== response.user_id) {
        message.assigned_id = +decrypt(userId);

        await channel.assertQueue("TICKET_ASSIGNED_UPDATE");
        await channel.sendToQueue(
          "TICKET_ASSIGNED_UPDATE",
          Buffer.from(JSON.stringify(message))
        );
      }

      let updatedDate = {
        title,
        description,
        point,
        status,
        user_id: +decrypt(userId),
        id: ticketId,
      };

      dbRepository
        .updateTicket(updatedDate)
        .then(() => {
          res.status(200).json({ date: "Data successfully updated" });
        })
        .catch((error) => {
          res.status(500).json({ error });
        });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
}

function getTicketDetail(req, res) {
  let { ticketId } = req.params;

  if (!notNullValidator(ticketId)) {
    return res.status(400).json({ error: "Something wrong with your input" });
  }

  dbRepository
    .getTicketDetail(ticketId)
    .then((data) => {
      let response = JSON.parse(data);

      response.Histories.forEach((history) => {
        history.date = formatDate(history.date);
      });

      res.status(200).json({ data: response });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
}

module.exports = {
  createTicket,
  getAllTicket,
  getTicketDetail,
  editTicket,
  getTicketDetail,
};
