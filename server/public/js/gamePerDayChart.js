import GameChart from "./gameChart.js"

export class GamePerDayChart extends GameChart {
    constructor(columns, chart, votes, voteMenu) {
        super(columns, chart);
        this.votes = votes;
        this.voteMenu = voteMenu
    }

    processCell(element) {
        const context = this;
        element.addEventListener("mouseenter", (event) => {
            context.setContentToCell(element.dataset.rowindex - 1, element.dataset.columnindex - 1)

            const rect = event.target.getBoundingClientRect();
            const voteRect = this.voteMenu.getBoundingClientRect();
            this.voteMenu.style.top = Math.max(Math.min((rect.top + (rect.height / 2)) - (voteRect.height / 4), innerHeight - voteRect.height - 50), 20)  + "px";
            this.voteMenu.style.left = (rect.left + (rect.left < window.innerWidth - voteRect.width - 100 ? rect.width + 20 : -(20 + voteRect.width))  ) + "px";
        })

        return super.processCell(element);
    }

    setContentToCell(x, y) {
        const vote = this.votes[x][y];
        const availableList = this.voteMenu.querySelector("#available")
        const maybeList = this.voteMenu.querySelector("#maybe")
        const unavailableList = this.voteMenu.querySelector("#unavailable")
        availableList.innerHTML = "";
        if (vote.available.length === 0) {
            availableList.previousElementSibling.classList.add("hidden");
        } else {
            availableList.previousElementSibling.classList.remove("hidden")
            vote.available.forEach((person) => {
                const listItem = document.createElement("li");
                listItem.innerText = person.name;
                availableList.appendChild(listItem);
            });
        }

        maybeList.innerHTML = "";
        if (vote.maybe.length === 0) {
            maybeList.previousElementSibling.classList.add("hidden");
        } else {
            maybeList.previousElementSibling.classList.remove("hidden")
            vote.maybe.forEach((person) => {
                const listItem = document.createElement("li");
                listItem.innerText = person.name;
                maybeList.appendChild(listItem);
            });
        }

        unavailableList.innerHTML = "";
        if (vote.unavailable.length === 0) {
            unavailableList.previousElementSibling.classList.add("hidden");
        } else {
            unavailableList.previousElementSibling.classList.remove("hidden")
            vote.unavailable.forEach((person) => {
                const listItem = document.createElement("li");
                listItem.innerText = person.name;
                unavailableList.appendChild(listItem);
            });
        }
    }
}