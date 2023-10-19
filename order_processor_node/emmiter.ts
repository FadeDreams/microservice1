import { Router, Request, Response } from 'express';
import consumeMessages from './consumer'; // Import the consumeMessages function

const emitterRouter = Router();

emitterRouter.get('/e', async (req: Request, res: Response, next) => {
  console.log("emmitter");

  // Now req.io should be accessible here
  //console.log(req.io);

  try {
    consumeMessages();
    req.io.emit("message", `Hello, `);
    next();

    //res.send('consumeMessages called successfully');
  } catch (error) {
    console.error('Error calling consumeMessages:', error);
    res.status(500).send('Error calling consumeMessages');
  }
});

export default emitterRouter;

