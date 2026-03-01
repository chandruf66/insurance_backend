FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
# Install only production dependencies to save RAM on your 1GB VM
RUN npm install --only=production
COPY . .
EXPOSE 5000
# Ensure your server.js uses process.env.PORT or 5000
CMD ["node", "server.js"] 
