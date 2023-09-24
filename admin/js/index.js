  
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
    }
    if(e.action == "updateEnabled") {
        document.querySelector(`#${e.student.name}-check`).checked = e.student.isEnabled
    }
}

