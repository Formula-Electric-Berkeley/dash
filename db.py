import os
from flask_pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

CONNECTION_STRING = os.getenv("ATLAS_URI")
run_data_db = MongoClient(CONNECTION_STRING)["run_data"]
run_data_collection = run_data_db.records


def get_all_run_data():
    """Returns all run data documents in run_data collection"""
    return run_data_collection.find()
