window.addEventListener("load", () => {
    const mainContainer = document.querySelector("#page-container")
    const studentList = ["lars", "alibaba", "lorem", "ipsum"]
    studentList.forEach(student => {
        let studentC = new Student(student, mainContainer)
        studentC.createBox()
    })
})
    
class Student {
    constructor(name) {
        this.parent = document.querySelector("#page-container")
        this.name = name
        this.enabled = false
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
    }
}






