FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
# and ensure dependency installation is based on the correct manifest.
COPY package.json ./
COPY package-lock.json ./

# Install project dependencies. 'npm ci' ensures a clean and reproducible install.
RUN npm ci --loglevel verbose

# Copy the rest of the application source code into the container.
COPY . .

# Build the React application for production. This step creates the optimized build output.
RUN npm run build

# Expose the port the application will serve on. For a React dev server, it's typically 3000.
EXPOSE 3000

# Command to start the application. For development, 'npm start' usually runs the dev server.
# For production, consider serving the 'build' directory with a lightweight web server like 'serve'.
CMD ["npm", "start"]