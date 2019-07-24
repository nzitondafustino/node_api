var express=require('express');
var app=express();
var morgan=require('morgan');
var bodyParser=require('body-parser');
var mongoose=require('mongoose');

//importing routes

var productsRouter=require('./api/routes/products');
var userRoutes=require('./api/routes/users');
var orderRoutes=require('./api/routes/orders');
//connecting to the local database
mongoose.connect('mongodb://localhost/products',{ useNewUrlParser: true });
    mongoose.connection.once('open',function(){
    console.log('connection was made successfully');
    }).on('error',function(error){
    console.log('connection error',error);
    });
mongoose.set('useCreateIndex', true);
mongoose.Promise=global.Promise;
 
//using routes

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'))
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//attaching headers to allow 
app.use((req,res,next)=>{
  res.header('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,Authorization');
  if(req.method==='OPTIONS')
  {
      res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
      return  res.status(200).json({});
  }
  next();
});

app.use('/products',productsRouter);
app.use('/orders',orderRoutes);
app.use('/users',userRoutes);

//handling error

app.use((req,res,next)=>{
 var error= new Error('Not found');
 error.status=404;
 next(error);
});
app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
               message:error.message
        }
    }); 

})

module.exports=app;