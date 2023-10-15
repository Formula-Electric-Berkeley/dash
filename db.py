import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

def get_database():
   CONNECTION_STRING = os.getenv("ATLAS_URI")

   client = MongoClient(CONNECTION_STRING)
 
   return client['run_data']
  
if __name__ == "__main__":   
   dbname = get_database()

   print(dbname)