/* This will be the main entry point of the server */

// Load env variables
if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}


//Import dependencies
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser")
const connectToDB = require("./config/connectToDB");
const notesController = require("./Controllers/notesController");
const usersController = require("./Controllers/usersController");
const requireAuth = require("./middleware/requireAuth");


// Create an express app
const app = express();

//configure express app
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true,
})); // With this line, our server will accept req from any domain

//connect to Database
connectToDB();

// Routing

app.post("/signup", usersController.signup);

app.post("/login", usersController.login);

app.get('/logout', usersController.logout);

//So someone is gonna hit check auth is gonna run our requireAuth function and in here we can check if they
// logged in or the token is valid and if its not we can return 401 and if it is good we call next and it 
// moves on to out checkAuth controller function
app.get('/check-auth', requireAuth, usersController.checkAuth);

app.get("/notes",requireAuth, notesController.fetchNotes );

app.get("/notes/:id",requireAuth, notesController.fetchNote )

app.post("/notes",requireAuth, notesController.createNote) 

app.put("/notes/:id",requireAuth,  notesController.updateNote)

app.delete("/notes/:id",requireAuth, notesController.deleteNote)


// Start our server
app.listen(process.env.PORT);