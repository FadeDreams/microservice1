import axios, { AxiosRequestConfig } from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 5003;
const target = process.env.AUTH_API_URL || 'http://localhost:5001/check_auth';

export async function AuthChecker(accessToken: string) {
  console.log("AuthChecker", accessToken)

  try {
    // Define the headers with the access token and any custom headers
    const headers: AxiosRequestConfig = {
      headers: {
        'Authorization': `Bearer ${accessToken}`, // Include the provided access token
        //'Custom-Header': 'SomeValue' // Replace with any custom headers you need
      }
    };

    // Make the GET request with the defined headers
    const response = await axios.get(target, headers);

    return response.data;
  } catch (error) {
    console.error('Error calling AuthChecker:', error);
    throw error;
  }
}

