from flask import Flask,jsonify
from flask_cors import CORS
import mysql.connector 
import configparser

config = configparser.ConfigParser()
config.read('config.ini')
with open('config.ini', 'r') as f:
    print(f.read())
host = config['database']['host']
port = config['database']['port']
database = config['database']['database']
username = config['database']['username']
password = config['database']['password']
# Read app settings
debug = config.getboolean('app', 'debug')
secret_key = config.get('app', 'secret_key')
 


app = Flask(__name__)
# db = mysql.connector.connect(
#     host=host,
#     port=port,
#     database=database,
#     user=username,
#     password=password
# )
import time
import mysql.connector

def create_db_connection(retries=10, retry_delay=5):
    for _ in range(retries):
        try:
            db = mysql.connector.connect(
                host='db',
                user='root',
                password='lit123',
                database='Penzi'
            )
            return connection
        except mysql.connector.Error as err:
            print(f"Failed to connect to the database. Error: {err}")
            time.sleep(retry_delay)
    raise Exception("Unable to establish a connection to the database.")

# if db.is_connected():
#     print('Connection to MySQL server is successful')
# else:
#     print('Connection failed')
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})
from Penzi import routes
