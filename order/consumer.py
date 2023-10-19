import pika
import sys
import os
import json


def main():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host="localhost"))
    channel = connection.channel()
    channel.queue_declare(queue="queue1", durable=True)

    def callback(ch, method, properties, body):
        message = body.decode('utf-8')  # Decode the bytes to a string
        # Parse the JSON string into a dictionary
        message_dict = json.loads(message)
        print("[x] received %r" % message_dict)
        # print("[x] received %r" %body)

    channel.basic_consume(
        queue="queue1", on_message_callback=callback, auto_ack=True)

    print(" [*] waiting for the messages. To exit press Ctrl-C")

    channel.start_consuming()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("Interrupted")
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)
