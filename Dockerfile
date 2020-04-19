FROM balenalib/rpi-node
COPY . /app
WORKDIR /app
RUN apt-get install ffmpeg
RUN npm install
CMD ["node", "."]
