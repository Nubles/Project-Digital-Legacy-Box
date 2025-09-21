# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /code

# Install dependencies
# We copy only requirements.txt first to leverage Docker cache
COPY requirements.txt /code/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend application code
COPY . /code/

# Expose the port the app runs on
EXPOSE 8000

# Run gunicorn
# The number of workers is a suggestion and can be tuned
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "legacy_box.wsgi:application"]
