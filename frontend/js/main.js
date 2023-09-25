
const ip = "http://127.0.0.1:4000";
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
