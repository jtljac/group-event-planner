'use strict';
const dayjs = require("dayjs");

exports.getDatesBetweenRange = (start, end) => {
    const dates = [];

    for (const date = new Date(start); date < end; date.setDate(date.getDate() + 1)) {
        dates.push(new Date(date));
    }

    return dates;
}