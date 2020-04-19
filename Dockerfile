FROM arm32v6/node
COPY . /app
WORKDIR /app
RUN npm install
CMD ["node", "."]
