FROM balenalib/rpi-node:latest-build
COPY . /app
WORKDIR /app
RUN apt-get update && apt-get install -yq \
    git build-essential python && \
    apt-get clean && rm -rf /var/lib/apt/lists/*
RUN apt-get install ffmpeg
RUN npm install
CMD ["node", "."]
