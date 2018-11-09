from flask import Flask, request, redirect, url_for
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import subprocess
import random
import json
from pymongo import MongoClient

mongo = MongoClient('localhost', 27017)
db = mongo['compass']

app = Flask(__name__)
CORS(app)

def log(message):
    # TODO: Make this log to a database of some sort
    print(message)

def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_UPLOAD_EXTENSIONS

def generate_random_string(length):
    letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    numbers = '0123456789'
    return ''.join(random.choice(letters + numbers) for __ in range(length))

def check_file_request(request):
    # Check if the post has the return type
    if 'file' not in request.files:
        return json.dumps({'message': 'Missing file in upload'})
    file = request.files['file']

    # If the user doesn't select a file, browser also submits an empty part without filename
    if file.filename == '':
        return json.dumps({'message': 'Missing file in upload'})

    if not (file and allowed_file(file.filename)):
        return json.dumps({'message': 'Invalid installation file: \'%s\'' % file.filename})

def save_file(file):
    random_string = generate_random_string(RANDOM_PREFIX_LENGTH)
    filename = secure_filename(file.filename)
    filename_to_save = '%s__%s' % (random_string, filename) # Make this string uniquely identifiable
    uploaded_file = os.path.join(app.config['CONFIG_FILE_UPLOAD_FOLDER'], filename_to_save)
    file.save(uploaded_file)

    return uploaded_file

@app.route('/account/<account_type>/<username>', methods=['GET'])
def handle_get_account(account_type, username):
    accounts_collection = db['accounts']
    query = {'account_type': account_type, 'username': username}
    account = accounts_collection.find_one(query, {'_id': 0})
    if account:
        return json.dumps(account)
    else:
        return json.dumps({'message': 'No \'%s\' account found for \'%s\'' % (account_type, username)})

@app.route('/account/<account_type>', methods=['POST'])
def handle_account(account_type):
    data = request.json
    accounts_collection = db['accounts']

    assert 'alias' in data
    assert 'account_type' in data
    if data['account_type'] == 'Twitter streaming':
        assert 'username' in data
        assert 'api_key' in data
        assert 'api_secret' in data
        assert 'access_token' in data
        assert 'access_token_secret' in data
        
        account_data = {
            'username': data['username'],
            'api_key': data['api_key'],
            'api_secret': data['api_secret'],
            'access_token': data['access_token'],
            'access_token_secret': data['access_token_secret'],
            'account_type': data['account_type']
        }
        
        new_account_info = accounts_collection.replace_one(
            {
                'username': data['username'], 
                'account_type': data['account_type']
            }, 
            account_data, upsert=True)

        if new_account_info.matched_count:
            log('%s account for %s modified' % (data['account_type'], data['username']))
        else:
            log('New accounts created: \'%s\'' % new_account_info.modified_count)
        log('Account type: %s' % data['account_type'])
        log('Account username: %s' % data['username'])

        return json.dumps({'message': 'Account created successfully'})
    

@app.route('/start/<project_alias>')
def handle_start_project(project_alias):
    pass

@app.route('/pause/<project_alias>')
def handle_pause_project(project_alias):
    pass

@app.route('/diagnostics/<project_alias>')
def handle_project_diagnostics(project_alias):
    if project_alias == 'richie':
        return json.dumps({'message': 'Project diagnostics for alias \'Richie\''})
    return json.dumps({'message': 'Generic project diagnostics for \'%s\'' % project_alias})     

@app.route('/install/custom', methods=['GET', 'POST'])
def install():
    log('Current directory:\n%s' % os.getcwd())
    if request.method == 'POST':
        check_file_request(request)
        uploaded_file = save_file(request.files['file'])

        # TODO: Check this file to make sure it's safe first?
        subprocess.call(['./install_custom.sh', uploaded_file])

        return json.dumps({'message': 'Custom requirements file \'%s\' installed' % request.files['file'].filename})

    return '''
    <!doctype html>
    <title>Upload new requirements file</title>
    <h1>Upload new requirements file</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''

if __name__ == '__main__':
    app.config.update({
        'INSTALL_FILE_UPLOAD_FOLDER': 'uploads/custom_install_files',
        'CONFIG_FILE_UPLOAD_FOLDER': 'uploads/config_files'
    })

    ALLOWED_UPLOAD_EXTENSIONS = set(['txt', 'yml'])
    RANDOM_PREFIX_LENGTH = 10
    app.run()