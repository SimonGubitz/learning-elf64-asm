FROM ubuntu:22.04

# copy the "shared" dir

RUN apt-get update && \
    apt-get install -y nasm build-essential file bsdmainutils

WORKDIR /app

CMD ["/bin/bash"]
