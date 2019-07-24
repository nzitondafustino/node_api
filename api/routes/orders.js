var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');
var Order=require('../models/orders');
var Product=require('../models/products');
var AuthCheck=require('./middleware/check-auth');
 //setting up routes
 router.get('/',AuthCheck,(req,res,next)=>{
    Order.find()
    .select('product quantity _id')
    .populate('product','name')
    .then(data=>{
        res.status(200).json({
            count:data.length,
            orders:data.map(dt=>{
                return {
                    product:dt.product,
                    quantity:dt.quantity,
                    _id:dt._id,
                    request:{
                        type:'GET',
                        url:'localhost:3000/orders/'+ dt._id
                    }
                    
                }
            })
        })
  
    })
    .catch(error=>{
        res.status(500).json({
            error:error
        })
    })
 });
 router.post('/',AuthCheck,(req,res,next)=>{
     Product.findById(req.body.productId)
     .then(result=>{
         if(!result){
             return res.status(404).json({
                 message:'product not found'
             })
         }
        const order= new Order({
            _id:mongoose.Types.ObjectId(),
            product:req.body.productId,
            quantity:req.body.quantity
        })
        return order.save()
       .then(result=>{
           res.status(201).json({
               _id:result.id,
               product:result.product,
               quantity:result.quantity,
               request:{
                   type:'GET',
                   url:'http://localhost:3000/orders/'+result._id
               }            
           });
       })
     })
     .catch(error=>{
         res.status(500).json({
             error:error
         })
     })
 });
 router.get('/:id',AuthCheck,(req,res,next)=>{
     Order.findById(req.params.id)
     .select('product quantity _id')
     .populate('product','name price')
     .then(result =>{
         if(!result){
             return res.status(404).json({
                 message:"order not Found"
             })
         }
        res.status(200).json({
           order:result,
           request:{
             type:'GET',
             url:'http://localhost:3000/orders'
           }
        })
     })
     .catch(error=>{
         res.status(500).json({
             error:error
         })
     })
 });
 router.delete('/:id',AuthCheck,(req,res,next)=>{
     Order.deleteOne({_id:req.params.id})
     .then(result=>{
         res.status(200).json({
            message:'Order deleted',
            request:{
                type:'POST',
                url:'http://localhost:3000/orders',
                body:{
                    productId:"ID",
                    quantity:"Number"
                }
              }

         })
     })
     .catch(error=>{
        res.status(500).json({
            error:error
        })
     })
 });
 //export router
 module.exports=router;