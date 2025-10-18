FROM node:20-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

# Copy source
COPY . .

# Build TypeScript code and generate Prisma client
RUN npm run prisma:generate
RUN npm run build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Run migrations and start the app
CMD /bin/sh -c "npm run prisma:migrate:deploy && npm start"