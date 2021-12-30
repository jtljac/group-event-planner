'use strict';
const dayjs = require("dayjs");
const Handlebars = require("express-handlebars").create().handlebars;

exports.contains = (item, array) => {
    return array.includes(item);
};

exports.containsKey = (item, object) => {
    return Object.keys(object).includes(item);
};

exports.arrayCollision = (arr1, arr2) => {
    return arr1.filter((item) => arr2.includes(item));
}

exports.maths = (lValue, operator, rValue) => {
    return {
        "+": lValue + rValue,
        "-": lValue - rValue,
        "*": lValue * rValue,
        "/": lValue / rValue,
        "%": lValue % rValue
    }[operator];
}

exports.compare = (lValue, operator, rValue) => {
    // noinspection EqualityComparisonWithCoercionJS
    if (lValue instanceof Array) lValue = lValue.length !== 0
    if (rValue instanceof Array) rValue = rValue.length !== 0

    return {
        "==": lValue == rValue,
        "===": lValue === rValue,
        "!=": lValue != rValue,
        "!==": lValue !== rValue,
        "<": !!lValue < !!rValue,
        ">": !!lValue > !!rValue,
        "<=": !!lValue <= !!rValue,
        ">=": !!lValue >= !!rValue,
        "||": !!lValue || !!rValue,
        "&&": !!lValue && !!rValue
    }[operator];
}

exports.formatDate = (date, format) => {
    return dayjs(date).format(format);
}

exports.selectOptions = (choices, selected, options) => {
    let html = ""

    const blank = options.hash["blank"] || false;


    if (blank) {
        html += `<option ${!selected ? "selected" : ""}></option>`
    }

    if (options instanceof Array) {
        for (const option of choices) {
            html += `<option ${option === selected ? "selected" : ""}>${option}</option>`;
        }
    } else {
        for (const option of Object.keys(choices)) {
            html += `<option value="${option}" ${option === selected ? "selected" : ""}>${choices[option]}</option>"`;
        }
    }

    return new Handlebars.SafeString(html);
}

exports.toJSON = (object) => {
    return JSON.stringify(object);
}