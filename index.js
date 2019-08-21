import rand from './util'
const express = require('express');
const app = express();
var fs  = require('fs');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require("body-parser");
var path = require('path');
var multer = require('multer')
var cors = require('cors');
var https = require('https')


const stringGen = (len) =>
{
    var text = " ";

    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < len; i++ )
        text += charset.charAt(Math.floor(Math.random() * charset.length));

    return text;
}

MongoClient.connect("mongodb://localhost:27017",(err,client) =>{
    if(err) throw err
    var db = client.db("MediumTutorial")


    app.listen(3001, function() {
    console.log('listening on 3001')
  })


// https.createServer({
//     key: fs.readFileSync('server.key'),
//     cert: fs.readFileSync('server.cert')
//   }, app)
//   .listen(3001, function () {
//     console.log('Example app listening on port 3001! Go to https://localhost:3001/')
//   })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors())


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
   
  var upload = multer({ storage: storage }).single('file')

  app.post('/upload',function(req, res) {
     
    upload(req, res, function (err) {
           if (err instanceof multer.MulterError) {
               return res.status(500).json(err)
           } else if (err) {
               return res.status(500).json(err)
           }
      return res.status(200).send(req.file)

    })

});
app.use(express.static(__dirname + '/public'));

    app.get('/2',(req,res) =>
        res.send('sakurasaku')
    ) 

    app.get('/userlist',(req,res) => 
    {
        db.collection("users").find().toArray((err,result) => {
            if (err) throw err;
                res.status(200).send(result)
        })
    })

    app.post('/findUser',(req,res) =>{
        db.collection("users").findOne({
            _id:req.body.email
        },(err,result) =>{
            if(err) throw err;
                res.status(200).send(result)
        })
    }
    )

    app.post('/addUser',(req,res) =>
    {
        db.collection("users").insertOne({
            _id:req.body.email,
            name:req.body.name,
            password:req.body.password,
            count:0
            
        },(err,result) => {
            if(err) return res.status(500).send(err.toString())
            res.sendStatus(200)
        })
    }
    
    )

    app.post('/updateUser',(req,res) =>
    {   const {email,...body_value} = req.body
    
    console.log(body_value)
        db.collection("users").updateOne(
            {_id:req.body.email},
            {
                $set:{
                    password:req.body.password
                }
            },(err,result) =>{
                if(err) return res.status(500).send(err.toString());
                res.sendStatus(200);
            }
        )
    })

    app.post('/countUpdate',(req,res) =>{
        db.collection("users").updateOne(
            {_id:req.body.email},
            {
                $inc:{
                    count:-10
                }
            },(err,result) => {
            if(err) return res.status(500).send(err.toString())
            res.sendStatus(200)
        })
           
        })

    app.post('/addEmployee' , (req,res) => {
        console.log(req.body.employee)
        db.collection("users").updateOne(
            {
                _id:req.body.email
            },{
                $pull:{
                    employee : {
                        grade:5
                    }
                    
                }
            },(err,result) =>{
                if(err) return res.status(500).send(err.toString())
                res.sendStatus(200)
            }
        )
    })

    app.post('/addTopic' , (req,res) => {
        const temp_id = stringGen(16)
        db.collection("db_test").insertOne(
            {
     
                id:temp_id,
                tag:req.body.tag,
                filename:req.body.filename,
                path:req.body.path,
                comment:req.body.comment,
                replay: []
            },
            (err,result) => {
                if(err) return res.status(500).send(err.toString())
                res.sendStatus(200)
            }
        )
    })

    app.post('/addComment',(req,res) =>   
    {
     const t = 
            {
                filename:req.body.filename,
                path :req.body.path,
                comment : req.body.comment
            }
        
            db.collection("db_test").updateOne(
                {
                    id:req.body.id
                },
                {
                    $push : 
                    {
                        replay : t
                    }
                }
                ,
            (err,result) => {
                if(err) return res.status(500).send(err.toString())
                res.sendStatus(200)
            }
            )

        } 
    )

    app.get('/topicList',(req,res) => 
    {
        db.collection("db_test").find().toArray((err,result) => {
            if (err) throw err;
                res.status(200).send(result)
        })
    })

    }
)

