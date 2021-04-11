#!/usr/bin/env bash

# instrucciones de https://www.antlr.org/
# modificadas para servir shell no interactivo de root

pushd /usr/local/lib

wget https://www.antlr.org/download/antlr-4.9.2-complete.jar
echo 'export CLASSPATH=".:/usr/local/lib/antlr-4.9.2-complete.jar:$CLASSPATH"' >> /root/.bashrc

popd

ln -s $(pwd)/antlr4.sh /usr/bin/antlr4
ln -s $(pwd)/grun.sh /usr/bin/grun
