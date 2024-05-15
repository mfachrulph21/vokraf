const amqp = require("amqplib");
let channel;

async function connectRabbitMQ() {
  const connection = await amqp.connect("amqp://guest:guest@localhost:5672/");
  channel = await connection.createChannel();
}

module.exports = {
  connectRabbitMQ,
  getChannel: function () {
    return channel;
  },
};
