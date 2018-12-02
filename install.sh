#!/bin/bash
INITIAL_ENV=venv

if which virtualenv > /dev/null; then
	echo "==================================================="
	echo "    VIRTUALENV ALREADY INSTALLED"
	echo "==================================================="
	virtualenv $INITIAL_ENV
else
	echo "==================================================="
	echo "INSTALL AND INITIALIZE A PYTHON VIRTUAL ENVIRONMENT"
	echo "==================================================="
	# Select current version of virtualenv:
	VERSION=15.1.0
	echo "VIRTUAL ENVIRONMENT VERSION " $VERSION 

	PYTHON=$(which python)
	URL_BASE=https://pypi.python.org/packages/d4/0c/9840c08189e030873387a73b90ada981885010dd9aea134d6de30cd24cb8/virtualenv-15.1.0.tar.gz#md5=44e19f4134906fe2d75124427dc9b716

	echo "DOWNLOADING VIRTUAL ENVIRONMENT "
	curl -o virtualenv-15.1.0.tar.gz $URL_BASE
	tar xzf virtualenv-$VERSION.tar.gz
	$PYTHON virtualenv-$VERSION/virtualenv.py $INITIAL_ENV
	# Don't need this anymore.
	rm -rf virtualenv-$VERSION
fi

# Add folders to hold installation files for custom jobs
if [ ! -d "uploads" ]; then
	mkdir uploads
fi

if [ ! -d "uploads/custom_install_files" ]; then
	mkdir uploads/custom_install_files
fi

if [ ! -d "$INITIAL_ENV" ]; then
	# Install virtualenv into the environment.
	$INITIAL_ENV/bin/pip install virtualenv-$VERSION.tar.gz
	rm -rf virtualenv-$VERSION.tar.gz
else
	echo "==================================================="
	echo "  VIRTUAL ENVIRONMENT INITIALIZED AT"
	echo "  $INITIAL_ENV"
	echo "==================================================="
fi

source $INITIAL_ENV/bin/activate
echo "==================================================="
echo "          INITIALIZED VIRTUAL ENVIRONMENT,"
echo "          INSTALLING PYTHON REQUIREMENTS"
echo "==================================================="

echo "==================================================="
echo "           UPGRADING PIP..."
echo "==================================================="
pip install --upgrade pip

echo "==================================================="
echo "           PIP UPGRADED"
echo "==================================================="

# Install core python requirements
pip install -r requirements.txt
