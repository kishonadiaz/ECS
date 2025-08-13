import { Nav,NewLocation } from "./components/nav.js"

async function load() {
   
    const token = sessionStorage.getItem('authToken');
    if (!token) {
        location.replace("./loginredirect.html");
        // return;
    } else {
        try {
            fetch('./templates/dash.html')
                .then(async response => {
                    let html = await response.text()
                    let maincont = document.querySelector("#maincont")
                    let nav = document.querySelector("#nav")
                    let drawer = document.querySelector("#drawer")
                    console.log(nav)
                    if(nav)
                        nav.classList.add("open")
                    if (drawer)
                        drawer.classList.add("open")
                    //drawer.classList.add("open")


                    //console.log(html);
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
                        //console.log(checkoutbutton)
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
                        Nav("#navSelections");
                    }, 300)

                })
        } catch (ex) {
            console.log("kkkkk")
        }
    }
}
try {
    history.pushState(null, null, location.href); // Pushes the current page to history
    window.onpopstate = function () {
        history.go(1); // Navigates forward if the user tries to go back
    };
    load()
} catch (ex) {

}
