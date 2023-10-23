import axios from 'axios';

export async function refreshToken() {
  const apiUrl = process.env.REACT_APP_LOGIN_API_URL;
  const refreshUrl = `${apiUrl}/refresh`;

  const refresh_token = localStorage.getItem('refresh_token');

  try {
    const response = await axios.post(
      refreshUrl,
      {},
      {
        headers: {
          Authorization: `Bearer ${refresh_token}`,
        },
      }
    );

    const newAccessToken = response.data.access_token;

    if (newAccessToken) {
      localStorage.setItem('token', newAccessToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
  }
}

export const handleTokenRefreshError = async (error) => {
  if (error.response && error.response.status === 401) {
    try {
      await refreshToken();
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError);
    }
  } else {
    console.error('Error creating the order:', error);
  }
};

