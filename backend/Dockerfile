FROM node:18-alpine
RUN npm install -g typescript
WORKDIR /backend
COPY package*.json ./
COPY . .
EXPOSE 5500
CMD ["./start.sh"]