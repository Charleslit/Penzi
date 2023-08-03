# Build step #1: build the React front end
FROM node:16-alpine as frontend

# Set the working directory inside the container
WORKDIR /app



COPY package*.json ./
RUN npm install

COPY index.html vite.config.ts tsconfig.json tsconfig.node.json ./
COPY src ./src
COPY public ./public

# Expose the application port (assuming your React app runs on port 5173)
EXPOSE 5173

# Start the React application
CMD ["npm", "run","dev"]

