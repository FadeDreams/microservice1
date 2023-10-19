import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import * as socketUtils from "./services/socketUtils.cjs";

dotenv.config();
//dotenv.config({
//path: "./config.env",
//});

const app = express();
const server = createServer(app);
const io = socketUtils.sio(server);
socketUtils.connection(io);

const socketIOMiddleware = (req, res, next) => {
  req.io = io;
  next();
};

// CORS
app.use(cors());

// ROUTES
app.use("/api/v1/hello", socketIOMiddleware, (req, res) => {
  req.io.emit("message", `Hello, `);
  res.send("hello world!");
});

// LISTEN
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});


//import express from 'express';
//import http from 'http';
//import authRouter from './routes/authRouter';
//import consumeMessages from './consumer.js';

//import dotenv from 'dotenv';
//dotenv.config();

//const app = express();

//const server = http.createServer(app);
//const port = process.env.PORT || 5003;

//const io = socketUtils.sio(server);
//socketUtils.connection(io);

//const socketIOMiddleware = (req, res, next) => {
//req.io = io;
//next();
//};

//app.use("/api/v1/hello", socketIOMiddleware, (req, res) => {
//req.io.emit("message", `Hello, ${req.originalUrl}`);
//res.send("hello world!");
//});

//app.use('/auth', authRouter);
//// app.use('/another', anotherRouter);

//app.listen(port, () => {
//console.log(`Server is running on port ${port}`);
//});

//consumeMessages();

