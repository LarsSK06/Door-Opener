const session = require('express-session')
const SessionStore = require('express-session-sequelize')(session.Store);
const cookieParser = require('cookie-parser');
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const https = require('https');
let DataBaseManager = require('./backend/db');
DataBaseManager = new DataBaseManager
const app = express();
app.disable("x-powered-by");


// Middleware. Basically what functions pass while user gets routed
app.use(session({
    store: DBManager.store(),
    secret: "our-secret",
    resave: true,
    saveUninitialized: false,
    cookie: {}
}))
app.use(cors());
app.use(express.json());


const isProd = false


// Certificate
// TODO : Add the actual credentials. Check Certbot
function createCredentials() {
    const privateKey = fs.readFileSync('./cert/privkey.pem', 'utf8');
    const certificate = fs.readFileSync('./cert/cert.pem', 'utf8');
    
    return {
        key: privateKey,
        cert: certificate,
    };    
}




app.post("/login", (request, response) => {
    if(request.headers.authorization != process.env.authorization){
        response.status(401).send({
            code: 401,
            message: "Invalid authorization header",
            abbr: "iah"
        });
        return;
    }
});

app.all("*", (request, response) => {
    if(fs.existsSync(`frontend${request.url}`) && request.method == "GET"){
        response.status(200).sendFile(`${__dirname}/frontend${request.url}`);
        return;
    }
    response.status(404).send({
        code: 404,
        message: "Unknown request",
        abbr: "ur"
    });
    console.log("Unknown request:"
        + `\n\tip:\t\t${request.ip}`
        + `\n\turl:\t\t${request.url}`
    );
});

const port = 4000;

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

