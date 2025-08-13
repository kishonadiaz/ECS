//import { run } from "../main.js"
//console.log(run)

export class Running {
    constructor() {
        this.passing = () => { }
    }

    add = (vars = {}, callback = () => { }) => {
        this.passing = callback();
    }
    get update(){
        return this.passing
    }
}

export function NewLocation(element, htm, callback=()=> { }) {
    setTimeout(() => {
        element.innerHTML = htm;
        callback();
    }, 300)
    
}
export function Nav(element) {
    var elem = document.querySelector(element);
    if(elem)
    elem.addEventListener("click",clickaction)
}
function clickaction(ev) {
    let maincont = document.querySelector("#maincont")
    let elem = ev.target
    if (elem) {
        console.log(ev)
        let child = ev.target.children[0]
        if (child) {
            ev.target.children[0].click()
            let action = child.getAttribute("data-action")
            if (action == "logout") {
                history.pushState(null, null, location.href); // Pushes the current page to history
                window.onpopstate = function () {
                    history.go(1); // Navigates forward if the user tries to go back
                };
                //let deletingAll =   history.deleteAll()
                location.replace("./loginredirect.html");

                logout()

            } else if (action == "checkout") {
                fetch('./templates/checkout.html')
                    .then(async response => {
                        let html = await response.text()

                        console.log(html);
                        let d = document.createElement("div");
                        d.innerHTML = html;
                        //const parser = new DOMParser();
                        //const doc = parser.parseFromString(html, 'text/html');
                        //console.log(doc)

                        setTimeout(() => {
                            maincont.innerHTML = d.innerHTML
                            //Nav("#navSelections");
                            
                        }, 300)

                    })
            } else if (action == "return") {
                fetch('./templates/returns.html')
                    .then(async response => {
                        let html = await response.text()

                        console.log(html);
                        let d = document.createElement("div");
                        d.innerHTML = html;
                        //const parser = new DOMParser();
                        //const doc = parser.parseFromString(html, 'text/html');
                        //console.log(doc)

                        setTimeout(() => {
                            maincont.innerHTML = d.innerHTML
                            //Nav("#navSelections");
                        }, 300)

                    })
            } else if (action == "dash") {
                fetch('./templates/dash.html')
                    .then(async response => {
                        let html = await response.text()

                        console.log(html);
                        let d = document.createElement("div");
                        d.innerHTML = html;
                        //const parser = new DOMParser();
                        //const doc = parser.parseFromString(html, 'text/html');
                        //console.log(doc)

                        setTimeout(() => {
                            maincont.innerHTML = d.innerHTML
                            let checkoutbutton = document.querySelector("#checkoutbtn")
                            let returnbutton = document.querySelector("#returnbtn")
                            checkoutbutton.addEventListener("click", () => {
                                fetch('./templates/checkout.html')
                                    .then(async responses => {
                                        NewLocation(maincont, await responses.text())
                                    })
                            })
                            returnbutton.addEventListener("click", () => {
                                fetch('./templates/returns.html')
                                    .then(async responses => {
                                        NewLocation(maincont, await responses.text())
                                    })
                            })
                            const ctx = document.getElementById('myChart');
                            if (ctx) {
                                new Chart(ctx, {
                                    type: 'line',
                                    data: {
                                        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                                        datasets: [{
                                            label: 'Number of Checkouts',
                                            data: [5, 9, 14, 20, 18, 25, 30],
                                            borderColor: 'rgba(75, 192, 192, 1)',
                                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                            tension: 0.3, // smooth curves
                                            fill: true,
                                            pointRadius: 5,
                                            pointBackgroundColor: 'rgba(75, 192, 192, 1)'
                                        }]
                                    },
                                    options: {
                                        responsive: false,
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: 'Tool Checked Out per Month'
                                            }
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                title: { display: true, text: 'Checked Out' }
                                            },
                                            x: {
                                                title: { display: true, text: 'Month' }
                                            }
                                        }
                                    }
                                });
                            }

                            //Nav("#navSelections");
                        }, 300)

                    })
            }
        
        }
    }
    
}
function logout() {
    sessionStorage.removeItem('authToken');
    console.log("Logged out and token cleared.");
}