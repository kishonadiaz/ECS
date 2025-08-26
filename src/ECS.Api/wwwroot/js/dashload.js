import { Nav, NewLocation } from "./components/nav.js"
import { TabelElementsBuild, TabelInvElementsBuild } from "./components/tableactions.js"
import { ByMonthGraph, BuildEmpSelect, ByBarGraph } from "./components/reportcomponent.js"

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
function createRadialGradient3(context, c1, c2, c3) {
    const chartArea = context.chart.chartArea;
    if (!chartArea) {
        // This case happens on initial chart load
        return;
    }

    const chartWidth = chartArea.right - chartArea.left;
    const chartHeight = chartArea.bottom - chartArea.top;
    if (width !== chartWidth || height !== chartHeight) {
        cache.clear();
    }
    let gradient = cache.get(c1 + c2 + c3);
    if (!gradient) {
        // Create the gradient because this is either the first render
        // or the size of the chart has changed
        width = chartWidth;
        height = chartHeight;
        const centerX = (chartArea.left + chartArea.right) / 2;
        const centerY = (chartArea.top + chartArea.bottom) / 2;
        const r = Math.min(
            (chartArea.right - chartArea.left) / 2,
            (chartArea.bottom - chartArea.top) / 2
        );
        const ctx = context.chart.ctx;
        gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, r);
        gradient.addColorStop(0, c1);
        gradient.addColorStop(0.5, c2);
        gradient.addColorStop(1, c3);
        cache.set(c1 + c2 + c3, gradient);
    }

    return gradient;
}
async function load() {
    let emp = undefined;
    const token = sessionStorage.getItem('authToken');
    if (!token) {
        location.replace("./loginredirect.html");
        // return;
    } else {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const uid = urlParams.getAll('uid');
            fetch(`/api/Employees/${uid}`, { method: "GET" })
                .then(async responses => {
                    emp = await responses.json()

                    console.log(emp);
                    if (emp.role == "Manager") {

                    } else {

                        fetch('./templates/dash.html')
                            .then(async response => {
                                let html = await response.text()
                                let maincont = document.querySelector("#maincont")
                                let nav = document.querySelector("#nav")
                                let drawer = document.querySelector("#drawer")
                                let chartcontainer = document.querySelector("#chart-container")
                                console.log(nav)
                                if (nav)
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
                                    if (emp.role != "Manager") {
                                        document.getElementById("reportedUI").style.display = "none";
                                        document.getElementById("reports").style.display = "none";
                                    }
                                    let checkoutbutton = document.querySelector("#checkoutbtn")
                                    let returnbutton = document.querySelector("#returnbtn")
                                    let invbutton = document.querySelector("#inventory")
                                    let reportsbutton = document.querySelector("#reports")
                                    checkoutbutton.addEventListener("click", () => {

                                        TabelElementsBuild("./templates/checkout.html", "#maincont", `./api/Inventory/checkout`, "Available", () => {
                                            var table = document.getElementById("checkouttable")
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
                                        setTimeout(() => {

                                        }, 300)
                                        fetch('./templates/report.html')
                                            .then(async responses => {
                                                NewLocation(maincont, await responses.text(), () => {
                                                    setTimeout(() => {
                                                        let drawer = document.querySelector("#drawer")

                                                        BuildEmpSelect((select) => {
                                                            const selectedIndex = select.selectedIndex;
                                                            const selectedText = select.options[selectedIndex].text;
                                                            const selectedValue = select.options[selectedIndex].value;

                                                            console.log(selectedText, selectedValue)
                                                            if (selectedValue != "default") {
                                                                ByMonthGraph(selectedValue, true);
                                                                ByBarGraph(selectedValue, true);
                                                            }
                                                        });

                                                        //const ctx = document.getElementById('circlegraph').getContext('2d');
                                                        //const myPieChart = new Chart(ctx, {
                                                        //    type: 'pie',
                                                        //    data: {
                                                        //        labels: ['Data' ],
                                                        //        //labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                                                        //        datasets: [{
                                                        //            label: 'Example Data',
                                                        //            data: [12, 1, 0, 0, 0, 0],
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
                                                    let chartcontainer = document.querySelector(".chart-container")
                                                    let contrectHeight = chartcontainer.getBoundingClientRect().height
                                                    console.log(contrectHeight)
                                                    drawer.style.height = "" + contrectHeight * 2 + "px"
                                                    //setTimeout(() => {
                                                    //    console.log("ok")
                                                    //    TabelElementsBuild("./templates/report.html", "#maincont", `./api/Inventory/return`, "CheckedOut", () => {
                                                    //        var table = document.getElementById("checkouttable")
                                                    //    })

                                                    //}, 200)
                                                })

                                            })
                                    })


                                    ByMonthGraph(uid);




                                    Nav("#navSelections");
                                }, 300)

                            })
                    }
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
