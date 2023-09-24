const session = require('express-session')
const SessionStore = require('express-session-sequelize')(session.Store);
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const https = require('https');
let DataBaseManager = require('./backend/db');

const app = express();
app.disable("x-powered-by");

const port = 4000;

// Classes
DataBaseManager = new DataBaseManager



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
const isProd = false
const arduinoActive = false

// Certificate
function createCredentials() {
    const privateKey = fs.readFileSync('./certs/private.key', 'utf8');
    const certificate = fs.readFileSync('./certs/certificate.crs', 'utf8');
    return {key: privateKey,cert: certificate};    
}

app.get("/", (request, response) => {
    console.log(request.session.name ? request.session.name : "Someone", "connected")
    response.sendFile(__dirname+"/frontend2/main.html")
})

app.post("/login", (request, response) => {
    DataBaseManager.login(request.body.password).then(login => {
        if (login === null) {
            response.status(401).send("User not found")
            return
        }
        request.session.name = login.name
        response.status(200).redirect("/")
        return
    })
});

app.get("/panel", (request, response) => {
    response.status(200).sendFile("./main.html");
})

app.get("/form", (request, response) => {
    response.send({html:(request.session.name ? `
    <button id="open" autofocus>
        Open
    </button>` :`
    <form id="login-form">
        <input
            id="password"
            type="password"
            placeholder="Password"
            autofocus>
        <p id="log"></p>
        <button id="submit" type="submit">
            Submit
        </button>
    </form>
    <h2>
        Experimental
    </h2>
    `)})
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
} else {
    app.listen(port, "0.0.0.0", () => {
        console.log(`API active on :${port}`);
    });
}