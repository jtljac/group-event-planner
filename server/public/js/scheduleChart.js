import GameChart from "./gameChart.js"

export class ScheduleChart extends GameChart {
    constructor(columns, chart, selector, peopleGames) {
        super(columns, chart);
        this.peopleGames = peopleGames;

        selector.addEventListener("change", (event) => {
            this.filterRows(event.target.value);
        })
    }

    filterRows(gameId) {
        const rows = this.getRows();

        for (const row of rows) {
            const show = !gameId || this.peopleGames[parseInt(row[0].dataset.id)].includes(parseInt(gameId));

            for (const item of row) {
                if (show) item.classList.remove("hide")
                else item.classList.add("hide");
            }
        }
    }
}