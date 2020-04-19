FROM arm32v6/node:10-alpine
COPY . /app
WORKDIR /app
RUN apk --no-cache add g++ gcc libgcc libstdc++ linux-headers make python
RUN npm install --quiet node-gyp -g
CMD ["node", "."]
