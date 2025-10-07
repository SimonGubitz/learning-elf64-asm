FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y nasm build-essential file bsdmainutils

WORKDIR /app

CMD ["/bin/bash"]