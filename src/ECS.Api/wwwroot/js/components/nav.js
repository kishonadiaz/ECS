import { ChartComp } from "./chartcomponent.js"
import { TabelElementsBuild, TabelInvElementsBuild } from "./tableactions.js"
import { ByMonthGraph, BuildEmpSelect, ByBarGraph } from "./reportcomponent.js"

/*

TODO ChartJs has to go in its own component

*/

/*
    Creates the Table for the graph by creating the elements to be injected into the graphs
*/
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
/*
    NewLocation takes the element that is being passed and sets the innner html from the reponse used in Button calls to change the dashboard layout from the dash template buttons

*/
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
/*
    clickaction is a function used in Nav to set a new click event when the Naviagtion is built when load ing a page it consistes of the links that changes the pages and the loading actions for each link when a link in the side bmenu is clicked 
*/ 
function clickaction(ev) {
    let maincont = document.querySelector("#maincont")
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.getAll('uid');
   
    let elem = ev.target
    let emp = undefined;

    /*Checks if the the traget element is there if it is run tis code*/
    if (elem) {
        console.log(ev)
        let child = ev.target.children[0]
        if (child) {
            ev.target.children[0].click()
            let action = child.getAttribute("data-action")//action checks the data attibute to see if the action is an action specified for an action

            /*
                logout sets the URL to the login page and also clears the history so pressing the back button does not display anything  
            */
            if (action == "logout") {
                history.pushState(null, null, location.href); // Pushes the current page to history
                window.onpopstate = function () {
                    history.go(1); // Navigates forward if the user tries to go back
                };
                
                location.replace("./loginredirect.html");

                logout()

            } else if (action == "checkout") {
                /*
                    checkout sets the the checkout template page and fills its content with the data and table for checkout  
                
                */
                fetch('./templates/checkout.html')
                    .then(async response => {
                        let html = await response.text()

                        //console.log(html);
                        let d = document.createElement("div");
                        d.innerHTML = html;
  

                        setTimeout(() => {
                            maincont.innerHTML = d.innerHTML
                            setTimeout(() => {
                                /*
                                    Check the Component TabelElementsBuild
                                */

                                TabelElementsBuild("./templates/checkout.html", "#maincont", `./api/Inventory/checkout`, "Available", () => {
                                    var table = document.getElementById("checkouttable")
                                })
                               
                            }, 200)
                            
                        }, 300)

                    })
            } else if (action == "return") {
                /*
                   return sets the the return template page and fills its content with the data and table for return  
               
               */
                fetch('./templates/returns.html')
                    .then(async response => {
                        let html = await response.text()

                        
                        let d = document.createElement("div");
                        d.innerHTML = html;


                        setTimeout(() => {
                            maincont.innerHTML = d.innerHTML
                            setTimeout(() => {
                                /*
                                  Check the Component TabelElementsBuild
                              */
                                TabelElementsBuild("./templates/returns.html", "#maincont", `./api/Inventory/return`, "CheckedOut", () => {
                                    var table = document.getElementById("checkouttable")
                                })
                            }, 200)

                        }, 300)

                    })
            } else if (action == "inventory") {
                /*
                    inventory sets the the inventory template page and fills its content with the data and table for inventory  
                */
                fetch('./templates/inventory.html')
                    .then(async response => {
                        let html = await response.text()
                        
                        let d = document.createElement("div");
                        d.innerHTML = html;


                        setTimeout(() => {
                            maincont.innerHTML = d.innerHTML
                            setTimeout(() => {
                                /*
                                 Check the Component TabelElementsBuild
                             */
                                TabelInvElementsBuild("./templates/inventory.html", "#maincont")
                            }, 200)

                        }, 300)

                    })
            } else if (action == "report") {
                /*
                    report sets the the report template page and fills its content with the data and table for report  
                */
                fetch('./templates/report.html')
                    .then(async response => {
                        let html = await response.text()

                        c
                        let d = document.createElement("div");
                        d.innerHTML = html;


                        setTimeout(() => {
                            maincont.innerHTML = d.innerHTML
                            setTimeout(() => {
                                /*
                                    Fills the Selectbox in the reports page
                                */
                                fetch('./templates/report.html')
                                    .then(async responses => {
                                        NewLocation(maincont, await responses.text(), () => {
                                            setTimeout(() => {

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

                                         
                                        })

                                    })
                              
                            }, 200)

                        }, 300)

                    })
            }


            else if (action == "dash") {
                /*
                    Gets the Employee using the UId in the URL
                
                */
                fetch(`/api/Employees/${uid}`, { method: "GET" })
                    .then(async responses => {
                        emp = await responses.json()

                        /*
                            Get ths dash  and fils the data of table and sets the buttons data
                        */
                    
                fetch('./templates/dash.html')
                    .then(async response => {
                        let html = await response.text()

                        console.log(html);
                        let d = document.createElement("div");
                        d.innerHTML = html;


                        setTimeout(() => {
                            const urlParams = new URLSearchParams(window.location.search);
                            const uid = urlParams.getAll('uid');
                           
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

                                                    
                                                    })

                                                })
                                           
                                        })

                                    })
                            })
                           
                            ByMonthGraph(uid,true);
                           
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