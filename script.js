const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const ejs= require("ejs");


app.use(express.static(__dirname));

const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const saltRounds = 10;
app.set('view engine', 'ejs');
app.use(express.static("public"));
 app.use(bodyParser.urlencoded({
     extended: true
}));


mongoose.connect("mongodb://127.0.0.1:27017/speechDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model("User",userSchema);

app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/public/home.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/template', (req, res) => {
    res.sendFile(__dirname + '/public/template.html');
});
// app.get("/register", function(req,res){
//     res.render("register");
// });

app.post("/register", function(req, res){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save(function(err){
            if(err){
                console.log(err);
            }else{
                res.render("secrets");
            }
        });
    });
    
});

app.post("/login", async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const foundUser = await User.findOne({ email: username }).exec();
        if (foundUser) {
            const result = await bcrypt.compare(password, foundUser.password);
            if (result === true) {
                // Redirect to the "template" page upon successful login
                res.redirect("/template.html");
            } else {
                // Handle invalid password or login
                res.send("Invalid username or password. Please try again.");
            }
        } else {
            // Handle user not found
            res.send("User not found. Please register or check your username.");
        }
    } catch (error) {
        console.error(error);
        // Handle other potential errors
        res.status(500).send("An error occurred during login.");
    }
});



























const port = 3000;

app.use(bodyParser.json());

// Serve static files from the same directory (including index.html)


app.post('/submit-data', (req, res) => {
    const formData = req.body;
    // You can handle the data from the form here, e.g., save it to a database.
    console.log('Received form data:', formData);
    res.send('Data received successfully');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
