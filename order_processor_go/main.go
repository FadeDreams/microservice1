package main

import (
	"bytes"
	"os"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"github.com/streadway/amqp"
	"github.com/joho/godotenv"
)

// Struct to represent the message
type Message struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Quantity int    `json:"quantity"`
	IsOpen   bool   `json:"is_open"`
}

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

func sendPutRequest(url string, id int) {
	fmt.Printf("Sending PUT request to URL: %s\n", url)

	data := map[string]bool{
		"is_open": true,
	}
	jsonStr, _ := json.Marshal(data)

	// Construct the URL with the extracted ID
	putURL := fmt.Sprintf("%s%d", url, id)

	// Create a request
	req, err := http.NewRequest("PUT", putURL, bytes.NewBuffer(jsonStr))
	if err != nil {
		fmt.Println("Error creating request:", err)
		return
	}

	// Set the request content type
	req.Header.Set("Content-Type", "application/json")

	// Send the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error sending request:", err)
		return
	}
	defer resp.Body.Close()

	// Read and print the response
	body, _ := ioutil.ReadAll(resp.Body)
	fmt.Println("Response:", string(body))
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "go server is running fine")
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	// Define your RabbitMQ connection and message handling here
	conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/") // Replace with your RabbitMQ server URL
	failOnError(err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(err, "Failed to open a channel")
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"queue1", // Queue name
		true,     // Durable
		false,    // Delete when unused
		false,    // Exclusive
		false,    // No-wait
		nil,      // Arguments
	)
	failOnError(err, "Failed to declare a queue")

	msgs, err := ch.Consume(
		q.Name, // Queue name
		"",     // Consumer name
		true,   // Auto-Ack
		false,  // Exclusive
		false,  // No-local
		false,  // No-wait
		nil,    // Arguments
	)
	failOnError(err, "Failed to register a consumer")

	// Print the message before starting the HTTP server
	fmt.Printf("waiting for the new messages...")

	// Define your URL for PUT requests
	//url := "http://localhost:5006/"
	url := os.Getenv("ORDER_API_URL")

	// Start the HTTP server
	http.HandleFunc("/go", helloHandler)
	//serverAddr := ":5006"
	serverAddr := os.Getenv("SERVER_ADDR")
	fmt.Printf("Server is running on %s\n", serverAddr)

	go func() {
		for d := range msgs {
			message := string(d.Body)
			fmt.Printf("Received a message: %s\n", message)

			// Parse the received message
			var msg Message
			err := json.Unmarshal([]byte(message), &msg)
			if err != nil {
				fmt.Println("Error parsing message:", err)
				continue
			}

			// Send the PUT request with the extracted ID
			sendPutRequest(url, msg.ID)
		}
	}()

	// Start the HTTP server
	err = http.ListenAndServe(serverAddr, nil)
	if err != nil {
		fmt.Printf("Error starting server: %s\n", err)
	}

	// The HTTP server is running and handling requests
	select {}
}

