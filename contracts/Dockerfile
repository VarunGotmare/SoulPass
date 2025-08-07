# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files first to install deps
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy entire project
COPY . .

# Make the entrypoint script executable
RUN chmod +x run.sh

# Start everything via script
CMD ["./run.sh"]
