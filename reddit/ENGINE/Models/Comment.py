#kreiramo klasu Comment i konstruktor
class Comment():
    id = None
    desc = None
    user_id = None
    topic_id = None

    def __init__(self, id, desc, user_id, topic_id):
        self.id = id
        self.desc = desc
        self.user_id = user_id
        self.topic_id = topic_id

# metoda koja pretvara listu u dictionary-> komentar, username
def ListToDictComment(list,username):
    print(list)
    dict={
        "id":list[0],
        "desc":list[1],
        "likes":list[2],
        "dislikes":list[3],
        "user_id":list[4],
        "topic_id":list[5],
        "user":username,
    }
    return dict
