import os
import psycopg2
import uuid
from dotenv import load_dotenv

load_dotenv()

CONNECTION_STRING = os.getenv("DATABASE_URL")
conn = psycopg2.connect(CONNECTION_STRING)

cursor = conn.cursor()
cursor.execute(
    f"CREATE TABLE IF NOT EXISTS files (id STRING PRIMARY KEY, filename STRING, size FLOAT, uploadDate STRING)")
conn.commit()


def add_file(filename, filepath, size, uploadDate):
    unique_id = uuid.uuid4().hex[:8]

    cursor.execute(
        f"INSERT INTO files (id, filename, size, uploadDate) VALUES ('{unique_id}', '{filename}', {size}, '{uploadDate}')")
    conn.commit()


cursor.execute("SELECT * FROM files")
rows = cursor.fetchall()
print(rows)
# cursor.close()
# conn.close()
