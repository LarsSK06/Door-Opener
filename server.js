const session = require('express-session')
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const https = require('https');
const http = require("http")
let DataBaseManager = require('./backend/db');
let ArduinoControl = require("./backend/arduinoController")
const enableWs = require('express-ws')
const {WebSocket} = require("ws");
const Users = require('./models/users');
const Session = require('./models/Session');
const port = 4000; // Doesnt really matter for prod

// On/off switches
const isProd = false
const arduinoActive = false

// Paths to files
const filePath = __dirname + "/frontend" // Public folder
const mainPage = filePath + "/mainPage.html"
const loginPage = filePath + "/loginPage.html"
const panelFilePath = __dirname + "/admin" // Private folder
const panelPage = panelFilePath + "/panelPage.html"



// Classes
DataBaseManager = new DataBaseManager()
arduinoActive ? ArduinoControl = new ArduinoControl() : null // If arduino not active its null

// express settings
const app = express();
app.disable("x-powered-by");
enableWs(app)

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
app.use(express.static("frontend", {extensions:["html", "js", "css"]})) // Publicly accessable through path. Allows serving files without sendFile on every file
app.use(isLoggedIn)
app.use("/panel", [ ensureAuthenticated, express.static("admin", {extensions:["html", "js", "css"]} ) ] )// On this path check if user is admin
// If above works, should only be accessible by those with admin

// Redirects user
function isLoggedIn(req, res, next) { 
    if(req.url == "/login" && req.session.name) { // If logged in and trying to access /login
        res.redirect("/")
    }
    if(req.session.name == undefined && (req.url !== "/login")) { // If not logged in and trying to access any other page
        res.redirect("/login")
    }
    next()
}

function ensureAuthenticated(req, res, next) {
    DataBaseManager.findByName(req.session.name).then(user => {
        console.log(user.isAdmin)
        if(!user.isAdmin){
            console.log("is not admin")
            res.redirect("/")
        } 
        next()
        
    })
}


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
    response.sendFile(loginPage)
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
    response.status(200).sendFile(panelPage); // Display panel page
})

app.post("/open", async (request, response) => { // Arduino open action
    let user
    if(request.session.name) { // If user is using browser 
        user = await DataBaseManager.findByName(request.session.name)
        console.log(request.session.name + " : is opening through website")
    } else if(request.body.password) { // If user is using external methods
        user = await DataBaseManager.login(request.body.password)
        console.log(user.name + " : is opening through POST")
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


let httpsServer
if(isProd) { 
    httpsServer = https.createServer(createCredentials(), app);
    httpsServer.listen(443, () => {
        console.log('HTTP Server running on port 443');
    });
} else { // I dont have the certificates on my dev env
    httpsServer = http.createServer(app)
    httpsServer.listen(80, "0.0.0.0", () => {
        console.log(`API active on :${port}`);
    });
    

}
const wss = new WebSocket.Server({ noServer: true });
wss.on('connection', async (ws, request) => {
    ws.send(JSON.stringify({action: "getAll", users: await DataBaseManager.getAll()}))
    // Handle WebSocket messages
    ws.on('message', async (message) => {
        message = message.toString("utf8")
       
      // Process the received message
      console.log('Received message:', message);
      try {
        let messageJson = JSON.parse(message)
        if(messageJson.action == "changeEnabled") {
            DataBaseManager.updateEnabled(messageJson.student.name, messageJson.student.isEnabled)
        }
    }catch (err) {
        if(err instanceof SyntaxError) {
            return
        }
        console.error(err)
    }   
    });
  
    // Handle WebSocket close
    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });
httpsServer.on('upgrade', (request, socket, head) => {
    if (request.url === '/panel') {
        wss.handleUpgrade(request, socket, head, (ws) => {
            console.log("upgrade")
        wss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});
Users.addHook("afterUpdate", (instance) => {
    const updatedData = instance.get();
    wss.clients.forEach(client => {
        client.send(JSON.stringify({action:"updateEnabled", student: {name: updatedData.name, isEnabled:updatedData.enabled}}))
    })
}) 