const bcrypt = require('bcryptjs');
//bcrypt is used here because we storing the password as a string straight away in our database and it can
// be a security issue so bcrypt is used here. Basically we get a function where we get a create a encrypted
// version of that password and then a function to compare that encrypted password and the actual password.
const jwt = require("jsonwebtoken");
const User = require("../models/user");


async function signup(req,res) {

    try{

    //Get the email and password off req body
    const { email, password } = req.body;

    //hash password
    const hashedPassword = bcrypt.hashSync(password,8);

    //Create a user with the data
    await User.create({email,password: hashedPassword})

    //respond
    res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
}

async function login(req,res) {
    try {
    // Get the email and password off req body
    const {email,password} = req.body;
    // find user with requested email
    const user = await User.findOne({email});
    if (!user) return res.sendStatus(401);

    //compare sent in password with found user password hash
    const passwordMatch = bcrypt.compareSync(password,user.password); // this return true or false depending on if they match
    if (!passwordMatch) return res.sendStatus(401);


    // create a jwt token. First arguement is the data we want to encrypt in our token and the second
    // arguement we put a secret key thats gonna be used to encrypt and decrypt it.
    const exp = Date.now() + 1000*60*60*24*30;
    const token = jwt.sign({sub: user._id, exp}, process.env.SECRET);
    
    //Set the cookie. First argument is what you want to name it. 2nd argument is the value. 3rd argument is option. 
    res.cookie("Authorization", token, {
        expires: new Date(exp),
        httpOnly: true, //This is makes it only the browser and our server can only read the cookie
        sameSite: 'lax',
        secure: process.env.NODE_ENV === "production",
    })
    
    //send it
    res.sendStatus(200);
    } catch(err) {
        console.log(err);
        res.sendStatus(400);
    }
}

function logout(req,res) {
    try {
    res.clearCookie("Authorization");
    res.sendStatus(200);
    } catch(err) {
        console.log(err);
        res.sendStatus(400);
    }
}

function checkAuth(req,res) {
    try {
    res.sendStatus(200);
    } catch(err) {
        return res.sendStatus(400);
    }
}
module.exports = {
    signup,
    login,
    logout,
    checkAuth
};