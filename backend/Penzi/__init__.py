from flask import Flask,jsonify
from flask_cors import CORS
import mysql.connector 
import configparser

app = Flask(__name__)
# bcrypt = Bcrypt()
config = configparser.ConfigParser()
config.read('config.ini')
with open('config.ini', 'r') as f:
    pass
host = config['database']['host']
port = config['database']['port']
database = config['database']['database']
username = config['database']['username']
password = config['database']['password']
Database =config['dbconfig']['Database']
# Read app settings
debug = config.getboolean('app', 'debug')
secret_key = config.get('app', 'secret_key')


db = mysql.connector.connect(
    host= 'mysql',
    port=port,
    database=database,
    user=username,
    password=password
)

# cnx = mysql.connector.connect(
#     host='mysql',
#     port=port,
#     database=Database,
#     user=username,
#     password=password
# )

# connection = mysql.connector.connect(
#     user='root', password='root', host='mysql', port="3306", database='db')

CORS(app, resources={r"/*": {"origins": "*"}})
from Penzi import routes
