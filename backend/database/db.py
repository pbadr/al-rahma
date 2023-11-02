from pymongo.mongo_client import MongoClient
from pymongo.database import Database
from pymongo.collection import Collection

from util import config

client = MongoClient(config['MONGODB_URI'])
database: Database = client['alrahma']

users: Collection = database['users']
