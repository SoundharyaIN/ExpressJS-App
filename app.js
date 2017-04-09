var express=require('express');
var bodyParser=require('body-parser');
var path=require('path');
var expressValidator=require('express-validator');
var mongojs=require('mongojs');
var db=mongojs('customerappe',['users']);
var ObjectId=mongojs.ObjectId;
var app=express();

/*var logger=function(req,res,next){
	console.log('Logging...');
	next();
}

app.use(logger);*/

//View engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//static path
app.use(express.static(path.join(__dirname,'public')));

//Global Var
app.use(function(req,res,next){
	res.locals.errors=null;
	next();
});

//express validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

var users=[
	{
		id:1,
		first_name:'Soundharya',
		last_name:'Bharatiya',
		email:'soundharyabharatiya@gmail.com',
	},
	{
		id:2,
		first_name:'Kirt',
		last_name:'Pankania',
		email:'kirit@gmail.com',
	},
	{
		id:3,
		first_name:'brenden',
		last_name:'schellbah',
		email:'brenden@gmail.com',
	}
		]

app.get('/',function(req,res){
	
	db.users.find(function(err,docs){
		console.log(docs);
		res.render('index',{
		title:'customers',
		users:docs
	});
	})
});

app.post('/users/add',function(req,res){
	
	req.checkBody('first_name','First Name is required').notEmpty();
	req.checkBody('last_name','Last Name is required').notEmpty();
	req.checkBody('email','Email is required').notEmpty();

	var errors=req.validationErrors();

	if(errors){
		res.render('index',{
		title:'customers',
		users:users,
		errors:errors
	});
	}

	else{

	var newUser={
		first_name:req.body.first_name,
		last_name:req.body.last_name,
		email:req.body.email
	}
	db.users.insert(newUser,function(err,res){

	if(err){
		console.log(err);
			}
		res.redirect('/');
	});
}

});

app.delete('/users/delete/:id',function(req,res){
	db.users.remove({_id:ObjectId(req.params.id)},function(err,result){
		if(err){
			console.log(err);
		}
		res.redirect('/');
			});
});

app.listen(3000,function(){

console.log('Server Started on port 3000');

})