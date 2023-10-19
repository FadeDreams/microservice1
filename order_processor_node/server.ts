import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import authRouter from './routes/authRouter';
import consumeMessages from './consumer';
import * as socketUtils from "./services/socketUtils.cjs";

//import emitterRouter from './emmiter';

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
app.use(socketIOMiddleware);

// ROUTES
//app.use('/auth', authRouter);

//app.use("/e", socketIOMiddleware, (req, res, next) => {
////req.io.emit("message", `Hello, `);
//next();
//res.send("message sent to socket");
//});

//app.use('/', emitterRouter);

app.get('/e', async (req: Request, res: Response, next) => {
  try {
    req.io.emit("message", `Hello, `);
    await consumeMessages();
    //res.send('consumeMessages called successfully');

  } catch (error) {
    console.error('Error calling consumeMessages:', error);
    res.status(500).send('Error calling consumeMessages');
  }
});


const port = process.env.PORT || 5003;
const host = process.env.HOST || 'localhost';
server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

(async () => {
  const result = await consumeMessages();

  if (result === 1) {
    console.log('The PUT request was successful.');
    // Print something or perform actions here when the PUT request is successful.
  }
})();

//const serverUrl = `http://${host}:${port}`;
//const path = '/e';
//fetch(`${serverUrl}${path}`, {
//method: 'GET',
//})
//.then((response) => {
//if (!response.ok) {
//throw new Error(`Request failed with status: ${response.status}`);
//}
//return response.text();
//})
//.then((data) => {
//console.log(`Response from /emitter: ${data}`);
//})
//.catch((error) => {
//console.error(`Error making request to /emitter: ${error.message}`);
//});



//consumeMessages();
//export { app, socketIOMiddleware }
