package main

import (
	"fmt"
	"net/http"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "Hello, World!")
}

func main() {
	http.HandleFunc("/go", helloHandler)

	// Listen on port 5004
	serverAddr := ":5004"

	fmt.Printf("Server is running on %s\n", serverAddr)

	err := http.ListenAndServe(serverAddr, nil)
	if err != nil {
		fmt.Printf("Error starting server: %s\n", err)
	}
}
