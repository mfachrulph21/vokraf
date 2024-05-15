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

function getUserById(id) {
  return User.findByPk(id, {
    attributes: ["name", "image", "id"],
  })
    .then(function (result) {
      return JSON.stringify(result);
    })
    .catch((error) => {
      console.log(error, "");
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

function getUserTicket(user_id) {
  return Ticket.findAll({
    attributes: ["status", "point", "title", "created_at"],
    where: {
      user_id,
    },
  })
    .then(function (data) {
      return JSON.stringify(data);
    })
    .catch((error) => {
      throw error;
    });
}

function ticketCreatedHistory(data) {
  return History.create({
    title: data.title,
    date: data.date,
    ticket_id: data.ticket_id,
    user: data.user,
  }).catch((error) => {
    throw error;
  });
}

function getTicketPerBiWeek(user_id, startDate, endDate) {
  return Ticket.findAll({
    where: {
      user_id,
      created_at: {
        [sequelize.Op.between]: [startDate, endDate],
      },
    },
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
  getUserTicket,
  ticketCreatedHistory,
  getUserById,
  getTicketPerBiWeek,
};
