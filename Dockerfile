FROM node:19-bullseye

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app

RUN apt-get update -y
RUN apt-get install -y ffmpeg libopus-dev libffi-dev libnacl-dev libsodium-dev libssl-dev

RUN rm -rf node_modules
