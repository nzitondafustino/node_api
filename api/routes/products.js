var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');
var multer=require('multer');
var AuthCheck=require('./middleware/check-auth');

const Product=require('../models/products');
var getAllPoduct=require('./coontrollers/get_all_product');
var createProduct=require('./coontrollers/createProduct');
var storage=multer.diskStorage({
    destination:'./uploads',
    filename:function(req,file,cb){
      cb(null,new Date().toISOString().replace(/:/g, '-')+ file.originalname);
    }
})
var fileFilter=function(req,file,cb){
    if(file.mimetype==='image/jpeg' || file.mimetype==='image/png')
    {
        cb(null,true);
    }
    else {
        cb(null,false);
    }
}
var uplooad=multer({storage:
    storage,
    limits:{
        fileSize:1024*1024*5
    },
    fileFilter:fileFilter
})
router.get('/',getAllPoduct);
router.post('/',AuthCheck,uplooad.single('productImage'),createProduct);
 router.get('/:id',(req,res,next)=>{
     var id=req.params.id;
    //  res.status(200).json('Hello')
     Product.findById(id,(error,data)=>{
         if(error){
             res.status(500);
         } else {
             if(data)
             {
             res.status(200).json({
                 product:data,
                 request:{
                     type:'GET',
                     url:'http://localhost:3000/products'
                 }
             });
            } else {
                res.status(404).json({message:"Product not found"})
            }
         }
     }).select('name price _id productImage');  
});
router.patch('/:id',AuthCheck,(req,res,next)=>{
    var id=req.params.id;
    const updateOps={};
    for(const ops of req.body)
    {
        updateOps[ops.proName]=ops.value;
    }
    Product.update({_id:id},{$set:updateOps},function(error,result){
        if(error)
        {
            console.log(error)
            res.status(500).json({error:error});
        }
        else{
            res.status(200).json({
                message:'product updated successfully',
                request:{
                    type:'GET',
                    url:'http://localhost:3000/products/'+id
                }
            });
        }
    })
 });
router.delete('/:id',AuthCheck,(req,res,next)=>{
    var id=req.params.id;
    Product.deleteOne({_id:id},function(error,result){
        if(error)
        {
            res.status(500).json({error:error});
        }
        else{
            res.status(200).json({
                message:"product deleted successfully",
                request:{
                    type:'POST',
                    url:"http://localhost:3000/products",
                    body:{
                        name:'String',
                        price:'Number'
                    }
                }
            });
        }
    })
 });
 module.exports=router;