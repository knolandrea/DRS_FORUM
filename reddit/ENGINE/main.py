import os
import sys
from flask import jsonify,request, Flask,session,current_app
from Models.Comment import ListToDictComment
from create_database import create_connection
from flask_cors import CORS  #pip install Flask-CORS
from Models.User import User,ListToDict
from Models.Post import Post,ListToDictPost
import json
import sqlite3
import sqlalchemy
import jwt
import security
#from sendgridEmail import SendHTML
from multiprocessing import Process, current_process

app = Flask(__name__)

app.config['DEBUG'] = True
app.config["SESSION_TYPE"]='filesystem'     #sesije se cuvaju u filesystem
app.config["SESSION_PERMANENT"]=True
app.config["PERMANENT_SESSION_LIFETIME"]=1000
app.config["SECRET_KEY"]="SECRET_KEY"       #kljuc za generisanje tokena itd

#Flask-CORS is a Flask extension that simplifies the process of handling Cross-Origin Resource Sharing issues
CORS(app)

database = create_connection("./instance/forum.db")

app.secret_key="hhhhhh"
#cursor is an object used to interact with the database. It allows you to execute SQL queries and retrieve results.
cursor=database.cursor()

# DEFINISANJE ENDPOINTOVA/ROUTES

#preuzima topics iz baze, za svaki trazi username, vraca podatke u json obliku
@app.route('/home', methods=['GET'])
def home():
    cursor.execute("select * from topic")
    database.commit()
    postsRAW=cursor.fetchall()
    allPosts=[]

    for post in postsRAW:
      cursor.execute("select username from user WHERE id=?",(post[5],))
      database.commit()
      id=cursor.fetchone()
      allPosts.append(ListToDictPost(post,id[0]))

    return jsonify(allPosts)

#vraca podatke o autentifikovanom korisniku
@app.route('/profile', methods=['GET','POST'])
def profile():
   user=security.token_required(database,app.config["SECRET_KEY"])

   return jsonify(user)

#apdejtuje br lajkova topika, listu lajkovanih tema svakog korisnika i vraca podatke o korisniku kao json
@app.route('/like', methods=['GET','POST'])
def like():
   user=security.token_required(database,app.config["SECRET_KEY"])
   print("TEST1")
   id=request.get_json()
   cursor.execute("""UPDATE topic SET likes=likes+1 where id=?""",(int(id),))
   database.commit()

   liked_topic=[]
   cursor.execute("""SELECT likedTopic from user where id=?""",(user["id"],))
   database.commit()
   liked_topic_JSON=cursor.fetchone()

   liked_topic=json.loads(liked_topic_JSON[0])
   liked_topic.append(id)

   cursor.execute("""UPDATE user SET likedTopic=? WHERE id=?""",(json.dumps(liked_topic),user["id"],))
   database.commit()

   return jsonify(user)

#apdejtuje iste podatke kao i like
@app.route('/unlike', methods=['GET','POST'])
def unlike():
   user=security.token_required(database,app.config["SECRET_KEY"])

   id=request.get_json()
   cursor.execute("""UPDATE topic SET likes=likes-1 where id=?""",(int(id),))
   database.commit()

   liked_topic=[]
   cursor.execute("""SELECT likedTopic from user where id=?""",(user["id"],))
   database.commit()
   liked_topic_JSON=cursor.fetchone()

   liked_topic=json.loads(liked_topic_JSON[0])
   liked_topic.remove(id)

   cursor.execute("""UPDATE user SET likedTopic=? WHERE id=?""",(json.dumps(liked_topic),user["id"],))
   database.commit()

   return jsonify(user)

#downvote
@app.route('/dislike', methods=['GET','POST'])
def dislike():
   user=security.token_required(database,app.config["SECRET_KEY"])

   id=request.get_json()
   cursor.execute("""UPDATE topic SET dislikes=dislikes+1 where id=?""",(int(id),))
   database.commit()

   disliked_topic=[]
   cursor.execute("""SELECT unlikedTopic from user where id=?""",(user["id"],))
   database.commit()
   disliked_topic_JSON=cursor.fetchone()

   disliked_topic=json.loads(disliked_topic_JSON[0])
   disliked_topic.append(id)

   cursor.execute("""UPDATE user SET unlikedTopic=? WHERE id=?""",(json.dumps(disliked_topic),user["id"],))
   database.commit()

   return jsonify(user)

#un-downvote
@app.route('/undislike', methods=['get','post'])
def undislike():
   user=security.token_required(database,app.config["SECRET_KEY"])

   id=request.get_json()
   cursor.execute("""UPDATE topic SET dislikes=dislikes-1 where id=?""",(int(id),))
   database.commit()

   disliked_topic=[]
   cursor.execute("""SELECT unlikedTopic from user where id=?""",(user["id"],))
   database.commit()
   disliked_topic_JSON=cursor.fetchone()

   disliked_topic=json.loads(disliked_topic_JSON[0])
   disliked_topic.remove(id)

   cursor.execute("""UPDATE user SET unlikedTopic=? WHERE id=?""",(json.dumps(disliked_topic),user["id"],))
   database.commit()

   return jsonify(user)

#prima apdejtovane podatke(json), vrsi validaciju i apdejtuje ih u bazi, uspesno -vraca true, neuspesno - vraca false
@app.route('/change-data', methods=['GET','POST'])
def changeData():
  user=security.token_required(database,app.config["SECRET_KEY"])
  user_update=request.get_json()

  if(user['email'] == "" or user['password'] == '' or user['address'] == '' or user['firstName'] == '' or user['lastName'] == '' or user['country'] == '' or user['username'] == '' or user['phoneNumber'] == '' ):
         return jsonify("FALSE")

  cursor.execute("""UPDATE user SET firstName=?,lastName=?,username=?,password=?,country=?,address=?,email=?,phoneNumber=?WHERE id=?""",(user_update['firstName'],user_update['lastName'],user_update['username'],user_update['password'],user_update['country'],user_update['address'],user_update['email'],user_update['phoneNumber'],user['id'],))
  database.commit()

  return jsonify("TRUE")

#prima unesene login podatke i vrsi validaciju
@app.route('/login', methods=['GET', 'POST'])
def login():
  if request.method=="POST":
        user=request.get_json()
        if(user['email'] == "" or user['password'] == ''):
            return jsonify("FALSE")
        cursor.execute("""SELECT * from user""")
        database.commit()
        db_list=cursor.fetchall()   #lista korisnika iz baze
        userr={}

        #trazi odgovarajuceg korisnika, logged in = Y, kreira json web token i vraca ga
        for i in db_list:
            if(i[8]==user['email'] and i[6]==user['password']):
              cursor.execute("""UPDATE user SET loggedIn='Y'WHERE email=?""",(user['email'],))
              database.commit()
              userr["token"] = jwt.encode(
                    {"id": i[0]},
                    app.config["SECRET_KEY"],
                    algorithm="HS256"
                )
              return jsonify(userr)

        return jsonify("FALSE")

#
@app.route('/register', methods=['POST','GET'])
def register():
    if request.method=="POST":
       #prrima unete podatke i verifikuje ih
       user=request.get_json()

       if(user['email'] == "" or user['password'] == '' or user['address'] == ''
        or user['firstName'] == '' or user['lastName'] == '' or user['country'] == '' or user['username'] == ''or user['phoneNumber'] == '' ):
         return jsonify("FALSE")

        #preuzima listu korisnika, gleda da li postoji vec sa istim usernameom/mejlom, ako ne kreira ga u bazi
       cursor.execute("""SELECT * from user""")
       database.commit()
       db_list=cursor.fetchall()
       for i in db_list:
         if(i[5]==user['username']):
            return jsonify("Username already exist! Try different one!")
         elif(i[8]==user['email']):
             return  jsonify("Email is already in use! Try logging in!")

       cursor.execute("SELECT COALESCE(MAX(id),0) FROM user")
       database.commit()
       oldid=cursor.fetchone()
       newid = oldid[0] + 1

       cursor.execute("""INSERT OR REPLACE INTO  user (id,firstName,lastName,address,country,username,password,phoneNumber,email,loggedIn,likedTopic,unlikedTopic,likedComment,unlikedComment,interests) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",(newid,user['firstName'],user['lastName'],user['address'],user['country'],user['username'],user['password'],user['phoneNumber'],user['email'],'N',"[]","[]","[]","[]","[]",))
       database.commit()
       print("user:"+user['username']+"  pasword:"+user['password'])
       sys.stdout.flush()
       return jsonify("Succes!")

#logout-uje odgovarajuceg korisnika na osnovu tokena, u bazi menja loggedin na 'N'
@app.route('/logout', methods=['GET', 'POST'])
def logout():
  user=security.token_required(database,app.config["SECRET_KEY"])
  cursor.execute("""UPDATE user SET loggedIn='N'WHERE username=?""",(user['username'],))
  database.commit()
  return jsonify('TRUE')

#za logovanog korisnika preuzima podatke za novi post, dodeljuje mu id i kreira ga u bazi
@app.route('/add-post', methods=['GET', 'POST'])
def addpost():
  user=security.token_required(database,app.config["SECRET_KEY"])
  cursor.execute("SELECT COALESCE(MAX(id),0) FROM topic")
  database.commit()
  oldid=cursor.fetchone()
  newid = oldid[0] + 1

  newPost=request.get_json()

  cursor.execute("""INSERT OR REPLACE INTO  topic (id,title,description,likes,dislikes,user_id,isDeleted,isClosed,commentsNumber,subscribedUser) VALUES (?,?,?,?,?,?,?,?,?,?)""",(newid,newPost['title'],newPost['description'],newPost['likes'],newPost['dislikes'],user['id'],0,0,0,"[]"))
  database.commit()

  return jsonify('TRUE')

# dodavanje komentara
@app.route('/add-comment', methods=['GET','POST'])
def addcomment():
    #GET-> preuzima sve komentare iz baze, formatira ih i vraca odgovor kao json
   if request.method=="GET":
      print("getttt")
      cursor.execute("select * from comment")
      database.commit()
      commentsRAW=cursor.fetchall()
      allComments=[]

      for comment in commentsRAW:
         cursor.execute("select username from user WHERE id=?",(comment[4],))
         database.commit()
         id=cursor.fetchone()
         allComments.append(ListToDictComment(comment,id[0]))

      return jsonify(allComments)

   #POST->prima json(podaci o komentaru), dodaje ga u bazu
   if request.method=="POST":
      print("usepsno")
      user=security.token_required(database,app.config["SECRET_KEY"])
      newComment=request.get_json()
      print(newComment)
      cursor.execute("SELECT COALESCE(MAX(id),0) FROM comment")
      database.commit()
      oldid=cursor.fetchone()
      newid = oldid[0] + 1

      cursor.execute("""INSERT OR REPLACE INTO  comment (id,desc,likes,dislikes,user_id,topic_id) VALUES (?,?,?,?,?,?)""",(newid,newComment['desc'],newComment['likes'],newComment['dislikes'],user['id'], newComment['topic_id']))
      database.commit()

      cursor.execute("""select title from topic where id=?""",(newComment['topic_id'],))
      database.commit()

      tema = cursor.fetchone()[0]

      cursor.execute("""UPDATE topic set commentsNumber=commentsNumber+1 where id=?""",(newComment['topic_id'],))
      database.commit()


      return jsonify("TRUE")

#prima info o komentaru i apdejtuje lajkove
@app.route('/likeComment', methods=['GET','POST'])
def likeComment():
   user=security.token_required(database,app.config["SECRET_KEY"])
   print("TEST1")
   id=request.get_json()
   cursor.execute("""UPDATE comment SET likes=likes+1 where id=?""",(int(id),))
   database.commit()

   liked_comment=[]
   cursor.execute("""SELECT likedComment from user where id=?""",(user["id"],))
   database.commit()
   liked_comment_JSON=cursor.fetchone()

   liked_comment=json.loads(liked_comment_JSON[0])
   liked_comment.append(id)

   cursor.execute("""UPDATE user SET likedComment=? WHERE id=?""",(json.dumps(liked_comment),user["id"],))
   database.commit()

   return jsonify(user)

#prima info o komentaru i apdejtuje lajkove
@app.route('/unlikeComment', methods=['GET','POST'])
def unlikeComment():
   user=security.token_required(database,app.config["SECRET_KEY"])

   id=request.get_json()
   cursor.execute("""UPDATE comment SET likes=likes-1 where id=?""",(int(id),))
   database.commit()

   liked_comment=[]
   cursor.execute("""SELECT likedComment from user where id=?""",(user["id"],))
   database.commit()
   liked_comment_JSON=cursor.fetchone()

   liked_comment=json.loads(liked_comment_JSON[0])
   liked_comment.remove(id)

   cursor.execute("""UPDATE user SET likedComment=? WHERE id=?""",(json.dumps(liked_comment),user["id"],))
   database.commit()

   return jsonify(user)

#prima info o komentaru i apdejtuje dislajkove
@app.route('/dislikeComment', methods=['GET','POST'])
def dislikeComment():
   user=security.token_required(database,app.config["SECRET_KEY"])

   id=request.get_json()
   cursor.execute("""UPDATE comment SET dislikes=dislikes+1 where id=?""",(int(id),))
   database.commit()

   disliked_comment=[]
   cursor.execute("""SELECT unlikedComment from user where id=?""",(user["id"],))
   database.commit()
   disliked_comment_JSON=cursor.fetchone()

   disliked_comment=json.loads(disliked_comment_JSON[0])
   disliked_comment.append(id)

   cursor.execute("""UPDATE user SET unlikedComment=? WHERE id=?""",(json.dumps(disliked_comment),user["id"],))
   database.commit()

   return jsonify(user)

#prima info o komentaru i apdejtuje dislajkove
@app.route('/undislikeComment', methods=['GET','POST'])
def undislikeComment():
   user=security.token_required(database,app.config["SECRET_KEY"])

   id=request.get_json()
   cursor.execute("""UPDATE comment SET dislikes=dislikes-1 where id=?""",(int(id),))
   database.commit()

   disliked_comment=[]
   cursor.execute("""SELECT unlikedComment from user where id=?""",(user["id"],))
   database.commit()
   disliked_comment_JSON=cursor.fetchone()

   disliked_comment=json.loads(disliked_comment_JSON[0])
   disliked_comment.remove(id)

   cursor.execute("""UPDATE user SET unlikedComment=? WHERE id=?""",(json.dumps(disliked_comment),user["id"],))
   database.commit()

   return jsonify(user)

#brise post na osnovu dobijenog jsona(id posta), ostaje u bazi samo se fleguje kao obrisan
@app.route('/deletePost', methods=['GET','POST'])
def deletePost():
   user=security.token_required(database,app.config["SECRET_KEY"])

   id=request.get_json()
   cursor.execute("""UPDATE topic SET isDeleted=1 where id=?""",(int(id),))
   database.commit()

   return jsonify("TRUE")

#zakljucava/otkljucava komentarisanje posta
@app.route('/openClosePost', methods=['get','post'])
def openClosePost():
   user=security.token_required(database,app.config["SECRET_KEY"])

   id=request.get_json()

   cursor.execute("""Select isClosed from topic where id=?""",(int(id),))
   database.commit()
   isClosed=cursor.fetchone()
   isClosed=isClosed[0]

   if(isClosed==0):
      isClosed=1
   else:
      isClosed=0

   cursor.execute("""UPDATE topic SET isClosed=? where id=?""",(isClosed,int(id),))
   database.commit()

   return jsonify("TRUE")

if __name__ == '__main__':
    app.run()

