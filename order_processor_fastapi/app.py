from fastapi import FastAPI
import aio_pika
import json
import httpx
import asyncio
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from .env file
app = FastAPI()

# Read the ORDER_API_URL variable with a default value
order_url = os.environ.get("ORDER_API_URL", "localhost:5002")


async def consume_messages():
    rabbitmq_url = "amqp://localhost"  # Update with your RabbitMQ server's URL
    queue_name = "queue1"

    connection = await aio_pika.connect_robust(rabbitmq_url)
    channel = await connection.channel()
    queue = await channel.declare_queue(queue_name, durable=True)

    async with queue.iterator() as queue_iter:
        async for message in queue_iter:
            async with message.process():
                message_body = message.body.decode()
                message_object = json.loads(message_body)
                print("Received:", message_object)

                # Set is_open to false in a JSON object
                updated_message = {"is_open": False}

                # Replace with the URL of your service
                # put_url = "http://localhost:5003/api/order/1"
                put_url = f"{order_url}"
                async with httpx.AsyncClient(proxies={}) as client:
                    try:
                        response = await client.put(put_url, json=updated_message)
                        response_data = response.json()
                        print("PUT request successfully sent.")
                        print("Response:", response_data)
                    except httpx.HTTPError as error:
                        print("Error sending PUT request:", error)


@app.on_event("startup")
async def startup_event():
    loop = asyncio.get_event_loop()
    loop.create_task(consume_messages())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
