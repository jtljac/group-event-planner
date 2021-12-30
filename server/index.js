const express = require('express');

const dayjs = require("dayjs");
const {create} = require('express-handlebars');

const helpers = require('./lib/hbsHelpers');
const conn = require("./lib/database");
const extraMaths = require("./lib/extraMaths")

const app = express();
const port = 8080;

const handlebars = create({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: helpers,

});

app.set('view engine', '.hbs');
app.set('views', './views');

app.engine('.hbs', handlebars.engine);

//Serves static files (we need it to import a css file)
app.use(express.static('public'))


//Sets a basic route
app.get('/gamechart', async (req, res) => {
    const people = await conn.query("SELECT id, personName as title FROM people");
    const games = await conn.query("SELECT games.id, games.gameName as title, count(gamechoices.personId) AS 'count' FROM games LEFT JOIN gamechoices ON(games.id = gamechoices.gameId) GROUP BY games.id ORDER BY count DESC");

    for (const game of games) {
        game["votes"] = (await conn.query("SELECT personId FROM gamechoices WHERE gameId = ?", [game.id])).map(item => item["personId"]);
    }

    return res.render("gameChart", {
        title: "Game Votes",
        itemPartial: "chartItems/gameChartItem",
        rows: people,
        columns: games,
    });
});

app.get('/schedule', async (req, res) => {
    const gameChoices = {};
    const people = await conn.query("SELECT id, personName as title FROM people");

    for (const person of people) {
        person["dates"] = (await conn.query("SELECT dayAvailable, availability FROM peopleDates WHERE personId = ?", [person.id])).reduce((acc, value) => {
            acc[value.dayAvailable.toISOString().slice(0, value.dayAvailable.toISOString().indexOf("T"))] = value.availability;
            return acc;
        }, {})

        gameChoices[person.id] = (await conn.query("SELECT gameId FROM gamechoices WHERE personId = ?", [person.id])).map(item => item["gameId"]);
    }

    const dates = (await conn.query("SELECT * FROM dates")).map((item) => {
        return {
            id: item.date.toISOString().slice(0, item.date.toISOString().indexOf("T")),
            title: dayjs(item.date).format("MMM D ddd"),
            game: item.game
        }
    });

    const gameOptions = (await conn.query("SELECT id, gameName FROM games")).reduce((acc, value) => {
        acc[value.id] = value.gameName;
        return acc;
    }, {})

    return res.render("schedule", {
        title: "Game Votes",
        stylesheets: ["css/schedule.css"],
        itemPartial: "chartItems/availabilityChartItem",
        rows: people,
        columns: dates,
        gameChoices: JSON.stringify(gameChoices),
        gameOptions: gameOptions
    });
})

app.get("/gamesperday", async (req ,res) => {
    const dates = (await conn.query("SELECT * FROM dates ORDER BY date")).map((item) => {
        return {
            id: item.date.toISOString().slice(0, item.date.toISOString().indexOf("T")),
            title: dayjs(item.date).format("MMM D ddd")
        }
    });

    for (const date of dates) {
        // await conn.query("INSERT INTO peopledates VALUES (22, ?, 1)", [date.id]);
        date["games"] = (await conn.query("SELECT gameId FROM gamedates WHERE date = ?", [date.id])).map((item) => item.gameId)
    }

    const games = await conn.query("SELECT games.id, games.gameName as title FROM games");

    const cells = [];

    for (const game of games) {
        game["dates"] = (await conn.query("SELECT date from gamedates WHERE gameId = ?", [game.id])).map((item) => item.date.toISOString().slice(0, item.date.toISOString().indexOf("T")));

        const gameVotes = await conn.query("SELECT personId as id, personName AS name FROM gameChoices LEFT JOIN people ON(gameChoices.personid = people.id) WHERE gameChoices.gameId = ?", [game.id]);

        const row = [];
        for (const theDate of dates) {
            const dateVotes = await conn.query("SELECT personId as id, personName AS name, availability FROM peopledates LEFT JOIN people ON(peopleDates.personid = people.id) WHERE peopledates.dayAvailable = ?", [theDate.id]);
            const cell = gameVotes.reduce((acc, person) => {
                const date = dateVotes.find((date) => date.id === person.id);
                (date ? (date.availability == 2 ? acc.available : acc.maybe) : acc.unavailable).push(person);
                return acc;
            }, {available: [], maybe: [], unavailable: []});

            let cls;

            const difference = (cell.available.length + cell.maybe.length) / (cell.unavailable.length + cell.maybe.length + cell.available.length);


            if (difference === 1) cls = "perfect";
            else if (difference < 0.5) cls = "no";
            else if (extraMaths.equal(difference, 0.5, 0.3)) cls = "maybe";
            else cls = "yes";

            cell["cls"] = cls;
            cell["value"] = difference;

            row.push(cell);
        }

        cells.push(row);
    }

    return res.render("gamesPerDay", {
        title: "Votes per Day",
        stylesheets: ["css/gamePerDay.css"],
        itemPartial: "chartItems/personPerGamePerDayChartItem",
        rows: games,
        columns: dates,
        votes: cells
    });
});

//Makes the app listen to port 3000
app.listen(port, () => console.log(`App listening to port ${port}`));