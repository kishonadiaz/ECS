export class ChartComp{
    constructor() {
        this.months = []
        this.data = []
    }
    addMonths(val) {
        this.months.push(val)
    }
    addData(val) {
        this.data.push(val)
    }

    getMonths() {
        return this.months
    }
    getData() {
        return this.data
    }

}