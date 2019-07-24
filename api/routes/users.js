var mongoose=require('mongoose');
var express=require('express');
var router=express.Router();
var bcrypt=require('bcrypt');
var jwt = require('jsonwebtoken');
var User=require('../models/users');

router.post('/signup',(req,res,next)=>{
    User.find({email:req.body.email})
    .then(user=>{
        if(user.length > 0)
        {
          return res.status(409).json({
              message:'user already exist'
          });
        } else {
            bcrypt.hash(req.body.password, 10).then(function(hash) {

                const user=new User({
                    _id:mongoose.Types.ObjectId(),
                    email:req.body.email,
                    password:hash  
                  })
                  user.save()
                  .then(result=>{
                      console.log(result);
                      res.status(201).json({
                          message:'User created successfully'
                      })
                  })
                  .catch(error=>{
                    res.status(500).json({
                        error:error
                    })
                  })
        })
        .catch(error=>{
          return  res.status(500).json({
                error:error
            })
        });
        }
    })
});
router.post('/login',(req,res,next)=>{
    User.findOne({email:req.body.email})
    .then(user=>{
        if(!user)
        {
            return res.status(401).json({
                message:'Auth failed'
            })
        }
        bcrypt.compare(req.body.password,user.password, function(err, result) {
            if(err){
                return res.status(401).json({
                    message:'Auth failed'
                })
            } else {
                if(result){
                    var token=jwt.sign({
                        email:user.email,
                        _id:user._id
                    },
                    'myapp',
                    {
                        expiresIn:'1h'
                    });
                    return res.status(200).json({
                        message:"auth success",
                        token:token
                    })
                } 
                return res.status(401).json({
                    message:'Auth failed'
                })

            }
        });
    })
    .catch(error=>{
        res.status(500).json({
            error:error
        })
    })
})
router.delete('/:id',(req,res,next)=>{
   User.deleteOne({_id:req.params.id})
   .then(result=>{
       res.status(200).json({
           message:'user created successfully'
       })
   })
   .catch(error=>{
       res.statust(500).json({
           error:error
       })
   })
})

module.exports=router;
 