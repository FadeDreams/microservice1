# Use the official Python image as a parent image
FROM python:3.11-slim

# Set the working directory
WORKDIR /app_fastapi

# Copy the requirements file into the container
COPY requirements.txt .

# Install FastAPI dependencies
RUN pip install -r requirements.txt

# Copy the rest of your FastAPI application into the container
COPY . .

# Expose the port your FastAPI app will run on
EXPOSE 5005

# Start the FastAPI app with uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5005"]

