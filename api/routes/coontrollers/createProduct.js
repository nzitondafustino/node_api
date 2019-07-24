var mongoose=require('mongoose');
const Product=require('../../models/products');
module.exports=(req,res,next)=>{
    const product=new Product({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price,
        productImage:req.file.path
    });
    product.save()
    .then((result)=>{
        res.status(200).json({
            name:result.name,
            price:result.price,
            productImage:result.productImage.replace(/\\/,'/'),
            _id:result._id,
            request:{
                type:'GET',
                url:'http://localhost:3000/products/'+ result._id
            }
        });
    })
    .catch((error=>{
        res.status(500).json({
            error:error
        });
    }));
 }