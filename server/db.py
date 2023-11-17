import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

CONNECTION_STRING = os.getenv("DATABASE_URL")
conn = psycopg2.connect(CONNECTION_STRING)

# with conn.cursor() as cur:
#     cur.execute("SELECT now()")
#     res = cur.fetchall()
#     conn.commit()
#     print(res)

cursor = conn.cursor()
cursor.execute(
    "CREATE TABLE IF NOT EXISTS files (id INT PRIMARY KEY, filename STRING, size INT, uploadDate STRING)")
conn.commit()

cursor.execute(
    "INSERT INTO files (id, filename, size, uploadDate) VALUES (2, 'test', 999, '99/99/2099')")
conn.commit()

cursor.execute("SELECT * FROM files")
rows = cursor.fetchall()
print(rows)
cursor.close()
conn.close()
