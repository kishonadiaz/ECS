
/*
    This Class is a component that is used to keep data for the graphs  it consists of 
    to arrays that constins the months and the data for those months 

*/
export class ChartComp{
    constructor() {
        this.months = []
        this.data = []
    }
    /*addMonths pushes data into the array for months this is a string */
    addMonths(val) {
        this.months.push(val)
    }
    /*
        addData pushes data for those months to display in the graph
    */
    addData(val) {
        this.data.push(val)
    }
    /*
        getMonths Get the months for the graph so that it may be displays and returns an array
    */
    getMonths() {
        return this.months
    }
    /*
        getData gets the data for the graph so that that data may be displays retruns an array
    */
    getData() {
        return this.data
    }

}