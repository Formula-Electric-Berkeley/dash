import os
import psycopg2
import uuid
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

CONNECTION_STRING = os.getenv("DATABASE_URL")
conn = psycopg2.connect(CONNECTION_STRING)

cursor = conn.cursor()
cursor.execute(
    f"CREATE TABLE IF NOT EXISTS files (id STRING PRIMARY KEY, filename STRING, size FLOAT, uploadDate STRING)")
conn.commit()


def add_file(filename, filepath, size, uploadDate):
    unique_id = "dashdata" + uuid.uuid4().hex[:8]

    cursor.execute(
        f"INSERT INTO files (id, filename, size, uploadDate) VALUES ('{unique_id}', '{filename}', {size}, '{uploadDate}')")
    conn.commit()

    df = pd.read_csv(filepath)
    df_columns = list(df.columns)
    table_str = ""
    insert_str = ""
    for i in df_columns:
        column_name = ''.join(char for char in i if char.isalnum())
        table_str += "col" + column_name + " STRING, "
        insert_str += "col" + column_name + ", "
    table_str = table_str[:-2]
    insert_str = insert_str[:-2]

    cursor.execute(
        f"CREATE TABLE {unique_id} ({table_str})")
    conn.commit()

    for row in df.itertuples():
        row_list = list(row)[1:]
        row_str = ', '.join(f"'{x}'" for x in row_list)

        cursor.execute(f'''
               INSERT INTO {unique_id} ({insert_str})
               VALUES ({row_str})
               ''')
    conn.commit()


def get_all_file_info():
    cursor.execute("SELECT * FROM files")
    return cursor.fetchall()


cursor.execute("SELECT * FROM files")
rows = cursor.fetchall()
print(rows)
