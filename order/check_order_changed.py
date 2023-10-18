import pika
import json

def consume_messages():
    connection = pika.BlockingConnection(pika.ConnectionParameters(host="localhost"))
    channel = connection.channel()
    channel.queue_declare(queue="queue1", durable=True)  # Set durable to True

    def callback(ch, method, properties, body):
        message = body.decode('utf-8')
        message_dict = json.loads(message)
        print("[x] received %r" % message_dict)

    channel.basic_consume(queue="queue1", on_message_callback=callback, auto_ack=True)

    print(" [*] waiting for the messages. To exit, press Ctrl-C")

    channel.start_consuming()

if __name__ == "__main__":
    consume_messages()

