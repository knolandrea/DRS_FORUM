#klasa i konstruktor za post
class Post():
    id=None
    title = None
    description = None
    likes = None
    dislikes = None
    user_id = None
    isClosed=None
    isDeleted=None
    commentsNumber=None

    def __init__(self,id, title, description, likes, dislikes, user_id,isClosed,isDeleted,commentsNumber):
        self.id=id
        self.title = title
        self.description = description
        self.likes = likes
        self.dislikes = dislikes
        self.user_id = user_id
        self.isClosed=isClosed
        self.isDeleted=isDeleted


# pravi dictionary -> post, username
def ListToDictPost(list,username):
    dict={
        "id":list[0],
        "title":list[1],
        "description":list[2],
        "likes":list[3],
        "dislikes":list[4],
        "user_id":list[5],
        "isDeleted":list[6],
        "isClosed":list[7],
        "commentsNumber":list[8],

        "user":username,

    }
    return dict
