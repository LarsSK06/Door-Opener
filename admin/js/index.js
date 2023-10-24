  

class Student {
    constructor(name, enabled) {
        this.parent = document.querySelector("#page-container")
        this.name = name
        this.enabled = enabled
        this.lastClick = "Not set"
    }
    createBox(){
        const container = document.createElement("div")
        container.setAttribute("class", "container")
        const nameSpace = document.createElement("h1")
        nameSpace.setAttribute("class", "nameSpace")
        nameSpace.innerHTML = this.name
        container.appendChild(nameSpace)
        this.parent.appendChild(container)
        container.innerHTML += `<input class="tgl tgl-skewed" id="${this.name}-check" type="checkbox"/>\n<label class="tgl-btn" data-tg-off="OFF" data-tg-on="ON" for="${this.name}-check"></label>`
        document.querySelector(`#${this.name}-check`).checked = this.enabled
    }
    attachEvent() {
        document.querySelector(`#${this.name}-check`).addEventListener("change", check => {
            socket.send(JSON.stringify({action: "changeEnabled", student: {name: this.name,isEnabled: check.target.checked}}))
        })
    }
}

function addToLog(logUser) {
    const timeLog = document.querySelector("#time-log")
    const logText = document.createElement("div")
    logText.setAttribute("class", "timelog-container")
    logText.innerHTML =  `<p class="timelog-name">${logUser.name}</p><p class="timelog-method">${logUser.method}</p><p class="timelog-time">${new Date(logUser.createdAt).toLocaleString("no-NO", { hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric', hour12:false }).replaceAll(".", "/")}</p>`
    timeLog.appendChild(logText)
    timeLogScrollHandler(timeLog)
}

function timeLogScrollHandler(timeLog) { // Takes to top 
    timeLog.scrollTop = -timeLog.scrollHeight;
}



const socketProtocol = (window.location.protocol === 'https:' ? 'wss:' : 'ws:')
const echoSocketUrl = socketProtocol + '//' + window.location.hostname + '/panel'
const socket = new WebSocket(echoSocketUrl);

socket.onopen = () => {
    socket.send('Connection opened'); 
}

socket.onmessage = e => {
    e = JSON.parse(e.data)
    console.log('Message from server:', e.action)
    if(e.action == "getAll") {
        e.users.forEach(student => {
            student = new Student(student.name, student.enabled)
            student.createBox()
            student.attachEvent()
        })
        e.timeLog.forEach(time => {
            console.log(time)
            addToLog(time)
        })
    }
    if(e.action == "updateEnabled") {
        document.querySelector(`#${e.student.name}-check`).checked = e.student.isEnabled
    }
    if(e.action == "OpenedDoor") {
       addToLog(e.student)
    }
}

