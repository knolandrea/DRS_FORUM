from functools import wraps
import jwt
from flask import request, abort
from flask import current_app
from Models.User import ListToDict
import sys


def token_required(database,secretkey):

    def decorated():
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
            print("TOKEEN:"+token)
            sys.stdout.flush()
        if token==None:
            print("Nije nasao token")
            sys.stdout.flush()
            return "FALSE"




        data=jwt.decode(token,secretkey, algorithms=["HS256"])

        cursor=database.cursor()
        cursor.execute("select * from user")
        database.commit()
        db_list=cursor.fetchall()
        current_user=None
        print(data)
        sys.stdout.flush()
        for i in db_list:
            if(i[0]==data["id"]):

                 sys.stdout.flush()
                 current_user=ListToDict(i)
                 return (current_user)


        if current_user is None:
          return "FALSE"

            #if current_user["loggedIn"]=="N":
                #return "FALSE"




        return (current_user)

    return decorated()
