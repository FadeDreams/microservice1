## Microservices Architecture with RabbitMQ

This project implements a well-structured microservices architecture, featuring six components, utilizing RabbitMQ as the event bus.

## Overview

### Auth Microservice (Flask)
The Flask-based Auth Microservice ensures both authentication and authorization, guaranteeing secure access within the microservices ecosystem.

### Order Microservice (Flask)
Dedicated to placing orders into the event bus, the Order Microservice adopts a decoupled and scalable design, enhancing flexibility and scalability.

### Order Processors
Three distinct microservices efficiently process orders retrieved from the event bus:

#### Order Processor FastAPI (FastAPI)
Handles order processing with the efficiency of FastAPI, contributing to the speed and responsiveness of the system.

#### Order Processor Node (Node.js)
Leverages Node.js to process orders seamlessly, ensuring a swift and effective execution of order-related tasks.

#### Order Processor Go (Golang)
Utilizes Golang for efficient order processing, adding robustness to the microservices architecture.

### React-Redux Microservice
Manages the placement of orders into the relevant microservices and utilizes Socket.IO for real-time updates, enhancing the overall user experience.

## Project Structure
```plaintext
.
├── auth
├── docker-compose.yaml
├── kubernetes
├── order
├── order_processor_fastapi
├── order_processor_go
├── order_processor_node
├── react-redux-ui
└── README.md

```

## Getting Started
1. Clone the repository.
2. Run the Docker Compose configuration using `docker-compose up`.
3. Explore the various microservices and their functionalities.

Feel free to contribute, report issues, or provide feedback to enhance and optimize the microservices architecture. Let's build a robust and scalable system together!
