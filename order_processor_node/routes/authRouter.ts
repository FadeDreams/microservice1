import { Router, Request, Response } from 'express';
import { AuthChecker } from '../services/authchecker';

const authRouter = Router();

authRouter.get('/authchecker', async (req: Request, res: Response) => {
  try {
    // Get the "Authorization" header from the request
    const authorizationHeader = req.headers.authorization;

    //console.log("authorizationHeader", authorizationHeader)
    // You can now use the "authorizationHeader" in your authentication logic
    if (!authorizationHeader) {
      return res.status(401).json({ error: 'Authorization header is missing' });
    }

    // Here, you can parse the token or authentication information from "authorizationHeader"

    // For example, if it's a Bearer token, you can extract it like this:
    const token = authorizationHeader.split(' ')[1]; // Assuming it's in the format "Bearer YourToken"

    // You can now use "token" in your authentication logic

    // Call the AuthChecker service, passing the token
    const data = await AuthChecker(token);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to call target service' });
  }
});

export default authRouter;

