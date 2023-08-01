# Build step #1: build the React front end
FROM node:16-alpine as build-step
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json package-lock.json ./
COPY front/src ./src
COPY front/public ./public
RUN npm install
CMD ["npm", "start"]

# Build step #2: build the PENZIAPI with the client as static files
FROM python:3.9
WORKDIR /app
COPY --from=build-step /app/ ./build

COPY run.py /app/
COPY Penzi/ ./Penzi
RUN pip install -r ./Penzi/requirements.txt

EXPOSE 5000
# Install Flask 
RUN pip install Flask
RUN python -m pip install mysql-connector-python 

# Run Flask app3
CMD ["python", "run.py"]
