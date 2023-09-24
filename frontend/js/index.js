const ip = "127.0.0.1";
const port = 4000;
window.addEventListener("load", () => {
    document.querySelector("#container").innerHTML += await fetch(`http://${ip}:${port}/a`, {
        method: "POST",
        headers: {
            Authorization: "just-for-security-idfk",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            password: password
        })
    });
    const data = await response.json();
    console.log(data);
    log(data["code"] + ": " + data["message"])
});
    document.querySelector("#submit").addEventListener("click", async () => {
        const password = document.querySelector("#container").querySelector("#password").value;
        const response = await fetch(`http://${ip}:${port}/login`, {
            method: "POST",
            headers: {
                Authorization: "just-for-security-idfk",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: password
            })
        });
        const data = await response.json();
        console.log(data);
        log(data["code"] + ": " + data["message"])
    });
    {
        let onCooldown = false;
        const element = document.querySelector("#log");
        function log(message){
            if(onCooldown) return;
            onCooldown = true;
            element.innerHTML = message;
            element.style.opacity = 1;
            setTimeout(() => onCooldown = false, 2500);
            setTimeout(() => {
                element.style.opacity = 0;
                setTimeout(() => onCooldown = false, 300);
            }, 2500);
        }
    }
    {
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
    }
});