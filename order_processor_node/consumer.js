const amqp = require('amqplib');
const axios = require('axios'); // Import the Axios library

const queueName = 'queue1';
const rabbitMQHost = 'amqp://localhost'; // Update with your RabbitMQ server's URL

async function consumeMessages() {
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

        // Set is_open to false in a JSON object
        const updatedMessage = { is_open: false };

        // Add your processing logic here for the received message.
        // Make a PUT request using Axios with the updated JSON object
        try {
          const putUrl = 'http://localhost:5002/order/1'; // Replace with your URL
          const response = await axios.put(putUrl, updatedMessage);

          console.log('PUT request successfully sent.');
          console.log('Response:', response.data); // Log the response data

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
//consumeMessages().catch(console.error);

