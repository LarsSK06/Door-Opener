
const ip = "http://127.0.0.1:4000";
const port = 4000;
window.addEventListener("load", () => {
    document.querySelector("#open").addEventListener("submit", (event) => {
        event.preventDefault()
        fetch(ip + "/open", {
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
        })
    });
});