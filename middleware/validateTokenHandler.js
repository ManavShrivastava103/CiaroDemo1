const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const validate_token = asyncHandler(async(req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if(authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
        if(!token) {
            res.status(401);
            throw new Error( "User not authorized or token is invalid.");
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if(err) {
                    res.status(401);
                    throw new Error("User is not authorized");
                }
                req.user = decoded;
                next();
            }
        );
    }
    else {
        res.status(401);
        throw new Error("Authorization header missing");
    }
});

module.exports = validate_token;