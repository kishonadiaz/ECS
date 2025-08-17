import { ChartComp } from "./chartcomponent.js"
import { TabelElementsBuild, TabelInvElementsBuild } from "./tableactions.js"

//import { run } from "../main.js"
//console.log(run)

//export class Running {
//    constructor() {
//        this.passing = () => { }
//    }

//    add = (vars = {}, callback = () => { }) => {
//        this.passing = callback();
//    }
//    get update(){
//        return this.passing
//    }
//}

/*

TODO ChartJs has to go in its own component

*/
/*
    NewLocation takes the element that is being passed and sets the innner html from the reponse used in Button calls to change the dashboard layout from the dash template buttons

*/
//function createTableElement(thtext, tdtext,btnval, ev = () => { }) {
//    let tr = document.createElement("tr");
//    let th = document.createElement("th");
//    th.setAttribute("scope", "row")
//    th.innerHTML = thtext;
//    let td = document.createElement("td");
//    td.innerHTML = tdtext
//    let tdbtn = document.createElement("td");
//    let button = document.createElement("button")
//    button.className = "btn btn-primary";
//    button.type = "button"
//    button.innerHTML = btnval
//    tdbtn.appendChild(button);
//    tr.append(th)
//    tr.append(td)
//    tr.append(tdbtn)

//    tdbtn.addEventListener("click",ev)
//    return tr;

//}
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

export function NewLocation(element, htm, callback=()=> { }) {
    setTimeout(() => {
        element.innerHTML = htm;

        callback();
    }, 300)
    
}

/*
    Nav is a component that is responable for the navigation of the dashboard it fetches from the templates and dynamicly
    injects into the element maincont where the template then appears and then after the call to dash is a new instance from the initially loaded dash so the chart is different
*/
export function Nav(element) {
    var elem = document.querySelector(element);
    if(elem)
    elem.addEventListener("click",clickaction)
}
function clickaction(ev) {
    let maincont = document.querySelector("#maincont")
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.getAll('uid');
    let chartcomp = new ChartComp();
    let elem = ev.target
    let emp = undefined;
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

                        //console.log(html);
                        let d = document.createElement("div");
                        d.innerHTML = html;
  

                        setTimeout(() => {
                            maincont.innerHTML = d.innerHTML
                            setTimeout(() => {
                                console.log("ok")
                                TabelElementsBuild("./templates/checkout.html", "#maincont", `./api/Inventory/checkout`, "Available", () => {
                                    var table = document.getElementById("checkouttable")
                                })
                                //fetch(`./api/Equipment/GetAll`, { method: "GET" })
                                //    .then(async responsed => {


                                //        let data = await responsed.json();
                                //        console.log(data);
                                //        var table = document.getElementById("checkouttable")
                                //        for (var i of data) {
                                //            console.log(i)
                                //            if (i.status == "Available") {
                                //                table.append(createTableElement(i.equipmentId, i.name,"Checkout" ,(ev) => {
                                //                    console.log(ev);
                                //                }))
                                //            }
                                //        }


                                //    })
                            }, 200)
                            
                        }, 300)

                    })
            } else if (action == "return") {
                fetch('./templates/returns.html')
                    .then(async response => {
                        let html = await response.text()

                        console.log(html);
                        let d = document.createElement("div");
                        d.innerHTML = html;


                        setTimeout(() => {
                            maincont.innerHTML = d.innerHTML
                            setTimeout(() => {
                                console.log("ok")
                                TabelElementsBuild("./templates/returns.html", "#maincont", `./api/Inventory/return`, "CheckedOut", () => {
                                    var table = document.getElementById("checkouttable")
                                })
                            }, 200)

                        }, 300)

                    })
            } else if (action == "inventory") {
                fetch('./templates/inventory.html')
                    .then(async response => {
                        let html = await response.text()

                        console.log(html);
                        let d = document.createElement("div");
                        d.innerHTML = html;


                        setTimeout(() => {
                            maincont.innerHTML = d.innerHTML
                            setTimeout(() => {
                                console.log("ok")
                                TabelInvElementsBuild("./templates/inventory.html", "#maincont")
                            }, 200)

                        }, 300)

                    })
            } else if (action == "report") {
                fetch('./templates/report.html')
                    .then(async response => {
                        let html = await response.text()

                        console.log(html);
                        let d = document.createElement("div");
                        d.innerHTML = html;


                        setTimeout(() => {
                            maincont.innerHTML = d.innerHTML
                            setTimeout(() => {
                                console.log("ok")
                                fetch('./templates/report.html')
                                    .then(async responses => {
                                        NewLocation(maincont, await responses.text(), () => {
                                            setTimeout(() => {
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
                                                            //console.log(chartcomp.getMonths(), chartcomp.getData())
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
                                                //const ctx = document.getElementById('circlegraph').getContext('2d');
                                                //const myPieChart = new Chart(ctx, {
                                                //    type: 'pie',
                                                //    data: {
                                                //        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                                                //        datasets: [{
                                                //            label: 'Example Data',
                                                //            data: [12, 19, 3, 5, 2, 3],
                                                //            backgroundColor: [
                                                //                'rgba(255, 99, 132, 0.2)',
                                                //                'rgba(54, 162, 235, 0.2)',
                                                //                'rgba(255, 206, 86, 0.2)',
                                                //                'rgba(75, 192, 192, 0.2)',
                                                //                'rgba(153, 102, 255, 0.2)',
                                                //                'rgba(255, 159, 64, 0.2)'
                                                //            ],
                                                //            borderColor: [
                                                //                'rgba(255, 99, 132, 1)',
                                                //                'rgba(54, 162, 235, 1)',
                                                //                'rgba(255, 206, 86, 1)',
                                                //                'rgba(75, 192, 192, 1)',
                                                //                'rgba(153, 102, 255, 1)',
                                                //                'rgba(255, 159, 64, 1)'
                                                //            ],
                                                //            borderWidth: 1
                                                //        }]
                                                //    },
                                                //    options: {
                                                //        responsive: true,
                                                //        plugins: {
                                                //            legend: {
                                                //                position: 'top',
                                                //            },
                                                //            title: {
                                                //                display: true,
                                                //                text: 'Pie Chart Example'
                                                //            }
                                                //        }
                                                //    }
                                                //});
                                            }, 300)

                                            //setTimeout(() => {
                                            //    console.log("ok")
                                            //    TabelElementsBuild("./templates/report.html", "#maincont", `./api/Inventory/return`, "CheckedOut", () => {
                                            //        var table = document.getElementById("checkouttable")
                                            //    })

                                            //}, 200)
                                        })

                                    })
                                //TabelElementsBuild("./templates/reor.html", "#maincont", `./api/Inventory/return`, "CheckedOut", () => {
                                //    var table = document.getElementById("checkouttable")
                                //})
                            }, 200)

                        }, 300)

                    })
            }


            else if (action == "dash") {
                fetch(`/api/Employees/${uid}`, { method: "GET" })
                    .then(async responses => {
                        emp = await responses.json()

                        //console.log(emp);
                    
                fetch('./templates/dash.html')
                    .then(async response => {
                        let html = await response.text()

                        console.log(html);
                        let d = document.createElement("div");
                        d.innerHTML = html;


                        setTimeout(() => {
                            const urlParams = new URLSearchParams(window.location.search);
                            const uid = urlParams.getAll('uid');
                            let chartcomp = new ChartComp();
                            maincont.innerHTML = d.innerHTML
                            if (emp.role != "Manager") {
                                document.getElementById("reportedUI").style.display = "none";
                                document.getElementById("reports").style.display = "none";
                            }
                            let checkoutbutton = document.querySelector("#checkoutbtn")
                            let returnbutton = document.querySelector("#returnbtn")
                            let invbutton = document.querySelector("#inventory")
                            let reportsbutton = document.querySelector("#reports")
                            checkoutbutton.addEventListener("click", () => {
                                fetch('./templates/checkout.html')
                                    .then(async responses => {
                                        NewLocation(maincont, await responses.text(), () => {
                                            setTimeout(() => {
                                                console.log("ok")
                                                TabelElementsBuild("./templates/checkout.html", "#maincont", `./api/Inventory/checkout`, "Available", () => {
                                                    var table = document.getElementById("checkouttable")
                                                })
                                            }, 200)
                                        })
                                       
                                    })
                            })
                            returnbutton.addEventListener("click", () => {
                                fetch('./templates/returns.html')
                                    .then(async responses => {
                                        NewLocation(maincont, await responses.text(), () => {
                                            setTimeout(() => {
                                                console.log("ok")
                                                TabelElementsBuild("./templates/returns.html", "#maincont", `./api/Inventory/return`, "CheckedOut", () => {
                                                    var table = document.getElementById("checkouttable")
                                                })
                                            }, 200)
                                        })
                                       
                                    })
                            })
                            invbutton.addEventListener("click", () => {

                                fetch('./templates/inventory.html')
                                    .then(async responses => {
                                        NewLocation(maincont, await responses.text(), () => {
                                            setTimeout(() => {
                                                console.log("ok")
                                                TabelInvElementsBuild("./templates/inventory.html", "#maincont")
                                               

                                            }, 200)
                                        })

                                    })
                            })
                            reportsbutton.addEventListener("click", () => {

                                fetch('./templates/report.html')
                                    .then(async responses => {
                                        NewLocation(maincont, await responses.text(), () => {
                                            fetch('./templates/report.html')
                                                .then(async responses => {
                                                    NewLocation(maincont, await responses.text(), () => {
                                                        setTimeout(() => {
                                                            fetch(`./api/Reports/employee/${uid}/checkouts-per-month`, { method: "GET" })
                                                                .then(async responses => {
                                                                    let data = await responses.json();
                                                                    //for (var [i, item] of Object.entries(data)) {
                                                                    //    console.log(i, item)
                                                                    //    chartcomp.addMonths(item.month)
                                                                    //    chartcomp.addData(item.count)
                                                                    //}

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
                                                            //const ctx = document.getElementById('circlegraph').getContext('2d');
                                                            //const myPieChart = new Chart(ctx, {
                                                            //    type: 'pie',
                                                            //    data: {
                                                            //        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                                                            //        datasets: [{
                                                            //            label: 'Example Data',
                                                            //            data: [12, 19, 3, 5, 2, 3],
                                                            //            backgroundColor: [
                                                            //                'rgba(255, 99, 132, 0.2)',
                                                            //                'rgba(54, 162, 235, 0.2)',
                                                            //                'rgba(255, 206, 86, 0.2)',
                                                            //                'rgba(75, 192, 192, 0.2)',
                                                            //                'rgba(153, 102, 255, 0.2)',
                                                            //                'rgba(255, 159, 64, 0.2)'
                                                            //            ],
                                                            //            borderColor: [
                                                            //                'rgba(255, 99, 132, 1)',
                                                            //                'rgba(54, 162, 235, 1)',
                                                            //                'rgba(255, 206, 86, 1)',
                                                            //                'rgba(75, 192, 192, 1)',
                                                            //                'rgba(153, 102, 255, 1)',
                                                            //                'rgba(255, 159, 64, 1)'
                                                            //            ],
                                                            //            borderWidth: 1
                                                            //        }]
                                                            //    },
                                                            //    options: {
                                                            //        responsive: true,
                                                            //        plugins: {
                                                            //            legend: {
                                                            //                position: 'top',
                                                            //            },
                                                            //            title: {
                                                            //                display: true,
                                                            //                text: 'Pie Chart Example'
                                                            //            }
                                                            //        }
                                                            //    }
                                                            //});
                                                        }, 300)

                                                        //setTimeout(() => {
                                                        //    console.log("ok")
                                                        //    TabelElementsBuild("./templates/report.html", "#maincont", `./api/Inventory/return`, "CheckedOut", () => {
                                                        //        var table = document.getElementById("checkouttable")
                                                        //    })

                                                        //}, 200)
                                                    })

                                                })
                                            //setTimeout(() => {
                                            //    console.log("ok")
                                            //    TabelElementsBuild("./templates/report.html", "#maincont", `./api/Inventory/return`, "CheckedOut", () => {
                                            //        var table = document.getElementById("checkouttable")
                                            //    })

                                            //}, 200)
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

                            //Nav("#navSelections");
                        }, 300)

                    })
                    })
            }
        
        }
    }
    
}
function logout() {
    sessionStorage.removeItem('authToken');
    console.log("Logged out and token cleared.");
}