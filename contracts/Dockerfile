# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files first to install deps
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the Hardhat project
COPY . .

# Default command for hardhat node
CMD ["npx", "hardhat", "node"]
