import os
from flask_pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

CONNECTION_STRING = os.getenv("ATLAS_URI")
dash_db = MongoClient(CONNECTION_STRING)["dash_db"]
dash_data_collection = dash_db.data
dash_headers_collection = dash_db.headers


def get_all_run_data():
    """Returns all run data documents in run_data collection"""
    return None
