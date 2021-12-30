exports.equal = (left, right, epsilon = Number.EPSILON) => {
    return Math.abs(left - right) < epsilon;
}