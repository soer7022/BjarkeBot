FROM balenalib/rpi-node:11-latest-build
COPY . /app
WORKDIR /app
RUN apt-get update && apt-get install -yq \
    git build-essential python ffmpeg && \
    apt-get clean && rm -rf /var/lib/apt/lists/*
RUN npm install
CMD ["node", "."]
