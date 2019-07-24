var jwt=require('jsonwebtoken');
module.exports=(req,res,next)=>{
    
    try{ 
        const token=req.headers.authorization.split(" ")[1]
        const decode=jwt.verify(token,'myapp');
        req.useData=decode;
        next()
    }
    catch(error){
        res.status(401).json({
            message:"auth failed"
        })
    }
}