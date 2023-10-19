const amqp = require('amqplib'); const axios = require('axios');
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

    return new Promise((resolve, reject) => {
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
            console.log('Response:', response.data);
            resolve(1);
          } catch (error) {
            console.error('Error sending PUT request:', error);
            // You can reject the promise with an error status
            reject(error);
          }
          channel.ack(msg); // Acknowledge the message to remove it from the queue.
        }
      });
    });
  } catch (error) {
    console.error(error);
    // You can reject the promise with an error status in case of an error here.
    reject(error);
  }
}

module.exports = consumeMessages;

