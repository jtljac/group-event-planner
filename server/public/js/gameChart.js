export default class GameChart {
    constructor(columns, chart) {
        this.chart = chart
        this.columns = columns;

        chart.querySelectorAll(".header.column").forEach(((element) => {
            this.processColumnHeader(element);
        }));
        
        chart.querySelectorAll(".cell").forEach((element) => {
            this.processCell(element);
        })
    }


    processColumnHeader(element) {
        element.addEventListener("click", (event) => {
            if (element.classList.contains("selected")) {
                element.classList.remove("selected");
                this.reorderRows((a, b) => {
                    return parseInt(a[0].dataset.rowindex) < parseInt(b[0].dataset.rowindex) ? -1 : 1;
                });
            } else {
                this.chart.querySelectorAll(".header.column").forEach((element) => element.classList.remove("selected"))
                element.classList.add("selected");
                this.reorderRows((a, b) => {
                    const aValue = parseFloat(a[element.dataset.columnindex].dataset.value);
                    const bValue = parseFloat(b[element.dataset.columnindex].dataset.value);

                    if (aValue === bValue) {
                        return parseInt(a[0].dataset.rowindex) < parseInt(b[0].dataset.rowindex) ? -1 : 1;
                    } else {
                        return aValue > bValue ? -1 : 1;
                    }
                });
            }
        });
    }

    getRows() {
        const rows = []
        const context = this;
        this.chart.querySelectorAll(".row").forEach((element) => {
            rows.push([...context.chart.querySelectorAll("[data-rowindex=\"" + element.dataset.rowindex + "\"]")]);
        })

        return rows;
    }

    reorderRows(sorter) {
        const rows = this.getRows();
        const context = this;

        rows.sort(sorter)

        let lastElm = this.chart.querySelector(".column.corner");
        rows.forEach((row) => row.forEach((elm) => {
            context.chart.insertBefore(elm, lastElm.nextSibling);
            lastElm = elm;
        }));
    }

    processCell(element) {

    }
}