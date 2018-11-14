from flask import Flask, request, redirect, url_for
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import subprocess
import random
import json
from pymongo import MongoClient
import pyaml

ALLOWED_UPLOAD_EXTENSIONS = set(['txt', 'yml'])
RANDOM_PREFIX_LENGTH = 10

mongo = MongoClient('localhost', 27017)
db = mongo['compass']

app = Flask(__name__)
CORS(app)

def log(message):
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
        return json.dumps({'message': 'Invalid file type: \'%s\'' % file.filename})

def save_file(file, directory):
    random_string = generate_random_string(RANDOM_PREFIX_LENGTH)
    filename = secure_filename(file.filename)
    filename_to_save = '%s__%s' % (random_string, filename) # Make this string uniquely identifiable
    uploaded_file = os.path.join(directory, filename_to_save)
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
        return json.dumps({'error': True, 'message': 'No \'%s\' account found for \'%s\'' % (account_type, username)})

@app.route('/account/<account_type>', methods=['POST'])
def handle_save_account(account_type):
    data = request.json
    accounts_collection = db['accounts']

    assert 'account_type' in data
    if data['account_type'] == 'Twitter streaming':
        required_keys = ['username', 'account_type', 'api_key', 'api_secret', 'access_token', 'access_token_secret']
        for key in required_keys:
            assert key in data
        
        account_data = {key: data[key] for key in required_keys}
        
        new_account_info = accounts_collection.replace_one(
            {
                'username': data['username'], 
                'account_type': data['account_type']
            }, 
            account_data, upsert=True)

        if new_account_info.matched_count:
            log('\'%s\' account modified for \'%s\'' % (data['account_type'], data['username']))
            return json.dumps({'message': 'Account modified successfully'})
        else:
            log('New \'%s\' account created for: \'%s\'' % (data['account_type'], data['username']))
            return json.dumps({'message': 'Account created successfully'})    

@app.route('/pipelines/<username>', methods=['GET'])
def get_pipelines(username):
    pipelines_collection = db['pipelines']
    pipelines = pipelines_collection.find({'username': username}, {'_id': 0})
    result = list(pipelines)

    return json.dumps(result)

@app.route('/pipeline', methods=['POST'])
def save_pipeline():
    data = request.json

    pipelines_collection = db['pipelines']
    saved_pipeline_info = pipelines_collection.replace_one(
        {
            'username': data['username'],
            'pipeline_alias': data['pipeline_alias']
        },
        data, upsert=True)

    if saved_pipeline_info.matched_count:
        message = '\'%s\' pipeline modified for \'%s\'' % (data['pipeline_alias'], data['username'])
        log(message)
        return json.dumps({'message': message})
    else:
        message = 'New pipeline \'%s\' created for \'%s\'' % (data['pipeline_alias'], data['username'])
        log(message)
        return json.dumps({'message': message})
    

@app.route('/start/<pipeline_alias>')
def handle_start_pipeline(pipeline_alias):
    pass

@app.route('/pause/<pipeline_alias>')
def handle_pause_pipeline(pipeline_alias):
    pass

@app.route('/diagnostics/<pipeline_alias>')
def handle_pipeline_diagnostics(pipeline_alias):
    if pipeline_alias == 'richie':
        return json.dumps({'message': 'pipeline diagnostics for alias \'Richie\''})
    return json.dumps({'message': 'Generic pipeline diagnostics for \'%s\'' % pipeline_alias})     

@app.route('/install/custom', methods=['POST'])
def install():
    check_file_request(request)
    uploaded_file = save_file(request.files['file'], app.config['CONFIG_FILE_UPLOAD_FOLDER'])

    # TODO: Check this file to make sure it's safe first?
    subprocess.call(['./install_custom.sh', uploaded_file])

    return json.dumps({'message': 'Custom requirements file \'%s\' installed' % request.files['file'].filename})

if __name__ == '__main__':
    app.config.update({
        'INSTALL_FILE_UPLOAD_FOLDER': 'uploads/custom_install_files',
        'CONFIG_FILE_UPLOAD_FOLDER': 'uploads/config_files'
    })

    app.run()