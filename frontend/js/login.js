
const ip = "http://127.0.0.1:80";
const port = 4000;
window.addEventListener("load", () => {
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