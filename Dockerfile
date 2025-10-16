FROM node:20-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

# Copy source
COPY . .

# Generate Prisma Client and Build
RUN npx prisma generate
RUN npm run build

# Start
CMD ["npm", "run", "start"]