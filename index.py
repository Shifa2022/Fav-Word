from flask import Flask
from flask_sqlalchemy import SQLAlchemy 
from flask import Flask, request, jsonify,session
from flask_cors import CORS,cross_origin
from sqlalchemy import ForeignKey

app=Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'

db = SQLAlchemy(app)


class Words(db.Model):
    _tablename_="words"
    id=db.Column(db.Integer,primary_key=True)
    sentence=db.Column(db.String(200))


    def __init__(self,sentence):
        self.sentence = sentence
    

    def serialize(self):
         return {
            "id": self.id,
            "sentence": self.sentence
            }

class Subscription(db.Model):
    _tablename_="subscription"
    id=db.Column(db.Integer,primary_key=True)
    user_id=db.Column(db.Integer)
    word_id=db.Column(db.Integer,ForeignKey('words.id'))
    word=db.Column(db.String(200))


    def __init__(self,user_id,word_id,word):
        self.user_id=user_id,
        self.word_id =word_id,
        self.word=word

    def serialize(self):
         return {
            "id": self.id,
            "user_id": self.user_id,
            "word_id":self.word_id,
            "word":self.word
            }

class User(db.Model):

    _tablename_ = 'usertable'
    id = db.Column(db.Integer, primary_key=True)
    name= db.Column(db.String(15))
    username = db.Column(db.String(15))
    email = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(256), unique=True)
    

    def __init__(self,name,username,email,password):
        self.name = name
        self.username=username
        self.email=email
        self.password=password


    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "username":self.username,
            "email":self.email
            }

       
    
@app.route('/')
def index():
    return "hello world"


@app.route('/order',methods=['POST'])
@cross_origin()
def add():
    sentence=request.json['sentence']
    order=Words(sentence)
    db.session.add(order)
    db.session.commit()
    return jsonify({"status":200,"message":"added successfully"})
    # return jsonify({'list':words.serialize()}), 201

@app.route('/order',methods=['GET'])
@cross_origin()
def words():
 return jsonify({'list': list(map(lambda words: words.serialize(), Words.query.all()))})

@app.route('/order/word/<string:word>')
@cross_origin()
def getSentenceByWord(word):
    value = Words.query.get(id)


@app.route('/subscribe', methods=['POST'])
@cross_origin()
def create_subscription():
    user_id=int(request.json['user_id'])
    word_id = int(request.json['word_id'])
  
   
    # get word from words table and if word doesnt exist send 404 status code
    word_db=Words.query.filter(Words.id==word_id).first()
    if word_db is None:
        return 404
    word=word_db.sentence
    subscription=Subscription(user_id,word_id,str(word))
    # db.session.commit()
    db.session.add(subscription)
    db.session.commit()
    # return jsonify({'subscription': subscription.serialize()}), 201
    return jsonify({"status":201,"message":"subscribed successfully"})


@app.route("/unsubscribe/id/<int:id>", methods=["DELETE"])
def guide_delete(id):
    unscubscribe= Subscription.query.filter(Subscription.id==id).first()
    print(unscubscribe)
    db.session.delete(unscubscribe)
    db.session.commit()

    return 200
    


if __name__ == "__main__":
    db.create_all()
    db.session.commit()
    app.run(debug=True)