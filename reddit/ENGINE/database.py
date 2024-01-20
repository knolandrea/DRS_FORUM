from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ARRAY,JSON
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy import PickleType
# from sqlalchemy_utils import ScalarListType

#kreira instancu flask aplikacije
app = Flask(__name__)

#koristi forum.db
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///forum.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ova 3 modela predstavljaju tabele, povezane putem db.relationship

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(50))
    lastName = db.Column(db.String(50))
    address = db.Column(db.String(50))
    country = db.Column(db.String(50))
    username= db.Column(db.String(50))
    password = db.Column(db.String(50))
    phoneNumber = db.Column(db.String(50))
    email = db.Column(db.String(100), unique=True)
    loggedIn=db.Column(db.String(1))
    likedTopic=db.Column(JSON)
    unlikedTopic=db.Column(JSON)
    likedComment=db.Column(JSON)
    unlikedComment=db.Column(JSON)
    interests=db.Column(JSON)
    topics = db.relationship('Topic', backref='user')
    commentss = db.relationship('Comment', backref='user')

class Topic(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50))
    description = db.Column(db.String(50))
    likes = db.Column(db.Integer)
    dislikes = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    isDeleted=db.Column(db.Integer)
    isClosed=db.Column(db.Integer)
    commentsNumber=db.Column(db.Integer)
    likedPosts = db.relationship('User', backref='topic')
    comments = db.relationship('Comment', backref='topic')
    subscribedUser = db.Column(JSON)

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    desc = db.Column(db.String(50))
    likes = db.Column(db.Integer)
    dislikes = db.Column(db.Integer)
    likedComment = db.relationship('User', backref='comment')
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    topic_id = db.Column(db.Integer, db.ForeignKey('topic.id'))

with app.app_context():
    db.create_all()
