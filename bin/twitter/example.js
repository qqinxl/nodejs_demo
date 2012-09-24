var express = require('express');
var app = express();
app.get('/', function(req, res) {
    res.send('Welcome to Node Twitter')
});
app.listen(9001);

app.post('/send',express.bodyParser(),function(req,res){
    if(req.body && req.body.tweet){
        tweets.push(req.body.tweet);
        res.send({status:'ok',message:'Tweet received'});
    }else{
        res.send({status:'nok',message:'no Tweet received'});
    }
});

app.get('/tweets',function(req,res){
    res.send(tweets);
});