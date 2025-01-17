# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements.txt file into the container at /app
COPY requirements.txt /app/

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . /app/

# Expose the port your Django app will run on
EXPOSE 8000

# Set the environment variable to avoid Python buffering output
ENV PYTHONUNBUFFERED=1

# Run Django migrations and start the application
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver_plus --cert-file=ssl/localhost.crt --key-file=ssl/localhost-key.pem"]