import GameChart from "./gameChart.js"

export class GamePerDayChart extends GameChart {
    constructor(columns, chart, votes, voteMenu) {
        super(columns, chart);
        this.votes = votes;
        this.voteMenu = voteMenu
    }

    processCell(element) {
        element.addEventListener("mouseenter", (event) => {
            const rect = event.target.getBoundingClientRect();
            this.voteMenu.style.top = (rect.top + (rect.height / 2)) - (this.voteMenu.getBoundingClientRect().height / 4)  + "px";
            this.voteMenu.style.left = (rect.left + rect.width + 20) + "px";
        })

        return super.processColumnHeader(element);
    }
}