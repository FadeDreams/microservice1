const amqp = require('amqplib');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const order_api_url = process.env.ORDER_API_URL || 'http://localhost:5002';
const queueName = 'queue1';
const rabbitMQHost = 'amqp://localhost'; // Update with your RabbitMQ server's URL

async function consumeMessages() {
  console.log('consumeMessages');
  try {
    const connection = await amqp.connect(rabbitMQHost);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });

    console.log(`[*] Waiting for messages in ${queueName}. To exit, press Ctrl-C`);

    channel.consume(queueName, async (msg) => {
      if (msg !== null) {
        const message = msg.content.toString();
        const messageObject = JSON.parse(message);

        console.log(`[x] Received`, messageObject);

        // Update the message to set is_open to false
        messageObject.is_open = false;

        // Make a PUT request using Axios with the updated JSON object
        try {
          const putUrl = `${order_api_url}/${messageObject.id}`;
          console.log(putUrl);
          console.log(messageObject);
          const response = await axios.put(putUrl, messageObject);

          console.log('PUT request successfully sent.');
          console.log('Response:', response.data); // Log the response data

          return 1;

          // Add your response handling logic here, e.g., store response data or perform additional actions.
        } catch (error) {
          console.error('Error sending PUT request:', error);
        }

        channel.ack(msg); // Acknowledge the message to remove it from the queue.
      }
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = consumeMessages;

