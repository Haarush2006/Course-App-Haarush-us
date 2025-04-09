const jwt = require('jsonwebtoken')


function userMiddleware(req,res,next) {
    const token = req.headers.authorization

    const verification = jwt.verify(token,process.env.JWT_USER_SECRET)
    if(verification){
        req.ID = verification.ID
        next()
    }
    else{
        return res.json({
            message:"Authentication failed"
        })
    }
}


module.exports = {
    userMiddleware
}