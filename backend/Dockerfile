# Use an official Python runtime as a parent image
FROM python:3.10-bullseye

# Set the working directory
WORKDIR /app  # ✅ Set correct working directory

# Install dependencies
COPY backend/requirements.txt .  
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend project
COPY backend/ .  

# Expose Django port
EXPOSE 8000

# Run migrations and start Django
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
