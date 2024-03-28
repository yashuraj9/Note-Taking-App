const jwt = require('jsonwebtoken');
const User = require('../models/user')
// We call it middleware bcos with function is going to run in between the path they are requsting and the 
// controller function. We to continue from middleware just call next.
async function requireAuth(req,res,next) {
    try {
    // Read token off cookies 
    const token = req.cookies.Authorization

    // Decode the token. So this will decode it if it fails its gonna throw an error. If we do get past this 
    // line we have our decoded token.
    const decoded = jwt.verify(token, process.env.SECRET);

    // check expiration
    if (Date.now() > decoded.exp) return res.sendStatus(401);

    // Find user using decoded sub
    const user = await User.findById(decoded.sub); // here decoded sub means id meaning we are searching the user thru id
    if (!user)  return res.sendStatus(401);
    //attack user to req. 
    req.user = user;


    //continue on
    next();
    } catch(err) {
        return res.sendStatus(401);
    }
};
module.exports = requireAuth;
