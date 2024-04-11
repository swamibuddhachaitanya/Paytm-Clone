const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const authMiddleware = (req,res,next)=>{

    const authHeader = req.headers.authorization;
    // console.log("req header: "+ req.headers)
    // console.log(authHeader.startsWith("Bearer"))
    
    if(!authHeader || !authHeader.startsWith("Bearer")){
        return res.status(403).json({error: "auth header not present/Doesn't start with Bearer!!"})
    }
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.userId = decoded.userId;

        next();

    } catch (error) {
        return res.status(403).json({error: "some error during verification of jwt"})
    }
}

module.exports = {
    authMiddleware,
}