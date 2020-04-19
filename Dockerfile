FROM balenalib/rpi-node
COPY . /app
WORKDIR /app
RUN apk --no-cache add g++ gcc libgcc libstdc++ linux-headers make python
RUN npm install --quiet node-gyp -g
CMD ["node", "."]
