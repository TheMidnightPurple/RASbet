import mysql.connector

DB_HOST = 'localhost'
DB_USER = 'rasbet'
DB_PASS = 'rasbet'
DB_NAME = 'rasbet'

def connectToDB():
    connection = mysql.connector.connect(
        host= DB_HOST,
        user= DB_USER,
        password= DB_PASS,
        database= DB_NAME
    )

    cursor = connection.cursor()
    return (connection, cursor)



