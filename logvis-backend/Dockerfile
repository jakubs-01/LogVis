FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Default to production, can be overridden
ENV NODE_ENV=production

EXPOSE 5000

CMD ["npm", "run", "start"]