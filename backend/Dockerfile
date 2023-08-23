
# Build step #2: 
FROM python:3.9 as backend
WORKDIR /app
RUN pip install mysql-connector-python
COPY run.py config.ini /app/
COPY Penzi/ ./Penzi
RUN pip install -r ./Penzi/requirements.txt

# EXPOSE 5000
# # Install Flask 
# RUN pip install Flask


# # Run Flask app3
# CMD ["python3", "run.py"]
