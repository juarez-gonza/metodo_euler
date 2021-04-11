FROM openjdk:11.0.10

COPY ./setup_scripts /usr/src/euler/setup_scripts
WORKDIR /usr/src/euler/setup_scripts/

RUN ./install_antlrv4.sh && ./install_utilities.sh

COPY ./src /usr/src/euler/src
WORKDIR /usr/src/euler/src

CMD ["/bin/bash", "-c", "javac *.java"]
