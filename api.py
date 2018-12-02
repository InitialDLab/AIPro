from flask import Flask, request, redirect, url_for, make_response, jsonify
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
import os
import subprocess
import random
import json
from pymongo import MongoClient
import pyaml

ALLOWED_UPLOAD_EXTENSIONS = set(['txt', 'yml', 'py', 'json', 'csv'])
RANDOM_PREFIX_LENGTH = 10

mongo = MongoClient('localhost', 27017)
db = mongo['compass']

processes = {}

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
    log('Checking file request...')
    # Check if the post has the return type
    if 'file' not in request.files:
        return json.dumps({'message': 'Missing file in upload'})
    my_file = request.files['file']

    # If the user doesn't select a file, browser also submits an empty part without filename
    if my_file.filename == '':
        return json.dumps({'message': 'Missing file in upload'})

    if not (my_file and allowed_file(my_file.filename)):
        return json.dumps({'message': 'Invalid file type: \'%s\'' % my_file.filename})

def save_file(the_file, directory):
    random_string = generate_random_string(RANDOM_PREFIX_LENGTH)
    filename = secure_filename(the_file.filename)
    filename_to_save = '%s__%s' % (random_string, filename) # Make this string uniquely identifiable
    uploaded_file = os.path.join(directory, filename_to_save)
    the_file.save(uploaded_file)
    log('File saved to %s' % uploaded_file)

    return uploaded_file

@app.route('/upload', methods=['POST', 'GET'])
def handle_upload():
    # Check if the post has the return type
    if request.method == 'GET':
        return '''
        <!doctype html>
        <title>Upload new File</title>
        <h1>Upload new File</h1>
        <form method=post enctype=multipart/form-data>
        <input type=file name=file>
        <input type=submit value=Upload>
        </form>
        '''
    if 'file' not in request.files:
        log('Missing file in upload')
        return json.dumps({'message': 'Missing file in upload', 'error': True})
    my_file = request.files['file']

    # If the user doesn't select a file, browser also submits an empty part without filename
    if my_file.filename == '':
        return json.dumps({'message': 'Missing file in upload'})

    if not (my_file and allowed_file(my_file.filename)):
        return json.dumps({'message': 'Invalid file type: \'%s\'' % my_file.filename})
    #uploaded_file = save_file(request.files['file'], '/uploads')

    #return json.dumps({'message': 'File \'%s\' uploaded' % request.files['file'].filename})
    return json.dumps({'message': 'Everything OK, you\'re good.'})

@app.route('/login', methods=['POST'])
def handle_login():
    data = request.json
    username, password = data['username'], data['password']
    users_collection = db['users']

    result = users_collection.find_one({'username': username, 'password': password}, {'_id': 0})
    log('User record for %s: %r' % (username, result))

    if result:
        response = jsonify({'success': True})
        response.set_cookie('current_user', username)
        return response
    else:
        response = jsonify({'success': False})
        response.set_cookie('current_user', '')
        return response

@app.route('/logout', methods=['GET'])
def handle_logout():
    response = jsonify({'success': True})
    response.set_cookie('current_user', '')
    return response

@app.route('/user', methods=['POST'])
def handle_create_user():
    data = request.json
    if 'username' not in data or 'password' not in data:
        return json.dumps({'success': False})

    username, password, email = data['username'], data['password'], data['email']
    users_collection = db['users']

    insert_result = users_collection.replace_one({
        'username': username
    },
    {
        'username': username,
        'password': password,
        'email': email
    }, upsert=True)

    if insert_result:
        if insert_result.matched_count == 1:
            log('Updated user login for %s' % username)
        else:
            log('New user created: %s' % username)

        return json.dumps({'success': True})
    else:
        return json.dumps({'success': False})

@app.route('/<username>/account/<account_type>/', methods=['GET'])
def handle_get_account(username, account_type):
    accounts_collection = db['accounts']
    query = {'account_type': account_type, 'username': username}
    account = accounts_collection.find_one(query, {'_id': 0})
    log(account)
    if account:
        return json.dumps(account)
    else:
        return json.dumps({'message': 'No \'%s\' account found for \'%s\'' % (account_type, username)})

@app.route('/<username>/account/<account_type>', methods=['POST'])
def handle_save_account(username, account_type):
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
                'username': username, 
                'account_type': data['account_type']
            }, 
            account_data, upsert=True)

        if new_account_info.matched_count:
            log('\'%s\' account modified for \'%s\'' % (data['account_type'], data['username']))
            return json.dumps({'message': 'Account modified successfully'})
        else:
            log('New \'%s\' account created for: \'%s\'' % (data['account_type'], data['username']))
            return json.dumps({'message': 'Account created successfully'})    

@app.route('/<username>/pipelines/<pipeline_alias>', methods=['GET'])
def get_single_pipeline(username, pipeline_alias):
    pipelines_collection = db['pipelines']
    pipeline = pipelines_collection.find_one({'username': username, 'pipeline_alias': pipeline_alias}, {'_id': 0})
    
    # TODO: Check to make sure pipeline is OK, not an error
    
    return json.dumps({'pipeline': pipeline})

@app.route('/<username>/pipelines', methods=['GET'])
def get_pipelines(username):
    pipelines_collection = db['pipelines']
    pipelines = pipelines_collection.find({'username': username}, {'_id': 0})
    
    # TODO: Check to make sure that pipelines is OK, not an error
    result = list(pipelines)

    return json.dumps({'pipelines': result})

@app.route('/<username>/pipeline', methods=['POST', 'DELETE'])
def save_or_delete_pipeline(username):
    log(request.method)
    if not username:
        log('Invalid username, username cannot be empty')
        return json.dumps({'success': False, 'message': 'Invalid username, username cannot be empty'})
    if request.method == 'OPTIONS':
        log('Options, moving on...')
        return json.dumps({})

    if request.method == 'POST':
        data = request.json

        pipelines_collection = db['pipelines']
        saved_pipeline_info = pipelines_collection.replace_one(
            {
                'username': username,
                'pipeline_alias': data['pipeline_alias']
            },
            data, upsert=True)

        if saved_pipeline_info.matched_count:
            message = '\'%s\' pipeline modified for \'%s\'' % (data['pipeline_alias'], username)
            log(message)
            return json.dumps({'message': message, 'success': True})
        else:
            message = 'New pipeline \'%s\' created for \'%s\'' % (data['pipeline_alias'], username)
            log(message)
            return json.dumps({'message': message, 'success': True})
    elif request.method == 'DELETE':
        data = request.json

        pipelines_collection = db['pipelines']
        filterObj = {
            'username': username,
            'pipeline_alias': data['pipeline_alias']
        }

        # Prepare to delete a pipeline, make sure there is one there
        num_pipelines = pipelines_collection.count_documents(filterObj)
        if num_pipelines == 0:
            message = 'No pipelines to delete for username %s and pipeline alias %s' % (username, data['pipeline_alias'])
            log(message)
            return json.dumps({'success': True, 'message': message})
        else:
            log('%d pipelines with username %s and pipeline alias %s about to be deleted' % (num_pipelines, username, data['pipeline_alias']))
            delete_result = pipelines_collection.delete_one(filterObj)
            message = 'Deleted count %d' % delete_result.deleted_count
            log(message)
            return json.dumps({'success': True, 'message': message})
    else:
        return json.dumps({'success': False, 'message': 'Unsupported request type %s' % request.method})

@app.route('/<username>/pipeline/<pipeline_alias>/start')
def handle_start_pipeline(username, pipeline_alias):
    log('Getting pipeline \'%s\' from user \'%s\'' % (pipeline_alias, username))
    log('HELLO THERE')
    pipelines_collection = db['pipelines']
    pipeline = pipelines_collection.find_one({'username': username, 'pipeline_alias': pipeline_alias}, {'_id': 0})

    instance_id = generate_random_string(15)
    yaml_filename = '%s.yml' % instance_id
    with open(yaml_filename, 'w+') as yaml_file:
        pyaml.dump(pipeline, yaml_file)

    popen = subprocess.Popen(['python', 'main.py', '-c', yaml_filename])
    processes[instance_id] = popen
    log('Started pipeline instance id %s' % instance_id)
    return json.dumps({'instance_id': instance_id})

@app.route('/stop/<instance_id>')
def handle_stop_pipeline(instance_id):
    if instance_id in processes:
        processes[instance_id].terminate()
        del processes[instance_id]
        subprocess.call(['rm', '%s.yml' % instance_id])
        log('Stopped pipeline instance id %s' % instance_id)
        if (processes.keys()):
            log('Running processes:\n%s' % '\n'.join(processes.keys()))
        else:
            log('No more running processes\n')
        return json.dumps({'message': 'Instance ID %s stopped' % instance_id})
    else:
        return json.dumps({'message': 'Couldn\'t find instance id %s' % instance_id, 'error': True})

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