const Product=require('../../models/products');
module.exports=(req,res,next)=>{
    Product.find((error,data)=>{
      if(error)
      {
          res.status(500).json({error:error});
      }
      else {
          const response={
              count:data.length,
              products:data.map(dt=>{
                  return {
                      name:dt.name,
                      price:dt.price,
                      productImage:dt.productImage,
                      request:{
                          type:'GET',
                          url:"http://localhost:3000/products/"+ dt._id
                      }
                  }
              })
          }
          res.status(200).json(response);
 
      }
    }).select('name price _id productImage');
 }