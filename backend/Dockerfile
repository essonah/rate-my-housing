# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the backend source code into the container
COPY . .

# Expose the port the backend service runs on
EXPOSE 5000

# Define the command to run the backend
CMD ["npm", "start"]