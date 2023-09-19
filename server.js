const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.disable("x-powered-by");
app.use(cors());
app.use(express.json());

let onCooldown = false;
const cooldown = 30;
let clickEpoch = 0;

app.post("/login", (request, response) => {
    if(onCooldown){
        response.status(401).send({
            code: 401,
            message: `On cooldown (${limitDec((clickEpoch + 10) - getEpoch(), 1)}s left)`,
            abbr: "oc"
        });
        return;
    }
    if(request.headers.authorization != process.env.authorization){
        response.status(401).send({
            code: 401,
            message: "Invalid authorization header",
            abbr: "iah"
        });
        return;
    }
    clickEpoch = getEpoch();
    onCooldown = true;
    setTimeout(() => onCooldown = false, cooldown * 1000);
});

app.all("*", (request, response) => {
    if(fs.existsSync(`frontend${request.url}`) && request.method == "GET"){
        response.status(200).sendFile(`${__dirname}frontend${request.url}`);
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
app.listen(port, "0.0.0.0", () => {
    console.log(`API active on :${port}`);
});

function getEpoch(){
    return new Date() / 1000;
}

function limitDec(num, dec){
    const multiplier = 10 ** dec;
    return Math.floor(num * multiplier) / multiplier;
}