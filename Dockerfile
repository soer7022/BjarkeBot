FROM balenalib/rpi-node:latest-build
COPY . /app
WORKDIR /app
RUN apt-get install ffmpeg
RUN npm install
CMD ["node", "."]
