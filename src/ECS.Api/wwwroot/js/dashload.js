import { Nav, NewLocation } from "./components/nav.js"
import { TabelElementsBuild, TabelInvElementsBuild } from "./components/tableactions.js"
import { ByMonthGraph, BuildEmpSelect, ByBarGraph } from "./components/reportcomponent.js"


// Function to create a table row element dynamically
// Each row includes equipmentId, name, and a button
function createTableElement(element, btnval, ev = () => { }) {
    let tr = document.createElement("tr");  // Create a table row
    let th = document.createElement("th");  // Header cell for equipmentId
    th.setAttribute("scope", "row")
    th.innerHTML = element.equipmentId;
    let td = document.createElement("td"); // Cell for equipment name
    td.innerHTML = element.name
    let tdbtn = document.createElement("td"); // Cell for action button
    let button = document=*/.createElement("button")
    button.className = "btn btn-primary"; // Bootstrap button style
    button.type = "button"
    button.innerHTML = btnval            // Button label (e.g., "Checkout")
    button.setAttribute("data-id", element.equipmentId)
    tdbtn.appendChild(button);

    // Append cells to the row
    tr.append(th)
    tr.append(td)
    tr.append(tdbtn)

    // Attach click event handler
    tdbtn.addEventListener("click", ev)
    return tr;

}

// Function to create a 3-color radial gradient for charts (Chart.js use case)
function createRadialGradient3(context, c1, c2, c3) {
    const chartArea = context.chart.chartArea;
    if (!chartArea) {
        // Chart not yet rendered, so return early
        return;
    }

    const chartWidth = chartArea.right - chartArea.left;
    const chartHeight = chartArea.bottom - chartArea.top;

    // If chart size changes, clear cache to rebuild gradient
    if (width !== chartWidth || height !== chartHeight) {
        cache.clear();
    }
    // Check if gradient already exists in cache
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
        gradient.addColorStop(0, c1);    // Inner color
        gradient.addColorStop(0.5, c2);  // Midpoint color
        gradient.addColorStop(1, c3);    // Outer color
        cache.set(c1 + c2 + c3, gradient);
    }

    return gradient;
}

// Main load function (runs when page loads)
async function load() {
    let emp = undefined;
    const token = sessionStorage.getItem('authToken');  // Get authentication token
    // If no token, redirect to login page
    if (!token) {
        location.replace("./loginredirect.html");
        // return;
    } else {
        try {
            // Extract userId (uid) from URL params
            const urlParams = new URLSearchParams(window.location.search);
            const uid = urlParams.getAll('uid');

            // Fetch employee info
            fetch(`/api/Employees/${uid}`, { method: "GET" })
                .then(async responses => {
                    emp = await responses.json()

                    console.log(emp);
                    
                    // Load dashboard template
            fetch('./templates/dash.html')
                .then(async response => {
                    let html = await response.text()
                    let maincont = document.querySelector("#maincont")
                    let nav = document.querySelector("#nav")
                    let drawer = document.querySelector("#drawer")
                    let chartcontainer = document.querySelector("#chart-container")
                    console.log(nav)

                    // Show nav + drawer
                    if(nav)
                        nav.classList.add("open")
                    if (drawer)
                        drawer.classList.add("open")
                   
                    //drawer.classList.add("open")


                    //console.log(html);
                    // Create temp container for HTML
                    let d = document.createElement("div");
                    d.innerHTML = html;

                    //const parser = new DOMParser();
                    //const doc = parser.parseFromString(html, 'text/html');
                    //console.log(doc)

                    // Delay to ensure DOM elements exist
                    
                    setTimeout(() => {
                        
                       
                        maincont.innerHTML = d.innerHTML

                        // Hide report UI if user is not a Manager
                        if (emp.role != "Manager") {
                            document.getElementById("reportedUI").style.display = "none";
                            document.getElementById("reports").style.display = "none";
                        }

                        // Setup button event handlers
                        let checkoutbutton = document.querySelector("#checkoutbtn")
                        let returnbutton = document.querySelector("#returnbtn")
                        let invbutton = document.querySelector("#inventory")
                        let reportsbutton = document.querySelector("#reports")

                        // Checkout button
                        checkoutbutton.addEventListener("click", () => {
                           
                            TabelElementsBuild("./templates/checkout.html", "#maincont", `./api/Inventory/checkout`,"Available", () => {
                                var table = document.getElementById("checkouttable")
                            })
                        })

                        // Return button
                        returnbutton.addEventListener("click", () => {
                            
                            fetch('./templates/returns.html')
                                .then(async responses => {
                                    NewLocation(maincont, await responses.text(), () => {
                                        setTimeout(() => {
                                            console.log("ok")
                                            TabelElementsBuild("./templates/returns.html", "#maincont", `./api/Inventory/return`,"CheckedOut", () => {
                                                var table = document.getElementById("checkouttable")
                                            })
                                           
                                        }, 200)
                                    })

                                })
                        })

                        // Inventory button
                        invbutton.addEventListener("click", () => {

                            fetch('./templates/inventory.html')
                                .then(async responses => {
                                    NewLocation(maincont, await responses.text(), () => {
                                        setTimeout(() => {
                                            console.log("ok")
                                            TabelInvElementsBuild("./templates/inventory.html","#maincont")
                                           

                                        }, 200)
                                    })

                                })
                        })

                        // Reports button
                        reportsbutton.addEventListener("click", () => {
                            setTimeout(() => {

                            },300)
                            fetch('./templates/report.html')
                                .then(async responses => {
                                    NewLocation(maincont, await responses.text(), () => {
                                        setTimeout(() => {
                                            let drawer = document.querySelector("#drawer")

                                            // Populate employee select dropdown for reports
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
                                            
                                          
                                        }, 300)


                                        // Adjust drawer height based on chart height
                                        let chartcontainer = document.querySelector(".chart-container")
                                        let contrectHeight = chartcontainer.getBoundingClientRect().height
                                        console.log(contrectHeight)
                                        drawer.style.height = ""+contrectHeight*2+"px"
                                       
                                    })

                                })
                        })

                        // Show initial graphs for this user
                        ByMonthGraph(uid);
                        


                        // Setup navigation
                        Nav("#navSelections");
                    }, 300)

                })
                })
        } catch (ex) {
            console.log("kkkkk")
        }
    }
}

// Prevents user from going back (forces forward navigation)
try {
    history.pushState(null, null, location.href); // Pushes the current page to history
    window.onpopstate = function () {
        history.go(1); // Navigates forward if the user tries to go back
    };
    load()    // Call main load function
} catch (ex) {

}
