import cors from "cors";
import env from "dotenv";
import express, { json } from "express";

import customCors from "./utils/customMiddleware.js"; // Ensure this is correctly exported
env.config({
    path: "./.env" // Load environment variables from .env file
});

const app = express();

const port = process.env.PORT || 5500;
const hostname = process.env.HOST || "localhost"; // Fallback to localhost if HOST is not defined

// Basic middleware configuration
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

const origin = [process.env.HOST_ORIGIN, process.env.SECOND_ORIGIN]; // Fallback to localhost:3000 if HOST_ORIGIN is not defined

// CORS middleware configuration
/*
app.use(cors({
    origin: origin,
    credentials: true,
    optionsSuccessStatus: 204
}));
*/

// Custom middleware
app.use(customCors);


// Routes
app.get('/', (req, res) => {
    res.status(200).send("Home page of ...");
});


let userData = [];
let count = 0;

// add deta using post http method. 
app.post('/users', (req, res)=>{
    const {userName, techStack} = req.body
    const userInfo = {
        userName: userName,
        tokenId: count++,
        techStack: techStack,
    }
    userData.push(userInfo);
    res.status(200).send(userInfo)
});


// get all data using get method of http.
app.get('/users', (req, res) => {
    res.status(200)
    .send(userData);
});


// get user with specific id
app.get('/users/:id', (req, res) => { 
    const userId = parseInt(req.params.id); // res.params store value in form of str uuid id string but if your id is int you have to parse using parseInt(req.params.id)
    const user = userData.find(data => data.tokenId === userId)

    if (!user){
        res.status(404).send("User Not Found")
    };

    res.status(200).
    send(user)
});


// update data using put http method. 
app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = userData.find(data => data.tokenId === userId);

    // handle error if user id not in userData
    if (!user){
        return res.status(404).json({ message: `User Not Found with id ${userId}`});
    }

    const {userName, techStack} = req.body
    user.userName = userName;
    user.techStack = techStack;

    res.status(200).send(user)
});

// delete user data using delete http method
app.delete('/users/:id', (req, res) =>{
    const userId = parseInt(req.params.id);
    const userPosition = userData.findIndex(data => data.tokenId === userId)

    if (userPosition === -1){
        return res.status(404).json({ message: "You couldn't delete this user because we don't have this user hahhahah...."})
    }
    
    userData.splice(userPosition, 1);
    res.status(200).send(`User : ${userId} Succefully Deleted...`);
})


// Start the server
app.listen(port, hostname, (err) => {
    if (err) console.log(`Server listening error: ${err}`);
    console.log(`Server is listening at http://${hostname}:${port}...`);
});