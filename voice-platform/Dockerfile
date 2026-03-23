FROM node:20-alpine

WORKDIR /app

# Install dependencies first (cached layer)
COPY package.json package-lock.json ./
RUN npm install

# Copy startup script
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# Source code is mounted as a volume for dev hot-reload
EXPOSE 3000

ENTRYPOINT ["/bin/sh"]
CMD ["./start.sh"]
