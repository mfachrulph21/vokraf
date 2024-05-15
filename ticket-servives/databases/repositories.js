const sequelize = require("sequelize");
const db = require("./db");
const dbModel = db.getModel();
const User = dbModel.User;
const Ticket = dbModel.Ticket;
const History = dbModel.History;

function checkUser(email) {
  return User.findOne({
    where: {
      email,
    },
  })
    .then(function (user) {
      if (user) {
        return { status: true, user };
      } else {
        return { status: false };
      }
    })
    .catch((error) => {
      throw error;
    });
}

function saveUser(user) {
  return User.create({
    name: user.name,
    email: user.email,
    image: user.image,
    password: user.password,
  }).catch((error) => {
    throw error;
  });
}

function getUser() {
  return User.findAll({
    attributes: ["id", "name", "email", "image"],
  })
    .then(function (user) {
      return JSON.stringify(user);
    })
    .catch((error) => {
      throw error;
    });
}

function saveTicket(ticket) {
  return Ticket.create({
    title: ticket.title,
    description: ticket.description,
    point: ticket.point,
    status: ticket.status,
    created_at: new Date(),
    user_id: ticket.user_id,
  })
    .then(function (data) {
      return JSON.stringify(data);
    })
    .catch((error) => {
      if (error.name) {
        throw error.name;
      } else {
        throw error;
      }
    });
}

function getTickets() {
  return Ticket.findAll({
    attributes: ["id", "title", "description", "point", "status"],
    include: [
      {
        model: User,
        attributes: ["name", "image", "id"],
      },
    ],
  })
    .then(function (result) {
      return JSON.stringify(result);
    })
    .catch((error) => {
      throw error;
    });
}

function getTicketById(ticketId) {
  return Ticket.findByPk(ticketId)
    .then(function (result) {
      return JSON.stringify(result);
    })
    .catch((error) => {
      throw error;
    });
}

function updateTicket(data) {
  return Ticket.update(
    {
      title: data.title,
      description: data.description,
      point: data.point,
      status: data.status,
      user_id: data.user_id,
    },
    {
      where: {
        id: data.id,
      },
    }
  )
    .then(function (data) {
      return JSON.stringify(data);
    })
    .catch((error) => {
      if (error.name) {
        throw error.name;
      } else {
        throw error;
      }
    });
}

function getTicketDetail(ticket_id) {
  return Ticket.findByPk(ticket_id, {
    include: [
      {
        model: User,
        attributes: ["name", "image"],
      },
      {
        model: History,
        attributes: ["title", "date", "user"],
        where: {
          ticket_id,
        },
      },
    ],
  })
    .then(function (result) {
      return JSON.stringify(result);
    })
    .catch((error) => {
      throw error;
    });
}

module.exports = {
  checkUser,
  saveUser,
  getUser,
  saveTicket,
  getTickets,
  getTicketById,
  updateTicket,
  getTicketDetail,
};
