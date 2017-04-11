#!/bin/bash
echo "==================================================="
echo "INSTALL AND INITIALIZE A PYTHON VIRTUAL ENVIRONMENT"
echo "==================================================="
# Select current version of virtualenv:
VERSION=15.1.0
echo "VIRTUAL ENVIRONMENT VERSION " $VERSION 
INITIAL_ENV=virtualenv
PYTHON=$(which python)
URL_BASE=https://pypi.python.org/packages/d4/0c/9840c08189e030873387a73b90ada981885010dd9aea134d6de30cd24cb8/virtualenv-15.1.0.tar.gz#md5=44e19f4134906fe2d75124427dc9b716

echo "DOWNLOADING VIRTUAL ENVIRONMENT "
curl -o virtualenv-15.1.0.tar.gz $URL_BASE
tar xzf virtualenv-$VERSION.tar.gz
$PYTHON virtualenv-$VERSION/virtualenv.py $INITIAL_ENV
# Don't need this anymore.
rm -rf virtualenv-$VERSION
# Install virtualenv into the environment.
$INITIAL_ENV/bin/pip install virtualenv-$VERSION.tar.gz
source virtual_env/bin/activate
rm -rf virtualenv-$VERSION.tar.gz

echo "==================================================="
echo "          INITIALIZED VIRTUAL ENVIRONMENT"
echo "==================================================="

