import { Router, Request, Response } from 'express';
import { AuthChecker } from '../services/authchecker';

const authRouter = Router();

authRouter.get('/authchecker', async (req: Request, res: Response) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(401).json({ error: 'Authorization header is missing' });
    }
    const token = authorizationHeader.split(' ')[1]; // Assuming it's in the format "Bearer YourToken"
    const data = await AuthChecker(token);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to call target service' });
  }
});

export default authRouter;

