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

export function TabelElementsBuild(whereTemplate, elem, what, status, callback = () => { }) {
    let btntext = "";
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.getAll('uid');
    fetch(whereTemplate)
        .then(async responses => {
            console.log("safdkjljsafd")
            fetch(`./api/Equipment/GetAll`, { method: "GET" })
                .then(async responsed => {

                    let data = await responsed.json();
                    console.log(data);
                    var table = document.getElementById("checkouttable")
                    for (var i of data) {
                        console.log(i)
                        if (i.assignedEmployeeId == null || i.assignedEmployeeId == uid) {
                            if (i.status == status) {
                                if (status == "CheckedOut") {
                                    btntext = "Return"
                                } else {
                                    btntext = "Checkout"
                                }
                                table.append(createTableElement(i, btntext, (ev) => {

                                    console.log(ev, i.equipmentId, uid);




                                    fetch(what, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({
                                            "equipmentId": parseInt(ev.target.getAttribute("data-id")),
                                            "employeeId": parseInt(uid[0])
                                        })
                                    })
                                        .then(async responsed => {
                                            console.log(responsed)
                                            TabelElementsBuild(whereTemplate, "#maincont", what, status, () => {
                                                var table = document.getElementById("checkouttable")
                                            })
                                        })

                                }))


                            }
                        }
                       
                    }

                })



            let html = await responses.text()
            elem = document.querySelector(elem)
            elem.innerHTML = html;
            callback()
        })
}