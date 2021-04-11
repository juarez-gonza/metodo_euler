#!/usr/bin/env bash

if [ !"$(docker image ls | grep 'metodo_euler')" ]
then
	docker build --tag metodo_euler .
fi

if [ "$(docker container ps -a | grep euler)" ]
then
	docker container rm euler
fi

docker container run -it \
--name euler \
--mount type=bind,source=$(pwd)/setup_scripts,target=/usr/src/euler/setup_scripts/ \
--mount type=bind,source=$(pwd)/src,target=/usr/src/euler/src/ \
metodo_euler:latest /bin/bash
