var express = require('express') , http = require('http') , path = require('path');

var app = express();

// Configuration
app.configure(function(){
  app.set('port', process.env.PORT || 9001);
  app.set('views', __dirname + '/views/ejs');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  //app.use(express.compiler({ src: __dirname + '/public', enable: ['sass'] }));
  //app.use(express.static(__dirname + '/public'));
  //app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(app.router);
});

app.configure('development', function(){
  //app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.use(express.errorHandler()); 
});

var PostProvider = require('./db/postprovider').PostProvider;
var provider= new PostProvider();

//Blog index
app.get('/', function(req, res){
  provider.findAll(function(error, posts){
    res.render('index', {
            locals: {
              title: 'Mongo Node.js Blog',
              posts: posts
            }
    });
  })
});

//new
app.get('/posts/new', function(req, res){
  res.render('post_new', {
             locals: {
               title: 'New Post'
             }
  });
});

//create
app.post('/posts/new', function(req, res){
  provider.save({
    title: req.param('title'),
    body: req.param('body')
  }, function(error, docs) {
    res.redirect('/');
  });
});

//show
app.get('/posts/:id', function(req, res){
  provider.findById(req.param('id'), function(error, post) {
    res.render('post_show', {
      locals: {
        title: post.title,
        post:post
      }
    });
  });
});

//edit
app.get('/posts/:id/edit', function(req, res){
  provider.findById(req.param('id'), function(error, post) {
    res.render('post_edit', {
      locals: {
        title: post.title,
        post:post
      }
    });
  });
});

//update
app.post('/posts/:id/edit', function(req, res){
  provider.updateById(req.param('id'), req.body, function(error, post) {
    res.redirect('/');
  });
});

//add comment
app.post('/posts/addComment', function(req, res){
  provider.addCommentToPost(req.body._id, {
    person: req.body.person,
    comment: req.body.comment,
    created_at: new Date()
  }, function(error, docs) {
    res.redirect('/posts/' + req.body._id)
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});