from flask import Flask, request, redirect, url_for, make_response, jsonify, send_file
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
import os
import subprocess
import random
import json
from pymongo import MongoClient
import pyaml

mongo = MongoClient('db', 27017)
db = mongo['aipro']

processes = {}

app = Flask(__name__)
CORS(app, origins="http://localhost/*")

def log(message):
    print(message)

def generate_random_string():
    length = 15
    letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    numbers = '0123456789'
    return ''.join(random.choice(letters + numbers) for __ in range(length))

@app.route('/demo-data/<demo_type>', methods=['GET'])
def run_demo(demo_type):
    if demo_type == 'captions':
        with open('captions-demo.json') as f:
            lines = [json.loads(line) for line in f]
            return json.dumps({'images': lines[::-1]})
    elif demo_type == 'sentiment':
        with open('sentiment-demo.json') as f:
            lines = [json.loads(line) for line in f]
            return json.dumps({'tweets': lines[::-1]})
    elif demo_type == 'classification':
        with open('classification-demo.json') as f:
            lines = [json.loads(line) for line in f]
            return json.dumps({'images': lines[::-1]})
    else:
        return json.dumps({'error': True, 'message': 'Unknown demo type {}'.format(demo_type)})

@app.route('/streaming-images/<image_name>')
def get_image(image_name):
    return send_file('streaming-images/{}'.format(image_name), mimetype='image/jpeg')

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

@app.route('/<username>/account/<account_type>', methods=['POST', 'GET'])
def handle_save_account(username, account_type):
    if request.method == 'POST':
        data = request.json
        print('Incoming save credentials request:')
        print(data)
        accounts_collection = db['accounts']

        assert 'username' in data
        assert 'account_type' in data
        if account_type == 'twitter':
            required_keys = ['account_type', 'api_key', 'api_secret', 'access_token', 'access_token_secret', 'username']
            for key in required_keys:
                assert key in data
            
            account_data = {key: data[key] for key in required_keys}
            
            new_account_info = accounts_collection.replace_one(
                {
                    'username': username, 
                    'account_type': account_type
                }, 
                account_data, upsert=True)

            if new_account_info.matched_count:
                log('\'%s\' account modified for \'%s\'' % (account_type, username))
                return json.dumps({'message': 'Account modified successfully'})
            else:
                log('New \'%s\' account created for: \'%s\'' % (account_type, username))
                return json.dumps({'message': 'Account created successfully'})
        else:
            return json.dumps({'error': True, 'message': 'Unknown account  type {}'.format(account_type)}) 
    elif request.method == 'GET':
        accounts_collection = db['accounts']
        query = {'account_type': account_type, 'username': username}
        account = accounts_collection.find_one(query, {'_id': 0})
        log(account)
        if account:
            return json.dumps(account)
        else:
            return json.dumps({'message': 'No \'%s\' account found for \'%s\'' % (account_type, username)})
    else:
        return json.dumps({'message': 'Default message for options'})

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
    
    # Check to see if any of these pipelines are running
    for instance_id in processes:
        pipeline_alias = processes[instance_id]['pipeline_alias']
        for i in range(len(result)):
            if pipeline_alias == result[i]['pipeline_alias']:
                result[i]['instance_id'] = instance_id
                result[i]['running'] = True

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
    pipelines_collection = db['pipelines']
    pipeline = pipelines_collection.find_one({'username': username, 'pipeline_alias': pipeline_alias}, {'_id': 0})

    instance_id = generate_random_string()
    yaml_filename = '%s.yml' % instance_id
    with open(yaml_filename, 'w+') as yaml_file:
        pyaml.dump(pipeline, yaml_file)

    popen = subprocess.Popen(['python', 'main.py', '-c', yaml_filename])
    processes[instance_id] = {
        'process': popen,
        'pipeline_alias': pipeline_alias,
        'instance_id': instance_id
    }
    log('Started pipeline instance id %s' % instance_id)
    return json.dumps({'instance_id': instance_id})

@app.route('/stop/<instance_id>')
def handle_stop_pipeline(instance_id):
    if instance_id in processes:
        processes[instance_id]['process'].terminate()
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

@app.route('/test', methods=['GET'])
def test_route():
    return json.dumps({'test': True})

if __name__ == '__main__':
    app.run(host="0.0.0.0")