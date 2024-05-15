const dbRepository = require("../databases/repositories");
const { encrypt } = require("../libs/crypto");
const moment = require("moment");
const {
  notNullValidator,
  isEmailValidator,
  isValidImageUrl,
} = require("../libs/input-validator");
const {
  createHashPassword,
  compareHashWithPassword,
  signPayloadToToken,
} = require("../libs/json-web-token");
const customRound = require("../libs/rounder-number");

function createUser(req, res) {
  const { name, email, image, password } = req.body;

  if (
    !notNullValidator(name) ||
    !isEmailValidator(email) ||
    !isValidImageUrl(image) ||
    !notNullValidator(password)
  ) {
    return res.status(400).json({ error: "Something wrong with your input" });
  }

  let user = {
    name,
    email,
    image,
    password: createHashPassword(password),
  };

  dbRepository
    .checkUser(email)
    .then((result) => {
      if (result.status) {
        return res.status(409).json({ error: "User already exist" });
      }

      dbRepository.saveUser(user).then(() => {
        res.status(201).json({ data: "User successfully created" });
      });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
}

function loginUser(req, res) {
  const { email, password } = req.body;

  if (
    !notNullValidator(email) ||
    !isEmailValidator(email) ||
    !notNullValidator(password)
  ) {
    return res.status(400).json({ error: "Something wrong with your input" });
  }

  dbRepository.checkUser(email).then((result) => {
    if (result.status) {
      let isValid = compareHashWithPassword(password, result.user.password);

      if (!isValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const access_token = signPayloadToToken({
        id: result.user.id,
        email: result.user.email,
      });

      res.status(200).json({ access_token });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  });
}

function getAllUser(req, res) {
  dbRepository
    .getUser()
    .then((user) => {
      const data = JSON.parse(user);
      data.forEach((el) => {
        el.id = encrypt(`${el.id}`);
      });

      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

function getUserTicketSummary(req, res) {
  let user = req.user;

  dbRepository
    .getUserTicket(user.id)
    .then((data) => {
      let response = JSON.parse(data);
      let countToDo = 0,
        countInProggress = 0,
        countDone = 0,
        countInReview = 0;
      let taskToDo = 0,
        taskInProggress = 0,
        taskDone = 0,
        taskInReview = 0;

      response.forEach((task) => {
        if (task.status == "To do") {
          taskToDo++;
          countToDo = countToDo + task.point;
        } else if (task.status == "In Proggress") {
          taskInProggress++;
          countInProggress = countInProggress + task.point;
        } else if (task.status == "Done") {
          taskDone++;
          countDone = countDone + task.point;
        } else if (task.status == "In Review") {
          taskInReview++;
          countInReview = countInReview + task.point;
        }
      });

      let summary = [
        {
          taskStatus: "To Do",
          totalTask: taskToDo,
          totalPoint: countToDo,
        },
        {
          taskStatus: "In Proggress",
          totalTask: taskInProggress,
          totalPoint: countInProggress,
        },
        {
          taskStatus: "Done",
          totalTask: taskDone,
          totalPoint: countDone,
        },
        {
          taskStatus: "In Review",
          totalTask: taskInReview,
          totalPoint: countInReview,
        },
      ];
      res.status(200).json({ data: summary });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
}

function getUserBiWeekPerformance(req, res) {
  let user = req.user;
  const biWeekStartDate = moment().startOf("week").subtract(14, "days"); //taking monday of current week - 14 days
  const biWeekEndDate = moment().endOf("week").subtract(7, "days"); //taking saturday of current week - 7 days

  dbRepository
    .getTicketPerBiWeek(user.id, biWeekStartDate, biWeekEndDate)
    .then((data) => {
      let response = JSON.parse(data);
      let totalTask = response.length;
      let completedTask = 0,
        unCompletedTask = 0,
        totalPoint = 0,
        completedPoint = 0,
        unCompletedPoint = 0;

      response.forEach((ticket) => {
        totalPoint = totalPoint + ticket.point;

        if (ticket.status !== "Done") {
          unCompletedTask++;
          unCompletedPoint = unCompletedPoint + ticket.point;
        } else {
          completedTask++;
          completedPoint = completedPoint + ticket.point;
        }
      });

      let ticketPerformance = {
        completedTask: completedTask,
        unCompletedTask: unCompletedTask,
        totalTask: totalTask,
        completedTaskPercentage: `${customRound(
          (completedTask / totalTask) * 100
        )}%`,
        completedPoint: completedPoint,
        unCompletedPoint: unCompletedPoint,
        totalPoint: totalPoint,
        completedPointPercentage: `${customRound(
          (completedPoint / totalPoint) * 100
        )}%`,
      };

      res.status(200).json({ data: ticketPerformance });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
}

module.exports = {
  createUser,
  loginUser,
  getAllUser,
  getUserTicketSummary,
  getUserBiWeekPerformance,
};
