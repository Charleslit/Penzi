
# Build step #2: 
FROM python:3.9 as backend
WORKDIR /app

WORKDIR /app
COPY run.py config.ini /app/
COPY Penzi/ ./Penzi
RUN pip install -r ./Penzi/requirements.txt

EXPOSE 5000 5000
# Install Flask 
RUN pip install Flask
RUN pip install mysql-connector-python

# Run Flask app3
CMD ["python", "run.py"]
