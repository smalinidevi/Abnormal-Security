# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev libssl-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container
COPY requirements.txt /app/

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . /app/

# Copy SSL certificates (ensure they exist in the host machine)
COPY ssl/ /app/ssl/

# Expose the port the Django app will run on
EXPOSE 8000

# Set environment variable to avoid Python buffering output
ENV PYTHONUNBUFFERED=1

# Run Django migrations and start the server
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver_plus --cert-file=ssl/localhost.crt --key-file=ssl/localhost-key.pem "] 