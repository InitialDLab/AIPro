import subprocess
from time import sleep

fake_pipeline_filename = 'fake/fake-pipeline.yml'
sent_pipeline_filename = 'examples/sentiment-analysis/config-rawfile.yml'

processes = {}

processes[fake_pipeline_filename] = subprocess.Popen(['python', 'main.py', '-c', fake_pipeline_filename])
processes[sent_pipeline_filename] = subprocess.Popen(['python', 'main.py', '-c', sent_pipeline_filename])
sleep(30)

processes[fake_pipeline_filename].kill()
processes[sent_pipeline_filename].kill()
