import { Nav, NewLocation } from "./components/nav.js"
import { TabelElementsBuild } from "./components/tableactions.js"
import { ChartComp } from "./components/chartcomponent.js"

function createTableElement(element, btnval, ev = () => { }) {
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.setAttribute("scope", "row")
    th.innerHTML = element.equipmentId;
    let td = document.createElement("td");
    td.innerHTML = element.name
    let tdbtn = document.createElement("td");
    let button = document.createElement("button")
    button.className = "btn btn-primary";
    button.type = "button"
    button.innerHTML = btnval
    button.setAttribute("data-id", element.equipmentId)
    tdbtn.appendChild(button);
    tr.append(th)
    tr.append(td)
    tr.append(tdbtn)

    tdbtn.addEventListener("click", ev)
    return tr;

}
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
                        const urlParams = new URLSearchParams(window.location.search);
                        const uid = urlParams.getAll('uid');
                        let chartcomp = new ChartComp();
                        maincont.innerHTML = d.innerHTML
                        let checkoutbutton = document.querySelector("#checkoutbtn")
                        let returnbutton = document.querySelector("#returnbtn")
                        checkoutbutton.addEventListener("click", () => {
                            //fetch('./templates/checkout.html')
                            //    .then(async responses => {
                            //        NewLocation(maincont, await responses.text(), () => {
                            //            setTimeout(() => {
                            //                console.log("ok")
                            //                fetch(`./api/Equipment/GetAll`, { method: "GET" })
                            //                    .then(async responsed => {




                            //                        let data = await responsed.json();
                            //                        console.log(data);
                            //                        var table = document.getElementById("checkouttable")
                            //                        for (var i of data) {
                            //                            console.log(i)
                            //                            if (i.status == "Available") {
                            //                                table.append(createTableElement(i, "Checkout", (ev) => {
                            //                                    const urlParams = new URLSearchParams(window.location.search);
                            //                                    const uid = urlParams.getAll('uid');
                            //                                    console.log(ev, i.equipmentId, uid);




                            //                                    fetch(`../api/Inventory/checkout`, {
                            //                                        method: "POST",
                            //                                        headers: {
                            //                                            "Content-Type": "application/json"
                            //                                        },
                            //                                        body: JSON.stringify({
                            //                                            "equipmentId": parseInt(ev.target.getAttribute("data-id")),
                            //                                            "employeeId": parseInt(uid[0])
                            //                                        })
                            //                                    })
                            //                                        .then(async responsed => {
                            //                                            console.log(responsed)

                            //                                        })

                            //                                }))


                            //                            }
                            //                        }

                            //                    })
                            //            }, 200)
                            //        })

                            //    })
                            TabelElementsBuild("./templates/checkout.html", "#maincont", `./api/Inventory/checkout`,"Available", () => {
                                var table = document.getElementById("checkouttable")
                            })
                        })
                        returnbutton.addEventListener("click", () => {
                            
                            fetch('./templates/returns.html')
                                .then(async responses => {
                                    NewLocation(maincont, await responses.text(), () => {
                                        setTimeout(() => {
                                            console.log("ok")
                                            TabelElementsBuild("./templates/returns.html", "#maincont", `./api/Inventory/return`,"CheckedOut", () => {
                                                var table = document.getElementById("checkouttable")
                                            })
                                            //fetch(`./api/Equipment/GetAll`, { method: "GET" })
                                            //    .then(async responsed => {


                                            //        TabelElementsBuild("./templates/returns.html", "#maincont", `./api/Inventory/return`, () => {
                                            //            var table = document.getElementById("checkouttable")
                                            //        })

                                            //        let data = await responsed.json();
                                            //        console.log(data);
                                            //        var table = document.getElementById("checkouttable")
                                            //        for (var i of data) {
                                            //            console.log(i)
                                            //            if (i.status == "CheckedOut") {
                                            //                const urlParams = new URLSearchParams(window.location.search);
                                            //                const uid = urlParams.getAll('uid');
                                            //                table.append(createTableElement(i,"Return" ,(ev) => {
                                            //                    console.log(ev,i.equipmentId);
                                                                
                                            //                    fetch(`./api/Inventory/return`, {
                                            //                        method: "POST",
                                            //                        headers: {
                                            //                            "Content-Type": "application/json"
                                            //                        },
                                            //                        body: JSON.stringify({
                                            //                            "equipmentId": parseInt(ev.target.getAttribute("data-id")),
                                            //                            "employeeId": parseInt(uid)
                                            //                        })
                                            //                    })
                                            //                        .then(async responsed => {
                                            //                            console.log(responsed)
                                            //                            fetch(`./api/Equipment/GetAll`, { method: "GET" })
                                            //                                .then(async responsed => { 
                                                                               
                                            //                                })
                                            //                    })
                                            //                }))
                                            //            }
                                            //        }

                                            //    })
                                        }, 200)
                                    })

                                })
                        })

                        fetch(`./api/Reports/employee/${uid}/checkouts-per-month`, { method: "GET" })
                            .then(async responses => {
                                let data = await responses.json();
                                for (var [i, item] of Object.entries(data)) {
                                    console.log(i, item)
                                    chartcomp.addMonths(item.month)
                                    chartcomp.addData(item.count)
                                }
                                
                                //console.log(checkoutbutton)
                                const ctx = document.getElementById('myChart');
                                if (ctx) {
                                    console.log(chartcomp.getMonths(), chartcomp.getData())
                                    new Chart(ctx, {
                                        type: 'line',
                                        data: {
                                            labels: chartcomp.getMonths(),
                                            datasets: [{
                                                label: 'Number of Checkouts',
                                                data: chartcomp.getData(),
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

                            })
                       
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
