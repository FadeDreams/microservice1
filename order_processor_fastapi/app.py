from fastapi import FastAPI
import aio_pika
import json
import httpx
import asyncio
from dotenv import load_dotenv
import os
import socketio

load_dotenv()  # Load environment variables from .env file
app = FastAPI()

host = os.getenv("HOST")
port = os.getenv("PORT")
order_api_url = os.environ.get("ORDER_API_URL", "http://localhost:5002")

sio = socketio.AsyncClient()


@app.post('/send_message')
async def send_message(message: str):
    # Connect to your Node.js server
    await sio.connect('http://localhost:5003')
    await sio.emit('message', message)  # Emit the message to the React app
    await sio.disconnect()

    return {"message": "Message sent"}


async def update_order(message_id, updated_message):
    async with httpx.AsyncClient(proxies={}) as client:
        put_url = f"{order_api_url}/{message_id}"
        response = await client.put(put_url, json=updated_message)
        return response


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
                message_id = message_object.get('id', None)
                updated_message = {"is_open": False}
                response = await update_order(message_id, updated_message)

                if response.status_code == 200:
                    print(f"Order {message_id} updated successfully.")
                else:
                    print(
                        f"Failed to update order {message_id}. Status code: {response.status_code}")


@app.on_event("startup")
async def startup_event():
    loop = asyncio.get_event_loop()
    loop.create_task(consume_messages())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=port)
