import { ChartComp } from "./chartcomponent.js"

let chartcomp = new ChartComp();
let bymouthchart = undefined;
let bymouthgraph = undefined;


/*
    Builds the Moth Graph and fills it with the data from the checkout api
    this is fo r the checkout table in the resports page
*/
export function ByMonthGraph(uid,alreadyused=false) {
    fetch(`./api/Reports/employee/${uid}/checkouts-per-month`, { method: "GET" })
        .then(async responses => {
            let data = await responses.json();
            if (!alreadyused) {
                for (var [i, item] of Object.entries(data)) {
                    console.log(i, item)
                    chartcomp.addMonths(item.month)
                    chartcomp.addData(item.count)
                }
            }

            //console.log(checkoutbutton)
            const ctx = document.getElementById('myChart');
            if (ctx) {
                console.log(chartcomp.getMonths(), chartcomp.getData())
                if (bymouthchart) bymouthchart.destroy();
                bymouthchart= new Chart(ctx, {
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
                        responsive: true,
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
}
/*
    For the reports page this files the Bar ggraph in the reports page and set the data for the reports in that page 
*/
export function ByBarGraph(uid, alreadyused = false) {
    const ctx = document.getElementById('bargraph');
    if (bymouthgraph) bymouthgraph.destroy();
    // Create the bar chart
    bymouthgraph =new Chart(ctx, {
        type: 'bar', // Specify the chart type as 'bar'
        data: {
            labels: chartcomp.getMonths(), // Labels for the x-axis
            datasets: [{
                label: 'Number of Checkouts', // Label for the dataset
                data: chartcomp.getData(), // Data values for the bars
                backgroundColor: [ // Customize bar background colors
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [ // Customize bar border colors
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1 // Set the border width for the bars
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true // Ensure the y-axis starts at zero
                }
            }
        }
    });
}


/*
    this function Buiolds and sets the data for the select dropdown in the the reposts page to select the employee to then fill  that data with tht employee information

*/
export function BuildEmpSelect(callback = () => { }) {
    let select = document.getElementById("employeedropdown")
    fetch(`./api/debug/employees`, { method: "GET" })
        .then(async responses => {
            let data = await responses.json()
            for (var [i, items] of Object.entries(data)) {
                console.log(i, items);
                let options = document.createElement("option")
                if (items.name != "string") {
                    options.value = items.employeeId
                    options.innerHTML = items.name
                    select.append(options)
                }
        
            }
            
            select.addEventListener("change", () => {
               
                callback(select)
            })

    })

}