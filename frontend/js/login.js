
const ip = "http://127.0.0.1:80";
const port = 4000;
window.addEventListener("load", () => {
    const header = document.querySelector("#header");
        header.querySelectorAll(".column").forEach(column => {
            const clicker = column.querySelector("#button").querySelector("#text");
            clicker.addEventListener("click", () => {
                if(column.hasAttribute("selected")){
                    column.removeAttribute("selected");
                }
                else if(header.querySelector(".column[selected]")){
                    header.querySelector(".column[selected]").removeAttribute("selected");
                    column.setAttribute("selected", "");
                }
                else column.setAttribute("selected", "");
            });
        });
    document.querySelector("#login-form").addEventListener("submit", (event) => {
        event.preventDefault()
        fetch(ip + "/login", {
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"password":document.querySelector("#password").value})
        }).then(response => response.json()).then(response => {
            console.log(response)
            if(response.code === 200) {
                window.location.href = ip + "/";
            }
            if(response.code !== 200) {
                document.querySelector("#log").innerHTML = response.code + " : " + response.message
            }
        })
    })
});
