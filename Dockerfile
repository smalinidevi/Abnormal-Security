# Use Node.js as the base image for frontend
FROM node:18 AS frontend-build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY frontend/package.json frontend/package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend application
COPY frontend ./

# Expose the development server port
EXPOSE 3000

# Run the development server
CMD ["npm", "run", "dev"]

# Use an official Python runtime as a parent image for backend
FROM python:3.10-bullseye AS django-build

# Set the working directory in the container
WORKDIR /app

# Install system dependencies and SSL libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev libssl-dev openssl ca-certificates && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Verify Python SSL support
RUN python -m ensurepip --upgrade && \
    python -m pip install --upgrade pip setuptools wheel && \
    python -c "import ssl; print(ssl.OPENSSL_VERSION)"

# Copy the backend requirements file into the container
COPY backend/requirements.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend application code
COPY backend ./

# Copy SSL certificates (ensure they exist in the host machine)
COPY backend/ssl/ /app/ssl/

# Expose the port the Django app will run on
EXPOSE 8000

# Set environment variable to avoid Python buffering output
ENV PYTHONUNBUFFERED=1

# Run Django migrations and start the server with SSL
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver_plus --cert-file=ssl/localhost.crt --key-file=ssl/localhost-key.pem"]
