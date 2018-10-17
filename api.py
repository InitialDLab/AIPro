from flask import Flask, request, redirect, url_for
from werkzeug.utils import secure_filename
import os
import subprocess
import random
import json

app = Flask(__name__)

install_file_uploads_folder = 'uploads/custom_install_files'
app.config['INSTALL_FILE_UPLOAD_FOLDER'] = install_file_uploads_folder

ALLOWED_INSTALL_EXTENSIONS = set(['txt'])
RANDOM_PREFIX_LENGTH = 10

def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_INSTALL_EXTENSIONS

def generate_random_string(length):
    letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    numbers = '0123456789'
    return ''.join(random.choice(letters + numbers) for __ in range(length))

@app.route('/install/custom', methods=['GET', 'POST'])
def install():
    print('Current directory:\n%s' % os.getcwd())
    if request.method == 'POST':
        # Check if the post has the return type
        if 'file' not in request.files:
            return json.dumps({'message': 'Missing file in upload'})
        file = request.files['file']

        # If the user doesn't select a file, browser also submits an empty part without filename
        if file.filename == '':
            return json.dumps({'message': 'Missing file in upload'})

        if file and allowed_file(file.filename):
            random_string = generate_random_string(RANDOM_PREFIX_LENGTH)
            filename = secure_filename(file.filename)
            filename_to_save = '%s__%s' % (random_string, filename) # Make this string uniquely identifiable
            uploaded_install_file = os.path.join(app.config['INSTALL_FILE_UPLOAD_FOLDER'], filename_to_save)
            file.save(uploaded_install_file)

            # TODO: Check this file to make sure it's safe first?
            subprocess.call(['./install_custom.sh', uploaded_install_file])

            return json.dumps({'message': 'Custom requirements file \'%s\' installed' % file.filename})
        else:
            return json.dumps({'message': 'Invalid installation file: \'%s\'' % file.filename})

    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''
