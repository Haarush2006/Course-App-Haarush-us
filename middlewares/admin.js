const jwt = require('jsonwebtoken')


function adminMiddleware(req,res,next) {
    const token = req.headers.authorization

    const verification = jwt.verify(token,process.env,JWT_ADMIN_SECRET)
    if(verification){
        req.AdminID = verification.ID
        next()
    }
    else{
        return res.json({
            message:"Authentication failed"
        })
    }
}


module.exports = {
    adminMiddleware
}



