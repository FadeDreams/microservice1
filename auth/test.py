import requests

# Define the URL of the server's endpoint
server_url = 'http://localhost:5001/check_authentication'

# Define your bearer token
bearer_token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY5NzI5MTE1MSwianRpIjoiNWE2MmE3ZjUtNjc5My00YTNkLWFjNWEtYTMzOTFmMGQ4NWJmIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6InhAeC5jb20iLCJuYmYiOjE2OTcyOTExNTEsImV4cCI6MTY5NzI5MjA1MX0.t1j6Sxqf8LXCWwpK8THn-mx4-LqWchf1-wsNx55ZX_g'

# Set up the headers with the bearer token
headers = {
    'Authorization': bearer_token
}

# Send the GET request to the server
response = requests.get(server_url, headers=headers)

# Check the response status code and handle accordingly
if response.status_code == 200:
    print('Authentication succeeded:', response.json())
elif response.status_code == 401:
    print('Authentication failed:', response.json())
else:
    print('Unexpected response:', response.status_code, response.text)

