FROM node:18

# cài openssl
RUN apt-get update && apt-get install -y openssl

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

CMD ["npm", "run", "dev"]