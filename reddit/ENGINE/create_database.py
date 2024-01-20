import sqlite3
from sqlite3 import Error

#metoda koja kreira konekciju sa bazom
def create_connection(path):
    connection = None
    try:
        connection = sqlite3.connect(path,check_same_thread=False)
        print("Connection to SQLite DB successful")
    except Error as e:
        print(f"The error '{e}' occurred")

    return connection
