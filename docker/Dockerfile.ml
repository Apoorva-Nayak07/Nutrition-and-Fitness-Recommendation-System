FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY ml-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY ml-service/ ./

# Expose port
EXPOSE 8000

# Start the application
CMD ["python", "app.py"]
