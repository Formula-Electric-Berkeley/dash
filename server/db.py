import sqlite3

# connection = sqlite3.connect(":memory:")
connection = sqlite3.connect("database.db", check_same_thread=False)

cursor = connection.cursor()

# cursor.execute(
#     "CREATE TABLE files (filename TEXT, size INTEGER, uploadDate TEXT)")

# cursor.execute("INSERT INTO files VALUES ('TEST.csv', 10, '99/99/2099')")
# cursor.execute("INSERT INTO files VALUES ('TEST.csv', 10, '99/99/2099')")


def get_all_rows():
    return cursor.execute(
        "SELECT filename, size, uploadDate FROM files").fetchall()


def add_file(filename, size, uploadDate):
    cursor.execute(
        f"INSERT INTO files VALUES ('{filename}', {size}, '{uploadDate}')")
    connection.commit()
    connection.close()


def get_num_changes():
    return connection.total_changes
