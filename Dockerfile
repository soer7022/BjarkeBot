FROM arm32v6/node:10-alpine
COPY . /app
WORKDIR /app
RUN npm install
CMD ["node", "."]
