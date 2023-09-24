
const ip = "http://127.0.0.1:4000";
const port = 4000;
window.addEventListener("load", () => {
    console.log(document.querySelector("#open"))
    document.querySelector("#open").addEventListener("click", (event) => {
        event.preventDefault()
        fetch(ip + "/open", {
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
        })
    });
});