const session = require('express-session')
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const https = require('https');
let DataBaseManager = require('./backend/db');
let ArduinoControl = require("./backend/arduinoController")


const app = express();
app.disable("x-powered-by");

const port = 4000;

// Classes
DataBaseManager = new DataBaseManager()
ArduinoControl = new ArduinoControl()


// Middleware. Basically what functions pass while user gets routed
app.use(session({
    store: DataBaseManager.store(),
    secret: "our-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {}
}))
app.use(cors());
app.use(express.json());
app.use(express.static("frontend2", {extensions:["html", "js", "css"]}))
app.use(isLoggedIn)


function isLoggedIn(req, res, next) {
    if(req.url == "/login" && req.session.name) {
        res.redirect("/")
    }
    if(req.session.name == undefined && (req.url !== "/login")) {
        res.redirect("/login")
    }
    next()
  }



const isProd = false
const arduinoActive = false

// Paths to files
const filePath = __dirname + "/frontend2" // Public folder
const mainPage = filePath + "/mainPage.html"
const loginPage = filePath + "/loginPage.html"



// Certificate for https
function createCredentials() {
    try {
    const privateKey = fs.readFileSync('./certs/private.key', 'utf8');
    const certificate = fs.readFileSync('./certs/certificate.crs', 'utf8');
    return {key: privateKey,cert: certificate};    
    } catch(err) {
        console.error("Error reading certificate files", err)
        return null
    }
}


// Routing
app.get("/", (request, response) => { // Main page for opening
    console.log(request.session.name ? request.session.name : "Someone", "connected")
    response.sendFile(mainPage)
})

app.get("/login", (request, response) => { // Visual login page
    if(request.session.name) {
    }
    response.sendFile(__dirname + "/frontend2/loginPage.html")
})

app.post("/login", (request, response) => { // Login action
    DataBaseManager.login(request.body.password).then(login => {
        if (login === null) {
            response.status(404).send({
                code: 404,
                message: "User not found",
                abbr: "unf"
            });
            return
        }
        request.session.name = login.name
        response.status(200).send({
            code: 200,
            message: "User logged in",
            abbr: "uli"
        })
        return
    })
});

// TODO : Add admin panel
app.get("/panel", (request, response) => { // Admin panel
    response.status(200).sendFile(mainPage);
})

app.post("/open", async (request, response) => { // Arduino open action
    let user
    if(request.session.name) { // If user is using browser 
        user = await DataBaseManager.findByName(request.session.name)
    } else if(request.body.password) { // If user is using external methods
        user = await DataBaseManager.login(request.body.password)
    }
    else { // If neither has matching credentials
        response.status(401).send({
            code: 401,
            message: "Unauthorized",
            abbr: "UA"
        })
        return
    }
    // Then
    if (user === null) {
        response.status(404).send({
            code: 404,
            message: "User not found",
            abbr: "unf"
        });
        return
    } else if(!user.enabled) {
        response.status(401).send({
            code: 401,
            message: "User disabled",
            abbr: "ud"
        })
        return
    }
    arduino.openDoor() // There are responses on this. Might want to do something with that
    response.status(200).send({
        code: 200,
        message: "Door opening",
        abbr: "do"
    })
    return
})


app.all("*", (request, response) => { // THIS HANDLES USER ATTEMPTING TO ACCESS UNKNOWN PAGES
    response.status(404).redirect("/")
    console.log("Unknown request:"
        + `\n\tip:\t\t${request.ip}`
        + `\n\turl:\t\t${request.url}`
        + `\n\tmethod:\t\t${request.method}`
    );
});



if(isProd) { 
    const httpsServer = https.createServer(createCredentials(), app);
    httpsServer.listen(80, () => {
        console.log('HTTP Server running on port 80');
    });
} else { // I dont have the certificates on my dev env
    app.listen(port, "0.0.0.0", () => {
        console.log(`API active on :${port}`);
    });
}